import {defineConfig} from 'vite';
export default defineConfig({
 base:'./',server:{host:'127.0.0.1'},
 build:{rolldownOptions:{output:{codeSplitting:{groups:[
  {name:'three',test:/node_modules[\\/]three/},
  {name:'motion',test:/node_modules[\\/](remotion|react)/}
 ]}}}}
});
