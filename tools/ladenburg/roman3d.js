import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export const BATH_ROOMS=[['Frigidarium',[-20,6,-6]],['Tepidarium',[0,6,0]],['Caldarium',[24,6,14]],['Praefurnium',[38,5,17]]];

// Shared original architecture for the city traces and the time-travel view.
function texture(type){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const c=canvas.getContext('2d');
 if(type==='tile'){c.fillStyle='#ad6145';c.fillRect(0,0,256,256);c.strokeStyle='#693d2c';c.lineWidth=2;for(let y=0;y<256;y+=24){c.beginPath();c.moveTo(0,y);c.lineTo(256,y);c.stroke();for(let x=0;x<256;x+=18){c.strokeStyle='#cf8a60';c.beginPath();c.moveTo(x,y+2);c.lineTo(x,y+20);c.stroke();}}}
 else if(type==='mosaic'){c.fillStyle='#ead7aa';c.fillRect(0,0,256,256);for(let x=0;x<16;x++)for(let y=0;y<16;y++){c.fillStyle=(x+y)%2?'#d2b98a':'#f0e3bd';c.fillRect(x*16,y*16,15,15);}c.strokeStyle='#835c39';c.lineWidth=7;c.strokeRect(10,10,236,236);c.strokeStyle='#8c301f';c.lineWidth=3;c.strokeRect(21,21,214,214);c.beginPath();c.arc(128,128,43,0,Math.PI*2);c.stroke();for(let a=0;a<8;a++){c.save();c.translate(128,128);c.rotate(a*Math.PI/4);c.fillStyle=a%2?'#8c301f':'#7e7854';c.fillRect(3,3,18,18);c.restore();}}
 else{c.fillStyle='#ddd0af';c.fillRect(0,0,256,256);for(let i=0;i<2200;i++){const x=(i*73)%256,y=(i*47+Math.floor(i/256)*31)%256;c.fillStyle=i%3?'#c6b89222':'#fff5dc33';c.fillRect(x,y,2,1);}c.strokeStyle='#b19f7b44';c.lineWidth=1;for(let y=32;y<256;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(256,y);c.stroke();for(let x=(y/32)%2?32:0;x<256;x+=64){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+32);c.stroke();}}}
 const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=2;return t;
}
function roofGeometry(w,d,height,rise){
 const h=w/2,z=d/2;const v=[-h,height,-z,h,height,-z,0,height+rise,-z,-h,height,z,0,height+rise,z,h,height,z,-h,height,-z,0,height+rise,-z,0,height+rise,z,-h,height,-z,0,height+rise,z,-h,height,z,h,height,-z,h,height,z,0,height+rise,z,h,height,-z,0,height+rise,z,0,height+rise,-z];
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.computeVertexNormals();const uv=[];for(let i=0;i<v.length;i+=3)uv.push((v[i]+h)/w,(v[i+2]+z)/d);g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));return g;
}
function barrelGeometry(w,d,y,rise){
 const v=[],uv=[];for(let i=0;i<24;i++){const a=i/24*Math.PI,b=(i+1)/24*Math.PI;const p=[Math.cos(a)*w/2,y+Math.sin(a)*rise],q=[Math.cos(b)*w/2,y+Math.sin(b)*rise];v.push(p[0],p[1],-d/2,q[0],q[1],-d/2,q[0],q[1],d/2,p[0],p[1],-d/2,q[0],q[1],d/2,p[0],p[1],d/2);uv.push(i/24,0,(i+1)/24,0,(i+1)/24,1,i/24,0,(i+1)/24,1,i/24,1);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;
}
function archGeometry(w,h,depth){
 const r=w/2,y=h-r;const s=new THREE.Shape();s.moveTo(-r,0);s.lineTo(-r,y);for(let i=0;i<=20;i++){const a=Math.PI-i/20*Math.PI;s.lineTo(Math.cos(a)*r,y+Math.sin(a)*r);}s.lineTo(r,0);s.lineTo(r-1,0);s.lineTo(r-1,y);for(let i=0;i<=20;i++){const a=i/20*Math.PI;s.lineTo(Math.cos(a)*(r-1),y+Math.sin(a)*(r-1));}s.lineTo(-r+1,0);s.closePath();return new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false});
}

export function createRomanArchitecture(pt,MONUMENTS){
 const scene=new THREE.Group();
 const stoneTex=texture('stone'),roofTex=texture('tile'),mosaicTex=texture('mosaic');
 const material=(color,map=null)=>new THREE.MeshStandardMaterial({color,map,roughness:.92});
 const M={stone:material(0xf1dfbb,stoneTex),white:material(0xf5e8ce),brick:material(0xa45136),roof:material(0xffffff,roofTex),sand:material(0xe9dbb9),floor:material(0xffffff,mosaicTex),dark:material(0x4e3a28),wood:material(0x87664a),bronze:material(0x9e8145),grass:material(0xb8c098),water:new THREE.MeshStandardMaterial({color:0x5faaa9,roughness:.24,metalness:.25,transparent:true,opacity:.83}),warmWater:new THREE.MeshStandardMaterial({color:0x679a99,roughness:.18,metalness:.15,transparent:true,opacity:.86})};
 M.roof.side=THREE.DoubleSide;
 const groups=[],roofParts=[],bathFloor=new THREE.Group(),bathWalls=[],bathPillars=new THREE.Group();
 const cube=(parent,x,y,z,w,h,d,mat)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y+h/2,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 const cylinder=(parent,x,y,z,r,h,mat,sides=16)=>{const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,sides),mat);mesh.position.set(x,y+h/2,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 const addRoof=(parent,x,z,w,d,h,rise)=>{const mesh=new THREE.Mesh(roofGeometry(w,d,h,rise),M.roof);mesh.position.set(x,0,z);mesh.castShadow=true;parent.add(mesh);if(['bath','forum','basilica','burgus'].includes(parent.userData.phase))roofParts.push(mesh);return mesh;};
 const addBarrel=(parent,x,z,w,d,y,rise)=>{const mesh=new THREE.Mesh(barrelGeometry(w,d,y,rise),M.roof);mesh.position.set(x,0,z);mesh.castShadow=true;parent.add(mesh);if(['bath','forum','basilica','burgus'].includes(parent.userData.phase))roofParts.push(mesh);return mesh;};
 function phase(id,birth,end=null){const root=new THREE.Group();root.userData.phase=id;scene.add(root);const state={id,root,birth,end,amount:0,target:0};groups.push(state);return root;}
 // The cavalry fort is a schematic first phase, not a surveyed reconstruction.
 const fort=phase('fort',70,115);fort.position.copy(pt([8.6102,49.47215]));
 cube(fort,0,0,0,150,.6,155,M.grass);
 for(const z of [-78,78])cube(fort,0,.6,z,150,4,2,M.wood);
 for(const x of [-75,75])cube(fort,x,.6,0,2,4,155,M.wood);
 for(const x of [-72,72])for(const z of [-74,74]){cube(fort,x,0,z,7,10,7,M.wood);addRoof(fort,x,z,9,9,10,3);}
 for(const x of [-42,42])for(const z of [-50,-27,25,49]){cube(fort,x,0,z,48,4,13,M.stone);addRoof(fort,x,z,50,15,4,3);}
 cube(fort,0,0,-18,32,5,27,M.stone);addRoof(fort,0,-18,35,30,5,4);
 // Forum court and porticoes, scaled to complement the 47 m wide basilica.
 const forum=phase('forum',120,270);forum.position.copy(pt(MONUMENTS.forum.coords));forum.rotation.y=.05;
 cube(forum,0,.1,0,83,.8,84,M.stone);cube(forum,3,.92,0,75,.16,41.5,M.sand);
 for(const z of [-34.5,34.5]){
  cube(forum,0,1,z,82,8,1.1,M.stone);
  for(let i=0;i<8;i++){const x=-35.5+i*10.1;cube(forum,x,1,z+Math.sign(z)*6,9.2,7,1,M.stone);cube(forum,x-4.6,1,z,1,7,12.5,M.stone);}
  addRoof(forum,0,z,83,19,8,3.4);
 }
 for(const z of [-23.5,23.5])for(let x=-35;x<=36;x+=6.45){cylinder(forum,x,1,z,.78,7.1,M.white,12);cube(forum,x,1,z,1.8,.45,1.8,M.white);cube(forum,x,7.8,z,1.8,.6,1.8,M.white);}
 for(const z of [-23.5,23.5])cube(forum,0,8.4,z,82,1,2.1,M.white);
 for(let z=-18;z<=18;z+=6){cylinder(forum,-37,1,z,.85,7.1,M.white);cube(forum,-37,8.1,z,2,.6,2,M.white);}
 cube(forum,-37,8.6,0,5,1.2,45,M.white);addRoof(forum,-37,0,8,49,9.8,2.4);
 cylinder(forum,0,1.1,0,3,.6,M.white);cube(forum,0,1.7,0,1.5,3,1.5,M.bronze);
 // The great hall: actual plan size, interpretive elevations and two arcade levels.
 const basilica=phase('basilica',130,270);basilica.position.copy(pt(MONUMENTS.basilica.coords));basilica.rotation.y=.05;
 cube(basilica,0,0,0,47,1,73,M.stone);cube(basilica,0,1,0,45,.18,71,M.floor);
 const arcade=archGeometry(9,9,1.2);
 for(const x of [-10.5,10.5])for(let z=-30;z<=30;z+=10){for(const y of [1,11]){const a=new THREE.Mesh(arcade,M.stone);a.rotation.y=Math.PI/2;a.position.set(x,y,z);a.castShadow=true;basilica.add(a);}cube(basilica,x,10,z,1.5,1,10,M.white);}
 for(const x of [-22.4,22.4]){
  cube(basilica,x,1,0,1.3,3.4,72,M.stone);
  for(let z=-30;z<=30;z+=10){cube(basilica,x,4.4,z-4.6,1.3,6.6,1.3,M.stone);const a=new THREE.Mesh(archGeometry(8,6.6,1.3),M.stone);a.rotation.y=Math.PI/2;a.position.set(x-.6,4.4,z);a.castShadow=true;basilica.add(a);}
  cube(basilica,x,11,0,1.5,1.2,73,M.white);
  addRoof(basilica,Math.sign(x)*16.5,0,13,73,11.5,3.7);
 }
 for(const z of [-36.3,36.3]){cube(basilica,0,1,z,47,11,1.2,M.stone);cube(basilica,0,12,z,21,10,1.2,M.stone);}
 for(const x of [-10.5,10.5]){cube(basilica,x,20,0,1.4,2,73,M.stone);}
 addRoof(basilica,0,0,23,75,22,6.4);
 // A curia-like apse is illustrative, consistent with the explicit model note.
 const apse=new THREE.Mesh(new THREE.CylinderGeometry(9,9,10,24,1,false,0,Math.PI),M.stone);apse.position.set(28,6,0);apse.rotation.y=Math.PI/2;apse.castShadow=true;basilica.add(apse);const apseRoof=new THREE.Mesh(new THREE.ConeGeometry(10,4,24,1,false,0,Math.PI),M.roof);apseRoof.position.set(28,13,0);apseRoof.rotation.y=Math.PI/2;basilica.add(apseRoof);roofParts.push(apseRoof);

 // The bathhouse is an original architectural type model. Its heated floor,
 // pilae, basins and roof system are actual geometry, not a flat reveal.
 const bath=phase('bath',150,270);bath.position.copy(pt(MONUMENTS.bath.coords));bath.rotation.y=-.15;
 cube(bath,0,0,0,78,.7,61,M.stone);bath.add(bathFloor,bathPillars);
 cube(bathFloor,0,3.65,0,66,.6,47,M.floor);
 for(let x=5;x<=29;x+=3.1)for(let z=-16;z<=17;z+=3.1){cube(bathPillars,x,.8,z,1.05,2.8,1.05,M.brick);for(const y of [1.1,1.6,2.1,2.6,3.1])cube(bathPillars,x,y,z,1.16,.13,1.16,M.brick);}
 // Cool basin set in a white masonry surround.
 cube(bathFloor,-20,4.25,-6,17,.45,14,M.white);cube(bathFloor,-20,4.72,-6,14,.14,11,M.water);
 for(const x of [-28.5,-11.5])cube(bathFloor,x,4.3,-6,.8,1,14,M.white);
 for(const z of [-13,1])cube(bathFloor,-20,4.3,z,18,1,.8,M.white);
 // Caldarium apsidal hot pool.
 const pool=new THREE.Mesh(new THREE.CylinderGeometry(7.7,7.7,.7,32),M.white);pool.position.set(24,4.5,14);bathFloor.add(pool);
 const water=new THREE.Mesh(new THREE.CircleGeometry(6.8,32),M.warmWater);water.rotation.x=-Math.PI/2;water.position.set(24,4.88,14);bathFloor.add(water);
 for(const z of [-23.5,23.5]){const w=cube(bath,0,4.3,z,67,7.2,1.2,M.stone);if(z>0)bathWalls.push(w);}
 for(const x of [-33,33]){const w=cube(bath,x,4.3,0,1.2,7.2,47,M.stone);if(x<0)bathWalls.push(w);}
 for(const x of [-8,7]){cube(bath,x,4.3,-14,1.1,6.7,19,M.stone);cube(bath,x,4.3,17,1.1,6.7,13,M.stone);const arch=new THREE.Mesh(archGeometry(8.2,7,1.1),M.stone);arch.rotation.y=Math.PI/2;arch.position.set(x,4.3,1);bath.add(arch);}
 for(const x of [-26,-15,0,16,28]){cube(bath,x,7.7,-24.14,3,3,.18,M.dark);cube(bath,x,7.4,-24.24,3.6,.5,.25,M.white);}
 for(let x=-26;x<=27;x+=8){cube(bathFloor,x,4.3,20,6,.7,2.6,M.white);}
 addRoof(bath,-20,0,27,50,11.5,4.8);addBarrel(bath,0,0,16,49,11.5,6);addBarrel(bath,20,0,28,49,11.5,8);
 // Furnace and the underfloor channel are visible on the heating cutaway.
 cube(bath,38,.8,13,10,4.5,10,M.brick);cube(bath,32,.8,13,8,2.8,3,M.dark);const oven=new THREE.Mesh(archGeometry(4.6,4.5,1.2),M.brick);oven.position.set(38,.8,18.2);bath.add(oven);
 const emberMat=new THREE.MeshStandardMaterial({color:0xc85320,emissive:0xbd3c0f,emissiveIntensity:1.5,roughness:.8});for(let x=35;x<=40;x+=1.3)cylinder(bath,x,1,16.9,.9,.7,emberMat,8);
 for(const z of [-20,20])for(let x=11;x<=29;x+=6){cube(bath,x,1,z,1.2,7,1.4,M.brick);}
 // Low foundation traces stay underneath the later city.
 const traces=new THREE.Group();scene.add(traces);for(const id of ['forum','basilica','bath']){const m=MONUMENTS[id],p=pt(m.coords);cube(traces,p.x,-.05,p.z,id==='bath'?76:id==='basilica'?47:83,.38,id==='bath'?60:id==='basilica'?73:84,material(0xa99871));}
 // Late Roman defensive complex, after the classical urban phase.
 const burgus=phase('burgus',365,480);burgus.position.copy(pt(MONUMENTS.burgus.coords));
 cube(burgus,0,0,0,49,.6,49,M.stone);cube(burgus,0,.6,0,20,17,20,M.stone);addRoof(burgus,0,0,22,22,17.6,6);
 for(const x of [-23,23])cube(burgus,x,.6,0,2.8,7,48,M.stone);
 for(const z of [-23,23])cube(burgus,0,.6,z,47,7,2.8,M.stone);
 for(const x of [-22,22])for(const z of [-22,22]){cylinder(burgus,x,.6,z,4.6,12,M.stone,12);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;cube(burgus,x+Math.cos(a)*3.9,12.6,z+Math.sin(a)*3.9,1.8,1.8,1.8,M.stone);}}
 for(const x of [-7,7])for(const z of [-10.12,10.12])cube(burgus,x,9,z,1.3,3,.15,M.dark);
 const dynamic=new Set([...roofParts,...bathWalls]);
 function batch(parent){
  const buckets=new Map();
  for(const child of [...parent.children]){
   if(child.isGroup){batch(child);continue;}
   if(!child.isMesh||dynamic.has(child)||Array.isArray(child.material))continue;
   const list=buckets.get(child.material)||[];list.push(child);buckets.set(child.material,list);
  }
  for(const [mat,meshes] of buckets){if(meshes.length<2)continue;const originals=new Set();const geos=meshes.map(m=>{m.updateMatrix();originals.add(m.geometry);const g=m.geometry.clone().applyMatrix4(m.matrix);return g.index?g.toNonIndexed():g;});const g=mergeGeometries(geos,false);if(!g){geos.forEach(g=>g.dispose());continue;}const merged=new THREE.Mesh(g,mat);merged.castShadow=meshes.some(m=>m.castShadow);merged.receiveShadow=meshes.some(m=>m.receiveShadow);meshes.forEach(m=>parent.remove(m));parent.add(merged);geos.forEach(g=>g.dispose());originals.forEach(g=>g.dispose());}
 }
 const batchAll=()=>groups.forEach(g=>batch(g.root));


 roofParts.forEach(r=>r.userData.baseY=r.position.y);
 return {root:scene,M,material,groups,phase,cube,cylinder,addRoof,roofParts,bathFloor,bathWalls,bath,forum,basilica,burgus,fort,traces,batchAll};
}
