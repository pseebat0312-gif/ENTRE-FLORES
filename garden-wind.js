'use strict';
// The same photographic garden moves gently across four independently generated seasons.
(()=>{
 const canvas=document.getElementById('livingGarden'),stage=document.querySelector('.garden-stage'),pan=document.querySelector('.garden-panorama'),garden=document.getElementById('garden');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),ctx=canvas.getContext('2d',{alpha:false});
 const texture=document.createElement('canvas'),paint=texture.getContext('2d'),cache=new Map();
 let current=null,imageWidth=1536,imageHeight=1024,centered=false,dirty=true,w=0,h=0,last=0,clock=0,request=0;
 function positionFlowers(){
  const width=stage.clientWidth,height=stage.clientHeight;if(width>0&&innerWidth<760&&!centered){pan.scrollLeft=Math.max(0,(width-pan.clientWidth)*.55);centered=true}
  const cover=Math.max(width/imageWidth,height/imageHeight),iw=imageWidth*cover,ih=imageHeight*cover;
  for(const b of stage.querySelectorAll('.garden-flower-hit')){
   const x=Number(b.style.getPropertyValue('--gx'))/100,y=Number(b.style.getPropertyValue('--gy'))/100;
   b.style.left=(x*iw+(width-iw)/2)+'px';b.style.top=(y*ih+(height-ih)/2)+'px';
   if(b.classList.contains('garden-specimen')){const ph=Number(b.style.getPropertyValue('--plant-height'))*ih/100;b.style.height=ph+'px';b.style.width=(ph*.584)+'px';if(b.dataset.originalWhite==='true')b.style.top=Math.min(y*ih+(height-ih)/2,height+ph*.59)+'px'}else{const r=Number(b.style.getPropertyValue('--radius'))||3;b.style.width=(r*iw/100)+'px';b.style.height=(r*iw/100)+'px'}
  }
  window.dispatchEvent(new Event('ef:gardenposition'));
 }
 function load(src){if(cache.has(src))return cache.get(src);const promise=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src});cache.set(src,promise);return promise}
 async function change(def,transition=true){
  const token=++request;garden.classList.add('season-loading');garden.setAttribute('aria-busy','true');
  try{const image=await load(def.src);if(token!==request)return;
   if(transition&&current&&!reduced.matches){const old=document.createElement('img');old.src=current.src;old.alt='';old.className='garden-season-veil';stage.append(old);requestAnimationFrame(()=>requestAnimationFrame(()=>old.classList.add('fade')));setTimeout(()=>old.remove(),900)}
   current=image;imageWidth=image.naturalWidth;imageHeight=image.naturalHeight;dirty=true;stage.querySelector('.garden-bg').style.backgroundImage=`url("${def.src}")`;canvas.dataset.season=def.key;positionFlowers();
   garden.classList.remove('season-loading');garden.setAttribute('aria-busy','false');
  }catch(e){if(token===request){garden.classList.remove('season-loading');garden.setAttribute('aria-busy','false');document.getElementById('seasonCaption').textContent='No se pudo cargar el jardín. Vuelve a elegir la estación.'}}
 }
 new ResizeObserver(()=>{dirty=true;positionFlowers()}).observe(stage);
 new MutationObserver(positionFlowers).observe(document.getElementById('gardenFlowers'),{childList:true});
 window.addEventListener('ef:seasonchange',e=>change(e.detail));
 change({key:'spring',src:SEASON_SCENES.Primavera.src},false);
 setTimeout(()=>Object.values(SEASON_SCENES).forEach(def=>load(def.src).catch(()=>{})),800);
 const mobileGarden=matchMedia('(max-width:760px)').matches;const cols=mobileGarden?12:22,rows=mobileGarden?8:14;
 function triangle(a,b,c,sx,sy,dx,dy){const aa=(b.x-a.x)/dx,bb=(b.y-a.y)/dx,cc=(c.x-a.x)/dy,dd=(c.y-a.y)/dy;ctx.save();ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();ctx.clip();ctx.setTransform(aa,bb,cc,dd,a.x-aa*sx-cc*sy,a.y-bb*sx-dd*sy);ctx.drawImage(texture,0,0);ctx.restore()}
 function frame(now){
  requestAnimationFrame(frame);if(!ctx||!current||document.hidden||!garden.classList.contains('active')||now-last<48)return;
  const delta=last?Math.min(100,now-last):0;last=now;if(!reduced.matches)clock+=delta*.001;
  const nw=Math.round(stage.clientWidth),nh=Math.round(stage.clientHeight);if(!nw||!nh)return;
  if(w!==nw||h!==nh||dirty){w=nw;h=nh;canvas.width=w;canvas.height=h;texture.width=w;texture.height=h;const cover=Math.max(w/current.width,h/current.height);paint.drawImage(current,(w-current.width*cover)/2,(h-current.height*cover)/2,current.width*cover,current.height*cover);dirty=false}
  if(reduced.matches){ctx.drawImage(texture,0,0);canvas.classList.add('ready');return}
  const cw=w/cols,ch=h/rows,points=[];
  for(let y=0;y<=rows;y++){const line=[];for(let x=0;x<=cols;x++){
   const px=x/cols,py=y/rows,canopy=Math.max(0,1-py/.5),bed=Math.max(0,Math.min(1,(py-.42)/.24))*Math.min(1,Math.max(0,(px-.2)/.17))*(1-Math.max(0,(py-.9)/.1));
   const edge=Math.min(1,x,y,cols-x,rows-y),stone=px<.22&&py>.35?.06:1;
   const wind=Math.sin(clock*.69+px*5.3)*.65+Math.sin(clock*1.13+px*9)*.25+Math.sin(clock*1.32+px*34)*.15;
   line.push({x:x*cw+wind*(canopy*.65+bed*1.05)*edge*stone,y:y*ch+Math.sin(clock*.83+px*14)*bed*.18*edge});
  }points.push(line)}
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(texture,0,0);
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){triangle(points[y][x],points[y][x+1],points[y+1][x],x*cw,y*ch,cw,ch);triangle(points[y+1][x+1],points[y+1][x],points[y][x+1],(x+1)*cw,(y+1)*ch,-cw,-ch)}
  canvas.classList.add('ready');canvas.dataset.windRenderer='seasonal-canvas-mesh';canvas.dataset.windFrame=String(Math.round(clock*100));
 }
 requestAnimationFrame(frame);positionFlowers();
})();
