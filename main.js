
'use strict';

/* CURSOR */
const dot=document.querySelector('.c-dot'),ring=document.querySelector('.c-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
(function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
document.querySelectorAll('a,button,.info-card,.team-card,.why-card,.award-card,.val-card,.fa-item,.wt-row').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('hov'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('hov'));
});

/* PARTICLES */
const canvas=document.getElementById('pc'),ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();addEventListener('resize',resize);
const pts=Array.from({length:75},()=>({
  x:Math.random()*innerWidth,y:Math.random()*innerHeight,
  vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,
  r:Math.random()*1.7+.3,a:Math.random()*.45+.1
}));
const pal=['rgba(201,168,76,','rgba(123,47,247,','rgba(232,108,44,','rgba(240,208,128,'];
pts.forEach(p=>{p.c=pal[Math.floor(Math.random()*pal.length)]+p.a+')';});
(function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<pts.length;i++){
    for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<115){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(201,168,76,${.04*(1-d/115)})`;ctx.lineWidth=.5;ctx.stroke();}
    }
  }
  pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>canvas.width)p.vx*=-1;if(p.y<0||p.y>canvas.height)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c;ctx.fill();});
  requestAnimationFrame(draw);
})();

/* SCROLL PROGRESS */
const sp=document.getElementById('sp');
addEventListener('scroll',()=>{const s=scrollY,h=document.documentElement.scrollHeight-innerHeight;sp.style.width=(h>0?s/h*100:0)+'%';},{passive:true});

/* NAVBAR */
const navEl=document.getElementById('nav'),hbg=document.getElementById('hbg'),navLinks=document.getElementById('navLinks');
addEventListener('scroll',()=>navEl.classList.toggle('sc',scrollY>60),{passive:true});
hbg.addEventListener('click',()=>{hbg.classList.toggle('open');navLinks.classList.toggle('open');});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{hbg.classList.remove('open');navLinks.classList.remove('open');}));

/* BACK TOP */
const btt=document.getElementById('btt');
addEventListener('scroll',()=>btt.classList.toggle('show',scrollY>500),{passive:true});
btt.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

/* SCROLL REVEAL — all variants */
const obs=new IntersectionObserver(ents=>{
  ents.forEach(e=>{
    if(e.isIntersecting){
      const sibs=[...e.target.parentElement.children];
      const i=sibs.indexOf(e.target);
      setTimeout(()=>e.target.classList.add('vis'),i*75);
      obs.unobserve(e.target);
    }
  });
},{threshold:.1,rootMargin:'0px 0px -30px 0px'});

const obs2=new IntersectionObserver(ents=>{
  ents.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs2.unobserve(e.target);}});
},{threshold:.12});

document.querySelectorAll('.sr').forEach(el=>obs.observe(el));
document.querySelectorAll('.sr-left,.sr-right').forEach(el=>obs2.observe(el));

/* STATS COUNTER */
const counterObs=new IntersectionObserver(ents=>{
  ents.forEach(e=>{
    if(e.isIntersecting){
      const t=+e.target.dataset.target,s=performance.now();
      (function up(now){
        const p=Math.min((now-s)/2200,1),ease=1-Math.pow(1-p,3);
        e.target.textContent=Math.floor(ease*t).toLocaleString();
        if(p<1)requestAnimationFrame(up);else e.target.textContent=t.toLocaleString();
      })(performance.now());
      counterObs.unobserve(e.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('.stat-n').forEach(el=>counterObs.observe(el));

/* SMOOTH ANCHORS */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();scrollTo({top:t.offsetTop-80,behavior:'smooth'});}
  });
});

/* 3D TILT on why-cards */
document.querySelectorAll('.why-card,.info-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const cx=r.left+r.width/2,cy=r.top+r.height/2;
    const rx2=((e.clientY-cy)/(r.height/2))*-5;
    const ry2=((e.clientX-cx)/(r.width/2))*5;
    card.style.transform=`perspective(800px) rotateX(${rx2}deg) rotateY(${ry2}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='';card.style.transition='transform .5s ease';});
});

/* PARALLAX ON HERO RINGS */
function parallax(){
  const s=scrollY;
  const r1=document.querySelector('.h-ring1');
  const r2=document.querySelector('.h-ring2');
  const r3=document.querySelector('.h-ring3');
  if(r1)r1.style.transform=`translate(-50%,-50%) rotate(${s*.05}deg)`;
  if(r2)r2.style.transform=`translate(-50%,-50%) rotate(-${s*.07}deg)`;
  if(r3)r3.style.transform=`translate(-50%,-50%) rotate(${s*.1}deg)`;
}
addEventListener('scroll',parallax,{passive:true});
