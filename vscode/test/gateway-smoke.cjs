'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const {spawn} = require('node:child_process');
const assert = require('node:assert/strict');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function availablePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {server.once('error', reject); server.listen(0, '127.0.0.1', resolve);});
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

async function smoke(directory) {
  const config = JSON.parse(fs.readFileSync(path.join(directory, 'tech-stack-config.json'), 'utf8'));
  assert.equal(config.project.type, 'microservice');
  assert.equal(config.microservice.gateway, true);
  const name = config.project.name, module = config.project.modules[0], route = module.replaceAll('-', '') + 's';
  const h2root = path.join(os.homedir(), '.m2/repository/com/h2database/h2');
  const h2 = fs.readdirSync(h2root).sort().reverse().map(v => path.join(h2root, v, `h2-${v}.jar`)).find(file => fs.existsSync(file));
  assert.ok(h2, 'H2 must already be available from the successful Maven test build');
  const servicePort = await availablePort(), gatewayPort = await availablePort();
  const children = [], logFiles = [];
  function launch(args, env, logName) {
    const log = path.join(path.dirname(directory), logName);
    const fd = fs.openSync(log, 'w');
    const child = spawn('java', args, {cwd: directory, env: {...process.env, ...env}, stdio: ['ignore', fd, fd]});
    fs.closeSync(fd);
    child.on('error', error => {child.spawnError = error;});
    children.push(child); logFiles.push(log);
    return child;
  }
  async function healthy(port, child) {
    const deadline = Date.now() + 45000;
    while (Date.now() < deadline) {
      if (child.spawnError) throw child.spawnError;
      assert.equal(child.exitCode, null, `Application exited; inspect ${logFiles.join(', ')}`);
      try {
        const response = await fetch(`http://127.0.0.1:${port}/actuator/health`, {signal: AbortSignal.timeout(1500)});
        if (response.status === 200 && (await response.json()).status === 'UP') return;
      } catch { /* Wait for application startup. */ }
      await pause(300);
    }
    throw new Error(`Startup timed out on port ${port}`);
  }
  try {
    const service = launch([
      `-Dloader.path=${h2}`, '-cp', `${module}-service/target/${name}-${module}-service-1.0.0-SNAPSHOT.jar`,
      'org.springframework.boot.loader.launch.PropertiesLauncher',
      '--spring.datasource.driver-class-name=org.h2.Driver', '--spring.jpa.hibernate.ddl-auto=create-drop',
      '--spring.security.user.name=smoke-user', '--spring.security.user.password=smoke-pass',
    ], {PORT: String(servicePort), DB_URL: 'jdbc:h2:mem:gatewaySmoke;DB_CLOSE_DELAY=-1', DB_USER: 'sa', DB_PASSWORD: ''}, 'gateway-live-service.log');
    await healthy(servicePort, service);
    const gateway = launch(['-jar', `gateway/target/${name}-gateway-1.0.0-SNAPSHOT.jar`], {
      PORT: String(gatewayPort), [`${module.toUpperCase().replaceAll('-', '_')}_SERVICE_URL`]: `http://127.0.0.1:${servicePort}`,
    }, 'gateway-live.log');
    await healthy(gatewayPort, gateway);
    const url = `http://127.0.0.1:${gatewayPort}/api/${route}`;
    const anonymous = await fetch(url);
    assert.equal(anonymous.status, 401);
    const response = await fetch(url, {headers: {Authorization: 'Basic ' + Buffer.from('smoke-user:smoke-pass').toString('base64')}});
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), []);
    const result = {passed: true, target: 'packaged generated gateway -> packaged generated business service', database: 'temporary H2; external databases untouched', servicePort, gatewayPort, anonymousStatus: anonymous.status, authenticatedStatus: response.status, logs: logFiles};
    fs.writeFileSync(path.join(path.dirname(directory), 'gateway-live.json'), JSON.stringify(result, null, 2));
    console.log('PASS packaged gateway forwards to packaged business service (401 anonymous, 200 authenticated).');
    return result;
  } finally {
    for (const child of children) {
      if (child.exitCode !== null || child.spawnError) continue;
      const stopped = new Promise(resolve => child.once('exit', resolve));
      child.kill('SIGTERM');
      const timeout = setTimeout(() => child.kill('SIGKILL'), 5000);
      await stopped;
      clearTimeout(timeout);
    }
  }
}
module.exports = {smoke};
