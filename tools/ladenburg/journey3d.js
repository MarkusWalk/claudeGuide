import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createRomanArchitecture,BATH_ROOMS} from './roman3d.js';
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
 const architecture=createRomanArchitecture(pt,MONUMENTS);
 const {M,material,groups,phase,cube,cylinder,addRoof,roofParts,bathFloor,bathWalls,bath,traces}=architecture;
 scene.add(architecture.root);
 let year=200,active=false,pending=false,frame=0,interaction=!mobile,selected='overview',cutaway=false,heating=false,cutProgress=0,heatProgress=0,tour=null,flight=null,playback=null,lastTime=0;
 const ground=new THREE.Mesh(new THREE.BoxGeometry(WORLD_W,9,WORLD_D),M.sand);ground.position.y=-5;ground.receiveShadow=true;scene.add(ground);
 const grid=new THREE.GridHelper(WORLD_W,32,0xa99672,0xc4b28b);grid.position.y=-.35;grid.material.transparent=true;grid.material.opacity=.24;scene.add(grid);
 const groundMat=material(0x88aaa1);data.features.filter(f=>f.kind==='water').forEach(f=>{const coords=clipPolygon(f.coordinates);if(coords.length<3)return;const shape=new THREE.Shape(coords.map(p=>new THREE.Vector2(p.x,-p.z)));const geo=new THREE.ShapeGeometry(shape);geo.rotateX(-Math.PI/2);const mesh=new THREE.Mesh(geo,groundMat);mesh.position.y=-.15;mesh.receiveShadow=true;scene.add(mesh);});

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


 architecture.batchAll();

 const labelLayer=document.createElement('div');labelLayer.className='journey-labels';container.appendChild(labelLayer);
 const labels=Object.entries(MONUMENTS).filter(([id])=>id!=='today').map(([id,m])=>{const el=document.createElement('button');el.className='journey-pin';el.textContent=m.tag;el.setAttribute('aria-label',m.name+' in 3D ansehen');el.addEventListener('click',()=>api.focus(id));labelLayer.appendChild(el);return {id,el,point:pt(m.coords,id==='bath'?17:id==='basilica'?30:10)};});
 const roomLayer=document.createElement('div');roomLayer.className='journey-room-labels';container.appendChild(roomLayer);
 const rooms=BATH_ROOMS.map(([name,coords])=>{const el=document.createElement('span');el.textContent=name;roomLayer.appendChild(el);return {el,local:new THREE.Vector3(...coords)};});
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
