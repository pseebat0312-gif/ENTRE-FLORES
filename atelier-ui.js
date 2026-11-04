'use strict';
(()=>{
 const root=document.getElementById('presentationOptions');
 for(const def of Object.values(PRESENTATIONS)){
  const button=document.createElement('button');button.dataset.presentation=def.id;button.className='presentation-card';button.setAttribute('aria-pressed',String(def.id===currentPresentation));if(def.id===currentPresentation)button.classList.add('selected');
  const img=document.createElement('img');img.src=def.src;img.alt='';if(def.thumb)img.style.clipPath=def.thumb;const name=document.createElement('strong');name.textContent=def.name;const note=document.createElement('small');note.textContent=def.note;const cost=document.createElement('span');cost.className='presentation-cost';cost.textContent=def.fee?'Envoltorio + '+money(def.fee):'Sin suplemento';const tick=document.createElement('span');tick.className='presentation-tick';tick.setAttribute('aria-hidden','true');tick.innerHTML=efIcon('check');button.append(img,name,note,cost,tick);
  button.onclick=()=>selectPresentation(def.id);root.append(button);
 }
 const workspace=document.querySelector('.workspace');const badge=document.createElement('div');badge.className='presentation-badge';badge.innerHTML='<span id="presentationName"></span><span class="presentation-gesture">Arrastra · gira · compón</span>';workspace.append(badge);
 document.querySelectorAll('[data-atelier-panel]').forEach(button=>button.onclick=()=>{
  const mode=button.dataset.atelierPanel;document.getElementById('studio').dataset.panel=mode;document.querySelectorAll('[data-atelier-panel]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  document.getElementById('presentationPanel').hidden=mode!=='presentation';document.getElementById('categoryTabs').hidden=mode==='presentation';document.getElementById('catalog').hidden=mode==='presentation';haptic('tap');keepAtelierInView();
 });
 const supported=typeof navigator.vibrate==='function';try{feedbackEnabled=localStorage.getItem('ef-haptics')!=='off'}catch(e){}
 const toggle=document.getElementById('hapticsToggle'),note=document.getElementById('feedbackNote');toggle.disabled=!supported;toggle.setAttribute('aria-pressed',String(supported&&feedbackEnabled));toggle.textContent=supported?'Vibración suave':'Respuesta visual';note.textContent=supported?'Un toque ligero al colocar cada tallo.':'Deslizamientos y una caída suave al colocar las flores.';
 toggle.onclick=()=>{feedbackEnabled=!feedbackEnabled;toggle.setAttribute('aria-pressed',String(feedbackEnabled));try{localStorage.setItem('ef-haptics',feedbackEnabled?'on':'off')}catch(e){}haptic('tap')};
 const receipt=document.querySelector('.receipt'),receiptToggle=document.getElementById('receiptToggle');receiptToggle.onclick=()=>{const expanded=receipt.classList.toggle('expanded');receiptToggle.setAttribute('aria-expanded',String(expanded));haptic('tap')};
 const mobileCanvas=matchMedia('(max-width:760px)');const fitCanvas=()=>document.getElementById('arrangement').setAttribute('preserveAspectRatio',mobileCanvas.matches?'xMidYMid slice':'xMidYMid meet');fitCanvas();mobileCanvas.addEventListener('change',fitCanvas);
 selectPresentation(currentPresentation,false);
})();
