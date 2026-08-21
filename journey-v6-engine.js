(function(){
  const years=window.TIAH_YEARS||[];
  const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
  if(!years.length||!$('#evolutionCanvas'))return;
  let current=years[0], raf=0, last=performance.now();
  const slider=$('#yearSlider'), stage=$('#yearStage'), canvas=$('#evolutionCanvas'), ctx=canvas.getContext('2d');
  const quick=$('#yearQuick'), rail=$('#yearRail');
  const lang=()=>window.state?.lang==='id'?'id':'en';
  const setText=(id,val)=>{const e=$(id);if(e)e.textContent=val};
  function setup(){
    slider.min=years[0].y; slider.max=years.at(-1).y;
    const min=years[0].y,max=years.at(-1).y;
    years.forEach((it,i)=>{const d=document.createElement('button');d.className='year-chip';d.dataset.year=it.y;d.textContent=it.y;d.onclick=()=>selectYear(it.y);quick.appendChild(d);const dot=document.createElement('button');dot.className='year-dot';dot.dataset.year=it.y;dot.style.left=((it.y-min)/(max-min)*100)+'%';dot.title=it.y;dot.onclick=()=>selectYear(it.y);rail.appendChild(dot);});
    renderYear(); resize(); requestAnimationFrame(loop);
  }
  function closest(y){let best=years[0];for(const it of years)if(Math.abs(it.y-y)<Math.abs(best.y-y))best=it;return best;}
  function selectYear(y){
    current=closest(Number(y)); slider.value=current.y;
    const idx=years.indexOf(current)+1; setText('#yearReadout',current.y);setText('#yearEra',current.era);setText('#yearIndex',String(idx).padStart(2,'0')+' / '+String(years.length).padStart(2,'0'));setText('#yearKicker',current.era);setText('#yearRange',current.y);setText('#yearTitle',lang()==='id'?current.idTitle:current.title);setText('#yearDesc',lang()==='id'?current.idDesc:current.desc);setText('#stageYearBig',current.y);setText('#stageSceneTitle',lang()==='id'?current.idTitle:current.title);setText('#stageCaption',current.caption);setText('#journeyYear',current.y);
    const facts=$('#yearFacts');facts.innerHTML=current.facts.map(x=>'<span>'+x+'</span>').join('');
    const p=(current.y-1990)/(2126-1990);setText('#yearProgressFill','');$('#yearProgressFill').style.width=(p*100)+'%';
    const human=Math.max(0,Math.round(100*(1-Math.max(0,current.y-2085)/41)));const complexity=Math.min(100,Math.round(4+(current.y-1990)/136*96));setText('#humanPresence',(current.y>=2089?'0%':human+'%'));setText('#networkComplexity',String(complexity).padStart(2,'0')+'%');
    let state='STABLE';if(current.y>=2088&&current.y<2090)state='WARNING';if(current.y>=2090&&current.y<2114)state='DEGRADED';if(current.y>=2114)state='RESTRICTED';if(current.y===2126)state='WATCHING';setText('#archiveState',state);
    setText('#stagePacket','PACKET DENSITY '+String(complexity).padStart(2,'0')+'%');
    stage.classList.toggle('collapse',current.y>=2089);const root=$('#journey');root.classList.toggle('phase-collapse',current.y>=2089);root.classList.toggle('phase-deep',current.y>=2110);root.classList.toggle('phase-final',current.y>=2126);
    $('#stageStatusDot').style.background=current.y>=2089?'#ff6571':'#9bf2ee';$('#stageStatusDot').style.boxShadow='0 0 14px '+(current.y>=2089?'#ff6571':'#8feeed');
    setText('#stageStatus',current.y===2126?'WATCHING':current.y>=2089?'SIGNAL LOST':'RECOVERING');
    $('.year-dot.active')?.classList.remove('active');$('.year-chip.active')?.classList.remove('active');$(`.year-dot[data-year="${current.y}"]`)?.classList.add('active');$(`.year-chip[data-year="${current.y}"]`)?.classList.add('active');
    if(window.remember)window.remember('YEAR:'+current.y);
    renderScene(true);
  }
  function renderYear(){selectYear(1990)}
  slider.addEventListener('input',e=>selectYear(e.target.value));
  $('#nextYearBtn').onclick=()=>{const i=years.indexOf(current);if(i<years.length-1)selectYear(years[i+1].y)};
  function resize(){const d=devicePixelRatio||1, r=canvas.getBoundingClientRect();canvas.width=Math.max(1,r.width*d);canvas.height=Math.max(1,r.height*d);ctx.setTransform(d,0,0,d,0,0)}
  addEventListener('resize',resize);
  function palette(y){if(y<2030)return {a:[132,238,238],b:[73,115,128],danger:false};if(y<2050)return {a:[158,146,255],b:[90,210,225],danger:false};if(y<2075)return {a:[91,223,190],b:[120,139,255],danger:false};if(y<2089)return {a:[250,205,106],b:[255,111,153],danger:false};if(y<2114)return {a:[255,87,105],b:[95,89,126],danger:true};if(y<2126)return {a:[140,110,190],b:[70,80,104],danger:true};return {a:[160,240,235],b:[255,90,108],danger:false}}
  function renderScene(instant){const r=canvas.getBoundingClientRect(),w=r.width,h=r.height;const p=palette(current.y);document.documentElement.style.setProperty('--sceneA',`rgb(${p.a.join(',')})`);document.documentElement.style.setProperty('--sceneB',`rgb(${p.b.join(',')})`);if(instant){const core=$('#stageCore');const y=current.y;let scale=1;if(y>=2025)scale=1+(Math.min(y,2085)-2025)/60*.5;if(y>=2089)scale=.9+(y-2089)/37*.55;if(y>=2126)scale=1.45;core.style.transform=`translate(-50%,-50%) scale(${scale})`;core.style.background=`radial-gradient(circle at 32% 28%,#efffff 0 2%,rgb(${p.a.join(',')}) 7%,rgba(${p.b.join(',')},.65) 23%,#081014 57%,#010304 76%)`;core.style.boxShadow=`0 0 ${50+scale*25}px rgba(${p.a.join(',')},.18),0 0 180px rgba(${p.a.join(',')},.08)`;buildNetwork(current.y)} }
  function buildNetwork(y){const box=$('#stageNetwork');box.innerHTML='';const count=Math.min(44,4+Math.floor((y-1990)/4));for(let i=0;i<count;i++){const n=document.createElement('i');n.className='net-node';n.style.left=(12+Math.random()*76)+'%';n.style.top=(18+Math.random()*64)+'%';n.style.animationDelay=(-Math.random()*2)+'s';box.appendChild(n)}for(let i=0;i<Math.floor(count*.7);i++){const l=document.createElement('i');l.className='net-line';const x=14+Math.random()*67, y1=20+Math.random()*60, len=10+Math.random()*20;l.style.left=x+'%';l.style.top=y1+'%';l.style.width=len+'%';l.style.transform=`rotate(${Math.random()*100-50}deg)`;box.appendChild(l)}}
  function drawStars(w,h,alpha,count){ctx.save();for(let i=0;i<count;i++){const x=(i*97.17)%w,y=(i*53.31)%h,r=(i%3)*.4+.4;ctx.fillStyle=`rgba(190,235,235,${alpha*((i%7)/7+.25)})`;ctx.fillRect(x,y,r,r)}ctx.restore()}
  function drawCity(w,h,progress){const city=$('#stageCity');if(!city.children.length){for(let i=0;i<24;i++){const b=document.createElement('i');b.className='city-block';city.appendChild(b)}}Array.from(city.children).forEach((b,i)=>{let base=16+((i*17)%35);let hgt=base; if(progress>.25)hgt*=1.3;if(progress>.55)hgt*=1.5;if(progress>.72)hgt*=1.1;b.style.height=Math.max(3,hgt)+'%';b.style.opacity=progress<.15?.18:progress<.85?.8:.45;b.style.filter=progress>0.72?'saturate(.55) contrast(1.05)':'none'});city.style.opacity=progress<.12?.1:progress<.25?.25:progress<.75?.85:.35}
  function drawCorruption(w,h,p){if(p<=0.73)return;const d=(p-.73)/.27;ctx.save();ctx.globalAlpha=Math.min(.55,d*1.5);for(let i=0;i<40;i++){const y=Math.random()*h;ctx.fillStyle=i%2?'rgba(255,80,100,.45)':'rgba(150,110,180,.35)';ctx.fillRect(Math.random()*w,y,20+Math.random()*160,1+Math.random()*3)}ctx.globalCompositeOperation='screen';for(let i=0;i<10*d;i++){ctx.beginPath();ctx.moveTo(Math.random()*w,h*.2+Math.random()*h*.65);ctx.lineTo(Math.random()*w,h*.2+Math.random()*h*.65);ctx.strokeStyle='rgba(255,90,105,.4)';ctx.stroke()}ctx.restore()}
  function loop(t){const r=canvas.getBoundingClientRect(),w=r.width,h=r.height;const p=(current.y-1990)/(2126-1990);ctx.clearRect(0,0,w,h);const pal=palette(current.y);const g=ctx.createRadialGradient(w*.5,h*.5,10,w*.5,h*.5,Math.max(w,h)*.55);g.addColorStop(0,`rgba(${pal.a.join(',')},${current.y<2089?.035:.02})`);g.addColorStop(.55,'rgba(10,13,16,.03)');g.addColorStop(1,'rgba(0,0,0,.35)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);drawStars(w,h,current.y>=2089?.16:.35,180);drawCity(w,h,p);drawCorruption(w,h,p);if(current.y>=2089){ctx.save();ctx.globalAlpha=.14+Math.sin(t*.005)*.04;ctx.strokeStyle='rgba(255,72,92,.55)';for(let i=0;i<9;i++){const yy=h*(.25+i*.07)+(Math.random()-.5)*6;ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(w,yy+(Math.random()-.5)*14);ctx.stroke()}ctx.restore()}if(current.y>=2120){ctx.save();ctx.globalAlpha=.08;ctx.fillStyle='rgba(150,110,200,.12)';ctx.fillRect(0,0,w,h);ctx.restore()}raf=requestAnimationFrame(loop)}
  setup();
  window.addEventListener('tiah:language',()=>selectYear(current.y));
})();
