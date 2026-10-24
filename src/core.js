/* ===== VEDA DE SONDEOS ===== */
/* Art. 69.7 de la LOREG: no se pueden publicar sondeos en los cinco días previos a la votación (24–28 nov 2026).
   Por prudencia la web los oculta también hasta el cierre de urnas del 29 (20:00). Por confirmar con la Junta Electoral Central.
   Con ?veda=1 se fuerza para probar. */
const VEDA_START=new Date('2026-11-24T00:00:00+01:00'), VEDA_END=new Date('2026-11-29T20:00:00+01:00');
function vedaActive(){
  try{ if(new URLSearchParams(location.search).get('veda')==='1') return true; }catch(e){}
  const n=Date.now(); return n>=VEDA_START.getTime()&&n<VEDA_END.getTime();
}
const R23={PP:33.06,PSOE:31.68,VOX:12.38,FA:9.5,POD:2.83,ERC:1.89,JUNTS:1.6,BILDU:1.36,PNV:1.12,BNG:0.62,CC:0.46,UPN:0.21,OTROS:3.29};
const SEATS23={PP:137,PSOE:121,VOX:33,FA:31,POD:0,ERC:7,JUNTS:7,BILDU:6,PNV:5,BNG:1,CC:1,UPN:1};
const NOWP=nowParties();
const IDS=NOWP.map(p=>p.id);
const PROV_IDX={};PROV.forEach((p,i)=>PROV_IDX[p.id]=i);

function norm100(s,pin){
  const ids=Object.keys(s),fixed=pin||[];const fs=fixed.reduce((a,i)=>a+s[i],0);
  const free=ids.filter(i=>!fixed.includes(i)),sum=free.reduce((a,i)=>a+s[i],0);
  const k=(100-fs)/sum;free.forEach(i=>s[i]=Math.max(0,s[i]*k));return s;
}
function shift(s,id,d){const others=Object.keys(s).filter(i=>i!==id),sum=others.reduce((a,i)=>a+s[i],0);if(d>sum)d=sum;s[id]+=d;others.forEach(i=>s[i]-=d*s[i]/sum);if(s[id]<0)s[id]=0;return s;}
function take(s,to,from,amt){const a=Math.min(amt,s[from]);s[from]-=a;s[to]+=a;return a;}
function zeroShares(){const s={};IDS.forEach(i=>s[i]=0);return s;}
function baseShares(){const s=zeroShares();if(vedaActive())Object.assign(s,R23);else Object.assign(s,pollToShares(POLL_SETS.media));return norm100(s);}

/* ===== ESCENARIOS RÁPIDOS ===== */
/* Cada escenario parte de la base (encuestas hoy; durante la veda, el resultado de 2023) y la mueve. */
const SCENARIOS=[
  {id:'hoy',icon:'◉',label:'Encuestas hoy',desc:'La media de 40 encuestas del 23 de octubre.',poll:true,f:s=>{}},
  {id:'r23',icon:'⟲',label:'Como en 2023',desc:'Se repite el reparto de votos del 23J de 2023.',f:s=>{Object.keys(s).forEach(k=>s[k]=0);Object.assign(s,R23);}},
  {id:'remontada',icon:'▲',label:'Remontada del PSOE',desc:'El PSOE sube cuatro puntos a costa del PP, Vox y los pequeños.',f:s=>{take(s,'PSOE','PP',2);take(s,'PSOE','VOX',1);take(s,'PSOE','OTROS',1);}},
  {id:'vox',icon:'▲',label:'Vox récord',desc:'Vox sube cuatro puntos y se queda con parte del voto del PP.',f:s=>{take(s,'VOX','PP',3);take(s,'VOX','PSOE',1);}},
  {id:'ppsolo',icon:'▲',label:'El PP se dispara',desc:'El PP sube cinco puntos con voto útil de Vox, PSOE y pequeños.',f:s=>{take(s,'PP','VOX',2);take(s,'PP','PSOE',2);take(s,'PP','OTROS',1);}},
  {id:'unidad',icon:'⇄',label:'Izquierda unida',desc:'Frente Amplio y Podemos se presentan juntos y suman un punto extra.',f:s=>{s.FA+=s.POD;s.POD=0;shift(s,'FA',1.2);}},
  {id:'regional',icon:'◆',label:'Regionales al alza',desc:'Los partidos regionales suben un punto y medio entre todos.',f:s=>{['ERC','JUNTS','BILDU','PNV','BNG','CC'].forEach(i=>{take(s,i,'PP',.13);take(s,i,'PSOE',.12);});}},
  {id:'fragmenta',icon:'✦',label:'Voto fragmentado',desc:'Los dos grandes pierden tres puntos que se reparten entre los demás.',f:s=>{take(s,'OTROS','PP',1.5);take(s,'OTROS','PSOE',1.5);}}
];
function scenarioList(){return SCENARIOS.filter(s=>!(s.poll&&vedaActive()));}
function scenarioById(id){const l=scenarioList();return l.find(s=>s.id===id)||l[0];}
function scenShares(id){const sc=scenarioById(id);const s=baseShares();sc.f(s);return norm100(s);}

/* ===== SIMULACIÓN EN DIRECTO ===== */
const SIM_OPTS={method:'dhondt',thr:3,mode:'prov'};
const LOCAL_PARTIES=['PP','PSOE','VOX','FA','POD'];
let BASE23_RES=null;
function base23Res(){if(!BASE23_RES){const s=zeroShares();Object.assign(s,R23);norm100(s);BASE23_RES=simulate(NOWP,s,SIM_OPTS);}return BASE23_RES;}
function makeNight(scenId,seed,idx){
  const base=scenShares(scenId);
  const rng=mulberry32(((seed>>>0)^Math.imul(idx+1,2654435761))>>>0);
  const shares=perturb(base,.06,rng);
  const ov={};PROV.forEach(P=>{ov[P.id]={};LOCAL_PARTIES.forEach(id=>{ov[P.id][id]=randn(rng)*1.1;});});
  const res=simulate(NOWP,shares,Object.assign({},SIM_OPTS,{ov:ov}));
  /* orden de escrutinio: pequeñas primero, grandes al final */
  const order=PROV.map(P=>({id:P.id,k:P.w*(.35+rng()*1.1)})).sort((a,b)=>a.k-b.k).map(x=>x.id);
  const ticks=[];let rest=order.slice();
  const sizes=[4,4,3,3,3,3,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1];
  let k=0;while(rest.length){const n=Math.min(sizes[k++]||1,rest.length);ticks.push(rest.splice(0,n));}
  return {scen:scenId,seed:seed,idx:idx,shares:shares,res:res,order:order,ticks:ticks,t:0,done:false,
    revealed:{},partial:{seats:zeroShares(),vote:zeroShares(),w:0}};
}
const WTOT=PROV.reduce((a,p)=>a+p.w,0);
function finalOrder(seats){return IDS.filter(id=>(seats[id]||0)>0).sort((a,b)=>PT[a].lr-PT[b].lr);}
/* avanza un paso: revela las provincias del siguiente grupo y devuelve los eventos */
function stepNight(N,prevLeaderId){
  const group=N.ticks[N.t]; if(!group)return [];
  const events=[];
  group.forEach(id=>{
    const i=PROV_IDX[id],pr=N.res.prov[i],P=PROV[i];N.revealed[id]=true;
    IDS.forEach(p=>{N.partial.seats[p]+=pr.seats[p]||0;N.partial.vote[p]+=P.w*pr.shares[p];});
    N.partial.w+=P.w;
    const b=base23Res().prov[i].win,w=pr.win;
    if(b!==w&&P.seats>=4)events.push({k:'vuelco',t:'Vuelco en '+P.name+': '+PT[b].s+' → '+PT[w].s,c:PT[w].c,prov:id});
    else if(P.seats>=10)events.push({k:'prov',t:P.name+' ('+P.seats+' escaños): gana '+PT[w].s+' con '+f1(pr.shares[w])+' %',c:PT[w].c,prov:id});
  });
  N.t++;
  const ranked=IDS.slice().sort((a,b)=>N.partial.seats[b]-N.partial.seats[a]);
  const leader=ranked[0];
  if(prevLeaderId&&leader!==prevLeaderId&&N.partial.seats[leader]>0&&N.partial.seats[ranked[1]]>0&&N.partial.seats[leader]>N.partial.seats[prevLeaderId])events.push({k:'adelanto',t:PT[leader].s+' adelanta a '+PT[prevLeaderId].s+' en el escrutinio',c:PT[leader].c});
  if(N.t>=N.ticks.length){N.done=true;
    const fs=N.res.seats,top=IDS.slice().sort((a,b)=>fs[b]-fs[a])[0];
    events.push({k:'fin',t:'Escrutinio al 100 %: '+PT[top].s+' gana con '+fs[top]+' escaños',c:PT[top].c});
  }
  return events;
}
function coalitions(seats){
  const sum=ids=>ids.reduce((a,i)=>a+(seats[i]||0),0);
  const def=[
    {id:'der',label:'Derecha',ids:['PP','VOX','UPN','CC','SALF','ALI']},
    {id:'prog',label:'Progresista',ids:['PSOE','FA','POD','ERC','JUNTS','BILDU','PNV','BNG','AA']},
    {id:'gran',label:'Gran coalición',ids:['PP','PSOE']},
    {id:'centro',label:'PP y regionales moderados',ids:['PP','PNV','JUNTS','CC','UPN']}
  ];
  return def.map(c=>{const n=sum(c.ids);const others=IDS.filter(i=>c.ids.indexOf(i)<0).reduce((a,i)=>a+(seats[i]||0),0);
    return {id:c.id,label:c.label,ids:c.ids.filter(i=>(seats[i]||0)>0),n:n,first:n>=176,second:n>others&&n<176,miss:Math.max(0,176-n)};});
}
