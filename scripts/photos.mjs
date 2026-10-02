import {readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root='public/photos';
const extensions=/\.(png|jpe?g|webp|gif|avif)$/i;
async function walk(dir){const files=await readdir(dir,{withFileTypes:true});let result=[];for(const f of files){const p=path.join(dir,f.name);if(f.isDirectory())result.push(...await walk(p));else if(extensions.test(f.name))result.push(p);}return result;}
const files=(await walk(root)).sort((a,b)=>a.localeCompare(b,'vi',{numeric:true}));
const photos=files.map((p,i)=>({id:p.slice(7),src:p.slice(7).split('/').map(encodeURIComponent).join('/'),title:/^\d{10,}[_-]/.test(path.basename(p))?`Kỷ niệm ${String(i+1).padStart(2,'0')}`:path.basename(p,path.extname(p)).replace(/[_-]/g,' ')}));
await writeFile('public/photos.json',JSON.stringify(photos,null,2));
console.log(`Album: ${photos.length} ảnh`);
