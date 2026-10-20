(()=>{
 const slides=[...document.querySelectorAll('[data-slide]')],stage=document.querySelector('.stage'),canvas=document.querySelector('.canvas'),prev=document.querySelector('[data-prev-slide]'),next=document.querySelector('[data-next-slide]'),output=document.querySelector('output');let current=0;
 function resize(){const r=stage.getBoundingClientRect();canvas.style.transform=`translate(-50%,-50%) scale(${Math.min(r.width/1440,r.height/810)})`;}
 function show(n,hash=true){current=Math.max(0,Math.min(slides.length-1,n));slides.forEach((s,i)=>s.hidden=i!==current);prev.disabled=current===0;next.disabled=current===slides.length-1;output.textContent=`${current+1} / ${slides.length}`;document.querySelector('.progress i').style.width=(current+1)/slides.length*100+'%';if(hash)history.replaceState(null,'','#'+slides[current].id);resize();}
 prev.onclick=()=>show(current-1);next.onclick=()=>show(current+1);
 document.querySelectorAll('[data-go-slide]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const n=slides.findIndex(s=>s.id===a.dataset.goSlide);if(n>=0)show(n);}));
 window.addEventListener('resize',resize);window.addEventListener('hashchange',()=>show(Math.max(0,slides.findIndex(s=>s.id===location.hash.slice(1))),false));
 window.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();show(current+1);}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1);}if(e.key==='Home')show(0);if(e.key==='End')show(slides.length-1);});
 show(Math.max(0,slides.findIndex(s=>s.id===location.hash.slice(1))),false);document.fonts.ready.then(resize);
})();
