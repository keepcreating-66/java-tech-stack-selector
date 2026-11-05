from pathlib import Path
import hashlib,json,zipfile,subprocess,re
r=Path(__file__).resolve().parents[1]
s=r/'skills/java-tech-stack-selector';d=r/'dist';d.mkdir(exist_ok=True)
files=sorted(p for p in s.rglob('*') if p.is_file())
assert (s/'SKILL.md').exists()
entry=(s/'SKILL.md').read_text()
assert entry.startswith('---\nname: java-tech-stack-selector\n') and 'description:' in entry
for ref in re.findall(r'\]\(([^)]+)\)',entry):
 assert (s/ref).is_file(), ref
for p in files:
 assert p.name not in ['.DS_Store'] and 'node_modules' not in p.parts
 p.read_text()
 assert '/Users/sht/' not in p.read_text(), p
assert len(files)<200
subprocess.run(['node','--check',str(s/'scripts/generate.cjs')],check=True)
assert not any(p.is_symlink() for p in s.rglob('*'))
manifest={str(p.relative_to(s)):hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
archive=d/'java-tech-stack-selector-1.2.0-rc.1.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in files:
  assert p.suffix in ['.md','.json','.cjs'] or p.name=='LICENSE'
  info=zipfile.ZipInfo('java-tech-stack-selector/'+str(p.relative_to(s)),(2026,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16
  z.writestr(info,p.read_bytes())
(d/'SHA256.json').write_text(json.dumps({**manifest,archive.name:hashlib.sha256(archive.read_bytes()).hexdigest()},indent=2)+'\n')
dependency_versions=json.loads(subprocess.check_output(['node',str(s/'scripts/generate.cjs'),'capabilities'],text=True))['versions']
source_hash=hashlib.sha256()
for p in sorted(list((r/'packages/core/src').rglob('*.ts'))+list((r/'cli/src').rglob('*.ts'))):
 source_hash.update(str(p.relative_to(r)).encode());source_hash.update(p.read_bytes())
(d/'version.json').write_text(json.dumps({'version':'1.2.0-rc.1','sourceBase':subprocess.check_output(['git','rev-parse','HEAD'],cwd=r,text=True).strip(),'workingTreeChanges':True,'node':subprocess.check_output(['node','--version'],text=True).strip(),'files':len(files),'dependencies':dependency_versions,'sourceSha256':source_hash.hexdigest(),'lockfileSha256':hashlib.sha256((r/'package-lock.json').read_bytes()).hexdigest(),'typescript':subprocess.check_output(['node','-p',"require('typescript/package.json').version"],cwd=r,text=True).strip(),'esbuild':subprocess.check_output(['node','-p',"require('esbuild/package.json').version"],cwd=r,text=True).strip()},indent=2)+'\n')
print(archive)
