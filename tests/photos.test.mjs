import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
test('discovers every image recursively and encodes special Vietnamese filenames',async()=>{const dir=await mkdtemp(path.join(tmpdir(),'castle-photos-'));try{await mkdir(path.join(dir,'public/photos/album'),{recursive:true});await writeFile(path.join(dir,'public/photos/album/Ngày vui #1.JPG'),'test');await writeFile(path.join(dir,'public/photos/ignore.txt'),'not an image');for(let i=0;i<9;i++)await writeFile(path.join(dir,`public/photos/${i}.webp`),'test');execFileSync(process.execPath,[new URL('../scripts/photos.mjs',import.meta.url).pathname],{cwd:dir});const photos=JSON.parse(await readFile(path.join(dir,'public/photos.json'),'utf8'));assert.equal(photos.length,10);const nested=photos.find(p=>p.id.includes('Ngày'));assert.equal(nested.title,'Ngày vui #1');assert.equal(nested.src,'photos/album/Ng%C3%A0y%20vui%20%231.JPG');}finally{await rm(dir,{recursive:true,force:true});}});
