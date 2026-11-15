import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const host=$('#scene3d'),toast=$('#toast'),STORE='gamingRoomStudio3D',SAVED='gamingRoomSaved3D';
const catalog=[
{id:'bed',name:'Lit cosy',group:'furniture',kind:'bed',color:'#d9c4d8'},
{id:'desk',name:'Bureau gaming',group:'furniture',kind:'desk',color:'#5d4b61'},
{id:'chair',name:'Fauteuil gaming',group:'furniture',kind:'chair',color:'#bd6eae'},
{id:'sofa',name:'Canapé lounge',group:'furniture',kind:'sofa',color:'#aa8cae'},
{id:'monitor',name:'Écran ultra-wide',group:'gaming',kind:'monitor',color:'#171923'},
{id:'monitor2',name:'Écran secondaire',group:'gaming',kind:'monitorSmall',color:'#20222e'},
{id:'pc',name:'Tour PC RGB',group:'gaming',kind:'pc',color:'#242431'},
{id:'ps5',name:'Console PS5',group:'gaming',kind:'console',color:'#ececf3'},
{id:'keyboard',name:'Clavier mécanique',group:'gaming',kind:'keyboard',color:'#24212d'},
{id:'headset',name:'Casque gaming',group:'gaming',kind:'headset',color:'#252332'},
{id:'lamp',name:'Lampe design',group:'lighting',kind:'lamp',color:'#f2d3a9'},
{id:'led',name:'Tube LED',group:'lighting',kind:'led',color:'#eb7bd0'},
{id:'plant',name:'Plante en pot',group:'plants',kind:'plant',color:'#548d67'},
{id:'poster',name:'Affiche murale',group:'decor',kind:'poster',color:'#d18fc1'},
{id:'shelf',name:'Étagère murale',group:'decor',kind:'shelf',color:'#9b7d9b'},
{id:'rug',name:'Tapis fluffy',group:'decor',kind:'rug',color:'#d8b8d4'}
];
const palettes={
pink:{label:'Pink Dream',wall:'#e7dce8',floor:'#b88c72',led:'#eb7bd0'},
cyber:{label:'Cyber Glow',wall:'#34334b',floor:'#39303a',led:'#7d6cff'},
cozy:{label:'Cozy Warm',wall:'#e6d1c0',floor:'#a77a5c',led:'#e5a58a'},
dark:{label:'Dark Setup',wall:'#282434',floor:'#403a43',led:'#7a8fff'},
nature:{label:'Nature',wall:'#cad9c5',floor:'#9a805f',led:'#77ba92'},
galaxy:{label:'Galaxy',wall:'#302947',floor:'#393044',led:'#a27dff'}
};
const games={
spiderman:['MARVEL’S SPIDER-MAN 2','#071d39','#d23b65'],godofwar:['GOD OF WAR RAGNARÖK','#172c3a','#a35a3c'],
horizon:['HORIZON FORBIDDEN WEST','#477f88','#db9860'],gt7:['GRAN TURISMO 7','#182c46','#a8c3d9'],
astrobot:['ASTRO BOT','#468be1','#f0c9ff'],tlou:['THE LAST OF US PART II','#253b30','#a99c6b'],
ghost:['GHOST OF TSUSHIMA','#4b493a','#c9a56a'],re4:['RESIDENT EVIL 4','#20252b','#a04b46']
};
const defaults={theme:'pink',wall:'#e7dce8',floor:'wood',led:'#eb7bd0',intensity:70,lights:true,game:'spiderman',roomName:'My dream room',objects:[],selectedId:null};
let state=structuredClone(defaults),savedRooms=[],selected=null;
let renderer,world,camera,controls,raycaster,pointer,dragObject=null,floorMesh,wallMeshes=[],ledMeshes=[],mainLight,screenTexture;
const cache=new Map();
function notify(s){toast.textContent=s;toast.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('show'),2200)}
function parse(v,f){try{return v?JSON.parse(v):f}catch{return f}}
function mat(c,r=.72,m=0){const k=[c,r,m].join('|');if(!cache.has(k))cache.set(k,new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m}));return cache.get(k)}
function box(p,n,s,pos,c,o={}){const m=new THREE.Mesh(new THREE.BoxGeometry(...s),mat(c,o.roughness??.72,o.metalness??0));m.name=n;m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;p.add(m);return m}
function cyl(p,n,a,b,h,pos,c,seg=24){const m=new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,seg),mat(c,.5));m.name=n;m.position.set(...pos);m.castShadow=true;p.add(m);return m}
function ball(p,n,r,pos,c){const m=new THREE.Mesh(new THREE.SphereGeometry(r,20,16),mat(c,.5));m.name=n;m.position.set(...pos);m.castShadow=true;p.add(m);return m}

function buildFurniture(d){
 const g=new THREE.Group();g.name=d.name;g.userData={itemId:d.id};const c=d.color,dark='#26232f',metal='#b6a7bd';
 if(d.kind==='bed'){
  box(g,'Cadre',[1.75,.22,2.15],[0,.28,0],'#514254');box(g,'Matelas',[1.68,.28,2.05],[0,.48,0],c);
  box(g,'Tête de lit',[1.78,.88,.13],[0,.83,-.98],'#725c73');for(const x of [-.43,.43])box(g,'Oreiller',[.58,.15,.4],[x,.7,-.58],'#f1e5ef');box(g,'Couverture',[1.55,.1,1.05],[0,.68,.35],'#a77ba2');
 }else if(d.kind==='desk'){
  box(g,'Plateau',[2.2,.14,.78],[0,1.08,0],c,{roughness:.35});for(const x of [-.95,.95])box(g,'Pied',[.09,1.05,.62],[x,.53,0],dark);
  box(g,'Caisson',[.45,.28,.68],[-.67,.86,0],'#47374c');
 }else if(d.kind==='chair'){
  box(g,'Assise',[.72,.18,.7],[0,.82,0],c);box(g,'Dossier',[.74,1.05,.18],[0,1.43,-.26],c);box(g,'Coussin lombaire',[.52,.22,.12],[0,1.2,-.15],'#f0d9ed');cyl(g,'Vérin',.07,.07,.48,[0,.47,0],metal);
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5,b=box(g,'Pied étoile',[.52,.07,.09],[Math.cos(a)*.28,.22,Math.sin(a)*.28],dark);b.rotation.y=-a}
  for(const x of [-.47,.47])box(g,'Accoudoir',[.11,.36,.5],[x,1.02,0],dark);
 }else if(d.kind==='sofa'){
  box(g,'Base',[1.65,.38,.78],[0,.42,0],c);box(g,'Dossier',[1.65,.8,.2],[0,.91,-.28],c);for(const x of [-.72,.72])box(g,'Accoudoir',[.2,.55,.8],[x,.68,0],'#8a6d8a');for(const x of [-.43,.43])box(g,'Coussin',[.64,.18,.55],[x,.7,-.02],'#e5d4e4');
 }else if(d.kind==='monitor'||d.kind==='monitorSmall'){
  const w=d.kind==='monitor'?1.28:.82;box(g,'Écran',[w,.78,.09],[0,.75,0],'#10111b',{metalness:.35,roughness:.25});
  const glass=box(g,'Dalle',[w-.07,.68,.018],[0,.76,.057],'#25365f',{roughness:.18,metalness:.18});glass.userData.gameScreen=true;
  box(g,'Pied écran',[.07,.28,.07],[0,.25,-.04],metal);box(g,'Socle',[.42,.045,.28],[0,.1,.02],dark);
 }else if(d.kind==='pc'){
  box(g,'Boîtier',[.55,1.1,.65],[0,.6,0],c,{roughness:.28,metalness:.22});box(g,'Verre trempé',[.42,.91,.025],[0,.62,.34],'#4d4263',{roughness:.16,metalness:.1});
  for(const y of [.32,.6,.88]){const f=cyl(g,'Ventilateur RGB',.13,.13,.025,[0,y,.37],state.led,32);f.rotation.x=Math.PI/2}
 }else if(d.kind==='console'){
  box(g,'Console',[.34,.95,.28],[0,.52,0],c,{roughness:.22});box(g,'Ligne centrale',[.07,.86,.285],[0,.52,.15],'#9996a6',{roughness:.25});box(g,'Socle',[.42,.05,.32],[0,.035,0],dark);
 }else if(d.kind==='keyboard'){
  box(g,'Clavier',[.9,.07,.32],[0,.08,0],dark);for(let r=0;r<3;r++)for(let col=0;col<11;col++)box(g,'Touche',[.055,.025,.055],[-.38+col*.076,.13,-.105+r*.095],r===1?state.led:'#aaa1b5');
 }else if(d.kind==='headset'){
  const a=new THREE.Mesh(new THREE.TorusGeometry(.24,.045,10,28,Math.PI),mat(c));a.position.y=.38;a.rotation.z=Math.PI;g.add(a);for(const x of [-.24,.24])box(g,'Écouteur',[.13,.28,.16],[x,.32,0],state.led);cyl(g,'Support',.045,.06,.42,[0,.21,0],metal);
 }else if(d.kind==='lamp'){
  cyl(g,'Base',.22,.22,.08,[0,.04,0],metal);cyl(g,'Tige',.035,.035,.72,[0,.42,0],metal);const s=new THREE.Mesh(new THREE.ConeGeometry(.32,.34,32),mat(c));s.position.y=.92;s.castShadow=true;g.add(s);const l=new THREE.PointLight(0xffd3aa,1.7,3);l.position.set(0,.82,0);g.add(l);
 }else if(d.kind==='led'){
  box(g,'Tube LED',[.08,1.7,.08],[0,.86,0],c,{metalness:.25});const l=new THREE.PointLight(new THREE.Color(c),1.6,3);l.position.y=1;g.add(l);
 }else if(d.kind==='plant'){
  cyl(g,'Pot',.25,.3,.38,[0,.2,0],'#bd8f85');cyl(g,'Terre',.23,.23,.025,[0,.4,0],'#554139');
  for(let i=0;i<7;i++){const a=i*2.4,l=ball(g,'Feuille',.19,[Math.cos(a)*.16,.65+(i%3)*.16,Math.sin(a)*.16],['#4a9366','#66a978','#83b77d'][i%3]);l.scale.set(.6,1.7,.55);l.rotation.z=-Math.cos(a)*.5}
  cyl(g,'Tige',.025,.025,.6,[0,.62,0],'#477a54');
 }else if(d.kind==='poster'){
  box(g,'Cadre',[.9,1.15,.07],[0,.85,0],'#d9c7da');box(g,'Illustration',[.78,1.03,.025],[0,.85,.05],c);box(g,'Détail',[.62,.3,.015],[0,.72,.07],'#56436f');
 }else if(d.kind==='shelf'){
  box(g,'Planche',[1.2,.1,.35],[0,.95,0],c);for(const x of [-.48,0,.48])box(g,'Support',[.04,.28,.04],[x,.77,-.1],metal);for(const x of [-.3,.27])box(g,'Livre',[.16,.28,.21],[x,1.14,0],x<0?'#bd86a9':'#8d9bc0');
 }else if(d.kind==='rug'){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(.95,.95,.045,64),mat(c));m.position.y=.035;m.scale.z=.68;m.receiveShadow=true;g.add(m);
 }
 return g;
}
function makeGameTexture(key){
 const c=document.createElement('canvas');c.width=512;c.height=320;const x=c.getContext('2d'),g=games[key]||games.spiderman;
 const grad=x.createLinearGradient(0,0,512,320);grad.addColorStop(0,g[1]);grad.addColorStop(1,g[2]);x.fillStyle=grad;x.fillRect(0,0,512,320);
 x.globalAlpha=.2;for(let i=0;i<12;i++){x.strokeStyle=i%2?'#fff':'#080b1a';x.lineWidth=12;x.beginPath();x.moveTo(i*55,0);x.lineTo(512-i*28,320);x.stroke()}x.globalAlpha=1;
 x.fillStyle='#fff';x.font='800 27px Arial';x.fillText('PLAYSTATION 5',24,45);x.font='800 35px Arial';let line='';let y=220;for(const w of g[0].split(' ')){if(x.measureText(line+w+' ').width>460){x.fillText(line,24,y);line=w+' ';y+=40}else line+=w+' '}x.fillText(line,24,y);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function buildRoom(){
 world=new THREE.Scene();world.background=new THREE.Color('#17131e');world.fog=new THREE.Fog('#17131e',12,24);
 floorMesh=new THREE.Mesh(new THREE.PlaneGeometry(8,7),mat(state.floor==='dark'?'#51414b':state.floor==='stone'?'#a59da9':'#bd9478',.9));floorMesh.rotation.x=-Math.PI/2;floorMesh.receiveShadow=true;world.add(floorMesh);
 const back=box(world,'Mur arrière',[8,4.3,.16],[0,2.15,-3.5],state.wall),left=box(world,'Mur gauche',[.16,4.3,7],[-4,2.15,0],state.wall),right=box(world,'Mur droit',[.16,4.3,7],[4,2.15,0],state.wall);wallMeshes=[back,left,right];
 box(world,'Plinthe arrière',[8,.14,.12],[0,.08,-3.39],'#b5a1b7');box(world,'Plinthe gauche',[.12,.14,7],[-3.89,.08,0],'#b5a1b7');
 box(world,'Encadrement fenêtre',[1.85,1.45,.11],[-2.45,2.32,-3.36],'#f1e8f0');box(world,'Vitre',[1.69,1.29,.035],[-2.45,2.32,-3.29],'#8ca9c8',{roughness:.18,metalness:.12});
 box(world,'Montant vertical',[.045,1.28,.04],[-2.45,2.32,-3.25],'#eee3ef');box(world,'Montant horizontal',[1.67,.045,.04],[-2.45,2.32,-3.25],'#eee3ef');
 box(world,'Encadrement porte',[.13,2.25,1.12],[3.89,1.15,2.1],'#4b354d');box(world,'Porte',[.07,2.08,.96],[3.84,1.08,2.1],'#876a7e');ball(world,'Poignée',.055,[3.76,1.05,2.43],'#e1c9a0');
 for(const z of [-3.25,3.25])ledMeshes.push(box(world,'Ruban LED',[7.4,.035,.035],[0,3.95,z],state.led));
 mainLight=new THREE.PointLight(new THREE.Color(state.led),2,12);mainLight.position.set(0,3.7,1.5);world.add(mainLight);
 const fill=new THREE.PointLight(0xb6c9ff,1.1,10);fill.position.set(-3,2.5,-1);world.add(fill);world.add(new THREE.HemisphereLight(0xe9d7f5,0x5a4358,1.25));
}
function colorObject(g,c){g.traverse(o=>{if(o.isMesh&&o.material&&!o.userData.gameScreen)o.material=mat(c,o.material.roughness,o.material.metalness)})}
function applyGameTextureToGroup(g){g.traverse(o=>{if(o.userData.gameScreen&&screenTexture)o.material=new THREE.MeshStandardMaterial({map:screenTexture,emissiveMap:screenTexture,emissive:0xffffff,emissiveIntensity:.25,roughness:.2})})}
function setGame(key){
 state.game=games[key]?key:'spiderman';screenTexture?.dispose();screenTexture=makeGameTexture(state.game);
 world.traverse(o=>{if(o.userData.gameScreen)o.material=new THREE.MeshStandardMaterial({map:screenTexture,emissiveMap:screenTexture,emissive:0xffffff,emissiveIntensity:.25,roughness:.2})});
 $('#gameSelect').value=state.game;persist();
}
function setLights(){
 mainLight.intensity=state.lights?1.1+state.intensity/55:0;
 world.traverse(o=>{if(o.isLight&&o!==mainLight&&o.type==='PointLight')o.visible=state.lights});
 $('#toggleLights').textContent=state.lights?'☼ Lumières ON':'☾ Lumières OFF';$('.toggle-switch').classList.toggle('on',state.lights);
}
function applyTheme(key){
 const p=palettes[key]||palettes.pink;state.theme=key;state.wall=p.wall;state.led=p.led;
 wallMeshes.forEach(w=>w.material=mat(state.wall));ledMeshes.forEach(l=>l.material=mat(state.led));
 if(mainLight)mainLight.color.set(state.led);$('#styleName').textContent=p.label;$('#ledColor').value=state.led;
 $$('[data-theme]').forEach(b=>b.classList.toggle('selected',b.dataset.theme===key));persist();
}
function setFloor(f){const finish=['wood','dark','stone'].includes(f)?f:'wood';state.floor=finish;floorMesh.material=mat(finish==='dark'?'#51414b':finish==='stone'?'#a59da9':'#bd9478',.9);$('[data-finish]').forEach(b=>b.classList.toggle('selected',b.dataset.finish===finish));persist()}
function placePosition(kind){
 const map={bed:[-2.45,0,1.55],desk:[-.1,0,-2.35],chair:[-.1,0,-.95],monitor:[-.1,1.18,-2.42],monitorSmall:[1.1,1.18,-2.42],pc:[1.22,.08,-2.15],lamp:[2.85,0,-2.5],plant:[3,0,2.6],rug:[0,.02,.45],sofa:[2.5,0,1],poster:[-1.7,1.5,-3.37],shelf:[1.6,1.8,-3.38],console:[1.6,1.15,-2.3],keyboard:[-.1,1.2,-1.8],headset:[.9,1.17,-1.9],led:[-3.5,0,0]};
 return map[kind]||[0,0,0];
}
function syncRecord(obj){
 const rec=state.objects.find(x=>x.instanceId===obj.userData.instanceId);if(!rec)return;
 rec.position=obj.position.toArray();rec.rotation=obj.rotation.y;rec.scale=obj.scale.x;
}
function selectObject(obj){
 selected=obj;state.selectedId=obj?.userData.instanceId||null;
 if(!obj){$('#emptySelection').classList.remove('hidden');$('#objectProperties').classList.add('hidden');return}
 const rec=state.objects.find(x=>x.instanceId===obj.userData.instanceId),def=catalog.find(x=>x.id===obj.userData.itemId);
 $('#emptySelection').classList.add('hidden');$('#objectProperties').classList.remove('hidden');
 $('#selectedName').textContent=def?.name||obj.name;$('#objectColor').value=rec?.color||def?.color||'#ffffff';
 $('#objectScale').value=Math.round(obj.scale.x*100);$('#scaleValue').textContent=$('#objectScale').value+'%';
 $('#objectRotation').value=(Math.round(THREE.MathUtils.radToDeg(obj.rotation.y))+360)%360;$('#rotationValue').textContent=$('#objectRotation').value+'°';
 document.querySelector('[data-panel="properties"]').click();
}
function addFurniture(id,record){
 const def=catalog.find(d=>d.id===id);if(!def)return;
 if(state.objects.length>=60){notify('Limite de 60 objets atteinte');return}
 const obj=buildFurniture(def),r=record||{instanceId:crypto.randomUUID(),catalogId:id,position:placePosition(def.kind),rotation:0,scale:1,color:def.color};
 obj.userData.instanceId=r.instanceId;obj.position.fromArray(r.position||placePosition(def.kind));obj.rotation.y=r.rotation||0;obj.scale.setScalar(r.scale||1);if(r.color)colorObject(obj,r.color);
 world.add(obj);applyGameTextureToGroup(obj);state.objects.push(r);selectObject(obj);$('#objectCount').textContent=state.objects.length;persist();return obj;
}
function removeSelected(){
 if(!selected)return;const id=selected.userData.instanceId;world.remove(selected);state.objects=state.objects.filter(x=>x.instanceId!==id);selected=null;selectObject(null);refreshCount();persist();notify('Objet supprimé');
}
function refreshCount(){$('#objectCount').textContent=state.objects.length}
function pointerSet(e){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1)}
function hitObject(e){pointerSet(e);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(world.children.filter(x=>x.userData.instanceId),true);if(!hits.length)return null;let o=hits[0].object;while(o.parent&&!o.userData.instanceId)o=o.parent;return o.userData.instanceId?o:null}
function onPointerDown(e){if(e.button!==0)return;const obj=hitObject(e);if(!obj){selectObject(null);return}selectObject(obj);dragObject=obj;controls.enabled=false;renderer.domElement.setPointerCapture(e.pointerId)}
function onPointerMove(e){
 if(!dragObject)return;pointerSet(e);raycaster.setFromCamera(pointer,camera);
 const plane=new THREE.Plane(new THREE.Vector3(0,1,0),-dragObject.position.y),hit=new THREE.Vector3();
 if(raycaster.ray.intersectPlane(plane,hit)){dragObject.position.x=THREE.MathUtils.clamp(hit.x,-3.65,3.65);dragObject.position.z=THREE.MathUtils.clamp(hit.z,-3.1,3.1);syncRecord(dragObject)}
}
function onPointerUp(){if(!dragObject)return;persist();dragObject=null;controls.enabled=true}
function setView(v){
 $$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$('#cataloguePanel').classList.toggle('hidden',v==='saved');$('#savedPanel').classList.toggle('hidden',v!=='saved');
 $('#pageTitle').innerHTML=v==='saved'?'Mes sauvegardes <span>✦</span>':v==='catalogue'?'Catalogue <span>✦</span>':'Ma chambre <span>✦</span>';
 if(v==='catalogue')$('#cataloguePanel').scrollIntoView({behavior:'smooth',block:'start'});
}
function renderCatalog(filter='all'){
 const root=$('#quickCatalog');root.innerHTML='';
 catalog.filter(d=>filter==='all'||d.group===filter).forEach(d=>{
  const b=document.createElement('button');b.className='object-card';
  const thumb=document.createElement('span');thumb.className='object-thumb thumb-'+(d.kind==='monitorSmall'?'monitor':d.kind);thumb.setAttribute('aria-hidden','true');
  const name=document.createElement('b');name.textContent=d.name;const type=document.createElement('small');type.textContent=({furniture:'MOBILIER',gaming:'SETUP GAMING',lighting:'ÉCLAIRAGE',decor:'DÉCORATION',plants:'PLANTES'})[d.group];
  b.append(thumb,name,type);b.onclick=()=>{addFurniture(d.id);notify(d.name+' ajouté à la pièce')};root.append(b);
 });
}
function renderSaved(){
 const root=$('#savedRooms');$('#savedCount').textContent=savedRooms.length;root.innerHTML='';
 if(!savedRooms.length){root.innerHTML='<div class="empty-state">Aucune chambre sauvegardée pour le moment.</div>';return}
 savedRooms.forEach((r,i)=>{
  const card=document.createElement('div');card.className='saved-room';const info=document.createElement('div'),name=document.createElement('b'),meta=document.createElement('small');
  name.textContent=r.roomName||'Ma chambre';meta.textContent=(palettes[r.theme]?.label||'Personnalisé')+' · '+r.objects.length+' objets';info.append(name,meta);
  const actions=document.createElement('div'),open=document.createElement('button'),del=document.createElement('button');open.textContent='Ouvrir';del.textContent='Supprimer';
  open.onclick=()=>restoreRoom(r);del.onclick=()=>{savedRooms.splice(i,1);persist();renderSaved()};actions.append(open,del);card.append(info,actions);root.append(card);
 });
}
function persist(){try{localStorage.setItem(STORE,JSON.stringify(state));localStorage.setItem(SAVED,JSON.stringify(savedRooms))}catch{notify('Stockage local saturé')}}
function saveRoom(){const snap=JSON.parse(JSON.stringify(state));snap.selectedId=null;snap.savedAt=new Date().toISOString();savedRooms.unshift(snap);savedRooms=savedRooms.slice(0,20);persist();renderSaved();notify('Configuration sauvegardée')}
function restoreRoom(r){
 for(const o of [...world.children])if(o.userData.instanceId)world.remove(o);
 state={...defaults,...JSON.parse(JSON.stringify(r)),objects:[]};wallMeshes.forEach(w=>w.material=mat(state.wall));setFloor(state.floor);applyTheme(state.theme);setGame(state.game);
 state.objects=[];(r.objects||[]).forEach(x=>addFurniture(x.catalogId,x));selectObject(null);
 $('#sceneRoomName').textContent=state.roomName.toUpperCase();setLights();setView('studio');persist();notify('Chambre chargée');
}
function resetRoom(){
 for(const o of [...world.children])if(o.userData.instanceId)world.remove(o);
 state=structuredClone(defaults);wallMeshes.forEach(w=>w.material=mat(state.wall));applyTheme('pink');setFloor('wood');setGame('spiderman');
 ['bed','desk','chair','monitor','pc','rug'].forEach(id=>addFurniture(id));selectObject(null);$('#sceneRoomName').textContent=state.roomName.toUpperCase();setLights();persist();notify('Pièce réinitialisée');
}
function exportConfig(){const payload={...state,objects:state.objects.map(o=>({...o}))};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='my-gaming-room.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Configuration JSON exportée')}

function init(){
 const saved=parse(localStorage.getItem(STORE),null);if(saved)state={...defaults,...saved,objects:[]};savedRooms=parse(localStorage.getItem(SAVED),[]);if(!Array.isArray(savedRooms))savedRooms=[];
 buildRoom();
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;host.appendChild(renderer.domElement);
 camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(7,6.2,9);
 controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1.1,0);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=5;controls.maxDistance=17;controls.maxPolarAngle=Math.PI*.485;controls.minAzimuthAngle=-1.35;controls.maxAzimuthAngle=1.35;
 raycaster=new THREE.Raycaster();pointer=new THREE.Vector2();
 const resize=()=>{const r=host.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()};
 new ResizeObserver(resize).observe(host);window.addEventListener('resize',resize);resize();
 renderer.domElement.addEventListener('pointerdown',onPointerDown);renderer.domElement.addEventListener('pointermove',onPointerMove);renderer.domElement.addEventListener('pointerup',onPointerUp);renderer.domElement.addEventListener('pointercancel',onPointerUp);
 renderer.domElement.addEventListener('dblclick',removeSelected);
 const records=saved?.objects||[];state.objects=[];
 if(records.length){records.forEach(r=>addFurniture(r.catalogId,r));selectObject(null)}
 else ['bed','desk','chair','monitor','pc','rug'].forEach(id=>addFurniture(id));
 $('#sceneRoomName').textContent=(state.roomName||'MY DREAM ROOM').toUpperCase();$('#roomNameInput').value=state.roomName;
 applyTheme(state.theme);setFloor(state.floor);setGame(state.game);$('#ledColor').value=state.led;$('#intensity').value=state.intensity;$('#intensityLabel').textContent=state.intensity+'%';setLights();
 renderCatalog();renderSaved();refreshCount();selectObject(null);document.querySelector('[data-panel="themes"]').click();
 $('#engineStatus').textContent='● MOTEUR 3D ACTIF';$('#sceneHint').textContent='Glisse pour tourner · Molette pour zoomer · Glisse un meuble pour le déplacer';
 const animate=()=>{requestAnimationFrame(animate);controls.update();renderer.render(world,camera)};animate();
}
$$('.nav-link').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
$$('[data-category]').forEach(b=>b.addEventListener('click',()=>{$$('[data-category]').forEach(x=>x.classList.toggle('active',x===b));if(b.dataset.category==='walls'){document.querySelector('[data-panel="colors"]').click();return}renderCatalog(b.dataset.category);$('#cataloguePanel').scrollIntoView({behavior:'smooth',block:'nearest'})}));
$('#settingsBtn').onclick=()=>document.querySelector('[data-panel="colors"]').click();
$$('[data-theme]').forEach(b=>b.addEventListener('click',()=>applyTheme(b.dataset.theme)));
$('[data-wall]').forEach(b=>b.addEventListener('click',()=>{state.wall=b.dataset.wall;wallMeshes.forEach(w=>w.material=mat(state.wall));$('[data-wall]').forEach(x=>x.classList.toggle('selected',x===b));persist()}));
$$('[data-finish]').forEach(b=>b.addEventListener('click',()=>setFloor(b.dataset.finish)));
$$('[data-panel]').forEach(b=>b.addEventListener('click',()=>{$$('[data-panel]').forEach(x=>x.classList.toggle('active',x===b));$$('.panel-content').forEach(x=>x.classList.toggle('active',x.id===b.dataset.panel))}));
$('#saveBtn').onclick=saveRoom;$('#resetBtn').onclick=resetRoom;$('#exportBtn').onclick=exportConfig;
$('#toggleLights').onclick=$('#lightMode').onclick=()=>{state.lights=!state.lights;setLights();persist()};
$('#roomNameInput').addEventListener('input',e=>{state.roomName=e.target.value.slice(0,28);$('#sceneRoomName').textContent=(state.roomName||'MY DREAM ROOM').toUpperCase();persist()});
$('#ledColor').addEventListener('input',e=>{state.led=e.target.value;ledMeshes.forEach(l=>l.material=mat(state.led));if(mainLight)mainLight.color.set(state.led);persist()});
$('#intensity').addEventListener('input',e=>{state.intensity=+e.target.value;$('#intensityLabel').textContent=state.intensity+'%';setLights();persist()});
$('#gameSelect').addEventListener('change',e=>{state.game=e.target.value;screenTexture?.dispose();screenTexture=makeGameTexture(state.game);world.traverse(o=>{if(o.userData.gameScreen)o.material=new THREE.MeshStandardMaterial({map:screenTexture,emissiveMap:screenTexture,emissive:0xffffff,emissiveIntensity:.25,roughness:.2})});persist()});
$('#objectColor').addEventListener('input',e=>{if(!selected)return;colorObject(selected,e.target.value);const r=state.objects.find(x=>x.instanceId===selected.userData.instanceId);if(r)r.color=e.target.value;persist()});
$('#objectScale').addEventListener('input',e=>{if(!selected)return;selected.scale.setScalar(+e.target.value/100);$('#scaleValue').textContent=e.target.value+'%';syncRecord(selected)});
$('#objectRotation').addEventListener('input',e=>{if(!selected)return;selected.rotation.y=THREE.MathUtils.degToRad(+e.target.value);$('#rotationValue').textContent=e.target.value+'°';syncRecord(selected)});
$('#objectScale').addEventListener('change',persist);$('#objectRotation').addEventListener('change',persist);
$('#deleteBtn').onclick=removeSelected;
$('#duplicateBtn').onclick=()=>{if(!selected)return;const r=state.objects.find(x=>x.instanceId===selected.userData.instanceId);if(r)addFurniture(r.catalogId,{...JSON.parse(JSON.stringify(r)),instanceId:crypto.randomUUID(),position:[r.position[0]+.5,r.position[1],r.position[2]+.5]})};
$('#fullscreenBtn').onclick=()=>host.requestFullscreen?.().catch(()=>notify('Plein écran indisponible'));
$('#cameraHome').onclick=()=>{camera.position.set(7,6.2,9);controls.target.set(0,1.1,0);controls.update()};
let zoom=1;const zoomBy=v=>{zoom=THREE.MathUtils.clamp(zoom+v,.75,1.45);camera.position.multiplyScalar(v<0?1.08:.92);$('#zoomValue').textContent=Math.round(zoom*100)+'%'};$('#zoomIn').onclick=()=>zoomBy(.05);$('#zoomOut').onclick=()=>zoomBy(-.05);
init();
