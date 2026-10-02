import {mkdtemp,mkdir,readFile,copyFile,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const source=process.argv[2],destination=path.resolve(process.argv[3]||'photos-ready');
if(!source){console.error('Dùng: npm run prepare-photos -- "thư mục ảnh gốc" ["thư mục xuất"]');process.exit(1);}
const sourcePath=path.resolve(source);
if(!(await stat(sourcePath)).isDirectory())throw Error('Hãy chọn một thư mục ảnh.');
if(destination===sourcePath||destination.startsWith(sourcePath+path.sep))throw Error('Thư mục xuất phải ở ngoài thư mục ảnh gốc.');
const workspace=await mkdtemp(path.join(tmpdir(),'vietduc-prepare-'));
try{
 execFileSync(process.execPath,[new URL('./photos.mjs',import.meta.url).pathname],{cwd:workspace,env:{...process.env,CASTLE_PHOTOS_SOURCE:sourcePath},stdio:'inherit'});
 await mkdir(destination,{recursive:true});const photos=JSON.parse(await readFile(path.join(workspace,'public/photos.json'),'utf8'));
 for(const photo of photos){const stem=path.basename(photo.id,path.extname(photo.id)).slice(0,80);const hash=path.basename(photo.src,'.webp').slice(0,8);await copyFile(path.join(workspace,'public',photo.src),path.join(destination,`${stem}-${hash}.webp`));}
 await copyFile(path.join(workspace,'public/photo-report.json'),path.join(destination,'photo-report.json'));
 console.log(`Đã chuẩn bị ${photos.length} ảnh: ${destination}\nTải các file .webp trong thư mục này lên public/photos trên GitHub. Ảnh gốc không bị thay đổi.`);
}finally{await rm(workspace,{recursive:true,force:true});}
