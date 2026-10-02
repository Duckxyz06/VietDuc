import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js';
import {spring,interpolate} from 'remotion';

export function createCastle(container,reduceMotion){
 let renderer,svgMode=false;
 const canvas=document.createElement('canvas');let context;
 try{context=canvas.getContext('webgl2',{antialias:true,alpha:true,powerPreference:'low-power'});}catch{}
 if(context){renderer=new THREE.WebGLRenderer({canvas,context,antialias:true,alpha:true,powerPreference:'low-power'});}else{renderer=new SVGRenderer();svgMode=true;renderer.setQuality('low');container.dataset.renderer='svg';}
 if(!svgMode){renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;}container.append(renderer.domElement);
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,1,.1,120);const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableZoom=true;controls.enableDamping=true;controls.minDistance=14;controls.maxDistance=29;controls.minPolarAngle=.65;controls.maxPolarAngle=1.48;controls.target.set(0,2,0);
 scene.add(new THREE.AmbientLight(0xa2a8df,svgMode?.38:1.7));const key=new THREE.DirectionalLight(0xffe5bb,svgMode?.7:3.7);key.position.set(7,14,9);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-10;key.shadow.camera.right=10;key.shadow.camera.top=14;key.shadow.camera.bottom=-8;scene.add(key);const rim=new THREE.DirectionalLight(0xa690e6,svgMode?.35:3);rim.position.set(-8,5,-7);scene.add(rim);const warm=new THREE.PointLight(0xffc479,svgMode?.15:35,18,2);warm.position.set(0,4,3);scene.add(warm);
 const world=new THREE.Group();scene.add(world);const castle=new THREE.Group();world.add(castle);
 const mat=(color,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});const stone=mat(0xd8c8c4),trim=mat(0xf2e4d2),roof=mat(0x776184,.45,.15),dark=mat(0x817280),grass=mat(0x838474),gold=mat(0xdbbb78,.35,.6),rock=mat(0x555366);
 const glow=new THREE.MeshStandardMaterial({color:0xffd991,emissive:0xffb84a,emissiveIntensity:1.5});
 function mesh(geo,material,x,y,z,parent=castle){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function box(w,h,d,x,y,z,material=stone,parent=castle){return mesh(new THREE.BoxGeometry(w,h,d),material,x,y,z,parent)}
 function cylinder(rt,rb,h,x,y,z,material=stone,n=12,parent=castle){return mesh(new THREE.CylinderGeometry(rt,rb,h,n),material,x,y,z,parent)}
 // Faceted floating island, layered rim and cobbled approach.
 cylinder(5.5,3.4,1.8,0,-.8,0,rock,9);cylinder(3.4,.2,2.2,0,-2.8,0,rock,7);cylinder(5.65,5.5,.22,0,.2,0,grass,12);cylinder(4.85,4.85,.16,0,.38,0,dark,12);
 box(2.5,.12,4.1,0,.49,3.5,trim);for(let i=0;i<7;i++)box(2.6,.15,.55,0,.46-i*.14,4.1+i*.34,stone);
 box(4.5,4.4,3.2,0,2.7,-.45);box(4.8,.23,3.5,0,4.85,-.45,trim);box(4.9,.23,3.6,0,.72,-.45,trim);
 // Main pitched roof, rotated four-sided cone.
 const mainRoof=cylinder(0,3.6,2.25,0,6.05,-.45,roof,4);mainRoof.rotation.y=Math.PI/4;mainRoof.scale.z=.78;
 box(1.9,5.8,1.9,0,3.65,-1.65);cylinder(0,1.65,2.7,0,7.9,-1.65,roof,4).rotation.y=Math.PI/4;cylinder(.045,.045,1,0,9.7,-1.65,gold,8);mesh(new THREE.SphereGeometry(.13,10,8),gold,0,10.23,-1.65);
 const flags=[];
 function tower(x,z,h,r=.8){cylinder(r,r+.13,h,x,h/2+.55,z);cylinder(r+.15,r+.15,.28,x,h+.55,z,trim);cylinder(r+.12,r+.12,.18,x,1,z,trim);cylinder(0,r+ .38,1.95,x,h+1.6,z,roof);cylinder(.032,.032,.85,x,h+2.97,z,gold,8);const flag=box(.58,.25,.025,x+.28,h+3.14,z,gold);flags.push(flag);for(let a=0;a<6;a++){let t=a/6*Math.PI*2;box(.22,.31,.22,x+Math.sin(t)*(r+.04),h+.84,z+Math.cos(t)*(r+.04),trim);}for(const y of [2.1,h-.6]){box(.22,.58,.055,x,y,z+r+.01,glow);box(.31,.08,.08,x,y-.33,z+r+.05,trim);}}
 tower(-2.75,1.2,4.65);tower(2.75,1.2,4.65);tower(-2.3,-2,5.6,.7);tower(2.3,-2,5.6,.7);
 // Arched gold doorway and windows.
 const arch=new THREE.Shape();arch.moveTo(-.65,0);arch.lineTo(.65,0);arch.lineTo(.65,1.45);arch.absarc(0,1.45,.65,0,Math.PI,false);arch.lineTo(-.65,0);const door=mesh(new THREE.ShapeGeometry(arch),gold,0,.6,1.19);door.material.side=THREE.DoubleSide;box(.04,1.8,.07,0,1.6,1.23,dark);for(const x of [-1.5,1.5]){box(.46,.9,.06,x,3.6,1.19,glow);box(.65,.1,.12,x,3.08,1.22,trim);box(.04,.9,.08,x,3.6,1.24,stone);box(.46,.04,.08,x,3.6,1.24,stone);}
 // Low walls with crenellations.
 for(const x of [-4.1,4.1]){box(.35,.9,3.4,x,1,1,stone);for(let z=-.5;z<=2.7;z+=.5)box(.42,.32,.24,x,1.6,z,trim);}
 // Cypress trees and lanterns.
 for(const [x,z,s] of [[-4,-2,.9],[4,-2,1],[-4,2.8,.8],[4,2.8,.75],[-3.4,3.8,.55],[3.4,3.8,.65]]){cylinder(.07,.1,.7,x,.8,z,dark,6);cylinder(0,.55*s,2*s,x,1.65*s+.5,z,mat(0x596773),7);cylinder(0,.42*s,1.6*s,x,2.1*s+.5,z,mat(0x697b7e),7);}
 for(const x of [-1.8,1.8]){cylinder(.035,.05,.8,x,1.1,3.4,gold,6);box(.23,.3,.23,x,1.58,3.4,glow);cylinder(0,.19,.17,x,1.81,3.4,gold,4);}
 // Floating fragments, luminous ring, distant dust.
 for(let i=0;i<12;i++){const a=i*2.399;const m=mesh(new THREE.DodecahedronGeometry(.15+(i%3)*.12,0),rock,Math.cos(a)*6.2,-1-i%3*.8,Math.sin(a)*5.5,world);m.rotation.set(a,a/2,0);}
 const ring=mesh(new THREE.TorusGeometry(7,.008,6,120),new THREE.MeshBasicMaterial({color:0xd6b784,transparent:true,opacity:.4}),0,-1,0,world);ring.rotation.x=Math.PI/2;
 const positions=[];for(let i=0;i<180;i++)positions.push((Math.sin(i*78.3)*.5)*38,(Math.cos(i*33.7)*.5)*25,Math.sin(i*91.9)*20);const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));scene.add(new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xfce7c2,size:.035,transparent:true,opacity:.8})));
 let paused=reduceMotion,touring=false,start=performance.now(),last=0,frameId;const frameGroup=new THREE.Group();world.add(frameGroup);const frameMeshes=[];
 function setPhotos(photos,onSelect){frameMeshes.splice(0).forEach(m=>{m.traverse(c=>{if(c.isMesh){c.geometry.dispose();if(c.material.map)c.material.map.dispose();c.material.dispose();}});frameGroup.remove(m)});if(svgMode)return;const loader=new THREE.TextureLoader();photos.slice(0,7).forEach((p,i)=>{const a=i/Math.min(photos.length,7)*Math.PI*2;const group=new THREE.Group();group.position.set(Math.sin(a)*7.15,2.3+(i%2)*1.1,Math.cos(a)*6.3);group.rotation.y=a;const f=new THREE.Mesh(new THREE.BoxGeometry(1.45,1.8,.09),gold.clone());group.add(f);loader.load(p.src,texture=>{texture.colorSpace=THREE.SRGBColorSpace;const image=new THREE.Mesh(new THREE.PlaneGeometry(1.27,1.62),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));image.position.z=.052;group.add(image)},undefined,()=>{});group.userData={photo:p,onSelect};frameGroup.add(group);frameMeshes.push(group)});}
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down;renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(frameGroup.children,true);if(hits.length){let g=hits[0].object;while(g.parent!==frameGroup)g=g.parent;g.userData.onSelect?.(g.userData.photo);}});
 function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();const mobile=w<600;camera.position.set(mobile?15:16,mobile?12:11,mobile?25:21);controls.target.set(0,2,0);camera.setViewOffset(w,h,mobile?0:-w*.23,mobile?-h*.17:0,w,h);controls.update();}new ResizeObserver(resize).observe(container);resize();
 function loop(now){frameId=requestAnimationFrame(loop);if(document.hidden||now-last<(svgMode?90:32))return;last=now;const t=(now-start)/1000;if(!paused){world.position.y=Math.sin(t*.65)*.14;castle.rotation.y=Math.sin(t*.1)*.08;frameGroup.rotation.y=t*.045;flags.forEach((f,i)=>f.rotation.y=Math.sin(t*2+i)*.18);controls.autoRotate=true;controls.autoRotateSpeed=touring?3.5:.25;}else controls.autoRotate=false;const reveal=reduceMotion?1:spring({frame:Math.floor(t*60),fps:60,config:{damping:200},durationInFrames:100});world.scale.setScalar(interpolate(reveal,[0,1],[.85,1])*(container.clientWidth<600?.9:.8));controls.update();renderer.render(scene,camera);}frameId=requestAnimationFrame(loop);
 return {setPaused(v){paused=v},tour(){touring=!touring;paused=false;return touring},setPhotos};
}
