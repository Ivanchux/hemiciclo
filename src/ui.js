/* ===== UTILIDADES DE INTERFAZ ===== */
const GEO=__GEO__;
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const HEMI=(function(){
  const rows=10,r0=.4,r1=1,N=TOTAL_SEATS;const radii=[];for(let k=0;k<rows;k++)radii.push(r0+(r1-r0)*k/(rows-1));
  const tot=radii.reduce((a,x)=>a+x,0);const counts=radii.map(r=>Math.round(N*r/tot));
  let diff=N-counts.reduce((a,x)=>a+x,0);for(let k=rows-1;diff!==0;k=(k+rows-1)%rows){counts[k]+=Math.sign(diff);diff-=Math.sign(diff);}
  const pts=[];counts.forEach((n,k)=>{for(let j=0;j<n;j++){pts.push({a:Math.PI*(1-(n===1?.5:j/(n-1))),r:radii[k]});}});
  pts.sort((x,y)=>y.a-x.a||x.r-y.r);return pts;
})();
const HW=600,HH=325,HCX=300,HCY=300,HR=288,HRAD=HR*.6/9*.40;
function hemiMarkup(){
  let h='<svg class="hemi" viewBox="0 0 '+HW+' '+HH+'" role="img" aria-label="Hemiciclo del Congreso">';
  HEMI.forEach((p,i)=>{h+='<circle cx="'+(HCX+p.r*HR*Math.cos(p.a)).toFixed(1)+'" cy="'+(HCY-p.r*HR*Math.sin(p.a)).toFixed(1)+'" r="'+HRAD.toFixed(1)+'" fill="#1c2750"/>';});
  return h+'<line x1="'+HCX+'" y1="'+(HCY-HR-10)+'" x2="'+HCX+'" y2="'+(HCY-HR*.34)+'" stroke="#FFC93C" stroke-width="1.5" stroke-dasharray="3 4" opacity=".7"/></svg>';
}
function hemiBuild(el){el.innerHTML=hemiMarkup();el._dots=$$('circle',el);el._cols=new Array(el._dots.length).fill(null);}
function hemiAssign(finalSeats,partial){
  const cols=new Array(TOTAL_SEATS).fill(null);let i=0;
  finalOrder(finalSeats).forEach(id=>{const n=finalSeats[id],m=Math.min(n,partial?(partial[id]||0):n);for(let k=0;k<n&&i<TOTAL_SEATS;k++,i++)if(k<m)cols[i]=COL(id);});
  return cols;
}
function hemiPaint(el,finalSeats,partial){
  if(!el||!el._dots)return; const cols=hemiAssign(finalSeats,partial);
  el._dots.forEach((c,j)=>{if(el._cols[j]!==cols[j]){c.setAttribute('fill',cols[j]||'#1c2750');
    if(cols[j]&&!el._cols[j]){c.classList.remove('pop');void c.getBoundingClientRect();c.classList.add('pop');}el._cols[j]=cols[j];}});
}
function tweenNum(el,to,fmt,ms){
  if(!el)return; fmt=fmt||(v=>String(Math.round(v))); const from=el._v==null?0:el._v; el._v=to;
  if(from===to||typeof requestAnimationFrame!=='function'){el.textContent=fmt(to);return;}
  if(el._r)cancelAnimationFrame(el._r); const t0=performance.now(); ms=ms||600;
  const step=now=>{const k=Math.min(1,(now-t0)/ms);const e=1-Math.pow(1-k,3);el.textContent=fmt(from+(to-from)*e);if(k<1)el._r=requestAnimationFrame(step);else el.textContent=fmt(to);};
  el._r=requestAnimationFrame(step);
}
function mapMarkup(id){
  let h='<svg id="'+id+'" viewBox="0 0 '+GEO.w+' '+GEO.h+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa de España por provincias">';
  Object.keys(GEO.paths).forEach(pid=>{if(pid==='CE'||pid==='ME')return;const P=PROV[PROV_IDX[pid]];h+='<path class="pv" data-id="'+pid+'" d="'+GEO.paths[pid]+'"><title>'+esc(P.name)+'</title></path>';});
  ['CE','ME'].forEach(pid=>{const c=GEO.cent[pid];h+='<circle class="pv" data-id="'+pid+'" cx="'+c[0]+'" cy="'+c[1]+'" r="7"><title>'+esc(PROV[PROV_IDX[pid]].name)+'</title></circle>';});
  const b=GEO.canBox;h+='<rect x="'+b[0]+'" y="'+b[1]+'" width="'+b[2]+'" height="'+b[3]+'" rx="8" fill="none" stroke="#27335F" stroke-dasharray="4 4"/><text x="'+(b[0]+8)+'" y="'+(b[1]+b[3]+14)+'" font-size="11" fill="#5D6A96" font-family="IBM Plex Mono,monospace">CANARIAS</text></svg>';
  return h;
}
function paintMap(svg,colorOf){$$('.pv',svg).forEach(p=>{const c=colorOf(p.dataset.id);p.style.fill=c||'';});}
const pn=id=>PROV[PROV_IDX[id]].name;

/* ===== ESTADO ===== */
const QUINIELA_CLOSE=new Date('2026-11-29T09:00:00+01:00');
let REAL_29N=null; /* tras el 29N: {PP:137,...} */
const S={scen:'hoy',seed:1,idx:0,N:null,speed:1,paused:false,sel:null,follow:null,win:null,events:[],mc:null,leader:null,hold:0,timer:null,
  histSel:'2023',histPlay:null,pact:{yes:{}},started:false};

/* ===== ESTRUCTURA ===== */
const TABS=[['map','◉','Mapa'],['hist','◷','Histórico'],['pact','⚖','Pactos'],['bet','★','Mi apuesta'],['car','◆','Carrera','Pronto']];
function shellHTML(){
  return '<header class="top"><div class="brand"><i></i>HEMICICLO</div><nav id="tabs">'+TABS.map(t=>'<button data-tab="'+t[0]+'"><span aria-hidden="true">'+t[1]+'</span>'+t[2]+(t[3]?' <span class="soon">'+t[3]+'</span>':'')+'</button>').join('')+'</nav>'+
   '<div class="tr"><div class="live"><i class="rec"></i><span>EN DIRECTO</span></div><div class="clock" id="clock"></div></div></header>'+
   '<div id="vedabar" hidden></div>'+
   '<main class="stage">'+
   '<aside class="col left">'+
     '<section class="panel" id="pStatus"><div class="ph"><span class="sym info">ℹ</span><h2>Simulación</h2><span class="sp"></span><span class="tag evt" id="stTag">Escrutando</span></div>'+
       '<div class="simn">Noche nº <span id="simN">1</span></div><p class="ctx" id="scDesc"></p>'+
       '<div class="progress"><i id="prog"></i></div><div class="ctx" style="margin:0 0 8px" id="progTxt"></div>'+
       '<div class="ctrls"><button class="btn sm" id="bPause" data-act="pause">⏸ Pausar</button><button class="btn sm ghost" data-speed="1" aria-pressed="true">1×</button><button class="btn sm ghost" data-speed="2">2×</button><button class="btn sm ghost" data-speed="4">4×</button><button class="btn sm ghost" data-act="next">⏭ Otra noche</button></div></section>'+
     '<section class="panel" id="pScen"><div class="ph"><span class="sym act">▶</span><h2>Escenario</h2></div><p class="ctx">Pulsa uno y empieza otra simulación con ese reparto de votos.</p><div class="chips" id="chips"></div></section>'+
     '<section class="panel" id="pProb"><div class="ph"><span class="sym info">%</span><h2>Probabilidades</h2></div><p class="ctx" id="probCtx"></p><div id="probs"></div></section>'+
   '</aside>'+
   '<section class="col mid"><div class="panel mapp" id="pMap"><div class="maplab"><span class="sym info">◉</span>Ganador por provincia</div>'+
     '<div class="legend"><span><i style="background:var(--acc)"></i>Escrutando ahora</span><span><i></i>Pendiente</span><span><i style="background:#5AA9FF"></i>Color = partido ganador</span></div>'+
     mapMarkup('map')+'<div class="provcard" id="provcard"></div></div>'+
     '<div class="panel tick" id="pTick"><div class="ph"><span class="sym evt">◆</span><h2>Última hora</h2><span class="sp"></span><span class="tag info" id="tkInfo">Eventos de la noche</span></div><div class="evl" id="evl"></div></div></section>'+
   '<aside class="col right">'+
     '<section class="panel hemip" id="pHemi"><div class="ph"><span class="sym info">▦</span><h2>Congreso · 350 escaños</h2><span class="sp"></span><button class="btn sm ghost" data-win="share">Compartir</button></div>'+
       '<div class="hemiw"><div id="hemi"></div><div class="hc"><b id="hcN">0</b><small id="hcT">Mayoría absoluta: 176</small></div></div></section>'+
     '<section class="panel tblp" id="pTbl"><div class="ph"><span class="sym info">≡</span><h2>Resultados</h2><span class="sp"></span><span class="tag act" id="tbPct">0 % escrutado</span></div>'+
       '<p class="ctx" id="tblCtx">Escaños y voto de cada partido. La flecha compara con 2023.</p><div class="trow thead"><span></span><span>Partido</span><span>Esc.</span><span></span><span>Voto</span><span>Δ 23</span></div><div class="tbl" id="tbl"></div></section>'+
   '</aside></main><div id="win" hidden></div>';
}

/* ===== DIRECTO ===== */
function shownSeats(){const N=S.N;return N?(N.done?N.res.seats:N.partial.seats):zeroShares();}
function leaderOf(seats){return IDS.slice().sort((a,b)=>seats[b]-seats[a])[0];}
function pushEvents(list){list.forEach(e=>S.events.unshift(e));S.events=S.events.slice(0,12);}
const EV_SYM={vuelco:['◆','evt'],prov:['●','info'],adelanto:['▲','act'],hito:['★','act'],fin:['✔','good'],inicio:['▶','info']};
function renderTicker(){
  const el=$('#evl');if(!el)return;
  const list=S.events.slice(0,3),key=list.map(e=>e.t+'|'+e.when).join('~');
  if(el._k===key)return;
  const old=el._seen||{};el._k=key;el._seen={};
  el.innerHTML=list.map(e=>{const id=e.t+'|'+e.when,fresh=!old[id];el._seen[id]=1;const s=EV_SYM[e.k]||EV_SYM.prov;return '<div class="ev'+(fresh?' new':'')+'" style="--c:'+(e.c||'#B58CFF')+'"><span class="sym '+s[1]+'">'+s[0]+'</span><span class="ell">'+esc(e.t)+'</span><span class="mono dim" style="font-size:11px">'+esc(e.when||'')+'</span></div>';}).join('')||'<p class="ctx">Los eventos aparecerán aquí según avance el escrutinio.</p>';
}
function renderStatus(){
  const N=S.N;if(!N)return; const sc=scenarioById(S.scen);
  $('#simN').textContent=N.idx+1;
  $('#scDesc').innerHTML='<b style="color:var(--fg)">'+esc(sc.label)+'.</b> '+esc(sc.desc)+(vedaActive()?' Parte del resultado de 2023.':'');
  const n=Object.keys(N.revealed).length,pct=Math.round(N.partial.w/WTOT*100);
  $('#prog').style.width=pct+'%';
  $('#progTxt').textContent=n+' de 52 provincias escrutadas · '+pct+' % del voto';
  const tag=$('#stTag');tag.textContent=N.done?'Terminada':(S.paused?'En pausa':'Escrutando');tag.className='tag '+(N.done?'good':S.paused?'act':'evt');
  $('#bPause').textContent=S.paused?'▶ Seguir':'⏸ Pausar';
  $$('[data-speed]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.speed===S.speed)));
  $$('[data-speed]').forEach(b=>b.classList.toggle('on',+b.dataset.speed===S.speed));
  $('#tbPct').textContent=pct+' % escrutado';
}
function renderChips(){
  $('#chips').innerHTML=scenarioList().map(s=>'<button class="chip" data-scen="'+s.id+'" aria-pressed="'+(S.scen===s.id)+'" title="'+esc(s.desc)+'"><i>'+s.icon+'</i><span class="ell">'+esc(s.label)+'</span></button>').join('');
}
function renderProb(){
  const el=$('#probs');if(!el)return;const m=S.mc;
  $('#probCtx').textContent=m?'Resultado de '+m.runs+' simulaciones de este escenario. Cada noche que ves es una de ellas.':'Calculando las simulaciones del escenario…';
  if(!m){el.innerHTML='';return;}
  const rows=[['Derecha suma 176',m.derecha,PT.PP.c],['Izquierda y regionales suman 176',m.progresista,PT.PSOE.c],['El PP es la primera fuerza',m.ppFirst,PT.PP.c],['El PSOE es la primera fuerza',m.psoeFirst,PT.PSOE.c]];
  el.innerHTML=rows.map(r=>'<div class="prob"><span class="ell">'+esc(r[0])+'</span><b class="mono" style="text-align:right">'+Math.round(r[1]*100)+' %</b><div class="t"><i style="width:'+Math.round(r[1]*100)+'%;background:'+r[2]+'"></i></div></div>').join('');
}
function renderMap(){
  const N=S.N;if(!N)return;const svg=$('#map');
  paintMap(svg,id=>N.revealed[id]?COL(N.res.prov[PROV_IDX[id]].win):null);
  $$('.pv',svg).forEach(p=>{p.classList.toggle('sel',p.dataset.id===S.sel);p.classList.toggle('now',!S.paused&&!N.done&&!!S.follow&&p.dataset.id===S.follow&&false);});
}
function renderProvCard(){
  const N=S.N,el=$('#provcard');if(!N||!el)return;const id=S.sel||S.follow;
  if(!id){el.innerHTML='<h3>Provincias</h3><p class="ctx" style="margin:6px 0 0">Aquí aparece el resultado de la provincia que se escruta. Pulsa cualquiera del mapa para verla.</p>';return;}
  const i=PROV_IDX[id],P=PROV[i],b=base23Res().prov[i].win;
  if(!N.revealed[id]){el.innerHTML='<h3>'+esc(P.name)+'</h3><p class="ctx" style="margin:6px 0 8px">Pendiente de escrutar · '+P.seats+' escaños.</p><span class="tag info">En 2023 ganó '+esc(PT[b].s)+'</span>';return;}
  const pr=N.res.prov[i],top=IDS.slice().sort((x,y)=>pr.shares[y]-pr.shares[x]).slice(0,4);
  const w=pr.win;
  el.innerHTML='<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px"><h3 class="ell" style="flex:1">'+esc(P.name)+'</h3><span class="tag '+(w===b?'info':'evt')+'">'+(w===b?'Igual que 2023':'¡Vuelco!')+'</span></div>'+
   top.map(x=>'<div class="pcrow"><i class="dot" style="background:'+COL(x)+'"></i><span class="ell">'+esc(PT[x].s)+'</span><b class="mono">'+f1(pr.shares[x])+' %</b><b class="mono" style="min-width:20px;text-align:right">'+(pr.seats[x]||0)+'</b></div>').join('')+
   '<p class="ctx" style="margin:6px 0 0">'+P.seats+' escaños · último dato de 2023: '+esc(PT[b].s)+'</p>';
}
function renderHemi(){
  const N=S.N;if(!N)return;const el=$('#hemi');if(!el._dots)hemiBuild(el);
  hemiPaint(el,N.res.seats,N.partial.seats);
  const seats=shownSeats(),lead=leaderOf(seats);
  tweenNum($('#hcN'),seats[lead]||0);$('#hcT').textContent=(seats[lead]?PT[lead].s+' · ':'')+'Mayoría absoluta: 176';
  $('#hcN').style.color=seats[lead]?COL(lead):'var(--fg)';
}
function renderTable(){
  const N=S.N;if(!N)return;const fin=N.res.seats;
  if(!N.rows){const ids=IDS.filter(id=>id!=='OTROS'&&((fin[id]||0)>0||N.shares[id]>=1)).sort((a,b)=>PT[a].lr-PT[b].lr);N.rows=ids;
    $('#tbl').innerHTML=ids.map(id=>'<div class="trow" data-p="'+id+'"><i class="dot" style="background:'+COL(id)+'"></i><span class="ell">'+esc(PT[id].s)+'</span><b class="mono" data-f="s">0</b><div class="bar"><i style="width:0;background:'+COL(id)+'"></i></div><span class="mono" data-f="v">0,0 %</span><span class="mono" data-f="d">·</span></div>').join('');}
  const mx=Math.max.apply(null,N.rows.map(id=>fin[id]||0).concat([1]));
  N.rows.forEach(id=>{const r=$('[data-p="'+id+'"]',$('#tbl'));if(!r)return;
    tweenNum($('[data-f="s"]',r),N.partial.seats[id]||0);
    $('.bar i',r).style.width=Math.round((N.partial.seats[id]||0)/mx*100)+'%';
    tweenNum($('[data-f="v"]',r),N.partial.w?N.partial.vote[id]/N.partial.w:0,v=>f1(v)+' %');
    const d=$('[data-f="d"]',r);
    if(N.done){const x=(fin[id]||0)-(SEATS23[id]||0);d.textContent=(x>0?'▲ ':x<0?'▼ ':'= ')+(x===0?'':Math.abs(x));d.className='mono '+(x>0?'up':x<0?'dn':'dim');}else{d.textContent='·';d.className='mono dim';}
  });
}
function renderAll(){renderStatus();renderMap();renderProvCard();renderHemi();renderTable();renderTicker();if(S.win==='pact')renderPact();if(S.win==='share')renderShare();}
function when(){const N=S.N;return N?Math.round(N.partial.w/WTOT*100)+' %':'';}
function startNight(){
  S.N=makeNight(S.scen,S.seed,S.idx);S.events=[];S.leader=null;S.follow=null;S.hold=0;
  {const el=$('#evl');if(el){el._k=null;el._seen={};}}
  S.events=[{k:'inicio',t:'Cierran los colegios. Empieza el escrutinio de la noche nº '+(S.idx+1),c:'#5AA9FF',when:'0 %'}];
  try{history.replaceState(null,'','#e/'+S.scen+'/'+S.seed+'/'+S.idx);}catch(e){}
  const el=$('#hemi');if(el){hemiBuild(el);}
  renderAll();schedule(900);
}
function schedule(ms){clearTimeout(S.timer);if(S.paused)return;S.timer=setTimeout(tick,ms!=null?ms:1000/S.speed);}
function tick(){
  const N=S.N;if(!N){startNight();return;}
  if(!N.done){
    const before=Object.assign({},N.partial.seats);
    const ev=stepNight(N,S.leader);
    IDS.forEach(id=>{[50,100,176].forEach(th=>{if(before[id]<th&&N.partial.seats[id]>=th)ev.push({k:'hito',t:PT[id].s+(th===176?' alcanza la mayoría absoluta':' supera los '+th+' escaños'),c:PT[id].c});});});
    ev.forEach(e=>e.when=when());pushEvents(ev);
    const g=N.ticks[N.t-1];S.follow=g[g.length-1];
    const seats=N.partial.seats;S.leader=leaderOf(seats);
    if(N.done){S.hold=7;if(!S.sel)S.follow=null;}
    renderAll();
  }else{S.hold--;if(S.hold<=0){S.idx++;startNight();return;}}
  schedule();
}
function setScenario(id){
  S.scen=id;S.idx=0;S.mc=null;renderChips();renderProb();startNight();
  setTimeout(()=>{const sc=S.scen;const m=monteCarlo(NOWP,scenShares(sc),SIM_OPTS,400,.07);if(S.scen===sc){S.mc=m;renderProb();if(S.win==='bet')renderBetFill();}},40);
}
function tickClock(){
  const el=$('#clock');if(!el)return;const t=new Date('2026-11-29T09:00:00+01:00').getTime()-Date.now();
  if(t>0){const d=Math.floor(t/864e5),h=Math.floor(t%864e5/36e5);el.innerHTML='29N en <b>'+d+' d '+h+' h</b>';}
  else if(Date.now()<VEDA_END.getTime())el.innerHTML='<b>Hoy se vota</b>';else el.innerHTML='29N celebrado';
}

/* ===== VENTANAS ===== */
function openWin(id){
  if(id==='map'){closeWin();return;}
  S.win=id;const w=$('#win');w.hidden=false;
  const B={hist:winHist,pact:winPact,bet:winBet,share:winShare,car:winCar}[id];
  w.innerHTML=B();markTabs();
  if(id==='hist')histInit();if(id==='pact')renderPact();if(id==='bet')renderBetFill();if(id==='share')renderShare();
}
function closeWin(){stopHistPlay();S.win=null;const w=$('#win');if(w){w.hidden=true;w.innerHTML='';}markTabs();}
function markTabs(){$$('#tabs button').forEach(b=>b.setAttribute('aria-current',String((S.win||'map')===b.dataset.tab)));}
function winFrame(cls,color,icon,title,body){return '<div class="win '+cls+'" style="--wc:'+color+'" role="dialog" aria-label="'+esc(title)+'"><div class="wh"><span class="sym" style="background:#222a4d;color:'+color+'">'+icon+'</span><h2>'+esc(title)+'</h2><span class="sp"></span><button class="x" data-act="close" aria-label="Cerrar">✕</button></div><div class="wb">'+body+'</div></div>';}

/* --- Histórico --- */
const histCache={};
function histData(key){
  if(histCache[key])return histCache[key];const h=HIST.find(x=>x.key===key);const sh={};h.parties.forEach(p=>sh[p.id]=p.share);
  const res=simulate(h.parties,sh,SIM_OPTS);const seats={};h.parties.forEach(p=>seats[p.id]=p.seats);
  return histCache[key]={h:h,res:res,seats:seats};
}
function winHist(){
  const yrs=HIST.map(h=>{const d=histData(h.key);const w=Object.keys(d.seats).sort((a,b)=>d.seats[b]-d.seats[a])[0];return '<button class="yr" data-hist="'+h.key+'" aria-pressed="false"><i class="dot" style="background:'+COL(w)+'"></i><span class="ell">'+esc(h.label)+'</span></button>';}).join('');
  return winFrame('full','#B58CFF','◷','Histórico 1977–2023','<div style="display:flex;flex-direction:column;height:100%;min-height:0"><div class="ph" style="margin-bottom:10px"><button class="btn sm" data-act="hplay" id="hplay">▶ Reproducir 1977–2023</button><span class="ctx" style="margin:0 0 0 8px">Pulsa un año o reprodúcelos todos. El punto de color es el partido que ganó.</span></div><div class="years">'+yrs+'</div>'+
    '<div class="hgrid" style="flex:1;min-height:0"><div class="hmap" id="hmap">'+mapMarkup('hmapsvg')+'<div class="maplab" style="left:16px"><span class="sym info">◉</span>Mapa reconstruido por el modelo</div></div>'+
    '<div style="display:flex;flex-direction:column;gap:10px;min-width:0;min-height:0"><div class="panel" style="flex:none"><div class="ph"><span class="sym info">▦</span><h2 id="hTitle">—</h2></div><p class="ctx" id="hInfo"></p><div class="hemiw"><div id="hhemi"></div><div class="hc"><b id="hN">0</b><small id="hT"></small></div></div></div>'+
    '<div class="panel" style="flex:1;min-height:0"><div class="ph"><span class="sym info">≡</span><h2>Escaños oficiales</h2></div><p class="ctx">Datos oficiales de escaños y voto. El mapa de la izquierda lo calcula el modelo y puede desviarse en elecciones antiguas.</p><div class="tbl" id="htbl"></div></div></div></div></div>');
}
function histInit(){hemiBuild($('#hhemi'));histSet(S.histSel);}
function histSet(key){
  S.histSel=key;const d=histData(key),h=d.h;
  $$('[data-hist]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.hist===key)));
  paintMap($('#hmapsvg'),id=>COL(d.res.prov[PROV_IDX[id]].win));
  hemiPaint($('#hhemi'),d.seats,null);
  const top=Object.keys(d.seats).sort((a,b)=>d.seats[b]-d.seats[a])[0];
  $('#hTitle').textContent=h.label;$('#hInfo').textContent=h.date+' · Participación '+f1(h.turnout)+' % · Gobierno: '+(h.gov||'sin dato');
  tweenNum($('#hN'),d.seats[top]||0);$('#hN').style.color=COL(top);$('#hT').textContent=pnameOf(h,top)+' · mayoría 176';
  $('#htbl').innerHTML='<div class="trow thead"><span></span><span>Partido</span><span>Esc.</span><span></span><span>Voto</span><span></span></div>'+h.parties.slice().sort((a,b)=>b.seats-a.seats).filter(p=>p.seats>0||p.share>=1).map(p=>'<div class="trow"><i class="dot" style="background:'+COL(p.id)+'"></i><span class="ell">'+esc(p.name||PT[p.id].s)+'</span><b class="mono">'+p.seats+'</b><div class="bar"><i style="width:'+Math.round(p.seats/Math.max(1,d.seats[top])*100)+'%;background:'+COL(p.id)+'"></i></div><span class="mono">'+f1(p.share)+' %</span><span></span></div>').join('');
}
function pnameOf(h,id){const p=h.parties.find(x=>x.id===id);return (p&&p.name)||PT[id].s;}
function stopHistPlay(){if(S.histPlay){clearInterval(S.histPlay);S.histPlay=null;}const b=$('#hplay');if(b)b.textContent='▶ Reproducir 1977–2023';}
function toggleHistPlay(){
  if(S.histPlay){stopHistPlay();return;}
  let i=0;histSet(HIST[0].key);$('#hplay').textContent='⏸ Parar';
  S.histPlay=setInterval(()=>{i++;if(i>=HIST.length){stopHistPlay();return;}histSet(HIST[i].key);},1500);
}

/* --- Pactos --- */
function winPact(){return winFrame('side','#43D18B','⚖','Pactos','<div id="pactBody"></div>');}
function pactSeats(){const N=S.N;return N?(N.done?N.res.seats:N.partial.seats):zeroShares();}
function verdictOf(yes,no){return yes>=176?['good','✔','Investidura a la primera']:yes>no?['act','◐','Segunda votación']:['bad','✖','Bloqueo'];}
function renderPact(){
  const el=$('#pactBody');if(!el)return;const N=S.N,seats=pactSeats(),pct=N?Math.round(N.partial.w/WTOT*100):0;
  const co=coalitions(seats);
  const cards=co.map(c=>{const v=c.first?['good','✔','Investidura a la primera']:c.second?['act','◐','Segunda votación']:['bad','✖','Le faltan '+c.miss];
    return '<div class="coal" style="--vc:var(--'+(v[0]==='act'?'acc':v[0])+')"><div style="display:flex;gap:8px;align-items:center"><b class="ell" style="flex:1">'+esc(c.label)+'</b><span class="tag '+v[0]+'">'+v[1]+' '+esc(v[2])+'</span></div>'+
     '<div class="bar">'+c.ids.map(i=>'<i style="width:'+(seats[i]/350*100)+'%;background:'+COL(i)+'"></i>').join('')+'<u style="left:'+(176/350*100)+'%"></u></div>'+
     '<div class="pchips">'+c.ids.map(i=>'<span class="pc"><i class="dot" style="background:'+COL(i)+'"></i>'+esc(PT[i].s)+' '+seats[i]+'</span>').join('')+'</div><div class="ctx" style="margin:6px 0 0"><b class="mono" style="color:var(--fg)">'+c.n+'</b> de 176 necesarios</div></div>';}).join('');
  const yes=S.pact.yes;const ids=IDS.filter(i=>(seats[i]||0)>0).sort((a,b)=>PT[a].lr-PT[b].lr);
  let y=0,n=0,cand=null;ids.forEach(i=>{if(yes[i]){y+=seats[i];if(!cand||seats[i]>seats[cand])cand=i;}else n+=seats[i];});
  const v=verdictOf(y,n);
  el.innerHTML='<p class="ctx"><span class="tag info">ℹ</span> Con los escaños de la noche en curso ('+pct+' % escrutado'+(N&&N.done?', terminada':'')+'). Se actualiza solo.</p>'+cards+
   '<div class="ph" style="margin-top:14px"><span class="sym act">▶</span><h2>Monta tu pacto</h2></div><p class="ctx">Pulsa los partidos que votarían «sí». El resto vota «no».</p>'+
   '<div class="pchips" style="margin-bottom:10px">'+ids.map(i=>'<button class="pc" data-yes="'+i+'" aria-pressed="'+(!!yes[i])+'"><i class="dot" style="background:'+COL(i)+'"></i>'+esc(PT[i].s)+' '+seats[i]+'</button>').join('')+'</div>'+
   '<div class="coal" style="--vc:var(--'+(v[0]==='act'?'acc':v[0])+')"><div style="display:flex;gap:8px;align-items:center"><b class="ell" style="flex:1">'+(cand?'Candidato: '+esc(CANDS[cand]||PT[cand].name):'Elige al menos un partido')+'</b><span class="tag '+v[0]+'">'+v[1]+' '+v[2]+'</span></div><div class="ctx" style="margin:6px 0 0"><b class="mono" style="color:var(--good)">'+y+'</b> síes · <b class="mono" style="color:var(--bad)">'+n+'</b> noes</div></div>';
}

/* --- Mi apuesta --- */
const BET_IDS=['PP','PSOE','VOX','FA','POD','ERC','JUNTS','BILDU','PNV','BNG','CC','UPN'];
function betScore(pred,real){
  let d=0;const ids=new Set(Object.keys(pred).concat(Object.keys(real)));ids.forEach(i=>d+=Math.abs((pred[i]||0)-(real[i]||0)));
  const lead=o=>Object.keys(o).sort((x,y)=>o[y]-o[x])[0];const right=['PP','VOX','UPN','CC','SALF','ALI'];const t=(o)=>right.reduce((a,i)=>a+(o[i]||0),0);
  return {score:Math.max(0,1000-d*10)+(lead(pred)===lead(real)?200:0)+((t(pred)>=176)===(t(real)>=176)?100:0),diff:d};
}
function winBet(){return winFrame('small','#FFC93C','★','Mi apuesta del 29N','<div id="betBody"></div>');}
function betDefault(){
  const seats={};const m=S.mc;const cur=shownSeats();let sum=0;
  BET_IDS.forEach(i=>{seats[i]=m?m.stat[i].med:(S.N&&S.N.done?cur[i]:SEATS23[i]||0);sum+=seats[i];});
  while(sum>350){const k=BET_IDS.slice().sort((a,b)=>seats[b]-seats[a])[0];seats[k]--;sum--;}
  return seats;
}
let betDraft=null;
function renderBetFill(){
  if(S.win!=='bet')return;const saved=lsGet('hemi3_apuesta',null);if(!betDraft)betDraft=saved?Object.assign({},saved.seats):betDefault();
  const el=$('#betBody');if(!el)return;const open=Date.now()<QUINIELA_CLOSE.getTime();
  const sum=BET_IDS.reduce((a,i)=>a+(betDraft[i]||0),0),rest=350-sum;
  let result='';
  if(saved&&REAL_29N){const r=betScore(Object.assign({OTROS:350-BET_IDS.reduce((a,i)=>a+(saved.seats[i]||0),0)},saved.seats),REAL_29N);result='<div class="coal" style="--vc:var(--good)"><b>Tu puntuación: '+r.score+' puntos</b><div class="ctx" style="margin:4px 0 0">Desvío total: '+r.diff+' escaños.</div></div>';}
  else if(saved)result='<div class="coal" style="--vc:var(--acc)"><b>Apuesta guardada.</b><div class="ctx" style="margin:4px 0 0">Se puntúa cuando se conozca el resultado del 29N: 1000 puntos menos 10 por escaño de desvío, +200 si aciertas la primera fuerza y +100 si aciertas si la derecha llega a 176.</div></div>';
  el.innerHTML='<p class="ctx"><span class="tag info">ℹ</span> Reparte los 350 escaños como crees que quedará el 29N. '+(open?'Se cierra el 29 de noviembre a las 9:00.':'<b>Ya está cerrada.</b>')+' Parto de la mediana de las simulaciones.</p>'+result+
   BET_IDS.map(i=>'<div class="step"><i class="dot" style="background:'+COL(i)+'"></i><span class="ell">'+esc(PT[i].name)+'</span><div class="sb"><button data-bet="'+i+'" data-d="-5">−5</button><button data-bet="'+i+'" data-d="-1">−</button><b class="mono">'+(betDraft[i]||0)+'</b><button data-bet="'+i+'" data-d="1">+</button><button data-bet="'+i+'" data-d="5">+5</button></div></div>').join('')+
   '<div class="step" style="border:0"><i class="dot" style="background:'+COL('OTROS')+'"></i><span class="ell">Otros (el resto)</span><b class="mono" style="color:'+(rest>=0?'var(--fg)':'var(--bad)')+'">'+rest+'</b></div>'+
   '<div class="ctrls" style="margin-top:12px"><button class="btn" data-act="betsave"'+(rest<0||!open?' disabled':'')+'>★ Guardar mi apuesta</button><button class="btn ghost" data-act="betreset">Volver a la mediana</button></div>';
}

/* --- Compartir --- */
function cardSVG(title,sub,seats){
  const order=finalOrder(seats);const cols=[];order.forEach(id=>{for(let k=0;k<seats[id];k++)cols.push(COL(id));});
  let hemi='';HEMI.forEach((p,i)=>{hemi+='<circle cx="'+(HCX+p.r*HR*Math.cos(p.a)).toFixed(1)+'" cy="'+(HCY-p.r*HR*Math.sin(p.a)).toFixed(1)+'" r="'+HRAD.toFixed(1)+'" fill="'+(cols[i]||'#1c2750')+'"/>';});
  const rank=IDS.filter(i=>(seats[i]||0)>0).sort((a,b)=>seats[b]-seats[a]);const top=rank[0];
  let rows='';rank.slice(0,9).forEach((id,k)=>{const y=190+k*52;rows+='<circle cx="860" cy="'+(y-8)+'" r="9" fill="'+COL(id)+'"/><text x="884" y="'+y+'" font-size="26" fill="#E9EDF9" font-family="Arial,sans-serif">'+esc(PT[id].name)+'</text><text x="1240" y="'+y+'" font-size="30" font-weight="700" fill="#E9EDF9" text-anchor="end" font-family="Arial,sans-serif">'+seats[id]+'</text>';});
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><rect width="1280" height="720" fill="#0A0F1E"/><rect width="1280" height="6" fill="#FFC93C"/>'+
   '<text x="40" y="78" font-size="46" font-weight="800" fill="#E9EDF9" font-family="Arial,sans-serif">'+esc(title)+'</text><text x="40" y="116" font-size="22" fill="#93A0C8" font-family="Arial,sans-serif">'+esc(sub)+'</text>'+
   '<g transform="translate(40,150) scale(1.2667)">'+hemi+'</g><text x="420" y="520" font-size="84" font-weight="800" fill="'+COL(top)+'" text-anchor="middle" font-family="Arial,sans-serif">'+seats[top]+'</text><text x="420" y="552" font-size="20" fill="#93A0C8" text-anchor="middle" font-family="Arial,sans-serif">'+esc(PT[top].s)+' · mayoría 176</text>'+rows+
   '<text x="40" y="688" font-size="20" fill="#5D6A96" font-family="Arial,sans-serif">HEMICICLO · simulación de las elecciones generales · 350 escaños</text></svg>';
}
function shareCard(){const N=S.N,sc=scenarioById(S.scen);return cardSVG(sc.label,'Noche nº '+(N.idx+1)+' · '+Math.round(N.partial.w/WTOT*100)+' % escrutado',shownSeats());}
function winShare(){return winFrame('small','#5AA9FF','↗','Compartir esta noche','<p class="ctx"><span class="tag info">ℹ</span> Imagen del resultado en este momento y enlace que reproduce esta misma noche.</p><div id="sharePrev" style="border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-bottom:12px"></div><div class="ctrls"><button class="btn" data-act="png">↓ Descargar imagen</button><button class="btn ghost" data-act="link">⧉ Copiar enlace</button></div>');}
function renderShare(){const el=$('#sharePrev');if(el&&S.N)el.innerHTML=shareCard().replace('width="1280" height="720"','width="100%" style="display:block"');}
function downloadPNG(){
  const svg=shareCard();const save=(blob,ext)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='hemiciclo-noche.'+ext;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);};
  const fallback=()=>save(new Blob([svg],{type:'image/svg+xml'}),'svg');
  try{const img=new Image();const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    img.onload=()=>{try{const c=document.createElement('canvas');c.width=1280;c.height=720;c.getContext('2d').drawImage(img,0,0);c.toBlob(b=>{URL.revokeObjectURL(url);if(b)save(b,'png');else fallback();},'image/png');}catch(e){fallback();}};
    img.onerror=fallback;img.src=url;}catch(e){fallback();}
}
function shareLink(){return location.href.split('#')[0]+'#e/'+S.scen+'/'+S.seed+'/'+(S.N?S.N.idx:0);}

/* --- Carrera (en construcción) --- */
function winCar(){return winFrame('small','#B58CFF','◆','Carrera política','<p class="ctx"><span class="tag evt">◆ Pronto</span></p><p style="margin:0 0 8px">Una opción pequeña dentro del simulador: empiezas de militante en una provincia real y quieres llegar al Congreso.</p><p class="ctx" style="margin:0">Tus seis medidores formarán un hexágono: Lealtad, Convicción, Base, Fama, Dinero y Energía.</p>');}

/* ===== EVENTOS ===== */
document.addEventListener('click',e=>{
  const t=e.target.closest('button,.pv');if(!t)return;
  if(t.classList&&t.classList.contains('pv')){const id=t.dataset.id;if(t.closest('#map')){S.sel=(S.sel===id?null:id);renderMap();renderProvCard();}return;}
  if(t.dataset.tab){openWin(t.dataset.tab);return;}
  if(t.dataset.win){openWin(t.dataset.win);return;}
  if(t.dataset.scen){setScenario(t.dataset.scen);return;}
  if(t.dataset.speed){S.speed=+t.dataset.speed;renderStatus();if(!S.paused)schedule();return;}
  if(t.dataset.hist){stopHistPlay();histSet(t.dataset.hist);return;}
  if(t.dataset.yes){S.pact.yes[t.dataset.yes]=!S.pact.yes[t.dataset.yes];renderPact();return;}
  if(t.dataset.bet){const i=t.dataset.bet,d=+t.dataset.d;const sum=BET_IDS.reduce((a,k)=>a+(betDraft[k]||0),0);const nv=Math.max(0,(betDraft[i]||0)+d);if(d>0&&sum+d>350)betDraft[i]=(betDraft[i]||0)+(350-sum);else betDraft[i]=nv;renderBetFill();return;}
  switch(t.dataset.act){
    case 'pause':S.paused=!S.paused;if(S.paused)clearTimeout(S.timer);else schedule(300);renderStatus();break;
    case 'next':S.idx++;startNight();break;
    case 'close':closeWin();break;
    case 'hplay':toggleHistPlay();break;
    case 'betsave':{const open=Date.now()<QUINIELA_CLOSE.getTime();if(open){lsSet('hemi3_apuesta',{ts:Date.now(),seats:Object.assign({},betDraft)});renderBetFill();}break;}
    case 'betreset':betDraft=betDefault();renderBetFill();break;
    case 'png':downloadPNG();break;
    case 'link':{const u=shareLink();const done=()=>{t.textContent='✔ Enlace copiado';setTimeout(()=>t.textContent='⧉ Copiar enlace',1600);};
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u).then(done,()=>{t.textContent='Copia la URL del navegador';});else t.textContent='Copia la URL del navegador';break;}
  }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.win)closeWin();});
document.addEventListener('click',e=>{if(e.target.id==='win')closeWin();});

/* ===== ARRANQUE ===== */
(function init(){
  document.getElementById('app').innerHTML=shellHTML();
  const vb=$('#vedabar');if(vedaActive()){vb.hidden=false;vb.textContent='Veda de sondeos: la ley prohíbe publicar sondeos en los cinco días previos al voto. Hasta el cierre de urnas del 29 la web parte del resultado de 2023 y no muestra encuestas.';}
  S.scen=scenarioList()[0].id;S.seed=(Date.now()%900000000)+1;
  const m=(location.hash||'').match(/^#e\/([a-z0-9]+)\/(\d+)\/(\d+)$/);
  if(m&&scenarioList().some(s=>s.id===m[1])){S.scen=m[1];S.seed=+m[2];S.idx=+m[3];}
  markTabs();renderChips();tickClock();setInterval(tickClock,30000);
  startNight();
  setTimeout(()=>{const sc=S.scen;const mc=monteCarlo(NOWP,scenShares(sc),SIM_OPTS,400,.07);if(S.scen===sc){S.mc=mc;renderProb();}},40);
  renderProb();
  const V0=vedaActive();setInterval(()=>{if(vedaActive()!==V0)location.reload();},60000);
})();
