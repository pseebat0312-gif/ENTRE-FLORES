'use strict';
(()=>{
 const hero=document.createElement('div');hero.className='independent-hero';hero.setAttribute('aria-hidden','true');document.getElementById('home').append(hero);
 // Every entry is one transparent botanical photograph with its own wind phase.
 const beds=[
 ['eucalyptus',59,125,-23,27,0],['olive',80,126,-27,-18,0],['babys-breath',90,108,-18,12,0],['stock',69,114,-22,-14,0],['sweet-pea',94,132,-28,20,0],['eucalyptus',102,140,-31,-10,0],
 ['rose',58,132,-39,-16,1],['peony',74,143,-42,8,1],['hydrangea',90,122,-30,-9,1],['ranunculus',99,129,-36,13,1],['cosmos',85,142,-35,19,1],['anemone',67,107,-29,-12,1],['stock',105,115,-30,10,1],['waxflower',54,107,-28,-18,1],
 ['peony',60,163,-65,-10,2],['rose',79,153,-58,12,2],['anemone',94,144,-54,-17,2],['ranunculus',108,155,-59,8,2],['cosmos',71,122,-44,18,2],['sweet-pea',86,116,-38,-9,2],['eucalyptus',50,124,-48,-23,2],['babys-breath',100,112,-34,16,2],
 ['rose',105,171,-83,-18,3],['peony',85,161,-81,17,3],['anemone',64,135,-60,-17,3],['ranunculus',57,106,-43,18,3],['cosmos',93,100,-36,11,3],['waxflower',75,103,-48,-12,3]
 ];
 for(const [i,[id,x,h,b,angle,plane]] of beds.entries()){
  const plant=document.createElement('span');plant.className='hero-plant plane-'+plane;plant.style.cssText=`--x:${x}%;--height:${h}%;--bottom:${b}%;--angle:${angle}deg;--wind:${(.55+i%5*.33).toFixed(2)}deg;--duration:${(7.7+i*1.29%10).toFixed(2)}s;--delay:${(-i*1.73).toFixed(2)}s;--plant-z:${plane*10+i%6};`;
  const img=document.createElement('img');img.src=`assets/flowers/${id}.png`;img.alt='';img.draggable=false;plant.append(img);hero.append(plant);
 }
 // Preserve the original botanical coordinates. Only clipped petals may cross the edge.
 const garden=document.getElementById('garden'),pan=garden.querySelector('.garden-panorama'),stage=garden.querySelector('.garden-stage');
 const portal=document.createElement('div');portal.className='garden-petal-overflow';garden.append(portal);
 function syncPetals(){
  portal.replaceChildren();if(!garden.clientHeight||matchMedia('(max-width:760px)').matches)return;
  const gr=garden.getBoundingClientRect(),sr=stage.getBoundingClientRect();
  document.querySelectorAll('#gardenFlowers [data-original-white="true"]').forEach(original=>{
   const copy=original.cloneNode(true);copy.classList.add('petal-continuation');copy.removeAttribute('tabindex');copy.setAttribute('aria-hidden','true');copy.style.left=(sr.left-gr.left+parseFloat(original.style.left))+'px';copy.style.top=(sr.top-gr.top+parseFloat(original.style.top))+'px';
   // Keep only the flower head, never its stem or leaves, outside the original scene.
   copy.querySelector('.specimen-stem').style.clipPath='inset(0 0 56% 0)';portal.append(copy);const sourceWind=original.querySelector('.specimen-stem').getAnimations()[0],copyWind=copy.querySelector('.specimen-stem').getAnimations()[0];if(sourceWind&&copyWind)copyWind.currentTime=sourceWind.currentTime;
  });
 }
 new ResizeObserver(syncPetals).observe(stage);pan.addEventListener('scroll',syncPetals,{passive:true});
 window.addEventListener('ef:gardenposition',syncPetals);window.addEventListener('ef:gardenrender',()=>requestAnimationFrame(syncPetals));
 syncPetals();
 const plants=[...hero.querySelectorAll('.hero-plant')].map((el,i)=>({el,img:el.querySelector('img'),phase:i*1.73,period:6.1+(i*1.39)%7.7,amplitude:1.25+(i%6)*.39,direction:i%2?-1:1,theta:0,velocity:0,omega:2.1+(i%5)*.16,sag:['rose','peony','hydrangea'].includes(beds[i][0])?2.7:1.1}));
 let previous=performance.now();const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function breeze(now){
  const dt=Math.min(.045,Math.max(.001,(now-previous)/1000));previous=now;
  if(scene==='home'&&!document.hidden&&!reduced.matches){const t=now/1000;
   for(const p of plants){const target=p.direction*p.amplitude*(Math.sin(t*6.283/p.period+p.phase)+.18*Math.sin(t*6.283/(p.period*1.83)+p.phase*.7));const gravity=.36*Math.sin(p.theta*Math.PI/180);const acceleration=(target-p.theta)*p.omega*p.omega-1.65*p.omega*p.velocity-gravity;p.velocity+=acceleration*dt;p.theta+=p.velocity*dt;p.img.style.transform=`rotate(${p.theta.toFixed(3)}deg) translateY(${(p.sag+Math.abs(p.theta)*.22).toFixed(2)}px)`;}
  }else if(reduced.matches){for(const p of plants)p.img.style.transform='none'}
  requestAnimationFrame(breeze);
 }
 requestAnimationFrame(breeze);
})();
