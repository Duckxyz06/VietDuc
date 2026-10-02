import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
const cli=new URL('../scripts/photos.mjs',import.meta.url).pathname;
async function fixture(){const dir=await mkdtemp(path.join(tmpdir(),'castle-photos-'));await mkdir(path.join(dir,'public/photos/album'),{recursive:true});return dir;}
const image=()=>sharp({create:{width:48,height:32,channels:4,background:{r:40,g:120,b:230,alpha:.7}}});
test('build accepts extensionless images, TIFF, AVIF and SVG and keeps valid photos when one file is corrupt',async()=>{const dir=await fixture();try{
 await image().jpeg().toFile(path.join(dir,'public/photos/album/Ngày vui #1.JPG'));
 await image().tiff().toFile(path.join(dir,'public/photos/Ngày khác.TIFF'));
 await image().avif().toFile(path.join(dir,'public/photos/ảnh.AVIF'));
 await writeFile(path.join(dir,'public/photos/không có đuôi'),await image().png().toBuffer());
 await writeFile(path.join(dir,'public/photos/vector.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="32"><rect width="48" height="32" fill="blue"/></svg>');
 await writeFile(path.join(dir,'public/photos/broken.jpg'),'broken image');
 await writeFile(path.join(dir,'public/photos/ignore.txt'),'not an image');
 execFileSync(process.execPath,[cli],{cwd:dir});const photos=JSON.parse(await readFile(path.join(dir,'public/photos.json'),'utf8'));
 assert.equal(photos.length,5);const nested=photos.find(p=>p.id.includes('Ngày vui'));assert.equal(nested.title,'Ngày vui #1');assert.ok(nested.src.startsWith('optimized-photos/'));assert.ok(nested.thumbnail.endsWith('-thumb.webp'));
 for(const p of photos){assert.equal((await sharp(path.join(dir,'public',p.src)).metadata()).format,'webp');}
 const report=JSON.parse(await readFile(path.join(dir,'public/photo-report.json'),'utf8'));assert.equal(report.failed.length,1);assert.equal(report.failed[0].file,'photos/broken.jpg');
}finally{await rm(dir,{recursive:true,force:true});}});
test('very tall image is resized without stretching and an EXIF-rotated photo keeps its orientation',async()=>{const dir=await fixture();try{
 await sharp({create:{width:120,height:20000,channels:3,background:'#297aca'}}).png().toFile(path.join(dir,'public/photos/tall.png'));
 await sharp({create:{width:100,height:50,channels:3,background:'#297aca'}}).jpeg().withMetadata({orientation:6}).toFile(path.join(dir,'public/photos/rotated.jpg'));
 execFileSync(process.execPath,[cli],{cwd:dir});const photos=JSON.parse(await readFile(path.join(dir,'public/photos.json'),'utf8'));
 const tall=await sharp(path.join(dir,'public',photos.find(p=>p.id.endsWith('tall.png')).src)).metadata();assert.equal(tall.height,2400);assert.ok(tall.width<=15);
 const rotated=await sharp(path.join(dir,'public',photos.find(p=>p.id.endsWith('rotated.jpg')).src)).metadata();assert.equal(rotated.width,50);assert.equal(rotated.height,100);
}finally{await rm(dir,{recursive:true,force:true});}});
test('prepares an original over the GitHub browser upload limit without changing the source',async()=>{const dir=await mkdtemp(path.join(tmpdir(),'castle-big-'));try{const source=path.join(dir,'originals'),dest=path.join(dir,'ready');await mkdir(source);const jpeg=await image().jpeg().toBuffer();const original=Buffer.concat([jpeg,Buffer.alloc(26*1024*1024)]);const sourceFile=path.join(source,'big.jpg');await writeFile(sourceFile,original);execFileSync(process.execPath,[new URL('../scripts/prepare-photos.mjs',import.meta.url).pathname,source,dest]);const {readdir,stat}=await import('node:fs/promises');const files=(await readdir(dest)).filter(f=>f.endsWith('.webp'));assert.equal(files.length,1);assert.ok((await stat(path.join(dest,files[0]))).size<25000);assert.equal((await stat(sourceFile)).size,original.length);}finally{await rm(dir,{recursive:true,force:true});}});
