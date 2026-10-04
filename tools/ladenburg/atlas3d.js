import {MONUMENTS} from './journey3d.js';
import {createRomanArchitecture,BATH_ROOMS} from './roman3d.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
const CENTER=[8.6086,49.4741];
const W=1120,D=1160;
const flatPoint=p=>new THREE.Vector2((p[0]-CENTER[0])*72400,(CENTER[1]-p[1])*111195);
const xyz=(p,y=0)=>{const q=flatPoint(p);return new THREE.Vector3(q.x,y,q.y)};
const WALK_CENTER=xyz([8.60735,49.47225]);
const materials={};
const palette={wall:0xe3d7be,wallAlt:0xd6c8af,roof:0xac7658,roofAlt:0x8d7060,stone:0xc9c7ab,greenRoof:0x6f8067,road:0xf9f4e8,roadEdge:0xd9ceba,park:0xc2cea9,river:0x91b9b7,ink:0x2d5140,route:0xaf4327};
function mat(color,roughness=1){return new THREE.MeshStandardMaterial({color,roughness,metalness:0})}
function ringCoords(coords){let a=coords.map(flatPoint);if(a.length>1&&a[0].distanceTo(a[a.length-1])<.15)a.pop();return a}
function shapeFor(coords){const pts=ringCoords(coords);const s=new THREE.Shape(pts.map(p=>new THREE.Vector2(p.x,-p.y)));return s}
function flatPolygon(coords,y,material){
 let polygon=ringCoords(coords);
 for(const [axis,bound,greater] of [['x',-W/2,true],['x',W/2,false],['y',-D/2,true],['y',D/2,false]]){
  const out=[];for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length],ia=greater?a[axis]>=bound:a[axis]<=bound,ib=greater?b[axis]>=bound:b[axis]<=bound;if(ia)out.push(a);if(ia!==ib){const t=(bound-a[axis])/(b[axis]-a[axis]);out.push(a.clone().lerp(b,t))}}polygon=out;
 }
 const shape=new THREE.Shape(polygon.map(p=>new THREE.Vector2(p.x,-p.y)));const geo=new THREE.ShapeGeometry(shape);geo.rotateX(-Math.PI/2);geo.translate(0,y,0);const mesh=new THREE.Mesh(geo,material);mesh.receiveShadow=true;return mesh}
function makeRoof(pts,wallHeight,rise){
 if(pts.length<3)return null;
 // A tent roof over each real footprint. Simple rectangles get an explicit ridge.
 const center=new THREE.Vector2();pts.forEach(p=>center.add(p));center.multiplyScalar(1/pts.length);
 let verts=[];
 if(pts.length===4){
  const edges=pts.map((p,i)=>p.distanceTo(pts[(i+1)%4]));const i=edges[0]+edges[2]>=edges[1]+edges[3]?0:1;
  const a=pts[i],b=pts[(i+1)%4],c=pts[(i+2)%4],d=pts[(i+3)%4];
  const r1=a.clone().add(d).multiplyScalar(.5),r2=b.clone().add(c).multiplyScalar(.5);
  const e=[a,b,c,d].map(p=>[p.x,wallHeight,p.y]);const r=[[r1.x,wallHeight+rise,r1.y],[r2.x,wallHeight+rise,r2.y]];
  const tri=(a,b,c)=>verts.push(...a,...b,...c);
  tri(e[0],e[1],r[1]);tri(e[0],r[1],r[0]);tri(e[2],e[3],r[0]);tri(e[2],r[0],r[1]);tri(e[3],e[0],r[0]);tri(e[1],e[2],r[1]);
 }else{
  for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];verts.push(a.x,wallHeight,a.y,b.x,wallHeight,b.y,center.x,wallHeight+rise,center.y)}
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.computeVertexNormals();return geo;
}
function cutSegment(a,b){
 // Liang–Barsky clips every street segment to the model's paper base.
 let lo=0,hi=1;const dx=b.x-a.x,dz=b.z-a.z;
 const p=[-dx,dx,-dz,dz],q=[a.x+W/2,W/2-a.x,a.z+D/2,D/2-a.z];
 for(let i=0;i<4;i++){if(Math.abs(p[i])<1e-8){if(q[i]<0)return null}else{const t=q[i]/p[i];if(p[i]<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>hi)return null}}
 return [new THREE.Vector3(a.x+lo*dx,a.y,a.z+lo*dz),new THREE.Vector3(a.x+hi*dx,b.y,a.z+hi*dz)];
}
function ribbon(coords,width,y){const vertices=[];for(let i=0;i<coords.length-1;i++){let a=xyz(coords[i],y),b=xyz(coords[i+1],y);const cut=cutSegment(a,b);if(!cut)continue;[a,b]=cut;const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);if(len<.05)continue;const nx=-dz/len*width/2,nz=dx/len*width/2;const aa=[a.x+nx,y,a.z+nz],ab=[a.x-nx,y,a.z-nz],ba=[b.x+nx,y,b.z+nz],bb=[b.x-nx,y,b.z-nz];vertices.push(...aa,...ba,...bb,...aa,...bb,...ab)}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();return geo}
function combine(geos){const usable=geos.filter(g=>g&&g.attributes.position.count>0).map(g=>{const v=g.index?g.toNonIndexed():g;for(const attr of Object.keys(v.attributes))if(!['position','normal'].includes(attr))v.deleteAttribute(attr);if(!v.attributes.normal)v.computeVertexNormals();return v});if(!usable.length)return null;const merged=mergeGeometries(usable,false);usable.forEach(g=>g.dispose());return merged}
window.createLadenburg3D=function(container,data,stops,hooks){
 let renderer;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'})}catch(e){console.warn('3D unavailable; street plan retained.',e.message);return null}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,navigator.maxTouchPoints>0?1.25:1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
 renderer.domElement.setAttribute('aria-label','Drehbare dreidimensionale Karte von Ladenburg. Ziehen zum Drehen; zwei Finger oder Tasten zum Zoomen.');renderer.domElement.setAttribute('role','img');renderer.domElement.tabIndex=0;container.prepend(renderer.domElement);
 const touchDevice=navigator.maxTouchPoints>0||matchMedia('(pointer:coarse)').matches;let interaction=!touchDevice;
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xeee7d8);
 const camera=new THREE.OrthographicCamera(-550,550,430,-430,.1,4500);camera.position.set(380,900,920).add(WALK_CENTER);camera.lookAt(WALK_CENTER);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.copy(WALK_CENTER);controls.enableDamping=false;controls.minZoom=.75;controls.maxZoom=4;controls.minPolarAngle=.04;controls.maxPolarAngle=1.25;controls.enablePan=true;controls.screenSpacePanning=false;controls.enableRotate=true;controls.mouseButtons.LEFT=THREE.MOUSE.ROTATE;controls.touches.ONE=THREE.TOUCH.ROTATE;controls.touches.TWO=THREE.TOUCH.DOLLY_PAN;
 const hemi=new THREE.HemisphereLight(0xfffcf0,0x829079,2.1);scene.add(hemi);
 const sun=new THREE.DirectionalLight(0xfff5de,2.4);sun.position.set(-360,700,-300);sun.castShadow=true;sun.shadow.mapSize.set(touchDevice?1024:2048,touchDevice?1024:2048);sun.shadow.camera.left=-650;sun.shadow.camera.right=650;sun.shadow.camera.top=600;sun.shadow.camera.bottom=-600;sun.shadow.camera.near=30;sun.shadow.camera.far=1800;sun.shadow.bias=-.0002;sun.shadow.normalBias=.65;scene.add(sun);
 const base=new THREE.Mesh(new THREE.BoxGeometry(W,12,D),mat(0xe5dbc7));base.position.y=-6.5;base.receiveShadow=true;scene.add(base);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(W,D),mat(0xece5d5));ground.rotation.x=-Math.PI/2;ground.position.y=-.4;ground.receiveShadow=true;scene.add(ground);
 // All geometry is embedded: no live map tiles, elevation or model requests.
 const waterMat=mat(palette.river),parkMat=mat(palette.park);data.features.filter(f=>f.kind==='water'||f.kind==='park').forEach(f=>{const poly=flatPolygon(f.coordinates,.03,f.kind==='water'?waterMat:parkMat);scene.add(poly)});
 const roads=data.features.filter(f=>f.kind==='road'&&!['platform','construction','proposed'].includes(f.type));
 const addMerged=(geos,material,parent=scene)=>{const geometry=combine(geos);if(!geometry)return null;const mesh=new THREE.Mesh(geometry,material);mesh.receiveShadow=true;parent.add(mesh);return mesh};
 const edgeGeos=[],roadGeos=[];roads.forEach(f=>{const width=['tertiary','secondary'].includes(f.type)?9:['footway','path','steps'].includes(f.type)?2.2:['service','track'].includes(f.type)?4:5.5;edgeGeos.push(ribbon(f.coordinates,width+1.4,.06));roadGeos.push(ribbon(f.coordinates,width,.09))});
 addMerged(edgeGeos,mat(palette.roadEdge));addMerged(roadGeos,mat(palette.road));
 const railwayGeo=data.features.filter(f=>f.kind==='rail').map(f=>ribbon(f.coordinates,1,.12));addMerged(railwayGeo,mat(0x9c9e84));
 const modern=new THREE.Group();scene.add(modern);const wallMats=[mat(palette.wall),mat(palette.wallAlt),mat(palette.stone)],roofMats=[mat(palette.roof),mat(palette.roofAlt),mat(palette.greenRoof)];
 wallMats.forEach(m=>m.side=THREE.DoubleSide);roofMats.forEach(m=>m.side=THREE.DoubleSide);
 const wallBuckets=[[],[],[]],roofBuckets=[[],[],[]];const specialIds=new Set([289802631,1189938433,181567321,1189309651,119239310]);
 let buildingCount=0;
 data.features.filter(f=>f.kind==='building').forEach(f=>{
  const pts=ringCoords(f.coordinates);if(pts.length<3)return;const center=pts.reduce((p,q)=>p.add(q),new THREE.Vector2()).multiplyScalar(1/pts.length);if(Math.abs(center.x)>W/2-4||Math.abs(center.y)>D/2-4)return;
  if(specialIds.has(f.id))return;
  let reported=parseFloat(f.height),levels=parseFloat(f.levels);const area=Math.abs(THREE.ShapeUtils.area(pts));if(area<7)return;
  const total=Number.isFinite(reported)?Math.min(45,Math.max(2,reported)):Number.isFinite(levels)?levels*3.1+3.1:area>500?10.5:8.8;
  const roof=Number.isFinite(parseFloat(f.roofHeight))?Math.min(6,parseFloat(f.roofHeight)):f.roofShape==='flat'?0:2.5;
  const exaggerated=1.45,wallHeight=Math.max(2,total-roof)*exaggerated,rise=roof*exaggerated;
  const shape=shapeFor(f.coordinates);const geo=new THREE.ExtrudeGeometry(shape,{depth:wallHeight,bevelEnabled:false,steps:1});geo.rotateX(-Math.PI/2);const bucket=f.type==='church'?2:f.id%2;wallBuckets[bucket].push(geo);if(rise>.1)roofBuckets[f.type==='church'?2:f.id%2].push(makeRoof(pts,wallHeight,rise));buildingCount++;
 });
 for(let i=0;i<3;i++){const walls=addMerged(wallBuckets[i],wallMats[i],modern);if(walls)walls.castShadow=true;const roofs=addMerged(roofBuckets[i],roofMats[i],modern);if(roofs)roofs.castShadow=true}
 // Landmark miniatures are stylised to aid recognition, not measured architectural surveys.
 const special=new THREE.Group();modern.add(special);
 function cube(x,y,z,w,h,d,material,parent=special){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y+h/2,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
 function cone(x,y,z,r,h,material,sides=4,parent=special){const mesh=new THREE.Mesh(new THREE.ConeGeometry(r,h,sides),material);mesh.position.set(x,y+h/2,z);if(sides===4)mesh.rotation.y=Math.PI/4;mesh.castShadow=true;parent.add(mesh);return mesh}
 const limestone=mat(0xe5dcc6),roofStone=mat(0x667c68),terracotta=mat(0xac7053),dark=mat(0x475745);
 // St. Gallus: twin western towers, long nave, lower side aisles, eastern choir.
 const cg=xyz([8.611085,49.47176]);cube(cg.x,cg.y,cg.z,43,17,17,limestone);cube(cg.x,0,cg.z,36,24,10,limestone);const naveRoof=makeRoof([new THREE.Vector2(cg.x-18,cg.z-5),new THREE.Vector2(cg.x+18,cg.z-5),new THREE.Vector2(cg.x+18,cg.z+5),new THREE.Vector2(cg.x-18,cg.z+5)],24,9);special.add(new THREE.Mesh(naveRoof,terracotta));
 for(const z of [cg.z-7,cg.z+7]){cube(cg.x-22,0,z,8,39,8,limestone);cube(cg.x-22,33,z,8.5,3,8.5,limestone);cone(cg.x-22,39,z,6,14,roofStone);cube(cg.x-22,29,z-4.08,2,5,.18,dark)}
 const choir=new THREE.Mesh(new THREE.CylinderGeometry(8,8,18,6),limestone);choir.position.set(cg.x+25,9,cg.z);choir.rotation.y=Math.PI/6;choir.castShadow=true;special.add(choir);cone(cg.x+25,18,cg.z,8.5,9,terracotta,6);
 // Water tower: cylindrical shaft, broad tank and conical cap.
 const wt=xyz([8.606315,49.470178]);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(4.8,7,35,16),limestone);shaft.position.set(wt.x,17.5,wt.z);shaft.castShadow=true;special.add(shaft);const tank=new THREE.Mesh(new THREE.CylinderGeometry(9.2,8.2,9,16),mat(0xb9ba9e));tank.position.set(wt.x,39.5,wt.z);tank.castShadow=true;special.add(tank);cone(wt.x,44,wt.z,10,10,roofStone,16);
 // Gate and adjacent tower: a visible arch/passage rather than a solid cube.
 const gate=xyz([8.607605,49.474444]);cube(gate.x-6,0,gate.z,5,10,11,limestone);cube(gate.x+6,0,gate.z,5,10,11,limestone);cube(gate.x,10,gate.z,17,21,11,limestone);cone(gate.x,31,gate.z,13,8,terracotta);
 const ht=xyz([8.607157,49.474383]);const roundTower=new THREE.Mesh(new THREE.CylinderGeometry(4.5,5,21,12),limestone);roundTower.position.set(ht.x,10.5,ht.z);roundTower.castShadow=true;special.add(roundTower);cone(ht.x,21,ht.z,6,10,terracotta,12);
 // Tower-like Benz-Garage with crenellations and a dark vehicle opening.
 const garage=xyz([8.605069,49.470744]);cube(garage.x,0,garage.z,11,14,13,limestone);cube(garage.x,0,garage.z+6.6,6,7,.15,dark);for(let i=-1;i<=1;i++){cube(garage.x+i*4,14,garage.z-5.6,2,2.5,2,limestone);cube(garage.x+i*4,14,garage.z+5.6,2,2.5,2,limestone)}
 // Copper walking ribbon stays on the real mapped street network.
 const routeGroup=new THREE.Group();scene.add(routeGroup);const routeGeo=data.legs.map(l=>ribbon(l.coordinates,3.2,.48));addMerged(data.legs.map(l=>ribbon(l.coordinates,5.4,.44)),mat(0xfff7e3),routeGroup);addMerged(routeGeo,mat(palette.route),routeGroup);
 const arrowMat=new THREE.MeshBasicMaterial({color:palette.route,side:THREE.DoubleSide});data.legs.forEach(l=>{const m=Math.floor(l.coordinates.length/2);if(m<1)return;const a=xyz(l.coordinates[m-1],.7),b=xyz(l.coordinates[m],.7);const v=b.clone().sub(a).normalize();const n=new THREE.Vector3(-v.z,0,v.x);const p1=b.clone().addScaledVector(v,5),p2=b.clone().addScaledVector(v,-3).addScaledVector(n,3),p3=b.clone().addScaledVector(v,-3).addScaledVector(n,-3);const g=new THREE.BufferGeometry().setFromPoints([p1,p2,p3]);g.computeVertexNormals();routeGroup.add(new THREE.Mesh(g,arrowMat))});
 // Low-poly trees grow only inside the mapped park polygons.
 const trees=new THREE.Group();modern.add(trees);const treeMat=mat(0x8a9f73),trunkMat=mat(0x87745a);const treePositions=[];data.features.filter(f=>f.kind==='park').forEach(f=>{const pts=ringCoords(f.coordinates),box=new THREE.Box2().setFromPoints(pts);for(let x=box.min.x+12;x<box.max.x;x+=20){for(let z=box.min.y+12;z<box.max.y;z+=21){const lon=CENTER[0]+x/72400,lat=CENTER[1]-z/111195;let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if(((a.y>z)!==(b.y>z))&&(x<(b.x-a.x)*(z-a.y)/(b.y-a.y)+a.x))inside=!inside}if(inside&&Math.abs(x)<W/2&&Math.abs(z)<D/2&&Math.sin(x*.63+z*.23)>.0)treePositions.push([x,z])}}});
 const canopy=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(4,0),treeMat,treePositions.length),trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.55,.7,5,5),trunkMat,treePositions.length);const dummy=new THREE.Object3D();treePositions.forEach(([x,z],i)=>{dummy.position.set(x,8,z);dummy.scale.set(1,1.35,1);dummy.updateMatrix();canopy.setMatrixAt(i,dummy.matrix);dummy.position.set(x,2.5,z);dummy.scale.set(1,1,1);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix)});canopy.castShadow=true;trees.add(canopy,trunks);
 // Evidence locations and interpretive architecture are labeled separately.
 const traces=[{stop:1,model:'basilica',key:'A',name:'Basilika',coords:[8.61108,49.47176],type:'Fundamente bei St. Gallus; Aufriss ergänzt'}, {stop:2,model:'forum',key:'B',name:'Forum',coords:data.stops.metzger,type:'Forumsreste in der Metzgergasse; Aufriss ergänzt'}, {stop:3,key:'C',name:'Römische Sammlung',coords:[8.608016,49.470805],type:'Objekte im Museum; Kopie der Jupitergigantensäule draußen'}, {stop:4,model:'burgus',key:'D',name:'Spätantiker Burgus',coords:data.stops.burgus,type:'Erhaltene Befestigung beim Rathaus; Aufriss ergänzt'}, {model:'bath',key:'E',name:'Thermenmodell',coords:MONUMENTS.bath.coords,type:'Römischer Bautyp; Standort schematisch, kein Fundort'}];
 const ancient=new THREE.Group();ancient.visible=false;scene.add(ancient);const ancientMaterials=[];
 const traceGeometry=new THREE.Group();ancient.add(traceGeometry);
 let romanArchitecture=null,romanSelection=null,romanCutaway=false,romanHeating=false;
 function ensureRomanArchitecture(){
  if(romanArchitecture)return;
  romanArchitecture=createRomanArchitecture(xyz,MONUMENTS);romanArchitecture.fort.visible=false;romanArchitecture.traces.visible=false;romanArchitecture.batchAll();ancient.add(romanArchitecture.root);
  const border=new THREE.BufferGeometry().setFromPoints([[-43,1,-34],[43,1,-34],[43,1,34],[-43,1,34],[-43,1,-34]].map(p=>new THREE.Vector3(...p)));
  const outline=new THREE.Line(border,new THREE.LineDashedMaterial({color:0x8c301f,dashSize:3,gapSize:2}));outline.computeLineDistances();romanArchitecture.bath.add(outline);
 }
 traces.forEach(t=>{const p=xyz(t.coords,.65);const diskMat=new THREE.MeshBasicMaterial({color:0xc3964d,transparent:true,opacity:.33,side:THREE.DoubleSide,depthWrite:false});const disk=new THREE.Mesh(new THREE.CircleGeometry(19,48),diskMat);disk.rotation.x=-Math.PI/2;disk.position.copy(p);traceGeometry.add(disk);ancientMaterials.push(diskMat);const rimMat=new THREE.MeshBasicMaterial({color:0x9e622a,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false});const rim=new THREE.Mesh(new THREE.RingGeometry(18.3,19,48),rimMat);rim.rotation.x=-Math.PI/2;rim.position.copy(p).add(new THREE.Vector3(0,.05,0));traceGeometry.add(rim);ancientMaterials.push(rimMat);const post=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,22,8),mat(0xc3964d));post.position.copy(p).add(new THREE.Vector3(0,11,0));traceGeometry.add(post)});
 // All annotation controls are HTML, so they remain keyboard accessible.
 const labelLayer=document.createElement('div');labelLayer.className='three-labels';container.appendChild(labelLayer);const connector=document.createElementNS('http://www.w3.org/2000/svg','svg');connector.classList.add('three-connectors');labelLayer.appendChild(connector);
 const stopLabels=stops.map((s,i)=>{const button=document.createElement('button');button.className='three-pin';button.setAttribute('aria-label',`Station ${i+1}: ${s.name}`);button.setAttribute('aria-pressed',i===0?'true':'false');button.innerHTML=`<span>${i+1}</span><small>${['Marktplatz','St. Gallus','Römisches Fenster','Bischofshof','Burgus','Benz-Garage','Neckarufer','Martinstor'][i]}</small>`;button.addEventListener('click',()=>hooks.selectStop(i));labelLayer.appendChild(button);const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.classList.add('pin-connector');connector.appendChild(line);return {el:button,world:xyz(data.stops[s.id],2),line,index:i}});
 const traceLabels=traces.map(t=>{const button=document.createElement('button');button.className='three-evidence'+(t.model==='bath'?' schematic':'');button.innerHTML=`<b>${t.key}</b><span>${t.name}</span>`;button.setAttribute('aria-label',`${t.name}. ${t.type}`);button.addEventListener('click',()=>t.model?hooks.selectRomanModel(t.model):hooks.selectStop(t.stop));labelLayer.appendChild(button);const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.classList.add('evidence-connector');connector.appendChild(line);return {el:button,world:xyz(t.coords,25),t,line}});
 const otherLabels=[['NECKAR',[8.60265,49.4701],2,'river-label'],['Wasserturm',[8.606315,49.470178],60,'landmark-label'],['Hexenturm',[8.607157,49.474383],34,'landmark-label'],['Benz-Haus',[8.60649,49.47077],22,'landmark-label'],['Bahnhof',[8.60265,49.47343],3,'landmark-label']].map(([name,p,h,cl])=>{const el=document.createElement('span');el.className='three-place '+cl;el.textContent=name;labelLayer.appendChild(el);return {el,world:xyz(p,h)}});
 const position=new THREE.Mesh(new THREE.SphereGeometry(4,12,8),mat(0x203f35));position.visible=false;scene.add(position);
 const roomLayer=document.createElement('div');roomLayer.className='roman-room-labels';roomLayer.hidden=true;container.appendChild(roomLayer);
 const roomLabels=BATH_ROOMS.map(([name,coords])=>{const el=document.createElement('span');el.textContent=name;roomLayer.appendChild(el);return {el,local:new THREE.Vector3(...coords)};});
 let width=1,height=1,pending=false,reveal=0,active=true,manual=false,frame=0,mode='3d',selectedIndex=0;
 function projectPoint(v){const q=v.clone().project(camera);return {x:(q.x*.5+.5)*width,y:(-q.y*.5+.5)*height,visible:q.z>-1&&q.z<1&&q.x>-1.15&&q.x<1.15&&q.y>-1.15&&q.y<1.15}}

 // A separate address marker; the eight-stop route keeps its own numbering.
 const extraPlace=data.extraPlaces?.find(p=>p.id==='neugraben-20');let addressLabel=null,addressGroup=null;
 if(extraPlace){
  const point=xyz(extraPlace.coords,0);addressGroup=new THREE.Group();scene.add(addressGroup);
  const ring=new THREE.Mesh(new THREE.RingGeometry(8,10,32),new THREE.MeshBasicMaterial({color:0x8c301f,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.copy(point).add(new THREE.Vector3(0,.25,0));addressGroup.add(ring);
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,30,8),new THREE.MeshBasicMaterial({color:0x8c301f}));pole.position.copy(point).add(new THREE.Vector3(0,15,0));addressGroup.add(pole);
  const dot=new THREE.Mesh(new THREE.SphereGeometry(3.5,12,8),new THREE.MeshBasicMaterial({color:0x8c301f}));dot.position.copy(point).add(new THREE.Vector3(0,31,0));addressGroup.add(dot);
  const el=document.createElement('button');el.className='three-address';el.textContent=extraPlace.name;el.setAttribute('aria-label',extraPlace.name+' · zusätzlicher Ort auf der Karte');el.addEventListener('click',()=>hooks.focusAddress());labelLayer.appendChild(el);addressLabel={el,world:xyz(extraPlace.coords,36)};
 }

 function annotate(){
  connector.setAttribute('width',width);connector.setAttribute('height',height);
  const placed=[];const sorted=[...stopLabels].sort((a,b)=>a.index===selectedIndex?-1:b.index===selectedIndex?1:a.index-b.index);
  sorted.forEach(label=>{const q=projectPoint(label.world);let x=q.x,y=q.y-20;if(width<550){
    const origin={x:THREE.MathUtils.clamp(x,24,width-24),y:THREE.MathUtils.clamp(y,24,height-88)};const candidates=[origin];
    for(let radius=20;radius<=140;radius+=20)for(let j=0;j<16;j++){const angle=j*Math.PI/8;candidates.push({x:origin.x+Math.cos(angle)*radius,y:origin.y+Math.sin(angle)*radius})}
    const spot=candidates.find(p=>p.x>=24&&p.x<=width-24&&p.y>=24&&p.y<=height-88&&!placed.some(v=>Math.hypot(v.x-p.x,v.y-p.y)<48));if(spot){x=spot.x;y=spot.y}
   }else{for(let loop=0;loop<8;loop++){const hit=placed.find(p=>Math.hypot(p.x-x,p.y-y)<36);if(!hit)break;y-=22}}
   x=THREE.MathUtils.clamp(x,24,width-24);y=THREE.MathUtils.clamp(y,24,height-35);label.el.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;label.el.hidden=!q.visible||reveal>.45;label.el.classList.toggle('selected',label.index===selectedIndex);label.el.setAttribute('aria-pressed',label.index===selectedIndex?'true':'false');label.line.setAttribute('x1',q.x);label.line.setAttribute('y1',q.y);label.line.setAttribute('x2',x);label.line.setAttribute('y2',y);label.line.style.display=q.visible&&reveal<=.45?'':'none';placed.push({x,y});
  });
  const evidencePlaced=[];
  traceLabels.forEach((l,i)=>{const q=projectPoint(l.world);let x=q.x+(i%2?-30:30),y=q.y-25;const labelWidth=width<550?44:(l.el.offsetWidth||125);for(let step=0;step<12;step++){if(!evidencePlaced.some(p=>Math.abs(p.x-x)<(p.width+labelWidth)/2+8&&Math.abs(p.y-y)<48))break;y-=48}x=THREE.MathUtils.clamp(x,labelWidth/2+8,width-labelWidth/2-8);y=THREE.MathUtils.clamp(y,24,height-35);const shown=reveal>=.08&&q.visible&&!romanSelection;l.el.hidden=!shown;l.el.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;l.el.style.opacity=String(Math.min(1,reveal*2));l.line.setAttribute('x1',q.x);l.line.setAttribute('y1',q.y);l.line.setAttribute('x2',x);l.line.setAttribute('y2',y);l.line.style.display=shown?'':'none';evidencePlaced.push({x,y,width:labelWidth})});
  otherLabels.forEach(l=>{const q=projectPoint(l.world);l.el.style.transform=`translate(${q.x}px,${q.y}px) translate(-50%,-50%)`;l.el.hidden=!q.visible||reveal>.35});
  if(addressLabel){const q=projectPoint(addressLabel.world);addressLabel.el.style.transform=`translate(${q.x}px,${q.y-12}px) translate(-50%,-100%)`;addressLabel.el.hidden=!q.visible||reveal>.35;addressGroup.visible=reveal<=.35;}
  const direction=camera.position.clone().sub(controls.target);const angle=Math.atan2(direction.x,direction.z)*180/Math.PI;container.closest('.map-panel').querySelector('.map-north svg').style.transform=`rotate(${angle}deg)`;
 }
 function annotateRooms(){
  roomLayer.hidden=reveal<.45||romanSelection!=='bath'||!romanCutaway;
  if(!roomLayer.hidden){romanArchitecture.bath.updateMatrixWorld();roomLabels.forEach(l=>{const p=romanArchitecture.bath.localToWorld(l.local.clone());if(romanHeating)p.y+=9;const q=projectPoint(p);l.el.hidden=!q.visible;l.el.style.transform='translate('+q.x+'px,'+q.y+'px) translate(-50%,-50%)';});}
 }
 function render(){pending=false;if(!active)return;renderer.render(scene,camera);annotate();annotateRooms();frame++;container.dataset.frames=String(frame)}
 function request(){if(!pending&&active){pending=true;requestAnimationFrame(render)}}
 let firstFit=false;
 function resize(){const r=container.getBoundingClientRect();if(r.width<10||r.height<10)return;if(!firstFit){firstFit=true;if(r.width<550){controls.target.set(50,0,20).add(WALK_CENTER);camera.position.set(270,1150,770).add(WALK_CENTER);camera.zoom=1.5;controls.update()}}width=Math.max(1,r.width);height=Math.max(1,r.height);renderer.setSize(width,height,false);const aspect=width/height;const half=Math.max(400,550/aspect);camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();request()}
 controls.addEventListener('change',request);const observer=new ResizeObserver(resize);observer.observe(container);resize();
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();hooks.fallback('3D-Grafik pausiert. Der Straßenplan ist verfügbar.');active=false});
 // In placement mode a click intersects the ground, independent of the camera tilt.
 const raycaster=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);let down;
 renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY]});renderer.domElement.addEventListener('pointerup',e=>{if(!manual||!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>8)return;const rect=renderer.domElement.getBoundingClientRect();const pointer=new THREE.Vector2((e.clientX-rect.left)/width*2-1,-(e.clientY-rect.top)/height*2+1);raycaster.setFromCamera(pointer,camera);const hit=new THREE.Vector3();if(raycaster.ray.intersectPlane(plane,hit)&&Math.abs(hit.x)<W/2&&Math.abs(hit.z)<D/2)hooks.setPosition([CENTER[0]+hit.x/72400,CENTER[1]-hit.z/111195],true)});
 renderer.domElement.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','0'].includes(e.key)){e.preventDefault();if(e.key==='+')api.zoom(1.25);else if(e.key==='-')api.zoom(.8);else if(e.key==='0')api.reset();else{const offset=camera.position.clone().sub(controls.target);if(e.key==='ArrowLeft'||e.key==='ArrowRight'){offset.applyAxisAngle(new THREE.Vector3(0,1,0),e.key==='ArrowLeft'?.13:-.13);camera.position.copy(controls.target).add(offset)}else{controls.target.z+=e.key==='ArrowUp'?-15:15;camera.position.z+=e.key==='ArrowUp'?-15:15}controls.update();request()}}});
 let dragPane=0;const api={
  setReveal(value){reveal=Math.max(0,Math.min(1,value));ancient.visible=reveal>.01;if(ancient.visible){ensureRomanArchitecture();romanArchitecture.root.scale.y=Math.max(.001,reveal);}modern.visible=reveal<.99;modern.traverse(o=>{if(o.isMesh){const list=Array.isArray(o.material)?o.material:[o.material];list.forEach(m=>{m.transparent=reveal>0;m.opacity=1-reveal*.94;m.depthWrite=reveal<.05})}});container.classList.toggle('roman-visible',reveal>.45);container.dataset.reveal=String(reveal);request()},
  focusRoman(id){if(!MONUMENTS[id]||id==='today')return;ensureRomanArchitecture();romanSelection=id;traceGeometry.visible=false;const target=xyz(MONUMENTS[id].coords,8);if(id==='forum')target.x+=24;controls.target.copy(target);camera.position.copy(target).add(new THREE.Vector3(id==='bath'?-74:-105,id==='bath'?68:105,id==='bath'?105:150));camera.zoom=id==='forum'?5.2:id==='basilica'?7.5:9;controls.maxZoom=12;camera.updateProjectionMatrix();controls.update();request()},
  romanOverview(){romanSelection=null;traceGeometry.visible=true;controls.maxZoom=4;const target=xyz([8.6091,49.47115]);controls.target.copy(target);camera.position.copy(target).add(new THREE.Vector3(200,650,450));camera.zoom=2.8;camera.updateProjectionMatrix();controls.update();request()},
  setRomanCutaway(value){ensureRomanArchitecture();romanCutaway=!!value;if(!romanCutaway)romanHeating=false;romanArchitecture.roofParts.forEach(r=>r.visible=!romanCutaway);romanArchitecture.bathWalls.forEach(w=>w.visible=!romanCutaway);romanArchitecture.bathFloor.position.y=romanHeating?9:0;request()},
  setRomanHeating(value){ensureRomanArchitecture();romanHeating=!!value;if(romanHeating)api.setRomanCutaway(true);romanArchitecture.bathFloor.position.y=romanHeating?9:0;request()},
  select(index){selectedIndex=index;request()},
  setMode(value){mode=value;if(mode==='flat'){camera.position.set(0,1300,.01).add(WALK_CENTER);controls.enableRotate=false}else{camera.position.set(380,900,920).add(WALK_CENTER);controls.enableRotate=true}if(width<550&&mode!=='flat'){controls.target.set(50,0,20).add(WALK_CENTER);camera.position.set(270,1150,770).add(WALK_CENTER);camera.zoom=1.5}else{controls.target.copy(WALK_CENTER);camera.zoom=1}camera.updateProjectionMatrix();controls.update();request()},
  focus(coords){const target=xyz(coords,0),offset=camera.position.clone().sub(controls.target);controls.target.copy(target);camera.position.copy(target).add(offset);camera.zoom=2.6;camera.updateProjectionMatrix();controls.update();request()},
  zoom(f){camera.zoom=THREE.MathUtils.clamp(camera.zoom*f,.75,romanSelection?12:4);camera.updateProjectionMatrix();controls.update();request()},
  reset(){romanSelection=null;controls.maxZoom=4;if(reveal>.01)api.romanOverview();else api.setMode(mode)},
  rotate(deg){if(mode==='flat')return;const offset=camera.position.clone().sub(controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),deg*Math.PI/180);camera.position.copy(controls.target).add(offset);controls.update();request()},
  setManual(value){manual=value;controls.enabled=!value&&(!touchDevice||interaction);renderer.domElement.style.touchAction=value||interaction||!touchDevice?'none':'pan-y';renderer.domElement.style.cursor=value?'crosshair':'grab'},
  setInteraction(value){interaction=value;controls.enabled=!manual&&(!touchDevice||interaction);renderer.domElement.style.touchAction=manual||interaction||!touchDevice?'none':'pan-y'},
  setPosition(coords){position.position.copy(xyz(coords,6));position.visible=true;request()},
  setActive(value){active=value;container.hidden=!value;if(value){resize();request()}},
  inspect(){return {buildingCount,treeCount:treePositions.length,frames:frame,reveal,mode,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,zoom:camera.zoom,romanModels:romanArchitecture?['forum','basilica','bath','burgus']:[],romanVisible:ancient.visible,romanSelection,romanCutaway,romanHeating}},
  dispose(){observer.disconnect();controls.dispose();renderer.dispose()}
 };
 controls.enabled=!touchDevice;renderer.domElement.style.touchAction=touchDevice?'pan-y':'none';
 container.dataset.ready='true';container.dataset.buildings=String(buildingCount+specialIds.size);request();return api;
};
