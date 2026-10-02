import {rm} from 'node:fs/promises';
// Deploy optimized images only. The full originals remain safely in the repo.
await rm('dist/photos',{recursive:true,force:true});
