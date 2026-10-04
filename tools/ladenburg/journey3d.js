import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const CENTER=[8.6080,49.4719];
const WORLD_W=960,WORLD_D=1040;
const pt=(coords,y=0)=>new THREE.Vector3((coords[0]-CENTER[0])*72400,y,(CENTER[1]-coords[1])*111195);
const smooth=t=>t*t*(3-2*t);
const clamp=THREE.MathUtils.clamp;
export const EPOCHS=[70,200,370,1200,1500,1905,2026];

// Original, deliberately illustrative reconstructions. They are not the
// museum's scientific 3D assets and do not imply surveyed bathhouse geometry.
export const MONUMENTS={
 bath:{name:'Thermen',tag:'III',year:200,coords:[8.6078,49.4702],kind:'Architektur-Typusmodell',text:'Vom kalten Becken über den warmen Raum ins Heißbad. Öffne die Dächer und hebe den Fußboden an: Unter ihm tragen kleine Ziegelpfeiler die beheizten Räume.',note:'Die Stadt nennt Thermen in Lopodunum. Lage, Raumfolge, Maße und Aufriss dieses Badehauses sind illustrativ; sie bilden keinen vermessenen Ladenburger Grundriss ab.',source:'https://www.ladenburg.de/de/2000-Jahre-Stadtgeschichte'},
 forum:{name:'Forum',tag:'I',year:200,coords:[8.61018,49.47176],kind:'Illustrative Rekonstruktion',text:'Säulengänge, Ladenräume und ein offener Hof: Hier trafen Handel, Verwaltung und das öffentliche Leben der Stadt zusammen.',note:'Der Gesamtkomplex aus Forum und Basilika misst etwa 130 × 84 Meter. Das Modell greift diese Größenordnung auf; Fassaden, Ausstattung und Details sind eigene Ergänzungen.',source:'https://reichert-verlag.de/de/fachgebiete/archaeologie/9783954902989_lopodunum_vi-detail'},
 basilica:{name:'Basilika',tag:'II',year:200,coords:[8.61108,49.47176],kind:'Illustrative Rekonstruktion',text:'Eine große öffentliche Halle mit hohem Mittelschiff, niedrigeren Seitenschiffen und Arkaden. Am Ort ihrer Fundamente steht heute St. Gallus.',note:'Die Fundamente sind belegt; der ergänzte Aufriss ist illustrativ. Ob die antike Basilika je vollständig fertiggestellt und wie geplant genutzt wurde, ist umstritten.',source:'https://reichert-verlag.de/de/fachgebiete/archaeologie/9783954902989_lopodunum_vi-detail'},
 burgus:{name:'Burgus',tag:'IV',year:370,coords:[8.60766,49.47149],kind:'Illustrative Rekonstruktion',text:'Ein Wehrbau aus der Zeit Valentinians I. Die große Forumsstadt gehört inzwischen einer früheren Epoche an. Römische Militärmacht kehrt an den Neckar zurück.',note:'Reste wurden am heutigen Rathaus konserviert. Die dargestellten aufgehenden Mauern, Türme und Dächer sind illustrative Ergänzungen.',source:'https://www.ladenburg.de/de/Rathaus/Einrichtungen-der-Stadt/Lobdengau-Museum'},
 today:{name:'Ladenburg heute',tag:'V',year:2026,coords:[8.6090,49.4717],kind:'Heutige Kartenabdrücke',text:'Drehe die Zeitleiste bis heute: St. Gallus, Stadtmauer, Benz-Garage und Wasserturm überlagern die römischen Orte. Der Stadtgrundriss kommt aus OpenStreetMap.',note:'Heutige Gebäudegrundrisse sind kartiert. Höhen und Dachformen sind teilweise geschätzt. Die alten Zeitbilder zeigen ausgewählte Entwicklungsphasen, keine vollständigen historischen Stadtpläne.',source:'https://www.openstreetmap.org/copyright'}
};
export const chapterFor=year=>year<110?{title:'Das Reiterkastell',text:'Um 70 n. Chr. entsteht ein Militärstandort. Lager, Baracken und Pferde prägen den Anfang.',note:'Kastellform und Anordnung im Modell sind schematisch.'}:year<260?{title:'Die Stadt Lopodunum',text:'Im 2. Jahrhundert wächst ein städtisches Zentrum: Forum, Basilika und römisches Badeleben.',note:'Aufrisse sind ergänzt; die Thermen sind ein Typusmodell.'}:year<450?{title:'Spätantike am Neckar',text:'Nach dem Verlust des rechtsrheinischen Gebiets folgt im 4. Jahrhundert der Burgus. Die frühere Forumsstadt erscheint als Spur.',note:'Ein Zeitbild mit illustrativ ergänztem Wehrbau.'}:year<1100?{title:'Zwischen den Epochen',text:'Römische Bauten verschwinden aus dem Stadtbild. Ihre Fundamente bleiben im Boden.',note:'Die leere Modellbühne steht für diesen Übergang, nicht für eine unbewohnte Stadt.'}:year<1500?{title:'Die ummauerte Stadt',text:'Um 1200 wächst der mittelalterliche Mauerring. Bischofshof, Stadttor und Kirche verändern das Bild.',note:'Ausgewählte Bauten und symbolische Häuser; Mauerzüge orientieren sich an heute erhaltenen, kartierten Resten.'}:year<1903?{title:'Über den Fundamenten',text:'Die Türme von St. Gallus und das Fachwerk bestimmen die Silhouette. Unter der Kirche liegen römische Fundamente.',note:'Dieses Zeitbild ist eine Auswahl, kein vermessener Stadtplan jener Jahre.'}:year<2026?{title:'Benz und der Wasserturm',text:'Der Wasserturm von 1903 und die Benz-Zeit ab 1904 ergänzen die alte Stadt. Bertha kauft die Villa 1905.',note:'Das Zeitbild bündelt diese Jahre; die Garage hat hier keine gesicherte Einzelbau-Datierung.'}:{title:'Ladenburg heute',text:'Die heutige Stadt erscheint mit ihren kartierten Gebäudegrundrissen. Römische Spuren liegen darunter.',note:'Aktuelle Grundrisse; teilweise geschätzte Höhen und Dachformen.'};

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
function clipPolygon(coords){
 let a=coords.map(p=>{const v=pt(p);return {x:v.x,z:v.z};});
 for(const [axis,bound,more] of [['x',-WORLD_W/2,true],['x',WORLD_W/2,false],['z',-WORLD_D/2,true],['z',WORLD_D/2,false]]){
  const out=[];for(let i=0;i<a.length;i++){const p=a[i],q=a[(i+1)%a.length],pi=more?p[axis]>=bound:p[axis]<=bound,qi=more?q[axis]>=bound:q[axis]<=bound;if(pi)out.push(p);if(pi!==qi){const t=(bound-p[axis])/(q[axis]-p[axis]);out.push({x:p.x+(q.x-p.x)*t,z:p.z+(q.z-p.z)*t});}}a=out;
 }return a;
}

window.LadenburgJourneyData={EPOCHS,MONUMENTS,chapterFor};
window.createLadenburgJourney=function(container,data,hooks={}){
 const mobile=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0,reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});}catch{return null;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.25:1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 const canvas=renderer.domElement;canvas.setAttribute('aria-label','Drehbares 3D-Zeitmodell von Lopodunum und Ladenburg. Die Gebäudetasten und die Zeitleiste steuern die Ansicht.');canvas.tabIndex=0;container.appendChild(canvas);
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xeee0bf);scene.fog=new THREE.Fog(0xeee0bf,1050,2100);
 const camera=new THREE.PerspectiveCamera(43,1,1,2600);camera.position.set(290,520,540);
 const controls=new OrbitControls(camera,canvas);controls.target.set(80,0,80);controls.enableDamping=false;controls.minDistance=50;controls.maxDistance=1150;controls.maxPolarAngle=Math.PI/2-.08;controls.minPolarAngle=.12;controls.enabled=!mobile;controls.screenSpacePanning=false;canvas.style.touchAction=mobile?'pan-y':'none';
 scene.add(new THREE.HemisphereLight(0xfff5de,0x8b8060,2.3));const sun=new THREE.DirectionalLight(0xffedd0,3.5);sun.position.set(-350,620,300);sun.castShadow=true;sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);Object.assign(sun.shadow.camera,{left:-550,right:550,top:550,bottom:-550,near:50,far:1500});sun.shadow.bias=-.0003;sun.shadow.normalBias=.45;scene.add(sun);
 const stoneTex=texture('stone'),roofTex=texture('tile'),mosaicTex=texture('mosaic');
 const material=(color,map=null)=>new THREE.MeshStandardMaterial({color,map,roughness:.92});
 const M={stone:material(0xf1dfbb,stoneTex),white:material(0xf5e8ce),brick:material(0xa45136),roof:material(0xffffff,roofTex),sand:material(0xe9dbb9),floor:material(0xffffff,mosaicTex),dark:material(0x4e3a28),wood:material(0x87664a),bronze:material(0x9e8145),grass:material(0xb8c098),water:new THREE.MeshStandardMaterial({color:0x5faaa9,roughness:.24,metalness:.25,transparent:true,opacity:.83}),warmWater:new THREE.MeshStandardMaterial({color:0x679a99,roughness:.18,metalness:.15,transparent:true,opacity:.86})};
 M.roof.side=THREE.DoubleSide;
 const groups=[],roofParts=[],bathFloor=new THREE.Group(),bathWalls=[],bathPillars=new THREE.Group();
 let year=200,active=false,pending=false,frame=0,interaction=!mobile,selected='overview',cutaway=false,heating=false,cutProgress=0,heatProgress=0,tour=null,flight=null,playback=null,lastTime=0;
 const cube=(parent,x,y,z,w,h,d,mat)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y+h/2,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 const cylinder=(parent,x,y,z,r,h,mat,sides=16)=>{const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,sides),mat);mesh.position.set(x,y+h/2,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 const addRoof=(parent,x,z,w,d,h,rise)=>{const mesh=new THREE.Mesh(roofGeometry(w,d,h,rise),M.roof);mesh.position.set(x,0,z);mesh.castShadow=true;parent.add(mesh);if(['bath','forum','basilica','burgus'].includes(parent.userData.phase))roofParts.push(mesh);return mesh;};
 const addBarrel=(parent,x,z,w,d,y,rise)=>{const mesh=new THREE.Mesh(barrelGeometry(w,d,y,rise),M.roof);mesh.position.set(x,0,z);mesh.castShadow=true;parent.add(mesh);if(['bath','forum','basilica','burgus'].includes(parent.userData.phase))roofParts.push(mesh);return mesh;};
 function phase(id,birth,end=null){const root=new THREE.Group();root.userData.phase=id;scene.add(root);const state={id,root,birth,end,amount:0,target:0};groups.push(state);return root;}
 const ground=new THREE.Mesh(new THREE.BoxGeometry(WORLD_W,9,WORLD_D),M.sand);ground.position.y=-5;ground.receiveShadow=true;scene.add(ground);
 const grid=new THREE.GridHelper(WORLD_W,32,0xa99672,0xc4b28b);grid.position.y=-.35;grid.material.transparent=true;grid.material.opacity=.24;scene.add(grid);
 const groundMat=material(0x88aaa1);data.features.filter(f=>f.kind==='water').forEach(f=>{const coords=clipPolygon(f.coordinates);if(coords.length<3)return;const shape=new THREE.Shape(coords.map(p=>new THREE.Vector2(p.x,-p.z)));const geo=new THREE.ShapeGeometry(shape);geo.rotateX(-Math.PI/2);const mesh=new THREE.Mesh(geo,groundMat);mesh.position.y=-.15;mesh.receiveShadow=true;scene.add(mesh);});

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
 // Selected medieval landmarks and symbolic houses, not retrodated OSM blocks.
 const medieval=phase('medieval',1180);const medievalHouses=phase('medievalHouses',1180,2026);const church=phase('church',1220);church.position.copy(pt(MONUMENTS.basilica.coords));
 cube(church,0,0,0,43,17,17,M.stone);cube(church,0,0,0,36,24,10,M.stone);addRoof(church,0,0,38,12,24,9);
 const churchTowers=phase('churchTowers',1450);churchTowers.position.copy(church.position);
 for(const z of [-7,7]){cube(churchTowers,-22,0,z,8,38,8,M.stone);const spire=new THREE.Mesh(new THREE.ConeGeometry(6,15,4),material(0x73806b));spire.position.set(-22,45.5,z);spire.rotation.y=Math.PI/4;churchTowers.add(spire);cube(churchTowers,-22,28,z+4.1,2,5,.2,M.dark);}
 const gate=pt([8.607605,49.474444]);cube(medieval,gate.x-6,0,gate.z,5,10,11,M.stone);cube(medieval,gate.x+6,0,gate.z,5,10,11,M.stone);cube(medieval,gate.x,10,gate.z,17,20,11,M.stone);addRoof(medieval,gate.x,gate.z,20,14,30,8);
 const bishop=pt([8.60825,49.47080]);cube(medieval,bishop.x,0,bishop.z,44,13,24,M.stone);addRoof(medieval,bishop.x,bishop.z,47,27,13,8);
 for(let i=0;i<18;i++){const a=i/18*Math.PI*2,x=170+Math.cos(a)*63,z=-42+Math.sin(a)*45;cube(medievalHouses,x,0,z,12,8,11,M.white);addRoof(medievalHouses,x,z,13,12,8,5);for(const yy of [3,6])cube(medievalHouses,x,yy,z+5.6,12,.28,.2,M.wood);cube(medievalHouses,x,0,z+5.7,.28,8,.2,M.wood);}
 // Surviving mapped wall segments orient the medieval phase; their present
 // outlines do not establish a complete historical circuit.
 const cityWall=phase('cityWall',1180);
 for(const f of data.features.filter(f=>f.kind==='wall'))for(let i=1;i<f.coordinates.length;i++){
  const a=pt(f.coordinates[i-1]),b=pt(f.coordinates[i]),mid=a.clone().add(b).multiplyScalar(.5),length=a.distanceTo(b);
  if(length<.5||Math.abs(mid.x)>WORLD_W/2||Math.abs(mid.z)>WORLD_D/2)continue;
  const segment=cube(cityWall,mid.x,0,mid.z,length,parseFloat(f.height)||4,1.5,M.stone);segment.rotation.y=-Math.atan2(b.z-a.z,b.x-a.x);
 }
 const industry=phase('industry',1903);const tower=pt([8.606315,49.470178]);cylinder(industry,tower.x,0,tower.z,6,36,M.stone);cylinder(industry,tower.x,36,tower.z,9,9,M.white);const cap=new THREE.Mesh(new THREE.ConeGeometry(10,9,20),material(0x71806c));cap.position.set(tower.x,49.5,tower.z);industry.add(cap);
 const benz=pt([8.605069,49.470744]);cube(industry,benz.x,0,benz.z,11,14,13,M.stone);cube(industry,benz.x,0,benz.z+6.6,6,7,.18,M.dark);for(let i=-1;i<=1;i++){cube(industry,benz.x+i*4,14,benz.z-5.6,2,2,2,M.stone);cube(industry,benz.x+i*4,14,benz.z+5.6,2,2,2,M.stone);}
 // Today's blocks appear as today's map state, with no invented birth dates.
 const today=phase('today',2025);const wallGeos=[],roofGeos=[];const modernMat=material(0xd5d1bd),modernRoof=material(0x967865);const omit=new Set([289802631,1189938433,181567321,1189309651,119239310]);let modernCount=0;
 for(const f of data.features.filter(f=>f.kind==='building'&&!omit.has(f.id))){const points=f.coordinates.map(c=>pt(c));if(points.length<4)continue;const avg=points.reduce((a,p)=>a.add(p),new THREE.Vector3()).multiplyScalar(1/points.length);if(Math.abs(avg.x)>WORLD_W/2-10||Math.abs(avg.z)>WORLD_D/2-10)continue;const shape=new THREE.Shape(points.map(p=>new THREE.Vector2(p.x,-p.z)));const h=Math.min(28,Math.max(3,parseFloat(f.height)||parseFloat(f.levels)*3.1+3||9));const g=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);wallGeos.push(g);modernCount++;const r=new THREE.ShapeGeometry(shape);r.rotateX(-Math.PI/2);r.translate(0,h+.1,0);roofGeos.push(r);}
 const merge=(geos,mat)=>{if(!geos.length)return;const ready=geos.map(g=>{const u=g.index?g.toNonIndexed():g;for(const a of Object.keys(u.attributes))if(!['position','normal'].includes(a))u.deleteAttribute(a);return u;});const g=mergeGeometries(ready,false);ready.forEach(g=>g.dispose());const m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;today.add(m);};
 merge(wallGeos,modernMat);merge(roofGeos,modernRoof);


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
 groups.forEach(g=>batch(g.root));

 const labelLayer=document.createElement('div');labelLayer.className='journey-labels';container.appendChild(labelLayer);
 const labels=Object.entries(MONUMENTS).filter(([id])=>id!=='today').map(([id,m])=>{const el=document.createElement('button');el.className='journey-pin';el.textContent=m.tag;el.setAttribute('aria-label',m.name+' in 3D ansehen');el.addEventListener('click',()=>api.focus(id));labelLayer.appendChild(el);return {id,el,point:pt(m.coords,id==='bath'?17:id==='basilica'?30:10)};});
 const roomLayer=document.createElement('div');roomLayer.className='journey-room-labels';container.appendChild(roomLayer);
 const rooms=[['Frigidarium',[-20,6,-6]],['Tepidarium',[0,6,0]],['Caldarium',[24,6,14]],['Praefurnium',[38,5,17]]].map(([name,coords])=>{const el=document.createElement('span');el.textContent=name;roomLayer.appendChild(el);return {el,local:new THREE.Vector3(...coords)};});
 function targetFor(id){return id==='overview'?new THREE.Vector3(90,0,65):pt(MONUMENTS[id]?.coords||MONUMENTS.bath.coords,8);}
 function viewFor(id){const t=targetFor(id);if(id==='overview'||id==='today')return {target:t,pos:t.clone().add(new THREE.Vector3(mobile?180:260,mobile?720:650,mobile?360:330))};if(id==='bath')return {target:t,pos:t.clone().add(new THREE.Vector3(-74,68,105))};if(id==='burgus')return {target:t,pos:t.clone().add(new THREE.Vector3(-65,80,110))};return {target:t,pos:t.clone().add(new THREE.Vector3(-105,105,150))};}
 function changeYear(value,notify=true){year=clamp(Number(value),70,2026);if(cutaway&&(year<120||year>=480||year>=270&&year<365)){cutaway=false;heating=false;hooks.onCutaway?.(false,false);}else if(heating&&(year<150||year>=270)){heating=false;hooks.onCutaway?.(cutaway,false);}groups.forEach(g=>{let amount=year>=g.birth?1:0;if(g.end!==null)amount*=1-clamp((year-(g.end-30))/30,0,1);g.target=amount;});traces.visible=year>=270;if(notify)hooks.onYear?.(year);request();}
 function annotate(){
  const used=[];for(const l of labels){const g=groups.find(g=>g.id===l.id);const p=l.point.clone().project(camera);const shown=selected==='overview'&&g&&g.amount>.65&&p.z>-1&&p.z<1&&Math.abs(p.x)<1.05&&Math.abs(p.y)<1.05;l.el.hidden=!shown;if(!shown)continue;let x=(p.x*.5+.5)*width,y=(-p.y*.5+.5)*height-16;for(let i=0;i<8&&used.some(a=>Math.hypot(a.x-x,a.y-y)<46);i++)y-=46;x=clamp(x,24,width-24);y=clamp(y,24,height-27);l.el.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;l.el.classList.toggle('selected',selected===l.id);l.el.setAttribute('aria-pressed',selected===l.id?'true':'false');used.push({x,y});}
  bath.updateMatrixWorld();roomLayer.hidden=selected!=='bath'||cutProgress<.8||year<150||year>=270;
  for(const r of rooms){const p=bath.localToWorld(r.local.clone());p.y+=heatProgress*7;p.project(camera);r.el.hidden=p.z<-1||p.z>1||Math.abs(p.x)>.98||Math.abs(p.y)>.98;r.el.style.transform=`translate(${(p.x*.5+.5)*width}px,${(-p.y*.5+.5)*height}px) translate(-50%,-50%)`;}
 }
 let width=1,height=1;
 function resize(){const r=container.getBoundingClientRect();if(r.width<10||r.height<10)return;width=r.width;height=r.height;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);request();}
 function request(){if(active&&!pending){pending=true;requestAnimationFrame(render);}}
 function stopTour(){if(tour){tour=null;hooks.onTour?.(false);}playback=null;hooks.onPlayback?.(false);}
 function smoothCamera(id,duration=1000){const end=viewFor(id);flight={start:performance.now(),duration:reduced?0:duration,from:camera.position.clone(),fromTarget:controls.target.clone(),...end};request();}
 function render(now){
  pending=false;if(!active)return;const dt=lastTime?Math.min(60,now-lastTime):16;lastTime=now;let moving=false;
  if(tour){
   const elapsed=Math.max(0,now-tour.start);const shots=[{id:'bath',year:200,start:0,end:4000},{id:'forum',year:200,start:4000,end:7500},{id:'basilica',year:200,start:7500,end:11000},{id:'burgus',year:370,start:11000,end:14000},{id:'overview',year:70,start:14000,end:18000}];const shot=shots.find(s=>elapsed>=s.start&&elapsed<s.end);
   if(!shot){tour=null;flight=null;selected='overview';smoothCamera('overview',400);hooks.onTour?.(false);hooks.onSelect?.('overview');}
   else{if(tour.shot!==shot.id){tour.shot=shot.id;const from=camera.position.clone(),fromTarget=controls.target.clone();tour.from=from;tour.fromTarget=fromTarget;selected=shot.id;changeYear(shot.year);hooks.onSelect?.(shot.id);hooks.onTourShot?.(shot.id,(elapsed/18000));}const t=smooth(clamp((elapsed-shot.start)/(shot.end-shot.start),0,1)),view=viewFor(shot.id);camera.position.lerpVectors(tour.from,view.pos,t);controls.target.lerpVectors(tour.fromTarget,view.target,t);controls.update();moving=true;}
  }
  if(playback){const phase=Math.max(0,now-playback.start)/21000*(EPOCHS.length-1);if(phase>=EPOCHS.length-1){changeYear(2026);playback=null;hooks.onPlayback?.(false);}else{const i=Math.floor(phase);changeYear(EPOCHS[i]+(EPOCHS[i+1]-EPOCHS[i])*smooth(phase-i));moving=true;}}
  if(flight&&!tour){const t=flight.duration?smooth(clamp((now-flight.start)/flight.duration,0,1)):1;camera.position.lerpVectors(flight.from,flight.pos,t);controls.target.lerpVectors(flight.fromTarget,flight.target,t);controls.update();if(t>=1)flight=null;else moving=true;}
  const speed=reduced?1:1-Math.exp(-dt/130);
  groups.forEach(g=>{g.amount+=(g.target-g.amount)*speed;if(Math.abs(g.target-g.amount)<.003)g.amount=g.target;else moving=true;g.root.visible=g.amount>.005;g.root.scale.y=Math.max(.001,g.amount);});
  const goal=cutaway?1:0;cutProgress+=(goal-cutProgress)*speed;if(Math.abs(goal-cutProgress)>.003)moving=true;else cutProgress=goal;
  roofParts.forEach(r=>{r.visible=cutProgress<.98;r.position.y=r.userData.baseY??(r.userData.baseY=r.position.y);r.position.y=r.userData.baseY+cutProgress*14;});
  bathWalls.forEach(w=>w.visible=cutProgress<.7);
  const heatGoal=heating?1:0;heatProgress+=(heatGoal-heatProgress)*speed;if(Math.abs(heatGoal-heatProgress)>.003)moving=true;else heatProgress=heatGoal;bathFloor.position.y=heatProgress*9;
  renderer.render(scene,camera);annotate();frame++;container.dataset.frames=String(frame);if(moving)request();
 }
 controls.addEventListener('change',request);
 controls.addEventListener('start',()=>{stopTour();flight=null;});
 // Rendering stops when the user is idle; animations schedule only needed frames.
 const observer=new ResizeObserver(resize);observer.observe(container);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();stopTour();active=false;hooks.onError?.('3D wurde angehalten. Du kannst die Zeitbilder weiterhin über die Zeitleiste lesen.');});
 canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key)){e.preventDefault();stopTour();flight=null;if(e.key==='+')api.zoom(.85);else if(e.key==='-')api.zoom(1.18);else{const o=camera.position.clone().sub(controls.target);o.applyAxisAngle(new THREE.Vector3(0,1,0),e.key==='ArrowLeft'?.13:e.key==='ArrowRight'?-.13:0);if(e.key==='ArrowUp'||e.key==='ArrowDown')o.y+=e.key==='ArrowUp'?20:-20;camera.position.copy(controls.target).add(o);controls.update();request();}}});
 const api={
  setActive(value){active=value;lastTime=0;if(value){resize();request();}else{stopTour();flight=null;}},
  setYear(value){stopTour();flight=null;selected='overview';hooks.onSelect?.('overview');changeYear(value);},
  focus(id){if(!MONUMENTS[id])return;stopTour();flight=null;selected=id;changeYear(MONUMENTS[id].year);hooks.onSelect?.(id);smoothCamera(id);},
  overview(){stopTour();selected='overview';hooks.onSelect?.('overview');smoothCamera('overview');},
  fly(){stopTour();flight=null;cutaway=false;heating=false;hooks.onCutaway?.(false,false);if(reduced){changeYear(200);selected='overview';hooks.onSelect?.('overview');smoothCamera('overview',0);hooks.onTour?.(false);return;}tour={start:performance.now(),shot:null};hooks.onTour?.(true);request();},
  skip(){stopTour();flight=null;changeYear(70);selected='overview';hooks.onSelect?.('overview');smoothCamera('overview',250);},
  play(){if(playback){playback=null;hooks.onPlayback?.(false);return;}stopTour();flight=null;selected='overview';hooks.onSelect?.('overview');smoothCamera('overview',600);playback={start:performance.now()};hooks.onPlayback?.(true);request();},
  setCutaway(value){cutaway=!!value;if(!cutaway)heating=false;hooks.onCutaway?.(cutaway,heating);request();},
  setHeating(value){heating=!!value;if(heating)cutaway=true;hooks.onCutaway?.(cutaway,heating);request();},
  setInteraction(value){interaction=!!value;controls.enabled=interaction;canvas.style.touchAction=interaction?'none':'pan-y';hooks.onInteraction?.(interaction);},
  zoom(f){stopTour();flight=null;camera.position.copy(controls.target).add(camera.position.clone().sub(controls.target).multiplyScalar(f));controls.update();request();},
  inspect(){return {year,selected,tour:!!tour,playback:!!playback,active,frame,cutaway,heating,cutProgress,heatProgress,modernCount,camera:[...camera.position],target:[...controls.target],visible:groups.filter(g=>g.root.visible&&g.amount>.5).map(g=>g.id),triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls};},
  dispose(){observer.disconnect();controls.dispose();renderer.dispose();}
 };
 changeYear(200,false);const initial=viewFor('overview');camera.position.copy(initial.pos);controls.target.copy(initial.target);controls.update();return api;
};
