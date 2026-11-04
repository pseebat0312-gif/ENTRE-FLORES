'use strict';
const efIconPaths={"arrow": "M5 19 19 5M5 5h14v14", "back": "M21 12H3m7-7-7 7 7 7", "pan": "M3 12h18M8 7l-5 5 5 5m8-10 5 5-5 5", "undo": "M4 10a8 8 0 1 1 1 9M4 4v6h6", "redo": "M20 10a8 8 0 1 0-1 9m1-15v6h-6", "reset": "M4 10a8 8 0 1 1 1 9M4 4v6h6", "download": "M12 3v16m-7-7 7 7 7-7M4 22h16", "restore": "M12 20V4m-7 7 7-7 7 7M4 22h16", "front": "M12 21V7m-7 7 7-7 7 7M4 3h16", "behind": "M12 3v14m-7-7 7 7 7-7M4 21h16", "close": "m6 6 12 12M18 6 6 18", "minus": "M5 12h14", "plus": "M5 12h14M12 5v14", "chevron": "m6 9 6 6 6-6", "menu": "M3 6h18M3 12h18M3 18h18", "check": "m5 12 4 4L19 6", "heart": "M12 21 3.7 12.7C-2 6.5 5 0 12 7c7-7 14-.5 8.3 5.7Z", "sparkle": "m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8Z"};
function efIcon(name){return `<svg class="ef-icon ef-icon-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${efIconPaths[name]}"/></svg>`}

const $=s=>document.querySelector(s);
const flowers=[
['hellebore','Eléboro',4.9,'Invierno','Flores blancas que iluminan el jardín en los días fríos.'],['rose','Rosa inglesa',4.5,'Primavera','Pétalos suaves y perfumados.'],['tulip','Tulipán',3.8,'Primavera','Líneas ligeras, color de primavera.'],['anemone','Anémona',4.2,'Invierno','Blanco luminoso y corazón oscuro.'],['dahlia','Dalia',4.8,'Otoño','Profundidad y estructura de pétalos.'],['peony','Peonía',6.5,'Primavera','Volumen generoso y delicado.'],['hydrangea','Hortensia',5.9,'Verano','Una nube de pequeñas flores azules.'],['ranunculus','Ranúnculo',4.3,'Primavera','Capas de pétalos de color crema.'],['stock','Alhelí',3.6,'Primavera','Ramillete floral delicado.'],['cosmos','Cosmos',3.5,'Verano','Flor silvestre y ligera.'],['waxflower','Flor de cera',3.2,'Primavera','Pequeñas flores de acompañamiento.'],['queen-annes-lace','Ammi',3.1,'Verano','Umbelas blancas y naturales.'],['sweet-pea','Guisante de olor',3.8,'Primavera','Pétalos de seda y color suave.'],['eucalyptus','Eucalipto',2.9,'Todas','Hojas gris verde, aroma fresco.'],['babys-breath','Paniculata',2.8,'Todas','Una nube de flores diminutas.'],['astrantia','Astrantia',3.7,'Verano','Pequeñas estrellas de jardín.'],['olive','Olivo',2.7,'Todas','Follaje mediterráneo.'],['burgundy-foliage','Follaje borgoña',2.8,'Otoño','Textura y contraste oscuro.']].map(([id,name,price,season,desc])=>({id,name,price,season,desc,src:`assets/flowers/${id}.png`}));
const money=n=>'€ '+n.toFixed(2).replace('.',',');let scene='home',historyScenes=['home'],active=null,cart=[],undoStack=[],redoStack=[],selected=null,drag=null,anim=0;
function go(id,record=true){if(!document.getElementById(id))return;const entering=document.getElementById(id),reenter=scene!==id;scene=id;if(reenter){entering.classList.remove('page-enter');void entering.offsetWidth;entering.classList.add('page-enter')}if(record&&historyScenes.at(-1)!==id)historyScenes.push(id);document.querySelectorAll('.scene').forEach(el=>el.classList.toggle('active',el.id===id));$('#detail').classList.remove('open');$('#detail').setAttribute('aria-hidden','true');if(id==='studio')renderAll();document.querySelectorAll('nav [data-go]').forEach(b=>b.setAttribute('aria-current',b.dataset.go===id?'page':'false'));document.querySelector('nav').classList.remove('open');document.querySelector('.mobile-menu').setAttribute('aria-expanded','false');window.scrollTo({top:0,behavior:'instant'});window.history.replaceState(null,'','#'+id)}
function back(){if(historyScenes.length>1){historyScenes.pop();go(historyScenes.at(-1),false)}else go('home',false)}
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',back));
let detailOrigin=null,currentGardenSeason='Primavera';
function gardenFlower(id){const scene=SEASON_SCENES[currentGardenSeason];const mapped=scene.map[id]||id;const f=flowers.find(f=>f.id===mapped);return {...f,src:scene.overrides[mapped]||f.src}}
function gardenButton(f,x,y,r,instance){
 const b=document.createElement('button');b.className='garden-flower-hit';b.dataset.id=f.id;b.dataset.instance=instance;
 b.style.setProperty('--gx',x);b.style.setProperty('--gy',y);b.style.setProperty('--radius',r);
 b.setAttribute('aria-label',`${f.name} · ${instance}`);const label=document.createElement('span');label.className='garden-flower-name';label.textContent=f.name;b.append(label);
 b.addEventListener('click',()=>{detailOrigin=b;showDetail(f)});return b;
}
function renderGarden(){
 const root=$('#gardenFlowers');root.replaceChildren();root.classList.remove('has-specimen-hover');
 let count=0;for(const base of flowers){const f=gardenFlower(base.id);const points=GARDEN_BLOOMS[base.id]||[];points.forEach(([x,y,r])=>root.append(gardenButton(f,x,y,r,`flor ${++count}`)))}
 GARDEN_SPECIMENS.forEach(([id,x,y,height,angle,plane],i)=>{
  const f=id==='anemone'&&plane==='front'?{...flowers.find(f=>f.id==='anemone')}:gardenFlower(id),b=gardenButton(f,x,y,4,`primer plano ${i+1}`);b.classList.add('garden-specimen',`specimen-${plane}`);if(id==='anemone'&&plane==='front')b.dataset.originalWhite='true';b.style.setProperty('--plant-height',height);b.style.setProperty('--rest-angle',angle+'deg');
  b.style.setProperty('--wind-duration',(7.1+(i*1.37)%7.8).toFixed(2)+'s');b.style.setProperty('--wind-delay',(-i*1.83).toFixed(2)+'s');b.style.setProperty('--wind-angle',(.65+(i%5)*.31).toFixed(2)+'deg');b.style.setProperty('--local-z',Math.round(y));
  const stem=document.createElement('span');stem.className='specimen-stem';const img=document.createElement('img');img.src=f.src;img.alt='';img.draggable=false;img.loading='eager';stem.append(img);b.prepend(stem);
  const hit=document.createElement('span');hit.className='specimen-touch';hit.setAttribute('aria-hidden','true');b.append(hit);root.append(b);
 });
 installGardenPicker(root);window.dispatchEvent(new Event('ef:gardenrender'));
}
// Alpha-aware picking follows the visible petals rather than overlapping rectangular hit boxes.
const specimenAlpha=new Map();
function flowerAlpha(img){
 const key=img.getAttribute('src');if(specimenAlpha.has(key))return specimenAlpha.get(key);
 if(!img.complete||!img.naturalWidth)return null;
 const c=document.createElement('canvas');c.width=112;c.height=Math.round(112*img.naturalHeight/img.naturalWidth);const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,c.width,c.height);
 const data={width:c.width,height:c.height,pixels:ctx.getImageData(0,0,c.width,c.height).data};specimenAlpha.set(key,data);return data;
}
function specimenAt(button,x,y){
 const stem=button.querySelector('.specimen-stem'),img=stem.querySelector('img'),alpha=flowerAlpha(img);if(!alpha)return false;
 const box=button.getBoundingClientRect(),matrix=new DOMMatrix(getComputedStyle(stem).transform),ox=box.width*.5,oy=box.height*.96;
 const dx=x-box.left-ox-matrix.e,dy=y-box.top-oy-matrix.f,det=matrix.a*matrix.d-matrix.b*matrix.c;
 const lx=(matrix.d*dx-matrix.c*dy)/det+ox,ly=(-matrix.b*dx+matrix.a*dy)/det+oy;
 if(lx<0||ly<0||lx>=box.width||ly>=box.height*.87)return false;
 const px=Math.floor(lx/box.width*alpha.width),py=Math.floor(ly/box.height*alpha.height);
 return alpha.pixels[(py*alpha.width+px)*4+3]>48;
}
function installGardenPicker(root){
 root._pickerController?.abort();const controller=new AbortController();root._pickerController=controller;let pointer=null;root.addEventListener('pointerdown',e=>{pointer={x:e.clientX,y:e.clientY}},{passive:true,signal:controller.signal});
 let hover=null,lastHover=0;
 root.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||performance.now()-lastHover<90)return;lastHover=performance.now();const specimens=[...root.querySelectorAll('.garden-specimen')].sort((a,b)=>Number(getComputedStyle(b).zIndex)-Number(getComputedStyle(a).zIndex));const next=specimens.find(b=>specimenAt(b,e.clientX,e.clientY));if(next!==hover){hover?.classList.remove('specimen-hover');hover=next;hover?.classList.add('specimen-hover');root.classList.toggle('has-specimen-hover',!!hover)}},{passive:true,signal:controller.signal});
 root.addEventListener('pointerleave',()=>{hover?.classList.remove('specimen-hover');hover=null;root.classList.remove('has-specimen-hover')},{signal:controller.signal});

 root.addEventListener('click',e=>{
  if(e.detail===0)return;e.stopPropagation();e.preventDefault();
  if(pointer&&Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>12)return;
  const specimens=[...root.querySelectorAll('.garden-specimen')].sort((a,b)=>Number(getComputedStyle(b).zIndex)-Number(getComputedStyle(a).zIndex));
  // Prefer the actual clicked flower button before geometric hit testing.
  // This preserves the existing botanical detail card for pointer/touch clicks.
  let picked=e.target.closest?.('.garden-flower-hit');
  if(picked&&!root.contains(picked))picked=null;
  if(!picked)picked=specimens.find(b=>specimenAt(b,e.clientX,e.clientY));
  if(!picked){let best=1.45;for(const b of root.querySelectorAll('.garden-flower-hit:not(.garden-specimen)')){const r=b.getBoundingClientRect();const d=Math.hypot((e.clientX-r.left-r.width/2)/(r.width/2),(e.clientY-r.top-r.height/2)/(r.height/2));if(d<best){best=d;picked=b}}}
  if(picked){detailOrigin=picked;root.dataset.lastPicked=picked.dataset.id;showDetail(gardenFlower(picked.dataset.id))}
 },{capture:true,signal:controller.signal});
}
const meanings={hellebore:'Calma, esperanza y nuevos comienzos.',rose:'Afecto y belleza atemporal.',tulip:'Renacimiento y alegría.',anemone:'Expectativa y sinceridad.',dahlia:'Elegancia y fortaleza.',peony:'Prosperidad, romance y nuevos comienzos.',hydrangea:'Gratitud y sentimientos profundos.',ranunculus:'Encanto y delicadeza.',stock:'Belleza duradera.',cosmos:'Armonía y serenidad.',eucalyptus:'Calma y renovación.'};
const latinNames={hellebore:'Helleborus niger',rose:'Rosa × hybrida',tulip:'Tulipa',anemone:'Anemone coronaria',dahlia:'Dahlia pinnata',peony:'Paeonia lactiflora',hydrangea:'Hydrangea macrophylla',ranunculus:'Ranunculus asiaticus',stock:'Matthiola incana',cosmos:'Cosmos bipinnatus',waxflower:'Chamelaucium uncinatum','queen-annes-lace':'Ammi majus','sweet-pea':'Lathyrus odoratus',eucalyptus:'Eucalyptus cinerea','babys-breath':'Gypsophila paniculata',astrantia:'Astrantia major',olive:'Olea europaea','burgundy-foliage':'Cotinus coggygria'};
const pairings={peony:'Rosa inglesa, anémona y eucalipto.',dahlia:'Olivo, cosmos y follaje borgoña.',anemone:'Peonía, ranúnculo y astrantia.',rose:'Peonía, alhelí y eucalipto.'};
const companionIds={rose:['peony','eucalyptus','stock'],peony:['rose','anemone','eucalyptus'],dahlia:['olive','cosmos','burgundy-foliage'],anemone:['peony','ranunculus','astrantia'],hydrangea:['rose','eucalyptus','babys-breath'],tulip:['ranunculus','waxflower','olive']};
function showDetail(f){
 active=f;$('#detailImage').src=f.src;$('#detailImage').alt=f.name;$('#detailName').textContent=f.name;$('#detailLatin').textContent=latinNames[f.id];$('#detailNumber').textContent='HERBARIO · Nº '+String(flowers.findIndex(x=>x.id===f.id)+1).padStart(2,'0');
 $('#detailMeaning').textContent=meanings[f.id]||'La belleza de lo sencillo, el cuidado y los nuevos recuerdos.';
 $('#detailDesc').textContent=f.desc;$('#detailSeason').textContent=f.season==='Todas'?'Todo el año':f.season;$('#detailPrice').textContent=money(f.price);
 const extra=$('#detailExtra');extra.replaceChildren();const label=document.createElement('span');label.className='card-label';label.textContent='COMBINA CON';extra.append(label);
 const row=document.createElement('div');row.className='flower-companions';
 (companionIds[f.id]||['rose','eucalyptus','anemone']).filter(id=>id!==f.id).forEach(id=>{const other=flowers.find(x=>x.id===id);const button=document.createElement('button');const img=document.createElement('img');img.src=other.src;img.alt='';const name=document.createElement('span');name.textContent=other.name;button.append(img,name);button.onclick=()=>showDetail(other);row.append(button)});extra.append(row);
 $('#detail').classList.add('open');$('#detail').setAttribute('aria-hidden','false');$('#closeDetail').focus({preventScroll:true});
}
$('#closeDetail').onclick=()=>{$('#detail').classList.remove('open');$('#detail').setAttribute('aria-hidden','true');detailOrigin?.focus({preventScroll:true})};
$('#addFromDetail').onclick=()=>{if(active)add(active.id,active.src);$('#detail').classList.remove('open');go('studio')};
document.querySelectorAll('.season button[data-season]').forEach(b=>b.onclick=()=>{
 currentGardenSeason=b.dataset.season;document.querySelectorAll('.season button[data-season]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});$('#garden').dataset.season=currentGardenSeason;
 $('#detail').classList.remove('open');$('#detail').setAttribute('aria-hidden','true');renderGarden();const def=SEASON_SCENES[currentGardenSeason];
 $('#seasonCaption').textContent=currentGardenSeason+' · '+def.caption;haptic('tap');window.dispatchEvent(new CustomEvent('ef:seasonchange',{detail:{name:currentGardenSeason,...def}}));
});
function renderHero(){const root=$('#homeBlooms');root.replaceChildren();['rose','peony','dahlia','ranunculus'].forEach((id,i)=>{const f=flowers.find(f=>f.id===id);const img=document.createElement('img');img.src=f.src;img.alt='';img.style.left=[0,19,39,62,77][i]+'%';img.style.top=[18,8,24,12,20][i]+'%';img.style.height=[75,82,65,79,66][i]+'%';img.style.animationDelay=(-i*1.4)+'s';root.append(img)})}
const svgns='http://www.w3.org/2000/svg';const mouth={x:470,y:512};let currentPresentation='classic';let feedbackEnabled=true;const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
function snapshot(){redoStack=[];undoStack.push(JSON.stringify(cart));if(undoStack.length>30)undoStack.shift()}
function add(id,source){const f=flowers.find(f=>f.id===id);if(!f)return;snapshot();const i=cart.length;const s={uid:'s'+Date.now().toString(36)+Math.random().toString(36).slice(2),id,src:source||f.src,x:mouth.x+((i%7)-3)*19,y:mouth.y,tx:mouth.x+((i%7)-3)*19,ty:mouth.y,angle:((i%7)-3)*4,scale:.60+(i%3)*.045,inserted:true,vx:0,vy:0};cart.push(s);selected=s.uid;placeNewStem(s);const target={x:s.x,y:s.y,angle:s.angle,scale:s.scale};s.y-=20;s.angle-=3;s.tx=target.x;s.ty=target.y;s.ta=target.angle;s.ts=target.scale;s.va=0;s.vs=0;renderAll();startSpring();haptic('insert');keepAtelierInView();toast(`${f.name} añadida a tu ramo`)}
function placeNewStem(s){
 const i=cart.length-1,cat=categoryFor(s.id),side=i%2===0?-1:1;
 s.x=mouth.x+((i%5)-2)*8;s.y=mouth.y+(i%3)*3;s.tx=s.x;s.ty=s.y;
 s.angle=i===0?0:side*(12+((Math.ceil(i/2)-1)%4)*10);
 s.scale=cat==='main'?.84:cat==='foliage'?.95:.87;s.inserted=true;s.anchorVersion=3;
}
function renderAll(){renderCatalog();renderStems();renderCart()}
function autoArrange(show=true){
 if(!cart.length){if(show)toast('Elige primero algunas flores.');return}
 if(show)snapshot();
 cart.sort((a,b)=>({foliage:0,support:1,main:2}[categoryFor(a.id)]-({foliage:0,support:1,main:2}[categoryFor(b.id)])));
 const n=cart.length;
 cart.forEach((s,i)=>{const cat=categoryFor(s.id);s.x=mouth.x+((i%5)-2)*7;s.y=mouth.y+(i%3)*3;s.tx=s.x;s.ty=s.y;s.angle=n===1?0:(i/(n-1)-.5)*88;s.scale=cat==='main'?.86:cat==='foliage'?.98:.91;s.inserted=true;s.anchorVersion=3;s.ta=s.angle;s.ts=s.scale;s.vx=s.vy=s.va=s.vs=0});
 renderAll();if(show)toast('Tu ramo está compuesto. Puedes ajustar cada tallo.');
}
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('visible'),2700)}
$('#autoCompose').onclick=()=>autoArrange(true);
$('#redo').onclick=()=>{if(!redoStack.length)return;undoStack.push(JSON.stringify(cart));cart=JSON.parse(redoStack.pop());selected=null;renderAll()};
$('#bringFront').onclick=()=>{const i=cart.findIndex(s=>s.uid===selected);if(i<0)return;snapshot();cart.push(cart.splice(i,1)[0]);renderAll()};
$('#sendBack').onclick=()=>{const i=cart.findIndex(s=>s.uid===selected);if(i<0)return;snapshot();cart.unshift(cart.splice(i,1)[0]);renderAll()};
function packagingFee(){return PRESENTATIONS[currentPresentation]?.fee||0}
function compositionTotal(){return cart.reduce((sum,s)=>sum+flowers.find(f=>f.id===s.id).price,0)+packagingFee()}
const storageKey='entre-flores-v2-design';
$('#saveLocal').onclick=()=>{try{localStorage.setItem(storageKey,JSON.stringify({name:$('#ramoName').value,cart,presentation:currentPresentation}));toast('Tu diseño se ha guardado en este navegador.')}catch(e){toast('No se pudo guardar en este navegador.')}};
$('#loadLocal').onclick=()=>{try{const data=JSON.parse(localStorage.getItem(storageKey)||'null');if(!data||!Array.isArray(data.cart)){toast('Aún no tienes un diseño guardado.');return}snapshot();cart=data.cart.filter(s=>flowers.some(f=>f.id===s.id));$('#ramoName').value=data.name||'';selected=null;if(PRESENTATIONS[data.presentation])selectPresentation(data.presentation,false);renderAll();toast('Diseño recuperado.')}catch(e){toast('No se pudo recuperar el diseño.')}};

let currentCategory="all";const categoryFor=id=>["eucalyptus","olive","burgundy-foliage"].includes(id)?"foliage":["babys-breath","waxflower","queen-annes-lace","astrantia","stock","sweet-pea"].includes(id)?"support":"main";
document.querySelectorAll("[data-category]").forEach(b=>b.onclick=()=>{currentCategory=b.dataset.category;document.querySelectorAll("[data-category]").forEach(x=>x.classList.toggle("chosen",x===b));renderCatalog()});
function renderCatalog(){const root=$('#catalog');root.replaceChildren();flowers.filter(f=>currentCategory==="all"||categoryFor(f.id)===currentCategory).forEach(f=>{const b=document.createElement('button');b.title=`Añadir ${f.name}`;const img=document.createElement('img');img.src=f.src;img.alt='';const name=document.createElement('span');name.textContent=f.name+' · '+money(f.price);b.append(img,name);b.onclick=()=>add(f.id);root.append(b)})}
function transform(s){return `translate(${s.x} ${s.y}) rotate(${s.angle}) scale(${s.scale}) translate(-140 -470)`}
function renderStems(){const placed=$('#placed'),free=$('#freeStems');placed.replaceChildren();free.replaceChildren();cart.forEach(s=>{if(s.anchorVersion!==3){s.x=mouth.x;s.y=mouth.y;s.tx=s.x;s.ty=s.y;s.inserted=true;s.anchorVersion=3}const g=document.createElementNS(svgns,'g');g.classList.add('stem');if(selected===s.uid)g.classList.add('selected');g.dataset.uid=s.uid;g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',flowers.find(f=>f.id===s.id).name+' en el jarrón');g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selected=s.uid;renderStems()}});g.setAttribute('transform',transform(s));const image=document.createElementNS(svgns,'image');image.setAttribute('href',s.src||flowers.find(f=>f.id===s.id).src);image.setAttribute('width','280');image.setAttribute('height','480');image.setAttribute('preserveAspectRatio','xMidYMid meet');g.append(image);(s.inserted?placed:free).append(g);g.addEventListener('pointerdown',e=>{e.preventDefault();snapshot();selected=s.uid;const pt=point(e);drag={uid:s.uid,startX:pt.x,startY:pt.y,origX:s.x,origY:s.y,px:pt.x,py:pt.y,time:performance.now()};s.inserted=false;$('#arrangement').classList.add('dragging');g.classList.add('selected');free.append(g);g.setPointerCapture(e.pointerId);renderGlassStems();renderCart()})});renderGlassStems()}
function renderGlassStems(){
 const root=$('#glassStems');root.replaceChildren();const def=PRESENTATIONS[currentPresentation];if(!def.glass)return;
 const bottom=def.box[1]+def.box[3]*.90;
 cart.filter(s=>s.inserted).forEach((s,i)=>{
  const r=s.angle*Math.PI/180;
  // Begin inside the photographed lower stalk, following its rotated axis through the lip.
  const startX=s.x+Math.sin(r)*30*s.scale,startY=s.y-Math.cos(r)*30*s.scale;
  const endY=bottom-(i%3)*5,depth=endY-startY;
  const endX=clamp(startX-Math.tan(r)*depth,def.box[0]+def.box[2]*.36,def.box[0]+def.box[2]*.64);
  const path=document.createElementNS(svgns,'path');
  path.setAttribute('d',`M ${startX} ${startY} Q ${startX-Math.sin(r)*depth*.45} ${startY+depth*.45} ${endX} ${endY}`);
  path.setAttribute('stroke',currentPresentation==='amber'?'#788343':'#77986b');path.setAttribute('stroke-width',String(5*s.scale+1.4));path.setAttribute('stroke-linecap','round');path.setAttribute('fill','none');path.setAttribute('opacity','.92');root.append(path);
  const light=path.cloneNode();light.setAttribute('stroke','#b4bc7d');light.setAttribute('stroke-width','1');light.setAttribute('opacity','.55');root.append(light);
 });
}
function point(e){const svg=$('#arrangement');const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const m=svg.getScreenCTM();return m?pt.matrixTransform(m.inverse()):{x:470,y:465}}
$('#arrangement').addEventListener('pointermove',e=>{if(!drag)return;const s=cart.find(s=>s.uid===drag.uid);if(!s)return;const pt=point(e),now=performance.now(),dt=Math.max(12,now-drag.time);s.vx=clamp((pt.x-drag.px)/dt*16,-35,35);s.vy=clamp((pt.y-drag.py)/dt*16,-35,35);s.x=clamp(drag.origX+pt.x-drag.startX,40,860);s.y=clamp(drag.origY+pt.y-drag.startY,60,730);drag.px=pt.x;drag.py=pt.y;drag.time=now;const g=document.querySelector(`[data-uid="${s.uid}"]`);if(g)g.setAttribute('transform',transform(s))});
function release(){
 if(!drag)return;const s=cart.find(s=>s.uid===drag.uid);drag=null;$('#arrangement').classList.remove('dragging');if(!s)return;
 const radians=s.angle*Math.PI/180,tipX=s.x+Math.sin(radians)*360*s.scale,tipY=s.y-Math.cos(radians)*360*s.scale;
 const dx=tipX-mouth.x,dy=Math.max(90,mouth.y-tipY),lean=Math.atan2(dx,dy)*180/Math.PI;
 s.ta=clamp(lean+Math.sign(lean)*1.3,-59,59);s.ts=clamp(Math.hypot(dx,dy)/360,.50,1.13);
 s.tx=mouth.x+Math.sin(s.ta*Math.PI/180)*14;s.ty=mouth.y;s.vx=clamp(s.vx||0,-10,10);s.vy=clamp((s.vy||0)+3,-5,12);s.va=clamp((s.ta-s.angle)*.025,-1,1);s.vs=0;s.inserted=true;s.anchorVersion=3;
 renderStems();startSpring();haptic('insert');renderCart();
}
$('#arrangement').addEventListener('pointerup',release);$('#arrangement').addEventListener('pointercancel',release);window.addEventListener('pointerup',release);
function startSpring(){
 if(anim)return;let previous=performance.now();
 function frame(now){let moving=false;const dt=Math.min(1.8,Math.max(.35,(now-previous)/16.667));previous=now;
  for(const s of cart){if(drag?.uid===s.uid)continue;const targets={x:s.tx??s.x,y:s.ty??s.y,angle:s.ta??s.angle,scale:s.ts??s.scale};
   const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
   for(const [key,velocity,force,damping] of [['x','vx',.09,.76],['y','vy',.105,.73],['angle','va',.055,.82],['scale','vs',.09,.76]]){
    const delta=targets[key]-s[key];if(!reduced&&(Math.abs(delta)>(key==='scale'?.001:.08)||Math.abs(s[velocity]||0)>.03)){
     s[velocity]=((s[velocity]||0)+delta*force*dt)*Math.pow(damping,dt);s[key]+=s[velocity]*dt;moving=true;
    }else{s[key]=targets[key];s[velocity]=0}
   }
   const g=document.querySelector(`[data-uid="${s.uid}"]`);if(g)g.setAttribute('transform',transform(s));
  }
  renderGlassStems();if(moving)anim=requestAnimationFrame(frame);else{anim=0;renderStems()}
 }
 anim=requestAnimationFrame(frame);
}
function keepAtelierInView(){if(!matchMedia('(max-width:760px)').matches||scene!=='studio')return;const top=$('#studio').getBoundingClientRect().top+window.scrollY-document.querySelector('.site-header').offsetHeight;window.scrollTo({top:Math.max(0,top),behavior:'instant'})}
function haptic(type='tap'){if(!feedbackEnabled||typeof navigator.vibrate!=='function')return;try{navigator.vibrate(type==='insert'?[9,20,6]:6)}catch(e){}}
function selectPresentation(id,animate=true){
 const def=PRESENTATIONS[id];if(!def)return;currentPresentation=id;mouth.x=def.mouth[0];mouth.y=def.mouth[1];const silhouette=$('#vesselSilhouette path');silhouette.setAttribute('d',def.silhouette||'M0 0H900V750H0Z');silhouette.setAttribute('clip-rule','evenodd');silhouette.setAttribute('fill-rule','evenodd');if(def.silhouette){silhouette.setAttribute('transform',`translate(${def.box[0]} ${def.box[1]}) scale(${def.box[2]/def.size[0]} ${def.box[3]/def.size[1]})`)}else silhouette.removeAttribute('transform');
 for(const selector of ['#vesselBack','#vesselFrontImage']){const image=$(selector);image.setAttribute('href',def.src);['x','y','width','height'].forEach((key,i)=>image.setAttribute(key,def.box[i]))}
 const [left,ly,right,ry,control]=def.lip;$('#vaseFront path').setAttribute('d',def.frontPath||`M ${def.box[0]-5} ${ly} L ${left} ${ly} Q ${mouth.x} ${control} ${right} ${ry} L 900 750 L 0 750 Z`);$('#stemArea path').setAttribute('d','M0 0H900V750H0Z');
 $('#insertionGuide').setAttribute('cy',String((ly+control)/2));$('#insertionGuide').setAttribute('rx',String((right-left)*.39));
 document.querySelectorAll('.presentation-card[data-presentation]').forEach(b=>{const selected=b.dataset.presentation===id;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});
 const workspace=$('.workspace');workspace.dataset.presentation=id;
 for(const s of cart){s.anchorVersion=3;s.tx=mouth.x+Math.sin(s.angle*Math.PI/180)*14;s.ty=mouth.y;s.ta=s.angle;s.ts=s.scale;if(!animate){s.x=s.tx;s.y=s.ty}}
 if(animate){workspace.classList.remove('presentation-changing');void workspace.offsetWidth;workspace.classList.add('presentation-changing');renderStems();startSpring();haptic('tap')}else renderStems();
 const label=$('#presentationName');if(label)label.textContent=def.name;$('#vesselFrontImage').setAttribute('opacity',def.glass?(id==='amber'?.24:.19):1);renderGlassStems();renderCart();if(animate)keepAtelierInView();
}
function renderCart(){const root=$('#cart');root.replaceChildren();if(!cart.length){const p=document.createElement('p');p.className='empty-cart';p.textContent='Tu historia empieza con una flor. Elige la primera en el catálogo.';root.append(p)}cart.forEach((s,i)=>{const f=flowers.find(f=>f.id===s.id);const row=document.createElement('div');row.className='cart-row';const name=document.createElement('span');name.textContent=f.name;const right=document.createElement('span');right.textContent=money(f.price)+' ';const del=document.createElement('button');del.innerHTML=efIcon('close');del.setAttribute('aria-label','Quitar '+f.name);del.onclick=()=>{snapshot();cart.splice(i,1);if(selected===s.uid)selected=null;renderAll()};right.append(del);row.append(name,right);root.append(row)});$('#count').textContent=cart.length;if(packagingFee()){const row=document.createElement('div');row.className='cart-row packaging-charge';const label=document.createElement('span');label.textContent=PRESENTATIONS[currentPresentation].name+' · envoltorio';const price=document.createElement('span');price.textContent=money(packagingFee());row.append(label,price);root.append(row)}$('#total').textContent=money(compositionTotal())}
function modify(fn){const s=cart.find(s=>s.uid===selected);if(!s)return;snapshot();fn(s);s.ta=s.angle;s.ts=s.scale;s.tx=s.x;s.ty=s.y;renderStems();renderCart();haptic('tap')}
$('#rotateLeft').onclick=()=>modify(s=>s.angle=clamp(s.angle-9,-65,65));$('#rotateRight').onclick=()=>modify(s=>s.angle=clamp(s.angle+9,-65,65));$('#smaller').onclick=()=>modify(s=>s.scale=clamp(s.scale-.06,.45,1.15));$('#larger').onclick=()=>modify(s=>s.scale=clamp(s.scale+.06,.45,1.15));$('#remove').onclick=()=>modify(s=>{cart=cart.filter(x=>x.uid!==s.uid);selected=null});$('#undo').onclick=()=>{if(!undoStack.length)return;redoStack.push(JSON.stringify(cart));cart=JSON.parse(undoStack.pop());selected=null;renderAll()};$('#reset').onclick=()=>{snapshot();cart=[];selected=null;renderAll();toast('El lienzo está vacío.')};
$('#save').onclick=async()=>{
 const btn=$('#save');btn.disabled=true;
 try{
  const svg=$('#arrangement').cloneNode(true);
  const images=[...svg.querySelectorAll('image')];
  await Promise.all(images.map(async el=>{
   const href=el.getAttribute('href');if(!href)return;
   const response=await fetch(href);if(!response.ok)throw new Error('Asset missing: '+href);
   const blob=await response.blob();
   const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
   el.setAttribute('href',data);
  }));
  svg.setAttribute('xmlns',svgns);svg.setAttribute('width','900');svg.setAttribute('height','750');
  const blob=new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml;charset=utf-8'});
  const url=URL.createObjectURL(blob);const img=new Image();
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});
  const canvas=document.createElement('canvas');canvas.width=1800;canvas.height=1500;
  const ctx=canvas.getContext('2d');ctx.scale(2,2);ctx.drawImage(img,0,0,900,750);
  URL.revokeObjectURL(url);
  const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!png)throw new Error('PNG conversion failed');
  const download=URL.createObjectURL(png),a=document.createElement('a');a.href=download;
  a.download='entre-flores-'+($('#ramoName').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-')||'mi-ramo')+'.png';a.click();
  setTimeout(()=>URL.revokeObjectURL(download),5000);toast('Imagen PNG exportada con todas las flores.');
 }catch(e){console.error(e);toast('No se pudo exportar. Abre el proyecto desde un servidor local.')}finally{btn.disabled=false}
};
$('#checkoutButton').onclick=()=>{const lines=$('#orderLines');lines.replaceChildren();cart.forEach(s=>{const f=flowers.find(f=>f.id===s.id),p=document.createElement('p');p.textContent=f.name+' — '+money(f.price);lines.append(p)});if(packagingFee()){const p=document.createElement('p');p.className='packaging-charge';p.textContent=PRESENTATIONS[currentPresentation].name+' · envoltorio — '+money(packagingFee());lines.append(p)}$('#orderTotal').textContent='Total: '+money(compositionTotal());$('#confirmDemo').disabled=!cart.length;$('#confirmation').textContent='';$('#orderDialog').showModal()};$('#closeOrder').onclick=()=>$('#orderDialog').close();$('#confirmDemo').onclick=()=>{$('#confirmation').textContent='Simulación confirmada. No se ha efectuado ningún pago.'};
renderGarden();renderAll();

// Accessibility and browsing polish.
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&$('#detail').classList.contains('open')){$('#closeDetail').click();return}
 if(scene!=='studio'||!selected||['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;
 const delta=e.shiftKey?12:4;
 const directions={ArrowLeft:[-delta,0],ArrowRight:[delta,0],ArrowUp:[0,-delta],ArrowDown:[0,delta]};
 if(directions[e.key]){e.preventDefault();modify(s=>{s.angle=clamp(s.angle+directions[e.key][0],-65,65);s.scale=clamp(s.scale-directions[e.key][1]*.008,.45,1.15);s.x=mouth.x;s.y=mouth.y;s.tx=s.x;s.ty=s.y;s.inserted=true})}
 if((e.key==='Delete'||e.key==='Backspace')&&document.activeElement.tagName!=='BUTTON'){$('#remove').click()}
});
$('#detail').setAttribute('aria-hidden','true');

// Editorial collection and services: functional category filtering and bouquet-to-builder flow.
const editorialBouquets=[
 {name:'Luz de primavera',price:38,cat:'temporada',image:'ramo-primavera',flowers:['peony','anemone','eucalyptus']},
 {name:'Tarde en Madrid',price:52,cat:'cotidianos',image:'ramo-madrid',flowers:['rose','dahlia','olive']},
 {name:'Brisa silvestre',price:45,cat:'temporada',image:'ramo-brisa',flowers:['anemone','queen-annes-lace','eucalyptus']},
 {name:'Rojo íntimo',price:60,cat:'especiales',image:'ramo-rojo',flowers:['rose','dahlia','burgundy-foliage']},
 {name:'Ramo poético',price:48,cat:'especiales',image:'ramo-poetico',flowers:['peony','rose','sweet-pea']}
];
function renderBouquets(category='all'){
 const root=document.getElementById('bouquetGrid');root.replaceChildren();
 editorialBouquets.filter(b=>category==='all'||b.cat===category).forEach(b=>{
 const card=document.createElement('article');card.className='bouquet-card';
 const photo=document.createElement('div');photo.className='bouquet-photo';
 const img=document.createElement('img');img.src=`assets/editorial/${b.image}.webp`;img.alt=`Ramo ${b.name}`;img.loading='lazy';photo.append(img);
 const title=document.createElement('h3');title.textContent=b.name;
 const price=document.createElement('p');price.textContent=`Desde € ${b.price}`;
 const btn=document.createElement('button');btn.innerHTML='Inspirarme en este ramo '+efIcon('arrow');
 btn.onclick=()=>{b.flowers.forEach(id=>add(id));go('studio');};
 card.append(photo,title,price,btn);root.append(card);
 });
}
document.querySelectorAll('[data-bouquet]').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('[data-bouquet]').forEach(x=>x.classList.toggle('selected',x===b));renderBouquets(b.dataset.bouquet);
}));
renderBouquets();

// Responsive navigation, deep links and keyboard access.
const menuButton=document.querySelector('.mobile-menu');menuButton.onclick=()=>{const open=document.querySelector('nav').classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open))};
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(document.getElementById(id)&&id!==scene)go(id)});
if(location.hash&&document.querySelector('.scene'+location.hash))go(location.hash.slice(1));else go('home',false);
$('#detail').addEventListener('keydown',e=>{if(e.key==='Tab'){const all=[...$('#detail').querySelectorAll('button')];if(e.shiftKey&&document.activeElement===all[0]){e.preventDefault();all.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===all.at(-1)){e.preventDefault();all[0].focus()}}});

window.addEventListener('beforeunload',()=>{try{sessionStorage.setItem('ef-working-draft',JSON.stringify({cart,name:$('#ramoName').value,presentation:currentPresentation}))}catch(e){}});try{const draft=JSON.parse(sessionStorage.getItem('ef-working-draft')||'null');if(draft&&Array.isArray(draft.cart)){cart=draft.cart.filter(s=>flowers.some(f=>f.id===s.id));$('#ramoName').value=draft.name||'';if(PRESENTATIONS[draft.presentation])selectPresentation(draft.presentation,false);renderAll()}}catch(e){}

// Subtle true perspective on the separate foreground floral sculpture.
const homeScene=$('#home');let heroPointer={x:0,y:0},heroSmooth={x:0,y:0};
homeScene.addEventListener('pointermove',e=>{const box=homeScene.getBoundingClientRect();heroPointer.x=(e.clientX-box.left)/box.width-.5;heroPointer.y=(e.clientY-box.top)/box.height-.5});
homeScene.addEventListener('pointerleave',()=>{heroPointer={x:0,y:0}});
function heroDepth(){if(scene==='home'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){heroSmooth.x+=(heroPointer.x-heroSmooth.x)*.055;heroSmooth.y+=(heroPointer.y-heroSmooth.y)*.055;homeScene.style.setProperty('--hx',(heroSmooth.x*23).toFixed(2)+'px');homeScene.style.setProperty('--hy',(heroSmooth.y*17).toFixed(2)+'px');homeScene.style.setProperty('--hr',(heroSmooth.x*3.5).toFixed(2)+'deg')}requestAnimationFrame(heroDepth)}requestAnimationFrame(heroDepth);

requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));

$('#backOrder').onclick=()=>$('#orderDialog').close();
