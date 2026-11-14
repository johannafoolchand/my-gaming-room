const scene=document.getElementById('scene');
const decorLayer=document.getElementById('decorLayer');
const toast=document.getElementById('toast');
const themes={bubblegum:['#f7c4dd','#efadd0','#dca0bf','#c77fa8','#ff7bc8'],lavender:['#d6c8ed','#bba8df','#c6b6dd','#a18bc6','#c5a2ff'],cherry:['#f7c0c7','#ed9eaa','#e4a2ad','#c77b8d','#ff879f'],aqua:['#c4e5e8','#9ed5da','#a8d5df','#7eb5c5','#79dce1']};
const defaults={theme:'bubblegum',floor:'wood',lights:true,roomName:'My room',console:'PlayStation 5',led:'#ff7bc8',decor:[]};
let state={...defaults};
function notify(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('show'),2200)}
function apply(){
 const t=themes[state.theme]||themes.bubblegum;
 ['--wall1','--wall2','--floor1','--floor2','--accent'].forEach((k,i)=>scene.style.setProperty(k,t[i]));
 scene.style.setProperty('--accent',state.led||t[4]);scene.classList.toggle('lights-off',!state.lights);
 document.getElementById('roomName').textContent=state.roomName;
 document.getElementById('setupName').value=state.roomName;document.getElementById('consoleSelect').value=state.console;document.getElementById('ledColor').value=state.led;
 document.querySelectorAll('[data-theme]').forEach(b=>b.classList.toggle('selected',b.dataset.theme===state.theme));
 document.querySelectorAll('[data-floor]').forEach(b=>b.classList.toggle('selected',b.dataset.floor===state.floor));
 document.getElementById('lightsBtn').textContent=state.lights?'☼ Lights on':'☾ Lights off';
 scene.dataset.floor=state.floor;renderDecor();
}
function renderDecor(){
 decorLayer.innerHTML='';
 state.decor.forEach((item,index)=>{const el=document.createElement('button');el.type='button';el.className='extra-decor';el.textContent=item.emoji;el.setAttribute('aria-label','Move or remove decoration');el.style.left=item.x+'%';el.style.top=item.y+'%';el.style.background='transparent';el.style.border='0';el.addEventListener('pointerdown',startDrag);el.addEventListener('dblclick',()=>{state.decor.splice(index,1);renderDecor();notify('Decoration removed ♡');});decorLayer.appendChild(el);});
 document.getElementById('itemCount').textContent=8+state.decor.length;
}
const icons={heart:'💗',star:'⭐',bow:'🎀',flower:'🌸',disc:'💿',bear:'🧸',lamp:'🪩',candy:'🍬'};
let activeDrag=null;
function startDrag(e){e.preventDefault();const el=e.currentTarget;activeDrag={el,id:[...decorLayer.children].indexOf(el)};el.setPointerCapture(e.pointerId);el.addEventListener('pointermove',moveDrag);el.addEventListener('pointerup',endDrag,{once:true});}
function moveDrag(e){if(!activeDrag)return;const rect=scene.getBoundingClientRect();const item=state.decor[activeDrag.id];item.x=Math.max(0,Math.min(95,(e.clientX-rect.left)/rect.width*100));item.y=Math.max(0,Math.min(90,(e.clientY-rect.top)/rect.height*100));activeDrag.el.style.left=item.x+'%';activeDrag.el.style.top=item.y+'%';}
function endDrag(e){if(activeDrag){activeDrag.el.removeEventListener('pointermove',moveDrag);activeDrag=null;}}
document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab,.tab-content').forEach(el=>el.classList.remove('active'));btn.classList.add('active');document.getElementById(btn.dataset.tab).classList.add('active');}));
document.querySelectorAll('[data-theme]').forEach(btn=>btn.addEventListener('click',()=>{state.theme=btn.dataset.theme;apply();}));
document.querySelectorAll('[data-floor]').forEach(btn=>btn.addEventListener('click',()=>{state.floor=btn.dataset.floor;apply();}));
document.querySelectorAll('[data-item]').forEach(btn=>btn.addEventListener('click',()=>{state.decor.push({emoji:icons[btn.dataset.item],x:42+Math.random()*18,y:28+Math.random()*25});renderDecor();}));
document.getElementById('lightsBtn').addEventListener('click',()=>{state.lights=!state.lights;apply();});
document.getElementById('setupName').addEventListener('input',e=>{state.roomName=e.target.value.slice(0,28);document.getElementById('roomName').textContent=state.roomName;});
document.getElementById('consoleSelect').addEventListener('change',e=>state.console=e.target.value);
document.getElementById('ledColor').addEventListener('input',e=>{state.led=e.target.value;apply();});
document.getElementById('saveBtn').addEventListener('click',()=>{try{localStorage.setItem('myGamingRoom',JSON.stringify(state));notify('Your room is saved on this device ♡');}catch{notify('Saving is unavailable in this browser.');}});
document.getElementById('resetBtn').addEventListener('click',()=>{state={...defaults,decor:[]};try{localStorage.removeItem('myGamingRoom');}catch{}apply();notify('Room reset ✧');});
document.getElementById('exportBtn').addEventListener('click',()=>{const markup=scene.outerHTML;const svg='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">'+markup+'</div></foreignObject></svg>';const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download='my-gaming-room.svg';a.click();URL.revokeObjectURL(url);notify('Room export started ✧');});
try{const saved=localStorage.getItem('myGamingRoom');if(saved){const parsed=JSON.parse(saved);state={...defaults,...parsed,decor:Array.isArray(parsed.decor)?parsed.decor:[]};}}catch{state={...defaults};}
apply();
