import {readdir,writeFile,readFile,mkdir,access,unlink} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
const run=promisify(execFile);
const root=process.env.CASTLE_PHOTOS_SOURCE||'public/photos',output='public/optimized-photos';
// Decode by contents, not only extension. Unsupported files are isolated, never
// allowed to crash the build or masquerade as successfully published photos.
const imageExtension=/\.(jpe?g|jfif|jpe|png|apng|webp|gif|avif|heic|heif|hif|tiff?|bmp|dib|svg|ico|cur|psd|psb|tga|pcx|ppm|pgm|pbm|pnm|dng|nef|nrw|cr2|cr3|arw|orf|raf|rw2|pef|srw|jxl|jp2|j2k|exr|hdr)$/i;
async function walk(dir){const result=[];for(const f of await readdir(dir,{withFileTypes:true})){if(f.name.startsWith('.'))continue;const p=path.join(dir,f.name);if(f.isDirectory())result.push(...await walk(p));else if(f.isFile())result.push(p);}return result;}
await mkdir(root,{recursive:true});await mkdir(output,{recursive:true});
sharp.concurrency(1);sharp.cache({memory:64,files:0,items:16});
const photos=[],failed=[],ignored=[];
for(const file of (await walk(root)).sort((a,b)=>a.localeCompare(b,'vi',{numeric:true}))){
 const id='photos/'+path.relative(root,file).split(path.sep).join('/');
 let bytes;
 try{
  bytes=await readFile(file);
  if(bytes.subarray(0,120).toString().startsWith('version https://git-lfs.github.com/spec/v1'))throw Error('LFS_POINTER');
  let input=bytes,meta;
  const options={limitInputPixels:false,failOn:'error',sequentialRead:true};
  try{meta=await sharp(input,options).metadata();await sharp(input,options).resize(1,1).png().toBuffer();}
  catch(firstError){
   const brand=bytes.subarray(4,40).toString('ascii');
   if(/ftyp.*(heic|heix|hevc|hevx|mif1)/s.test(brand)){
    try{input=Buffer.from(await heicConvert({buffer:bytes,format:'PNG'}));meta=await sharp(input,options).metadata();}catch{input=null;}
   }else input=null;
   if(!input){
    const signature=bytes.subarray(0,12);
    const rasterMagic=signature.subarray(0,2).toString()==='BM'||signature.subarray(0,4).toString()==='8BPS'||signature.equals(Buffer.from([0,0,1,0]))||bytes.subarray(0,4).equals(Buffer.from([0,0,1,0]))||bytes.subarray(0,4).equals(Buffer.from([0,0,2,0]))||/^(II|MM|P[1-7])/.test(signature.toString('ascii'))||brand.includes('ftyp');
    if(!imageExtension.test(file)&&!rasterMagic){ignored.push(id);continue;}
    // ImageMagick expands support to BMP/ICO/PSD, HEIF and camera RAW decoders.
    // Absolute paths prevent filenames from being treated as URL/coder inputs.
    const args=['-limit','memory','128MiB','-limit','map','256MiB',path.resolve(file)+'[0]','-auto-orient','-resize','2400x2400>','png:-'];
    try{const result=await run('convert',args,{encoding:'buffer',maxBuffer:128*1024*1024,timeout:120000});input=result.stdout;meta=await sharp(input,options).metadata();}
    catch{throw Error('DECODE_FAILED');}
   }
  }
  if(!meta.width||!meta.height)throw Error('DECODE_FAILED');
  const hash=createHash('sha256').update(id).update(bytes).update('castle-webp-v1').digest('hex').slice(0,24);
  const src=`optimized-photos/${hash}.webp`,thumbnail=`optimized-photos/${hash}-thumb.webp`;
  const make=(edge)=>sharp(input,{...options,animated:meta.format==='gif'&&meta.pages>1}).rotate().resize({width:edge,height:edge,fit:'inside',withoutEnlargement:true}).webp({quality:86,effort:4});
  try{await access('public/'+src);}catch{await make(2400).toFile('public/'+src);}
  try{await access('public/'+thumbnail);}catch{await sharp(input,options).rotate().resize({width:600,height:600,fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile('public/'+thumbnail);}
  const stem=path.basename(file,path.extname(file));
  const title=/^\d{10,}[_-]/.test(path.basename(file))?`Kỷ niệm ${String(photos.length+1).padStart(2,'0')}`:stem.replace(/[_-]/g,' ');
  const info=await sharp('public/'+src).metadata();
  photos.push({id,src,thumbnail,title,width:info.width,height:info.pageHeight||info.height,format:meta.format});
 }catch(error){const message=error.message==='LFS_POINTER'?'Đây là con trỏ Git LFS, chưa có dữ liệu ảnh. Hãy tải ảnh đã xuất hoặc nén lại.':'File bị hỏng hoặc định dạng này chưa giải mã được. Hãy xuất lại thành JPG/PNG/WebP.';failed.push({file:id,message});console.warn(`Không xử lý được ${id}: ${message}`);}
}
const active=new Set(photos.flatMap(p=>[path.basename(p.src),path.basename(p.thumbnail)]));
for(const name of await readdir(output)){if(/^[a-f0-9]{24}(?:-thumb)?\.webp$/.test(name)&&!active.has(name))await unlink(path.join(output,name));}
await writeFile('public/photos.json',JSON.stringify(photos,null,2));
await writeFile('public/photo-report.json',JSON.stringify({total:photos.length,failed,ignored:ignored.length},null,2));
console.log(`Album: ${photos.length} ảnh đã tối ưu; ${failed.length} lỗi; ${ignored.length} file khác.`);
if(process.env.GITHUB_STEP_SUMMARY){await writeFile(process.env.GITHUB_STEP_SUMMARY,`## Bộ sưu tập ảnh\n\nĐã xử lý **${photos.length} ảnh**. ${failed.length} file không mở được.\n\n`+failed.map(f=>`- ${f.file.replace(/[<>]/g,'')} — ${f.message}`).join('\n')+'\n',{flag:'a'});}
