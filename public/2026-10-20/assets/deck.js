(()=>{
 const slides=[...document.querySelectorAll('[data-slide]')],stage=document.querySelector('.stage'),canvas=document.querySelector('.canvas'),prev=document.querySelector('[data-prev-slide]'),next=document.querySelector('[data-next-slide]'),output=document.querySelector('output');let current=0;
 function resize(){if(innerWidth<=650){canvas.style.transform='none';return;}const r=stage.getBoundingClientRect();canvas.style.transform=`translate(-50%,-50%) scale(${Math.min(r.width/1440,r.height/810)})`;}
 function show(n,hash=true){current=Math.max(0,Math.min(slides.length-1,n));slides.forEach((s,i)=>s.hidden=i!==current);prev.disabled=current===0;next.disabled=current===slides.length-1;output.textContent=`${current+1} / ${slides.length}`;document.querySelector('.progress i').style.width=(current+1)/slides.length*100+'%';if(hash)history.replaceState(null,'','#'+slides[current].id);document.querySelectorAll('.reader>header nav a[href^="../"]').forEach(a=>{a.hash=slides[current].id});resize();if(innerWidth<=650)window.scrollTo(0,0);}
 prev.onclick=()=>show(current-1);next.onclick=()=>show(current+1);
 document.querySelectorAll('[data-go-slide]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const n=slides.findIndex(s=>s.id===a.dataset.goSlide);if(n>=0)show(n);}));
 const tabs=[...document.querySelectorAll('[data-toc-tab]')],panels=[...document.querySelectorAll('[data-toc-panel]')];
 function selectTab(index,focus=false){tabs.forEach((t,i)=>{t.setAttribute('aria-selected',String(i===index));t.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});if(focus)tabs[index].focus();}
 tabs.forEach((t,i)=>{t.onclick=()=>selectTab(i);t.onkeydown=e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();e.stopPropagation();selectTab(e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length,true);}}});
 window.addEventListener('resize',resize);window.addEventListener('hashchange',()=>show(Math.max(0,slides.findIndex(s=>s.id===location.hash.slice(1))),false));
 window.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();show(current+1);}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1);}if(e.key==='Home')show(0);if(e.key==='End')show(slides.length-1);});
 show(Math.max(0,slides.findIndex(s=>s.id===location.hash.slice(1))),false);document.fonts.ready.then(resize);
})();
