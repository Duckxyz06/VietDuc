import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,rm} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
const cli=new URL('../scripts/photos.mjs',import.meta.url).pathname;
test('BMP, ICO and layered PSD are converted to browser-compatible images',async()=>{const dir=await mkdtemp(path.join(tmpdir(),'castle-extra-'));try{await mkdir(path.join(dir,'public/photos'),{recursive:true});for(const extension of ['bmp','ico','psd'])execFileSync('convert',['-size','64x40','xc:#297aca',path.join(dir,`public/photos/sample.${extension}`)]);execFileSync(process.execPath,[cli],{cwd:dir});const photos=JSON.parse(await readFile(path.join(dir,'public/photos.json'),'utf8'));assert.equal(photos.length,3);assert.deepEqual(photos.map(p=>p.title),['sample','sample','sample']);assert.equal(JSON.parse(await readFile(path.join(dir,'public/photo-report.json'),'utf8')).failed.length,0);}finally{await rm(dir,{recursive:true,force:true});}});
