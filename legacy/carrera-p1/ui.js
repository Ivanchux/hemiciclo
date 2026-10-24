/* ===== MONIGOTES ===== */
function figure(seed,col,size,female){
  size=size||44; const r=mulberry32(((seed*2654435761)>>>0)||1); const pick=a=>a[Math.floor(r()*a.length)];
  const skin=pick(['#F2C9A5','#E0A980','#C68B63','#8D5A3B','#F6D7BC','#6B4430']);
  const hair=pick(['#2B2118','#4A3022','#8C5A2B','#C9A15A','#BDBDBD','#111111','#7A2E1E']);
  let style=Math.floor(r()*5); if(female&&(style===0||style===1))style=2+Math.floor(r()*3);
  const glasses=r()<.35; const tie=pick(['#F4F4F4','#C8102E','#1F3A93','#E8B82D','#2E8B57']);
  let h='<svg class="fig" width="'+size+'" height="'+Math.round(size*1.4)+'" viewBox="0 0 40 56" aria-hidden="true">';
  h+='<rect x="7" y="29" width="26" height="27" rx="7" fill="'+col+'"/><polygon points="16,29 24,29 20,38" fill="#F4F4F4"/>';
  h+='<polygon points="19,35 21,35 22.5,46 20,49 17.5,46" fill="'+tie+'"/><rect x="17" y="24" width="6" height="6" fill="'+skin+'"/>';
  if(style===2)h+='<path d="M8.5 30 Q6 8 20 4 Q34 8 31.5 30 L28 30 Q29 12 20 10 Q11 12 12 30Z" fill="'+hair+'"/>';
  h+='<circle cx="20" cy="16" r="10.5" fill="'+skin+'"/>';
  if(style===1)h+='<path d="M9.5 15 Q10 4 20 4.5 Q30 4 30.5 15 Q26 9 20 9.5 Q14 9 9.5 15Z" fill="'+hair+'"/>';
  if(style===2)h+='<path d="M9.5 14 Q11 4 20 4.5 Q29 4 30.5 14 Q20 7 9.5 14Z" fill="'+hair+'"/>';
  if(style===3)h+='<path d="M9.5 14 Q13 3 24 5 Q31 7 30.5 14 Q22 8 14 12Z" fill="'+hair+'"/>';
  if(style===4)h+='<g fill="'+hair+'"><circle cx="12" cy="9" r="4.5"/><circle cx="20" cy="6.5" r="5"/><circle cx="28" cy="9" r="4.5"/></g>';
  h+='<circle cx="16" cy="16.5" r="1.3" fill="#222"/><circle cx="24" cy="16.5" r="1.3" fill="#222"/>';
  if(glasses)h+='<g fill="none" stroke="#222" stroke-width="1"><circle cx="16" cy="16.5" r="3.3"/><circle cx="24" cy="16.5" r="3.3"/><line x1="19.3" y1="16.5" x2="20.7" y2="16.5"/></g>';
  h+='<path d="M16.5 21 Q20 23.5 23.5 21" fill="none" stroke="#222" stroke-width="1.1" stroke-linecap="round"/></svg>';
  return h;
}

/* ===== HEMICICLO ===== */
const HEMI=(function(){
  const rows=10,r0=.4,r1=1,N=TOTAL_SEATS;const radii=[];for(let k=0;k<rows;k++)radii.push(r0+(r1-r0)*k/(rows-1));
  const tot=radii.reduce((a,x)=>a+x,0);const counts=radii.map(r=>Math.round(N*r/tot));
  let diff=N-counts.reduce((a,x)=>a+x,0);for(let k=rows-1;diff!==0;k=(k+rows-1)%rows){counts[k]+=Math.sign(diff);diff-=Math.sign(diff);}
  const pts=[];counts.forEach((n,k)=>{for(let j=0;j<n;j++){pts.push({a:Math.PI*(1-(n===1?.5:j/(n-1))),r:radii[k]});}});
  pts.sort((x,y)=>y.a-x.a||x.r-y.r);return pts;
})();
function hemiSVG(seats,mine){
  const W=600,H=325,cx=300,cy=300,R=288;const order=CTX.parties.map(p=>p.id).filter(id=>(seats[id]||0)>0).sort((a,b)=>PT[a].lr-PT[b].lr);
  const colors=[];order.forEach(id=>{for(let k=0;k<seats[id];k++)colors.push(COL(id));});const rad=R*.6/9*.40;
  let out='<svg class="hemi" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Hemiciclo" style="width:100%;height:auto;display:block">';
  HEMI.forEach((p,i)=>{const x=cx+p.r*R*Math.cos(p.a),y=cy-p.r*R*Math.sin(p.a);const c=i<colors.length?colors[i]:'#27335F';
    out+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+rad.toFixed(1)+'" fill="'+c+'"'+(i>=colors.length?' opacity=".55"':'')+'/>';});
  return out+'</svg>';
}
function legend(seats){return CTX.parties.map(p=>p.id).filter(id=>(seats[id]||0)>0).sort((a,b)=>seats[b]-seats[a]).map(id=>'<span><i class="dot" style="background:'+COL(id)+'"></i>'+PT[id].s+' <b>'+seats[id]+'</b></span>').join('');}

/* ===== VISTAS ===== */
const SETUP={party:'PPE',prov:'J',name:'',seed:'',female:false};
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function diffLabel(s0){return s0===0?['Extrema','Tu partido no saca escaño aquí hoy'] : s0===1?['Muy difícil','Un escaño disputado']:s0<=3?['Difícil','Pocos escaños, muchos aspirantes']:['Asequible','Hay sitio si trabajas'];}
function viewTitle(){
  const save=lsGet('carrera_save',null); const hist=lsGet('carrera_hist',[]);
  const picks=PLAYABLE_IDS.map(id=>'<button class="pick" data-pick="'+id+'" aria-pressed="'+(SETUP.party===id)+'" style="--pc:'+COL(id)+'">'+figure(PT[id].lr*31,COL(id),38)+'<h3>'+esc(PT[id].s)+'</h3><span class="mut" style="font-size:12.5px">'+esc(PT[id].name)+'</span><p>'+esc(FP_TABLE.find(p=>p.id===id).tag)+'</p></button>').join('');
  const opts=PROV.slice().sort((a,b)=>a.name.localeCompare(b.name,'es')).map(P=>{const s0=baseSeats(SETUP.party,P.id);return '<option value="'+P.id+'"'+(SETUP.prov===P.id?' selected':'')+'>'+esc(P.name)+' · '+P.seats+' esc. · tu partido: '+s0+'</option>';}).join('');
  const s0=baseSeats(SETUP.party,SETUP.prov); const dl=diffLabel(s0); const P=PROV[PROV_IDX[SETUP.prov]];
  return '<h2 class="h-sec" style="font-size:44px">Carrera política</h2><p class="note" style="margin:0 0 6px">Empiezas de militante en una provincia real y quieres llegar al Congreso. Los partidos y las personas son inventados. El reparto de escaños, no.</p>'+
   (save?'<div class="panel" style="margin:12px 0;border-color:var(--acc)"><b>Tienes una partida a medias.</b> <span class="mut">'+esc(save.name)+' · '+esc(PT[save.party].s)+' · Legislatura '+save.leg+'</span><div class="row" style="margin-top:10px"><button class="btn sm" data-act="continue">Continuar</button><button class="btn sm ghost" data-act="discard">Descartar</button></div></div>':'')+
   '<div class="eyebrow" style="margin:18px 0 8px">1 · Tu partido</div><div class="setup">'+picks+'</div>'+
   '<div class="eyebrow" style="margin:18px 0 8px">2 · Tu provincia</div><div class="panel"><label class="field" style="margin:0"><select id="provSel" style="width:100%">'+opts+'</select></label>'+
   '<p style="margin:10px 0 0"><span class="chip">Dificultad: <b style="color:var(--fg)">'+dl[0]+'</b></span> <span class="mut" style="font-size:13px">'+dl[1]+'. '+esc(P.name)+' reparte '+P.seats+' escaños.</span></p></div>'+
   '<div class="eyebrow" style="margin:18px 0 8px">3 · Tú</div><div class="panel"><div class="row" style="gap:14px;align-items:flex-start">'+
   '<div style="flex:none">'+figure(((SETUP.seed|0)*7919)%999983+1,COL(SETUP.party),64,SETUP.female)+'</div><div style="flex:1;min-width:200px"><label class="field"><span>Nombre (vacío = al azar)</span><input type="text" id="nameIn" maxlength="40" value="'+esc(SETUP.name)+'" placeholder="Ej.: Marta Gil Ortega" style="width:100%"></label>'+
   '<label class="field"><span>Semilla (vacío = al azar). Con la misma semilla, la misma partida.</span><input type="text" id="seedIn" maxlength="9" inputmode="numeric" value="'+esc(SETUP.seed)+'" style="width:100%"></label>'+
   '<div class="seg" data-seg="female"><button data-v="0" aria-pressed="'+(!SETUP.female)+'">Hombre</button><button data-v="1" aria-pressed="'+SETUP.female+'">Mujer</button></div></div></div></div>'+
   '<div class="row" style="margin-top:18px"><button class="btn" data-act="start" style="font-size:17px">Empezar de militante</button><span class="chip" title="Fundar un partido llegará en una fase posterior">Fundar un partido: próximamente</span></div>'+
   (hist.length?'<div class="eyebrow" style="margin:26px 0 8px">Últimas carreras</div><div class="panel">'+hist.map(h=>'<div class="rowline"><b>'+esc(h.name)+'</b> <span class="mut">'+esc(PT[h.party]?PT[h.party].s:h.party)+' · '+esc(h.prov)+' · '+(h.out==='diputado'?'Diputado/a en la legislatura '+h.leg:'Sin escaño')+'</span><span class="sp"></span><b class="mono">'+h.score+'</b></div>').join('')+'</div>':'')+
   '<details style="margin-top:22px"><summary>Cómo se juega</summary><div class="panel" style="margin-top:8px"><p style="margin:0 0 8px">Cada legislatura tiene 8 semestres. En cada uno recibes una orden del partido o un imprevisto, y después eliges cómo pasas el semestre.</p><p style="margin:0 0 8px">Tu <b>puesto en la lista</b> sale de tu Lealtad, tu Base y tu Fama. Al cierre de listas se fija, y el día de las elecciones los escaños se reparten con el sistema real (D\'Hondt, 3 % por provincia).</p><p style="margin:0">Si tu partido logra tantos escaños como tu puesto, eres diputado. Si no, vuelves a empezar con lo aprendido. Tienes '+MAX_LEG+' legislaturas.</p></div></details>';
}
const statBar=(k,v)=>'<div class="stat" title="'+esc(STAT_HELP[k])+'"><span>'+STAT_NAMES[k]+'</span><div class="t"><i style="width:'+Math.round(v)+'%;background:'+({L:'#6AA7FF',C:'#C28BFF',B:'#43D18B',F:'#FFC93C'})[k]+'"></i></div><b class="mono">'+Math.round(v)+'</b></div>';
function hud(){
  const rk=ranking(G.phase==='campaign'||G.phase==='night'||G.phase==='result'); const pos=rk.findIndex(x=>x.o.me)+1; const ps=G.phase==='campaign'||G.phase==='night'||G.phase==='result'?(G.el?G.el.won:projSeats()):projSeats();
  const lo=Math.max(0,Math.min(pos-3,rk.length-5)), hi=Math.min(rk.length,lo+5);
  const ladder=rk.slice(lo,hi).map((x,i)=>{const n=lo+i+1;const inn=n<=ps;return '<div class="lad'+(x.o.me?' me':'')+'">'+'<b class="mono n">'+n+'</b>'+figure(x.o.look,x.o.me?COL(G.party):'#5D6A96',22,x.o.female)+'<span class="nm">'+esc(x.o.me?G.name+' (tú)':x.o.name)+'</span><i class="'+(inn?'in':'out')+'"></i></div>';}).join('');
  const dots=Array.from({length:TURNS},(_,i)=>'<i class="'+(i<G.turn-1||G.phase==='lists'||G.phase==='campaign'||G.phase==='night'||G.phase==='result'?'on':(i===G.turn-1?'cur':''))+'"></i>').join('');
  return '<aside class="ghud panel"><div class="row" style="margin-bottom:8px"><b style="color:'+COL(G.party)+'">'+esc(PT[G.party].s)+'</b><span class="mut" style="font-size:13px">· '+esc(PROV[provIdx()].name)+'</span></div>'+
   '<div class="eyebrow">Legislatura '+G.leg+' de '+MAX_LEG+'</div><div class="dots">'+dots+'</div>'+
   ['L','C','B','F'].map(k=>statBar(k,G.st[k])).join('')+
   '<div class="facts" style="margin:12px 0 8px"><div class="fact"><b>'+pos+'</b><span>Tu puesto en la lista</span></div><div class="fact"><b style="color:'+COL(G.party)+'">'+ps+'</b><span>Escaños de tu partido aquí</span></div></div>'+
   '<div class="eyebrow" style="margin:6px 0 4px">Tu entorno en la lista</div><div class="ladder">'+ladder+'</div><p class="note" style="margin:6px 0 0;font-size:12px">Punto verde: puestos que hoy dan escaño.</p></aside>';
}
const dchips=d=>d?['L','C','B','F'].filter(k=>d[k]).map(k=>'<span class="dchip '+(d[k]>0?'up':'dn')+'">'+STAT_NAMES[k]+' '+(d[k]>0?'+':'')+d[k]+'</span>').join(''):'';
function viewCard(){
  const c=CARD_BY_ID[G.card]; const isEv=c.kind==='evento';
  const who=isEv?'Imprevisto':'Orden del partido';
  const opts=c.o.map((o,i)=>{const cls=isEv?'ev':(o.k==='obey'?'obey':o.k==='nuance'?'nuance':'disobey');
    const tag=isEv?'':(o.k==='obey'?'Obedecer':o.k==='nuance'?'Matizar':'Desobedecer');
    return '<button class="gopt '+cls+'" data-act="ans" data-i="'+i+'">'+(tag?'<small>'+tag+'</small>':'')+'<b>'+esc(o.l)+'</b></button>';}).join('');
  return '<div class="gwrap"><section><div class="eyebrow">Semestre '+G.turn+' de '+TURNS+' · '+who+'</div>'+
   '<div class="gcard" id="gcard" data-swipe="'+(isEv?'2':'3')+'"><div class="gc-fig">'+figure(G.seed+G.turn*13+G.leg*101,isEv?'#5D6A96':COL(G.party),56)+'</div><h3>'+esc(c.t)+'</h3>'+
   '<details><summary>Ver más</summary><p>'+esc(c.x)+'</p></details><div class="gopts '+(isEv?'two':'three')+'">'+opts+'</div><p class="swhint">Arrastra la tarjeta: derecha '+(isEv?'= primera opción':'= obedecer')+', izquierda '+(isEv?'= segunda':'= desobedecer')+'.</p></div></section>'+hud()+'</div>';
}
function viewAction(){
  const tiles=G.offer.map(id=>{const a=ACTIONS[id];return '<div class="atile"><b>'+esc(a.n)+'</b><span>'+esc(a.d)+'</span><details><summary>Ver más</summary><p>'+esc(a.x)+'</p></details><button class="btn sm" data-act="do" data-id="'+id+'">Hacer esto</button></div>';}).join('');
  return '<div class="gwrap"><section><div class="eyebrow">Semestre '+G.turn+' de '+TURNS+' · Cómo pasas el semestre</div>'+
   '<div class="res"><p style="margin:0 0 8px">'+esc(G.last)+'</p><div>'+dchips(G.lastD)+'</div></div>'+
   '<div class="atiles">'+tiles+'</div></section>'+hud()+'</div>';
}
function viewLists(){
  const rk=ranking(true); const ps=projSeats(); const pos=G.pos; const show=rk.slice(0,Math.max(ps+3,pos+2,8));
  const rows=show.map((x,i)=>{const n=i+1;return '<div class="lrow'+(x.o.me?' me':'')+(n===ps?' cut':'')+'"><b class="mono n">'+n+'</b>'+figure(x.o.look,x.o.me?COL(G.party):'#5D6A96',26,x.o.female)+'<span class="nm">'+esc(x.o.me?G.name+' (tú)':x.o.name)+'</span><span class="mut" style="font-size:12px">'+(x.o.me?'':esc(ARCH[x.o.arch].n))+'</span><i class="'+(n<=ps?'in':'out')+'"></i></div>';}).join('');
  const ok=pos<=ps;
  return '<div class="gwrap"><section><div class="eyebrow">Cierre de listas · '+esc(PROV[provIdx()].name)+'</div><h2 class="h-sec">Lista cerrada de '+esc(PT[G.party].s)+'</h2>'+
   '<div class="verdict '+(ok?'ok':'ko')+'" style="margin:10px 0 14px"><div class="eyebrow">Tu puesto</div><h3>Número '+pos+'</h3><p style="margin:6px 0 0">'+(ok?'Hoy los números te dan escaño. Una mala noche puede quitártelo.':ps===0?'Tu partido no saca escaño aquí hoy. Haría falta un milagro, o una buena campaña.':'Tu partido saca '+ps+' escaño'+(ps===1?'':'s')+' en la proyección. Con tu puesto quedas fuera, pero la noche electoral da sorpresas.')+'</p></div>'+
   '<div class="panel">'+rows+'</div><details style="margin-top:10px"><summary>Por qué estás aquí</summary><p class="note">Tu puesto sale de tu Lealtad, tu Base y tu Fama a partes casi iguales, más un poco de lo que pase en los despachos al cerrar la lista. Quienes tienen más Lealtad sufren menos ese ruido.</p></details>'+
   '<div class="row" style="margin-top:14px"><button class="btn" data-act="to-campaign">Empezar la campaña →</button></div></section>'+hud()+'</div>';
}
function viewCampaign(){
  const tiles=Object.keys(CAMPAIGN).map(id=>{const a=CAMPAIGN[id];return '<div class="atile"><b>'+esc(a.n)+'</b><span>'+esc(a.d)+'</span><details><summary>Ver más</summary><p>'+esc(a.x)+'</p></details><button class="btn sm" data-act="camp" data-id="'+id+'">Hacer esto</button></div>';}).join('');
  return '<div class="gwrap"><section><div class="eyebrow">Campaña electoral · últimas semanas</div><h2 class="h-sec">Una decisión antes de abrir las urnas</h2><p class="note" style="margin:6px 0 14px">Tu puesto ya está fijado. Lo que hagas ahora mueve votos en tu provincia.</p><div class="atiles">'+tiles+'</div></section>'+hud()+'</div>';
}
function nightBars(sh){
  return Object.keys(sh).filter(id=>id!=='OTROS'&&sh[id]>=1).sort((a,b)=>sh[b]-sh[a]).slice(0,6).map(id=>'<div class="nb"><span><i class="dot" style="background:'+COL(id)+'"></i>'+esc(PT[id].s)+'</span><div class="t"><i style="width:'+Math.min(100,sh[id]*2.2)+'%;background:'+COL(id)+'"></i></div><b class="mono">'+f1(sh[id])+' %</b></div>').join('');
}
function viewNight(){
  const el=G.el,step=G.night.step,P=PROV[provIdx()];
  const sh=step>=10?el.shares:nightPartial(step); const alloc=allocate(sh,el.seatsTotal,'dhondt',3);
  const slots=[];Object.keys(alloc).sort((a,b)=>sh[b]-sh[a]).forEach(id=>{for(let k=0;k<alloc[id];k++)slots.push(id);});
  const mySlots=slots.filter(id=>id===G.party).length; const inside=G.pos<=mySlots;
  const slotHtml=slots.map(id=>'<i class="slot" style="background:'+COL(id)+'" title="'+esc(PT[id].s)+'"></i>').join('');
  let status='';
  if(step<10)status='Escrutado el '+step*10+' %. Ahora mismo '+esc(PT[G.party].s)+' tiene '+mySlots+' escaño'+(mySlots===1?'':'s')+' aquí. Tu puesto es el '+G.pos+': <b style="color:'+(inside?'var(--good)':'var(--bad)')+'">'+(inside?'DENTRO':'FUERA')+'</b>.';
  else status='Escrutinio al 100 %. '+(el.elected?'Eres diputado/a.':'Te quedas fuera.');
  const hemi=step>=10?'<div class="panel" style="margin-top:12px"><div class="eyebrow" style="margin-bottom:6px">Congreso resultante</div>'+hemiSVG(el.national)+'<div class="legend">'+legend(el.national)+'</div></div>':'';
  return '<section class="night1"><div class="night-top"><div><div class="eyebrow">Noche electoral · '+esc(P.name)+'</div><div class="pct" id="npct">'+(step*10)+'<small>%</small></div></div><span class="sp"></span><div class="row">'+(step<10?'<button class="btn" data-act="night-play">'+(G.nightRun?'⏸ Pausar':'▶ Seguir')+'</button><button class="btn ghost" data-act="night-skip">Saltar</button>':'<button class="btn" data-act="night-done">Ver mi resultado →</button>')+'</div></div>'+
   '<div class="progress"><i style="width:'+step*10+'%"></i></div><div class="ticker">'+status+'</div>'+
   '<div class="panel" style="margin-top:12px"><div class="eyebrow" style="margin-bottom:8px">Voto en tu provincia</div>'+nightBars(sh)+'<div class="eyebrow" style="margin:14px 0 6px">'+el.seatsTotal+' escaños en juego</div><div class="slots">'+slotHtml+'</div></div>'+hemi+'</section>';
}
function viewResult(){
  const el=G.el; const P=PROV[provIdx()]; const v=n=>n.toLocaleString('es-ES');
  let cls,title,txt;
  if(el.elected){cls='ok';title='Eres diputado/a';txt=el.margin<2500?'Tu escaño nº '+G.pos+' se decidió por unos '+v(el.margin)+' votos. Un autobús mal aparcado en un colegio habría bastado.':el.margin<15000?'Tu escaño nº '+G.pos+' se salvó por unos '+v(el.margin)+' votos de margen.':'Tu escaño nº '+G.pos+' entró con holgura: unos '+v(el.margin)+' votos de margen.';}
  else if(el.kind==='umbral'){cls='ko';title='Sin escaño';txt='Tu partido no llega al 3 % en '+P.name+'. Le faltaron unos '+v(el.margin)+' votos para entrar en el reparto.';}
  else{cls='ko';title='Te quedas fuera';txt=(el.margin<2500?'El escaño nº '+G.pos+' se te escapó por unos '+v(el.margin)+' votos.':'Al escaño nº '+G.pos+' le faltaron unos '+v(el.margin)+' votos.')+' En el despacho dicen que «la próxima será la buena».';}
  return '<section class="night1"><div class="verdict '+cls+'"><div class="eyebrow">Resultado · '+esc(P.name)+' · Legislatura '+G.leg+'</div><h3>'+title+'</h3><p style="margin:8px 0 0">'+txt+'</p></div>'+
   '<div class="facts" style="margin-top:14px"><div class="fact"><b>'+G.pos+'</b><span>Tu puesto</span></div><div class="fact"><b>'+el.won+'</b><span>Escaños de tu partido aquí</span></div><div class="fact"><b>'+f1(el.shares[G.party])+' %</b><span>Voto de tu partido aquí</span></div></div>'+
   '<div class="row" style="margin-top:14px">'+(el.elected?'<button class="btn" data-act="res-next">Ver mi carrera →</button>':(G.leg>=MAX_LEG?'<button class="btn" data-act="res-next">Retirarte →</button>':'<button class="btn" data-act="res-next">Otra legislatura →</button>'))+'</div></section>';
}
function viewEnd(){
  const win=G.out==='diputado'; const lines=epilogueLines().map(t=>'<p style="margin:0 0 8px">'+esc(t)+'</p>').join('');
  return '<section class="night1"><div class="verdict '+(win?'ok':'mid')+'"><div class="eyebrow">'+esc(G.name)+' · '+esc(PT[G.party].s)+' · '+esc(PROV[provIdx()].name)+'</div><h3>'+(win?'Diputado/a del Congreso':'Fuera de la política')+'</h3></div>'+
   '<div class="panel" style="margin-top:12px"><div class="row" style="align-items:flex-start;gap:16px"><div>'+figure(G.look,COL(G.party),84,G.female)+'</div><div style="flex:1;min-width:220px">'+lines+'</div></div></div>'+
   '<div class="facts" style="margin-top:12px"><div class="fact"><b>'+finalScore()+'</b><span>Puntuación</span></div><div class="fact"><b>'+G.leg+'</b><span>Legislaturas</span></div>'+['L','C','B','F'].map(k=>'<div class="fact"><b>'+Math.round(G.st[k])+'</b><span>'+STAT_NAMES[k]+'</span></div>').join('')+'</div>'+
   '<div class="row" style="margin-top:14px"><button class="btn" data-act="copy">Copiar resultado</button><button class="btn ghost" data-act="again">Nueva partida</button></div></section>';
}

/* ===== RENDER Y EVENTOS ===== */
let nightTimer=null;
function stopNight(){if(nightTimer){clearInterval(nightTimer);nightTimer=null;}if(G)G.nightRun=false;}
function render(){
  const root=document.getElementById('app'); let h;
  if(!G)h=viewTitle();
  else{switch(G.phase){case 'card':h=viewCard();break;case 'action':h=viewAction();break;case 'lists':h=viewLists();break;case 'campaign':h=viewCampaign();break;case 'night':h=viewNight();break;case 'result':h=viewResult();break;default:h=viewEnd();}
    if(!G.done)lsSet('carrera_save',G);}
  root.innerHTML=h; bindSwipe();
}
function bindSwipe(){
  const c=document.getElementById('gcard'); if(!c)return; let x0=null,dx=0;
  c.addEventListener('pointerdown',e=>{if(e.target.closest('button,summary,details'))return;x0=e.clientX;dx=0;});
  c.addEventListener('pointermove',e=>{if(x0==null)return;dx=e.clientX-x0;c.style.transform='translateX('+dx*.6+'px) rotate('+dx*.04+'deg)';c.style.borderColor=dx>40?'var(--good)':dx<-40?'var(--bad)':'';});
  const end=()=>{if(x0==null)return;const n=+c.dataset.swipe;const d=dx;x0=null;c.style.transform='';c.style.borderColor='';
    if(d>90)pickAnswer(0);else if(d<-90)pickAnswer(n===3?2:1);};
  c.addEventListener('pointerup',end);c.addEventListener('pointercancel',()=>{x0=null;c.style.transform='';});
}
function pickAnswer(i){if(!G||G.phase!=='card')return;if(answerCard(i))render();}
function startFromSetup(){
  const seed=(String(SETUP.seed).replace(/\D/g,'')|0)||((Date.now()%900000000)+1);
  newGame({party:SETUP.party,prov:SETUP.prov,name:SETUP.name.trim().slice(0,40),female:SETUP.female,seed:seed}); render();
}
function nightTick(){
  if(!G||G.phase!=='night'){stopNight();return;}
  if(G.night.step<10){G.night.step++;render();}
  if(G.night.step>=10)stopNight();
}
document.addEventListener('click',e=>{
  const t=e.target.closest('button'); if(!t)return;
  if(t.dataset.pick){SETUP.party=t.dataset.pick;render();return;}
  const seg=t.closest('[data-seg="female"]'); if(seg){SETUP.female=t.dataset.v==='1';render();return;}
  const a=t.dataset.act; if(!a)return;
  switch(a){
    case 'start':startFromSetup();break;
    case 'continue':{const s=lsGet('carrera_save',null);if(s){G=s;render();}break;}
    case 'discard':lsSet('carrera_save',null);render();break;
    case 'ans':pickAnswer(+t.dataset.i);break;
    case 'do':if(doAction(t.dataset.id))render();break;
    case 'to-campaign':G.phase='campaign';render();break;
    case 'camp':if(doCampaign(t.dataset.id))render();break;
    case 'night-play':if(G.nightRun){stopNight();render();}else{G.nightRun=true;nightTimer=setInterval(nightTick,800);nightTick();}break;
    case 'night-skip':stopNight();G.night.step=10;render();break;
    case 'night-done':stopNight();finishNight();render();break;
    case 'res-next':resultNext();render();break;
    case 'copy':{const txt='Carrera política · '+G.name+' ('+PT[G.party].s+', '+PROV[provIdx()].name+') · '+(G.out==='diputado'?'Diputado/a en la legislatura '+G.leg+', puesto '+G.pos:'Sin escaño tras '+G.leg+' legislaturas')+' · '+finalScore()+' puntos';
      const done=()=>{t.textContent='Copiado';setTimeout(()=>t.textContent='Copiar resultado',1600);};
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,()=>{t.textContent='No se pudo copiar';});else t.textContent='No se pudo copiar';break;}
    case 'again':stopNight();lsSet('carrera_save',null);G=null;render();break;
    case 'home':stopNight();if(G&&!G.done){lsSet('carrera_save',G);}G=null;render();break;
  }
});
document.addEventListener('input',e=>{const t=e.target; if(t.id==='nameIn')SETUP.name=t.value; else if(t.id==='seedIn')SETUP.seed=t.value;});
document.addEventListener('change',e=>{const t=e.target; if(t.id==='provSel'){SETUP.prov=t.value;render();}});
document.addEventListener('keydown',e=>{
  if(!G||G.phase!=='card')return; if(e.target&&e.target.matches&&e.target.matches('input,select,textarea'))return;
  const isEv=CARD_BY_ID[G.card].kind==='evento';
  if(e.key==='ArrowRight')pickAnswer(0); else if(e.key==='ArrowLeft')pickAnswer(isEv?1:2); else if(e.key==='ArrowDown'&&!isEv)pickAnswer(1);
});
(function init(){render();})();
