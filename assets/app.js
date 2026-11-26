(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const C=JSON.parse($('#cfg').textContent),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const st=(k,v)=>{try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){return null}};
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach((el,i)=>{el.style.setProperty('--d',[...el.parentElement.children].indexOf(el)%6);io.observe(el)});
// header hide/show (transform only, hysteresis)
const H=$('[data-header]');let ly=scrollY,tk=false;
addEventListener('scroll',()=>{if(tk)return;tk=true;requestAnimationFrame(()=>{const y=scrollY,d=y-ly;
if(document.body.classList.contains('menu-open')||y<80)H.classList.remove('is-hidden');else if(d>10){H.classList.add('is-hidden');ly=y}else if(d<-10){H.classList.remove('is-hidden');ly=y}tk=false})},{passive:true});
// mobile menu
const B=$('.burger');B&&B.addEventListener('click',()=>{const o=document.body.classList.toggle('menu-open');B.setAttribute('aria-expanded',o);B.setAttribute('aria-label',o?'Close menu':'Open menu')});
$$('.mmenu a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));
addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('menu-open')});
// open status + hours (America/Chicago)
const now=()=>{const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:C.tz,weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date()).map(x=>[x.type,x.value]));
return{d:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday),m:(+p.hour%24)*60+ +p.minute}};
const fmt=h=>{const x=h%12||12;return x+(h<12||h===24?' AM':' PM')};
const t=now(),hr=C.hours[t.d];let txt;
if(hr&&t.m>=hr[0]*60&&t.m<hr[1]*60)txt='Open now · until '+fmt(hr[1]);else{let n=1;while(n<8&&!C.hours[(t.d+n)%7])n++;const nh=C.hours[(t.d+n)%7];txt=hr&&t.m<hr[0]*60?'Closed · opens '+fmt(hr[0]):'Closed · opens '+['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][(t.d+n)%7]+' '+fmt(nh[0]);$$('[data-open-status]').forEach(s=>s.classList.add('closed'))}
$$('[data-open-status] span:last-child').forEach(s=>s.textContent=txt);$$('[data-day]').forEach(l=>+l.dataset.day===t.d&&l.classList.add('today'));
// hero pet selector + tilt
const hs=$('[data-hero]');if(hs){const cap=$('.cap',hs),btns=$$('.sel button',hs);btns.forEach(b=>b.addEventListener('click',()=>{btns.forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.stage>*',hs).forEach(el=>el.classList.toggle('on',el.dataset.pet===b.dataset.pet));cap.textContent=b.dataset.cap}));
}
// smooth pointer engine: lerped parallax, magnetic buttons, card spotlight
if(!RM&&matchMedia('(pointer:fine)').matches){const P={x:0,y:0},T={x:0,y:0};addEventListener('pointermove',e=>{T.x=e.clientX/innerWidth-.5;T.y=e.clientY/innerHeight-.5},{passive:true});
const dep=$$('[data-depth]').map(el=>({el,d:+el.dataset.depth})),mag=$$('.btn--lg,.btn--md').map(el=>({el,x:0,y:0,tx:0,ty:0}));
mag.forEach(m=>{m.el.addEventListener('pointermove',e=>{const r=m.el.getBoundingClientRect();m.tx=(e.clientX-r.left-r.width/2)/r.width*14;m.ty=(e.clientY-r.top-r.height/2)/r.height*8});m.el.addEventListener('pointerleave',()=>{m.tx=m.ty=0})});
$$('.card,.tile').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}));
const tick=()=>{P.x+=(T.x-P.x)*.05;P.y+=(T.y-P.y)*.05;dep.forEach(o=>o.el.style.translate=`${P.x*o.d}px ${P.y*o.d*.6}px`);mag.forEach(m=>{m.x+=(m.tx-m.x)*.14;m.y+=(m.ty-m.y)*.14;m.el.style.translate=`${m.x}px ${m.y}px`});requestAnimationFrame(tick)};tick()}
// marquee pause
$$('.pause').forEach(b=>b.addEventListener('click',()=>{const p=b.previousElementSibling.parentElement.classList.toggle('paused');b.textContent=p?'Play motion':'Pause motion';b.setAttribute('aria-pressed',p)}));
// services filter
$$('[data-filter] button').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter] button').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('[data-tags]').forEach(c=>{c.hidden=b.dataset.f!=='all'&&!c.dataset.tags.includes(b.dataset.f)})}));
// consent + map
const bn=$('.consent');let cv=null;try{cv=JSON.parse(st('kohn-consent'))}catch(e){}
const save=m=>{st('kohn-consent',JSON.stringify({v:1,t:Date.now(),map:m}));cv={map:m};bn.classList.remove('on')};
const show=()=>{bn.classList.add('on');$('button',bn).focus()};
if(!cv)(navigator.globalPrivacyControl?save(false):setTimeout(show,900));
$('[data-acc]').onclick=()=>save(true);$('[data-rej]').onclick=()=>save(false);$('[data-cus]').onclick=()=>{$('.opt',bn).hidden=false;$('[data-cus]').hidden=true;$('[data-sv]').hidden=false};$('[data-sv]').onclick=()=>save($('#cmap').checked);
$$('[data-privacy]').forEach(b=>b.addEventListener('click',()=>{$('.opt',bn).hidden=true;$('[data-cus]').hidden=false;$('[data-sv]').hidden=true;show()}));
bn.addEventListener('keydown',e=>{if(e.key==='Escape')bn.classList.remove('on')});
$$('[data-map]').forEach(b=>b.addEventListener('click',()=>{if(!cv||!cv.map){show();return}const m=b.closest('.map');m.innerHTML=`<iframe title="Map of Kohn Animal Hospital" loading="lazy" src="https://www.google.com/maps?q=${encodeURIComponent(C.addr)}&output=embed"></iframe>`}));
// newsletter stub
$$('[data-news]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();if(!f.agree.checked){$('.err',f).textContent='Please tick the box so we can email you.';return}$('.err',f).textContent='Check your inbox to confirm.';f.reset()}));
// wizard (stub: nothing is sent)
const w=$('[data-wiz]');if(w){const fs=$$('fieldset',w),bar=$('.bar2 i',w);let i=0;
const days=$('#days'),dn=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];for(let k=0;k<14;k++){const d=new Date(Date.now()+k*864e5),dow=new Date(d.toLocaleString('en-US',{timeZone:C.tz})).getDay();const lab=document.createElement('label'),v=d.toLocaleDateString('en-US',{timeZone:C.tz,month:'short',day:'numeric'});lab.innerHTML=`<input type="radio" name="day" value="${v}" ${C.hours[dow]?'':'disabled'}><span>${dn[dow]} ${v}</span>`;days.append(lab)}
const go=n=>{i=n;fs.forEach((f,k)=>f.classList.toggle('on',k===n));bar.style.width=(n+1)*25+'%';$('legend',fs[n]).focus()};
const need=n=>{const f=fs[n],e=$('.err',f);let m='';if(n<3&&!$('input:checked',f)&&n<2)m='Please pick one option to continue.';if(n===2&&(!$('[name=day]:checked',f)||!$('[name=part]:checked',f)))m='Please choose a day and a time of day.';if(n===3){const nm=$('[name=name]',f).value.trim(),ph=$('[name=phone]',f).value.replace(/\D/g,'');if(!nm)m='Please tell us your name.';else if(ph.length<10)m='Please enter a phone number we can call.';else if(!$('[name=consent]',f).checked)m='Please agree to the Privacy Policy so we can contact you.'}e.textContent=m;return!m};
$$('[data-next]',w).forEach(b=>b.addEventListener('click',()=>need(i)&&go(i+1)));$$('[data-back]',w).forEach(b=>b.addEventListener('click',()=>go(i-1)));
$$('input,textarea',w).forEach(x=>x.addEventListener('blur',()=>{if(x.type==='text'||x.type==='tel')need(i)}));
w.addEventListener('submit',e=>{e.preventDefault();if($('[name=hp]',w).value||!need(3))return;fs.forEach(f=>f.classList.remove('on'));$('.bar2',w).hidden=true;const o=$('.ok',w);o.classList.add('on');$('h2',o).focus()})}
})();
