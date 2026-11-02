import { TechStackConfig } from '../core/types';

export const basePackage = (config: TechStackConfig): string => `com.example.${config.project.name.replaceAll('-', '')}`;
export const upper = (value: string): string => value.split('-').map(p => p[0].toUpperCase() + p.slice(1)).join('');
export const javaPath = (pkg: string, cls: string): string => `src/main/java/${pkg.replaceAll('.', '/')}/${cls}.java`;

export function application(pkg: string, cls: string, scanRoot?: string, orm?: string): string {
    const jpa = scanRoot && orm === 'jpa' ? `import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
@EntityScan("${scanRoot}")
@EnableJpaRepositories("${scanRoot}")
` : '';
    const mapper = scanRoot && orm === 'mybatis-plus' ? `import org.mybatis.spring.annotation.MapperScan;
@MapperScan("${scanRoot}")
` : '';
    const scan = scanRoot ? `(scanBasePackages = "${scanRoot}")` : '';
    return `package ${pkg};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
${jpa}${mapper}
@SpringBootApplication${scan}
public class ${cls} {
    public static void main(String[] args) { SpringApplication.run(${cls}.class, args); }
}
`;
}

export function entity(pkg: string, module: string, orm: string): string {
    const cls = `${upper(module)}Record`;
    const annotation = orm === 'jpa'
        ? `import jakarta.persistence.*;
@Entity
@Table(name = "${module.replaceAll('-', '_')}_records")`
        : `import com.baomidou.mybatisplus.annotation.*;
@TableName("${module.replaceAll('-', '_')}_records")`;
    const id = orm === 'jpa' ? '@Id @GeneratedValue(strategy = GenerationType.IDENTITY)' : '@TableId(type = IdType.AUTO)';
    return `package ${pkg};

${annotation}
public class ${cls} {
    ${id}
    private Long id;
    private String name;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
`;
}

export function repository(pkg: string, module: string, orm: string): string {
    const entityName = `${upper(module)}Record`;
    const cls = `${upper(module)}Repository`;
    return orm === 'jpa' ? `package ${pkg};

import org.springframework.data.jpa.repository.JpaRepository;
public interface ${cls} extends JpaRepository<${entityName}, Long> {}
` : `package ${pkg};

import org.apache.ibatis.annotations.Mapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
@Mapper
public interface ${cls} extends BaseMapper<${entityName}> {}
`;
}

export function service(pkg: string, module: string, orm: string): string {
    const name = upper(module), entityName = `${name}Record`, repositoryName = `${name}Repository`;
    const methods = orm === 'jpa' ? `
    public ${entityName} create(${entityName} item) { item.setId(null); return repository.save(item); }
    public List<${entityName}> list() { return repository.findAll(); }
    public Optional<${entityName}> find(Long id) { return repository.findById(id); }
    public Optional<${entityName}> update(Long id, ${entityName} item) {
        return repository.findById(id).map(existing -> { existing.setName(item.getName()); return repository.save(existing); });
    }
    public boolean delete(Long id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id); return true;
    }` : `
    public ${entityName} create(${entityName} item) { item.setId(null); repository.insert(item); return item; }
    public List<${entityName}> list() { return repository.selectList(null); }
    public Optional<${entityName}> find(Long id) { return Optional.ofNullable(repository.selectById(id)); }
    public Optional<${entityName}> update(Long id, ${entityName} item) {
        if (repository.selectById(id) == null) return Optional.empty();
        item.setId(id); repository.updateById(item); return Optional.of(item);
    }
    public boolean delete(Long id) { return repository.deleteById(id) > 0; }`;
    return `package ${pkg};

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ${name}Service {
    private final ${repositoryName} repository;
    public ${name}Service(${repositoryName} repository) { this.repository = repository; }
${methods}
}
`;
}

export function controller(pkg: string, module: string, commonPackage?: string): string {
    const name = upper(module), record = `${name}Record`, serviceName = `${name}Service`, route = module.replaceAll('-', '') + 's';
    const commonImport = commonPackage ? `import ${commonPackage}.ModuleInfo;\n` : '';
    const info = commonPackage ? `    @GetMapping("/info") public ModuleInfo info() { return new ModuleInfo("${module}"); }\n` : '';
    return `package ${pkg};

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
${commonImport}
@RestController
@RequestMapping("/api/${route}")
public class ${name}Controller {
    private final ${serviceName} service;
    public ${name}Controller(${serviceName} service) { this.service = service; }
${info}    @GetMapping public List<${record}> list() { return service.list(); }
    @GetMapping("/{id}") public ResponseEntity<${record}> find(@PathVariable Long id) {
        return service.find(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ${record} create(@RequestBody ${record} item) { return service.create(item); }
    @PutMapping("/{id}") public ResponseEntity<${record}> update(@PathVariable Long id, @RequestBody ${record} item) {
        return service.update(id, item).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
`;
}

export function security(pkg: string, framework: string): Record<string, string> {
    if (framework === 'spring-security') {
        return { 'SecurityConfig.java': `package ${pkg};

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth.requestMatchers("/actuator/health").permitAll().anyRequest().authenticated())
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}
`, 'CsrfController.java': `package ${pkg};

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsrfController {
    @GetMapping("/csrf") public CsrfToken csrf(CsrfToken token) { return token; }
}
` };
    }
    return {
        'SaTokenConfig.java': `package ${pkg};

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SaTokenConfig implements WebMvcConfigurer {
    @Override public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin())).addPathPatterns("/api/**");
    }
}
`,
        'DemoAuthController.java': `package ${pkg};

import java.util.Map;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class DemoAuthController {
    @Value("\${demo.auth.username:}") private String expectedUser;
    @Value("\${demo.auth.password:}") private String expectedPassword;
    @PostMapping("/auth/login")
    public Map<String, String> login(@RequestParam String username, @RequestParam String password) {
        if (expectedUser.isBlank() || expectedPassword.isBlank() || !expectedUser.equals(username) || !expectedPassword.equals(password))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        StpUtil.login(username);
        return Map.of("token", StpUtil.getTokenValue());
    }
}
`,
        'SaTokenExceptionHandler.java': `package ${pkg};

import cn.dev33.satoken.exception.NotLoginException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class SaTokenExceptionHandler {
    @ExceptionHandler(NotLoginException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public void notLoggedIn() {}
}
`
    };
}

export function contextTest(pkg: string, cls: string, beanName: string, route: string, framework: string): string {
    const login = framework === 'spring-security'
        ? `String header = "Authorization";
        String token = "Basic " + java.util.Base64.getEncoder().encodeToString("test-user:test-pass".getBytes(java.nio.charset.StandardCharsets.UTF_8));`
        : `var login = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/auth/login"))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .POST(HttpRequest.BodyPublishers.ofString("username=test-user&password=test-pass")).build(), HttpResponse.BodyHandlers.ofString());
        assertThat(login.statusCode()).isEqualTo(200);
        String header = "satoken";
        String token = new com.fasterxml.jackson.databind.ObjectMapper().readTree(login.body()).get("token").asText();`;
    const csrf = framework === 'spring-security' ? `var csrf = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/csrf"))
            .header(header, token).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(csrf.statusCode()).isEqualTo(200);
        var csrfJson = new com.fasterxml.jackson.databind.ObjectMapper().readTree(csrf.body());
        String csrfHeader = csrfJson.get("headerName").asText(), csrfToken = csrfJson.get("token").asText();`
        : 'String csrfHeader = "X-Demo-Test", csrfToken = "unused";';
    return `package ${pkg};

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.web.server.LocalServerPort;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@SpringBootTest(classes = ${cls}.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {"spring.security.user.name=test-user", "spring.security.user.password=test-pass",
        "demo.auth.username=test-user", "demo.auth.password=test-pass"})
class ${cls}Test {
    @Autowired ApplicationContext context;
    @LocalServerPort int port;
    @Test void contextLoadsWithBusinessController() {
        assertThat(context.containsBean("${beanName}")).isTrue();
    }
    @Test void servesHealthyHttpEndpoint() throws Exception {
        var response = HttpClient.newHttpClient().send(HttpRequest.newBuilder(
            URI.create("http://localhost:" + port + "/actuator/health")).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).contains("UP");
    }
    @Test void protectsAndServesBusinessEndpoint() throws Exception {
        var client = HttpClient.newBuilder().cookieHandler(new java.net.CookieManager(null, java.net.CookiePolicy.ACCEPT_ALL)).build();
        var uri = URI.create("http://localhost:" + port + "/api/${route}");
        var anonymous = client.send(HttpRequest.newBuilder(uri).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(anonymous.statusCode()).isEqualTo(401);
        ${login}
        var response = client.send(HttpRequest.newBuilder(uri).header(header, token).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).isEqualTo("[]");
        ${csrf}
        var created = client.send(HttpRequest.newBuilder(uri).header(header, token).header(csrfHeader, csrfToken)
            .header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString("{\\"name\\":\\"example\\"}")).build(), HttpResponse.BodyHandlers.ofString());
        assertThat(created.statusCode()).isEqualTo(200);
        long id = new com.fasterxml.jackson.databind.ObjectMapper().readTree(created.body()).get("id").asLong();
        var itemUri = URI.create(uri + "/" + id);
        var updated = client.send(HttpRequest.newBuilder(itemUri).header(header, token).header(csrfHeader, csrfToken)
            .header("Content-Type", "application/json").PUT(HttpRequest.BodyPublishers.ofString("{\\"name\\":\\"updated\\"}")).build(), HttpResponse.BodyHandlers.ofString());
        assertThat(updated.statusCode()).isEqualTo(200);
        var found = client.send(HttpRequest.newBuilder(itemUri).header(header, token).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(found.statusCode()).isEqualTo(200);
        assertThat(found.body()).contains("updated");
        var deleted = client.send(HttpRequest.newBuilder(itemUri).header(header, token).header(csrfHeader, csrfToken).DELETE().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(deleted.statusCode()).isEqualTo(204);
        var missing = client.send(HttpRequest.newBuilder(itemUri).header(header, token).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(missing.statusCode()).isEqualTo(404);
    }
}
`;
}

/** Start a real gateway and verify that it forwards to an independent HTTP server. */
export function gatewayTest(pkg: string, cls: string, module: string): string {
    return `package ${pkg};

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = ${cls}.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ${cls}Test {
    static final HttpServer upstream;
    static {
        try {
            upstream = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            upstream.createContext("/api/${module.replaceAll('-', '')}s/ping", exchange -> {
                byte[] body = "gateway-ok".getBytes(java.nio.charset.StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, body.length);
                try (var out = exchange.getResponseBody()) { out.write(body); }
            });
            upstream.start();
        } catch (java.io.IOException error) { throw new ExceptionInInitializerError(error); }
    }
    @DynamicPropertySource static void serviceUrl(DynamicPropertyRegistry properties) {
        properties.add("${module.toUpperCase().replaceAll('-', '_')}_SERVICE_URL", () -> "http://127.0.0.1:" + upstream.getAddress().getPort());
    }
    @LocalServerPort int port;
    @AfterAll static void stopUpstream() { upstream.stop(0); }
    @Test void forwardsBusinessRoute() throws Exception {
        var response = HttpClient.newHttpClient().send(HttpRequest.newBuilder(
            URI.create("http://localhost:" + port + "/api/${module.replaceAll('-', '')}s/ping")).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).isEqualTo("gateway-ok");
    }
}
`;
}
