/* ===== DATOS ===== */
const TOTAL_SEATS = 350;
const ELECTION_DAY = '2026-11-29';

/* Partidos: nombre, color, posición izquierda-derecha (orden en el hemiciclo), bloque, forma territorial */
const PT = {
  POD:{s:'Podemos',name:'Podemos',c:'#9A55D6',lr:5,bloc:'I',shape:'pod'},
  FA:{s:'Frente Amplio',name:'Frente Amplio',c:'#E4237F',lr:10,bloc:'I',shape:'su'},
  SU:{s:'Sumar',name:'Sumar',c:'#E4237F',lr:10,bloc:'I',shape:'su'},
  UP:{s:'Unidas Podemos',name:'Unidas Podemos',c:'#9A55D6',lr:8,bloc:'I',shape:'su'},
  IU:{s:'PCE / IU',name:'PCE / Izquierda Unida',c:'#C23B4E',lr:9,bloc:'I',shape:'su'},
  MP:{s:'Más País',name:'Más País',c:'#2FB5A0',lr:12,bloc:'I',shape:'su'},
  BILDU:{s:'EH Bildu',name:'EH Bildu (HB / Amaiur)',c:'#C6D43A',lr:15,bloc:'N',shape:'bildu'},
  BNG:{s:'BNG',name:'Bloque Nacionalista Galego',c:'#6CC0F2',lr:17,bloc:'N',shape:'bng'},
  ERC:{s:'ERC',name:'Esquerra Republicana',c:'#FFB41F',lr:18,bloc:'N',shape:'erc'},
  AA:{s:'Adelante And.',name:'Adelante Andalucía',c:'#46B86B',lr:19,bloc:'N',shape:'aa'},
  PSP:{s:'PSP',name:'PSP-US',c:'#E5608C',lr:25,bloc:'I',shape:'psoe'},
  PSOE:{s:'PSOE',name:'PSOE',c:'#E1253B',lr:30,bloc:'I',shape:'psoe'},
  PNV:{s:'PNV',name:'Partido Nacionalista Vasco',c:'#0B7A4B',lr:42,bloc:'N',shape:'pnv'},
  JUNTS:{s:'Junts',name:'Junts per Catalunya',c:'#19C3B1',lr:46,bloc:'N',shape:'junts'},
  CIU:{s:'CiU',name:'Convergència i Unió',c:'#2B5FB8',lr:47,bloc:'N',shape:'junts'},
  UPYD:{s:'UPyD',name:'UPyD',c:'#E5258E',lr:48,bloc:'O',shape:'cs'},
  CDS:{s:'CDS',name:'CDS',c:'#7DBE5E',lr:49,bloc:'O',shape:'cs'},
  CS:{s:'Cs',name:'Ciudadanos',c:'#F26B21',lr:50,bloc:'O',shape:'cs'},
  UCD:{s:'UCD',name:'UCD',c:'#2EA0A8',lr:52,bloc:'D',shape:'ucd'},
  CC:{s:'CC',name:'Coalición Canaria',c:'#F2D21B',lr:55,bloc:'N',shape:'cc'},
  PP:{s:'PP',name:'Partido Popular',c:'#1F8FE0',lr:70,bloc:'D',shape:'pp'},
  UPN:{s:'UPN',name:'Unión del Pueblo Navarro',c:'#3A66C2',lr:72,bloc:'D',shape:'upn'},
  VOX:{s:'Vox',name:'Vox',c:'#74C22F',lr:90,bloc:'D',shape:'vox'},
  SALF:{s:'SALF',name:'Se Acabó La Fiesta',c:'#F5A524',lr:93,bloc:'O',shape:'salf'},
  ALI:{s:'Aliança',name:'Aliança Catalana',c:'#E8742A',lr:95,bloc:'O',shape:'ali'},
  OTROS:{s:'Otros',name:'Otros',c:'#7C86A2',lr:99,bloc:'O',shape:'otros'}
};

/* Provincias: [id, nombre, escaños, electores válidos (miles, aprox.), fila, col, pp, psoe, vox, sumar, extra]
   Las bases provinciales son aproximadas (forma territorial del voto de 2023). El modelo las ajusta para cuadrar el resultado nacional. */
const PROV_RAW = [
 ['AC','A Coruña',8,700,0,0,38,28,6,14,{bng:9}],
 ['LU','Lugo',4,230,0,1,46,30,5,8,{bng:7}],
 ['AS','Asturias',7,570,0,2,32,33,10,17,{}],
 ['CB','Cantabria',5,310,0,3,40,32,12,8,{}],
 ['BI','Bizkaia',8,650,0,4,13,24,4,9,{pnv:28,bildu:16}],
 ['SS','Gipuzkoa',6,400,0,5,9,21,3,9,{pnv:26,bildu:30}],
 ['PO','Pontevedra',7,600,1,0,38,30,6,11,{bng:9}],
 ['OR','Ourense',4,240,1,1,46,31,6,8,{bng:6}],
 ['LE','León',4,260,1,2,36,33,11,8,{}],
 ['P','Palencia',3,95,1,3,42,31,12,7,{}],
 ['BU','Burgos',4,220,1,4,40,29,13,8,{}],
 ['VI','Álava',4,210,1,5,19,25,6,9,{pnv:25,bildu:15}],
 ['NA','Navarra',5,370,1,6,11,30,8,9,{bildu:17,pnv:5,upn:17}],
 ['HU','Huesca',3,130,1,7,36,31,14,8,{}],
 ['LL','Lleida',4,230,1,8,14,25,8,8,{erc:14,junts:20,ali:3}],
 ['GI','Girona',6,400,1,9,11,24,8,9,{erc:14,junts:23,ali:4}],
 ['ZA','Zamora',3,100,2,2,45,31,11,7,{}],
 ['VA','Valladolid',5,290,2,3,39,31,12,11,{}],
 ['SO','Soria',2,55,2,4,41,28,10,7,{}],
 ['LO','La Rioja',4,190,2,5,43,32,11,9,{}],
 ['Z','Zaragoza',7,590,2,6,33,31,13,11,{}],
 ['TE','Teruel',3,80,2,7,40,30,14,6,{}],
 ['T','Tarragona',6,410,2,8,17,29,10,11,{erc:12,junts:13,ali:2}],
 ['B','Barcelona',32,3010,2,9,14,33,7,17,{erc:10,junts:11,ali:1.5}],
 ['SA','Salamanca',4,190,3,2,44,29,13,7,{}],
 ['AV','Ávila',3,90,3,3,48,28,12,5,{}],
 ['SG','Segovia',3,90,3,4,44,29,13,7,{}],
 ['GU','Guadalajara',3,140,3,5,41,29,16,8,{}],
 ['CU','Cuenca',3,110,3,6,43,33,13,6,{}],
 ['CS','Castellón',5,280,3,7,39,30,13,13,{}],
 ['PM','Baleares',8,610,3,9,36,31,12,14,{}],
 ['CC','Cáceres',4,255,4,2,38,38,12,6,{}],
 ['TO','Toledo',6,380,4,3,42,31,15,8,{}],
 ['M','Madrid',37,3330,4,4,39,26,13,17,{}],
 ['AB','Albacete',4,215,4,6,40,33,14,7,{}],
 ['V','Valencia',16,1500,4,7,32,27,12,19,{}],
 ['BA','Badajoz',5,360,5,2,33,40,12,6,{}],
 ['CR','Ciudad Real',5,270,5,3,41,33,14,7,{}],
 ['J','Jaén',5,340,5,4,38,37,12,7,{aa:1.5}],
 ['GR','Granada',7,600,5,5,38,29,15,11,{aa:2}],
 ['MU','Murcia',10,820,5,6,41,25,22,9,{}],
 ['A','Alicante',12,1010,5,7,41,27,17,9,{}],
 ['H','Huelva',5,270,6,1,34,36,14,8,{aa:2.5}],
 ['SE','Sevilla',12,1040,6,2,33,36,12,12,{aa:3.5}],
 ['CO','Córdoba',6,480,6,3,37,30,15,11,{aa:2}],
 ['MA','Málaga',11,920,6,4,40,27,15,11,{aa:2}],
 ['AL','Almería',6,400,6,5,41,27,21,6,{aa:1}],
 ['CA','Cádiz',9,700,7,3,34,30,15,11,{aa:3}],
 ['CE','Ceuta',1,35,7,4,39,34,23,3,{}],
 ['ME','Melilla',1,35,7,6,42,25,22,4,{}],
 ['GC','Las Palmas',8,520,8,1,23,31,11,14,{cc:5}],
 ['TF','Santa Cruz de Tenerife',7,520,8,0,29,29,9,7,{cc:14}]
];
const CAT = {B:1,T:1,GI:1,LL:1};
const PROV = PROV_RAW.map(r=>{
  const b = Object.assign({pp:r[6],psoe:r[7],vox:r[8],su:r[9]}, r[10]);
  const known = Object.values(b).reduce((a,x)=>a+x,0);
  b.ot = Math.max(1.5, 100-known);
  return {id:r[0],name:r[1],seats:r[2],w:r[3],r:r[4],c:r[5],cat:!!CAT[r[0]],b};
});

/* Bloques para el pactómetro */
const BLOCS = {
  derecha:{label:'Derecha',ids:['PP','VOX','UPN','CC','SALF','ALI'],cand:'PP'},
  progresista:{label:'Progresista',ids:['PSOE','FA','POD','ERC','JUNTS','BILDU','PNV','BNG','AA','CC'],cand:'PSOE'}
};

/* Datos de encuestas del 23-oct-2026 (porcentaje nacional) */
const POLL_SETS = {
 media:{label:'Media de 40 encuestas',note:'Su Momento, 23-oct-2026',s:{PP:32.0,PSOE:26.4,VOX:19.0,FA:6.3,POD:3.1,SALF:1.8,ERC:2.2,JUNTS:1.2,BILDU:1.3,PNV:1.0,BNG:1.0,CC:0.4,UPN:0.2,AA:0.9,ALI:0.4},ref:null},
 sigma:{label:'Sigma Dos / El Mundo',note:'Trabajo de campo 1–14 oct',s:{PP:31.5,PSOE:25.3,VOX:19.5,FA:8.1,POD:2.8,SALF:1.0,ERC:2.5,JUNTS:1.2,BILDU:1.2,PNV:0.9,BNG:0.8,CC:0.5,UPN:0.2,AA:0.8,ALI:0.4},ref:{PP:135,PSOE:104,VOX:67,FA:13,POD:1,ERC:9,JUNTS:7,BILDU:7,PNV:6,BNG:2,CC:1,AA:2}},
 imop:{label:'IMOP / El Confidencial',note:'13–16 oct',s:{PP:28.5,PSOE:27.1,VOX:20.0,FA:8.9,POD:1.9,SALF:1.2,ERC:2.2,JUNTS:1.2,BILDU:1.3,PNV:1.0,BNG:1.1,CC:0.6,UPN:0.2,AA:0.8,ALI:0.4},ref:{PP:123,PSOE:113,VOX:72,FA:14,POD:1,ERC:8,JUNTS:4,BILDU:6,PNV:5,BNG:2,CC:1}},
 electo:{label:'EM-Analytics / Electomanía',note:'15–17 oct',s:{PP:31.8,PSOE:27.1,VOX:18.9,FA:6.2,POD:2.0,SALF:1.7,ERC:2.1,JUNTS:1.2,BILDU:1.4,PNV:1.0,BNG:1.0,CC:0.3,UPN:0.2,AA:1.1,ALI:0.4},ref:{PP:134,PSOE:111,VOX:62,FA:10,POD:1,ERC:8,JUNTS:5,BILDU:7,PNV:6,BNG:3,AA:3}},
 socio:{label:'SocioMétrica / El Español',note:'10–11 oct',s:{PP:32.6,PSOE:26.2,VOX:18.8,FA:5.8,POD:2.8,SALF:2.1,ERC:2.0,JUNTS:1.5,BILDU:1.3,PNV:0.8,BNG:0.9,CC:0.5,UPN:0.2,AA:0.9,ALI:0.4},ref:{PP:141,PSOE:104,VOX:64,FA:8,POD:2,ERC:8,JUNTS:6,BILDU:7,PNV:4,BNG:2,CC:1,UPN:1,AA:1}},
 db40:{label:'40dB / Prisa',note:'7–8 oct',s:{PP:31.9,PSOE:28.1,VOX:18.9,FA:5.3,POD:2.3,SALF:1.8,ERC:2.0,JUNTS:1.2,BILDU:1.3,PNV:1.0,BNG:1.0,CC:0.4,UPN:0.2,AA:0.8,ALI:0.4},ref:{PP:132,PSOE:111,VOX:69,FA:6,POD:2,ERC:8,JUNTS:7,BILDU:7,PNV:6,BNG:2,CC:1,UPN:1}}
};

/* Elecciones históricas: [id, % voto, escaños oficiales] — el resto va a "Otros" */
const HIST_RAW = [
 {k:'1977',label:'1977',date:'15 jun 1977',turnout:78.8,p:[['UCD',34.4,166],['PSOE',29.3,118],['IU',9.4,20],['PP',8.3,16],['PSP',4.5,6],['CIU',2.8,11],['PNV',1.6,8]],names:{PP:'AP',IU:'PCE'},gov:'Adolfo Suárez (UCD)'},
 {k:'1979',label:'1979',date:'1 mar 1979',turnout:68.1,p:[['UCD',34.8,168],['PSOE',30.4,121],['IU',10.8,23],['PP',6.1,9],['CIU',2.7,8],['PNV',1.5,7],['BILDU',1.0,3]],names:{PP:'Coalición Democrática',IU:'PCE'},gov:'Adolfo Suárez (UCD)'},
 {k:'1982',label:'1982',date:'28 oct 1982',turnout:79.9,p:[['PSOE',48.1,202],['PP',26.5,107],['UCD',6.8,11],['IU',4.0,4],['CDS',2.9,2],['CIU',3.7,12],['PNV',1.9,8],['BILDU',1.0,2],['ERC',0.7,1]],names:{PP:'AP-PDP',IU:'PCE'},gov:'Felipe González (PSOE)'},
 {k:'1986',label:'1986',date:'22 jun 1986',turnout:70.5,p:[['PSOE',44.1,184],['PP',26.0,105],['CDS',9.2,19],['IU',4.6,7],['CIU',5.0,18],['PNV',1.5,6],['BILDU',1.1,5]],names:{PP:'Coalición Popular'},gov:'Felipe González (PSOE)'},
 {k:'1989',label:'1989',date:'29 oct 1989',turnout:69.7,p:[['PSOE',39.6,175],['PP',25.8,107],['IU',9.1,17],['CDS',7.9,14],['CIU',5.0,18],['PNV',1.2,5],['BILDU',1.1,4]],names:{},gov:'Felipe González (PSOE)'},
 {k:'1993',label:'1993',date:'6 jun 1993',turnout:76.4,p:[['PSOE',38.8,159],['PP',34.8,141],['IU',9.6,18],['CIU',4.9,17],['PNV',1.2,5],['CC',0.9,4],['BILDU',0.9,2],['ERC',0.8,1]],names:{},gov:'Felipe González (PSOE)'},
 {k:'1996',label:'1996',date:'3 mar 1996',turnout:77.4,p:[['PP',38.8,156],['PSOE',37.6,141],['IU',10.6,21],['CIU',4.6,16],['PNV',1.3,5],['CC',0.9,4],['BNG',0.9,2],['BILDU',0.7,2],['ERC',0.7,1]],names:{},gov:'José María Aznar (PP)'},
 {k:'2000',label:'2000',date:'12 mar 2000',turnout:68.7,p:[['PP',44.5,183],['PSOE',34.2,125],['IU',5.4,8],['CIU',4.2,15],['PNV',1.5,7],['BNG',1.3,3],['CC',1.1,4],['ERC',0.8,1]],names:{},gov:'José María Aznar (PP)'},
 {k:'2004',label:'2004',date:'14 mar 2004',turnout:75.7,p:[['PSOE',42.6,164],['PP',37.7,148],['IU',5.0,5],['CIU',3.2,10],['ERC',2.5,8],['PNV',1.6,7],['CC',0.9,3],['BNG',0.8,2]],names:{},gov:'José Luis Rodríguez Zapatero (PSOE)'},
 {k:'2008',label:'2008',date:'9 mar 2008',turnout:73.8,p:[['PSOE',43.9,169],['PP',39.9,154],['IU',3.8,2],['CIU',3.0,10],['PNV',1.2,6],['ERC',1.2,3],['BNG',0.8,2],['CC',0.7,2],['UPYD',1.2,1]],names:{},gov:'José Luis Rodríguez Zapatero (PSOE)'},
 {k:'2011',label:'2011',date:'20 nov 2011',turnout:68.9,p:[['PP',44.6,186],['PSOE',28.8,110],['IU',6.9,11],['UPYD',4.7,5],['CIU',4.2,16],['PNV',1.3,5],['BILDU',1.4,7],['ERC',1.1,3],['BNG',0.8,2],['CC',0.6,2]],names:{BILDU:'Amaiur'},gov:'Mariano Rajoy (PP)'},
 {k:'2015',label:'2015',date:'20 dic 2015',turnout:73.2,p:[['PP',28.7,123],['PSOE',22.0,90],['UP',20.7,69],['CS',13.9,40],['IU',3.7,2],['ERC',2.4,9],['JUNTS',2.2,8],['PNV',1.2,6],['BILDU',0.9,2],['CC',0.3,1]],names:{UP:'Podemos y confluencias',JUNTS:'Democràcia i Llibertat'},gov:'Mariano Rajoy (PP), tras repetir elecciones'},
 {k:'2016',label:'2016',date:'26 jun 2016',turnout:66.5,p:[['PP',33.0,137],['PSOE',22.6,85],['UP',21.2,71],['CS',13.1,32],['ERC',2.6,9],['JUNTS',2.0,8],['PNV',1.2,5],['BILDU',0.8,2],['CC',0.3,1]],names:{UP:'Unidos Podemos',JUNTS:'Convergència'},gov:'Mariano Rajoy (PP) hasta la moción de censura de 2018'},
 {k:'2019a',label:'Abr 2019',date:'28 abr 2019',turnout:71.8,p:[['PSOE',28.7,123],['PP',16.7,66],['CS',15.9,57],['UP',14.3,42],['VOX',10.3,24],['ERC',3.9,15],['JUNTS',1.9,7],['PNV',1.5,6],['BILDU',0.9,4],['CC',0.5,2]],names:{},gov:'Sin investidura: repetición electoral'},
 {k:'2019b',label:'Nov 2019',date:'10 nov 2019',turnout:66.2,p:[['PSOE',28.0,120],['PP',20.8,89],['VOX',15.1,52],['UP',12.8,35],['ERC',3.6,13],['CS',6.8,10],['JUNTS',2.2,8],['PNV',1.6,6],['BILDU',1.1,5],['MP',2.4,3],['CC',0.5,2],['BNG',0.5,1]],names:{},gov:'Pedro Sánchez (PSOE-UP)'},
 {k:'2023',label:'2023',date:'23 jul 2023',turnout:70.4,p:[['PP',33.06,137],['PSOE',31.68,121],['VOX',12.38,33],['SU',12.33,31],['ERC',1.89,7],['JUNTS',1.60,7],['BILDU',1.36,6],['PNV',1.12,5],['BNG',0.62,1],['CC',0.46,1],['UPN',0.21,1]],names:{},gov:'Pedro Sánchez (PSOE-Sumar)'}
];

function buildHist(h){
  const arr = h.p.map(([id,share,seats])=>({id,share,seats,name:(h.names&&h.names[id])||null}));
  const sh = arr.reduce((a,x)=>a+x.share,0), se = arr.reduce((a,x)=>a+x.seats,0);
  arr.push({id:'OTROS',share:Math.max(0.2,+(100-sh).toFixed(2)),seats:TOTAL_SEATS-se,name:null});
  return {key:h.k,label:h.label,date:h.date,turnout:h.turnout,gov:h.gov,official:true,parties:arr};
}
const HIST = HIST_RAW.map(buildHist);

function nowParties(){
  const ids=['PP','PSOE','VOX','FA','POD','SALF','ERC','JUNTS','BILDU','PNV','BNG','CC','UPN','AA','ALI','OTROS'];
  return ids.map(id=>({id,share:0,seats:null,name:null}));
}
function pollToShares(set){
  const s = Object.assign({}, set.s); const sum = Object.values(s).reduce((a,x)=>a+x,0);
  s.OTROS = +(100-sum).toFixed(2); return s;
}

/* Candidatos del 29N (según prensa, oct-2026) */
const CANDS = {PP:'Alberto Núñez Feijóo',PSOE:'Pedro Sánchez',VOX:'Santiago Abascal',FA:'Ada Colau',POD:'Irene Montero',ERC:'Gabriel Rufián',JUNTS:'Míriam Nogueras',BILDU:'Oskar Matute',BNG:'Néstor Rego',CC:'Cristina Valido',SALF:'Alvise Pérez'};

/* ===== MOTOR ELECTORAL ===== */
function shapeVal(P,key){
  const b=P.b;
  switch(key){
    case 'pp': return b.pp;
    case 'psoe': return b.psoe;
    case 'vox': return b.vox;
    case 'su': return b.su;
    case 'pod': return P.cat?0.01:b.su;
    case 'ucd': return .75*b.pp+.25*b.psoe;
    case 'cs': return .55*b.pp+.45*b.psoe;
    case 'salf': return 1;
    case 'otros': return b.ot;
    default: return b[key]||0;
  }
}

/* Ajuste proporcional iterativo: provincias suman 100 y el voto nacional (ponderado) coincide con los objetivos */
function fitProvinces(ctxParties, shares, iters){
  iters = iters||40;
  const ids = ctxParties.map(p=>p.id);
  const wsum = PROV.reduce((a,p)=>a+p.w,0);
  const X = PROV.map(P=>ids.map(id=>Math.max(1e-6, shapeVal(P,PT[id].shape)) * (shapeVal(P,PT[id].shape)<=0.001?0.0001:1)));
  const T = ids.map(id=>Math.max(0.0001, shares[id]||0));
  for(let it=0; it<iters; it++){
    for(let i=0;i<ids.length;i++){
      let cur=0; for(let p=0;p<PROV.length;p++) cur+=PROV[p].w*X[p][i];
      cur/=wsum; if(cur<=0) continue;
      const f=T[i]/cur; for(let p=0;p<PROV.length;p++) X[p][i]*=f;
    }
    for(let p=0;p<PROV.length;p++){
      let s=0; for(let i=0;i<ids.length;i++) s+=X[p][i];
      const f=100/s; for(let i=0;i<ids.length;i++) X[p][i]*=f;
    }
  }
  return {ids,X};
}

/* Reparto de escaños: métodos d'Hondt, Sainte-Laguë, Hare (restos mayores) */
function allocate(votes, n, method, thr){
  const ids=Object.keys(votes), tot=ids.reduce((a,i)=>a+votes[i],0);
  const elig=ids.filter(i=>votes[i]/tot*100>=thr && votes[i]>0);
  const out={}; ids.forEach(i=>out[i]=0);
  if(!elig.length||n<=0) return out;
  if(method==='hare'){
    const sum=elig.reduce((a,i)=>a+votes[i],0), q=sum/n;
    const rem=[]; let given=0;
    elig.forEach(i=>{const f=votes[i]/q; out[i]=Math.floor(f); given+=out[i]; rem.push([i,f-Math.floor(f)]);});
    rem.sort((a,b)=>b[1]-a[1]); for(let k=0;given<n;k++,given++) out[rem[k%rem.length][0]]++;
    return out;
  }
  const cand=[];
  elig.forEach(i=>{ for(let k=0;k<n;k++){ const d = method==='sainte' ? (k===0?1.4:2*k+1) : k+1; cand.push([votes[i]/d,i]); }});
  cand.sort((a,b)=>b[0]-a[0]);
  for(let k=0;k<n;k++) out[cand[k][1]]++;
  return out;
}

/* Simulación completa */
function simulate(ctxParties, shares, opts){
  opts=opts||{}; const method=opts.method||'dhondt', thr=opts.thr==null?3:opts.thr, mode=opts.mode||'prov', ov=opts.ov||{};
  const {ids,X}=fitProvinces(ctxParties, shares, opts.iters||40);
  const seats={}; ids.forEach(i=>seats[i]=0);
  const prov=[];
  for(let p=0;p<PROV.length;p++){
    const P=PROV[p]; const row={}; let tot=0;
    ids.forEach((id,i)=>{ let v=X[p][i]; const o=ov[P.id]&&ov[P.id][id]; if(o) v=Math.max(0,v+o); row[id]=v; tot+=v; });
    ids.forEach(id=>row[id]=row[id]/tot*100);
    let ps={}; ids.forEach(i=>ps[i]=0);
    if(mode==='prov'){ ps=allocate(row,P.seats,method,thr); ids.forEach(i=>seats[i]+=ps[i]); }
    let win=ids[0]; ids.forEach(i=>{ if(row[i]>row[win]) win=i; });
    prov.push({id:P.id,shares:row,seats:ps,win});
  }
  let nat={}; const wsum=PROV.reduce((a,p)=>a+p.w,0);
  ids.forEach(id=>{ let s=0; prov.forEach((r,p)=>s+=PROV[p].w*r.shares[id]); nat[id]=s/wsum; });
  if(mode==='unica'){
    const a=allocate(nat,TOTAL_SEATS,method,thr); ids.forEach(i=>seats[i]=a[i]);
  }
  return {seats,prov,nat,mode};
}

/* Aleatoriedad con semilla (mulberry32). El juego usa un generador global que se puede fijar con setSeed().
   Las probabilidades usan un generador propio derivado de los datos: mismos datos, mismos números. */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
let RNG=mulberry32((Date.now()^0x9E3779B9)>>>0);
function setSeed(n){RNG=mulberry32(n>>>0);}
function rnd(){return RNG();}
function hashShares(shares){let h=2166136261;Object.keys(shares).sort().forEach(k=>{const t=k+':'+Math.round(shares[k]*100)+';';for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619);}});return h>>>0;}

/* Ruido correlacionado para probabilidades */
function randn(r){r=r||rnd;let u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function perturb(shares, sigma, r){
  const zD=randn(r), zI=randn(r); const out={}; let sum=0;
  Object.keys(shares).forEach(id=>{
    const b=PT[id].bloc; const zb=b==='D'?zD:b==='I'?zI:0;
    const sg=(shares[id]>10?1:1.7)*sigma;
    out[id]=shares[id]*Math.exp(sg*(0.55*zb+0.85*randn(r))); sum+=out[id];
  });
  Object.keys(out).forEach(id=>out[id]=out[id]/sum*100);
  return out;
}
function monteCarlo(ctxParties, shares, opts, N, sigma){
  N=N||200; sigma=sigma==null?0.07:sigma;
  const ids=ctxParties.map(p=>p.id); const runs=[]; const r=mulberry32((hashShares(shares)^Math.imul(N,2654435761))>>>0);
  for(let k=0;k<N;k++){ const s=perturb(shares,sigma,r); runs.push(simulate(ctxParties,s,Object.assign({},opts,{iters:25})).seats); }
  const stat={}; ids.forEach(id=>{ const v=runs.map(r=>r[id]).sort((a,b)=>a-b); stat[id]={lo:v[Math.floor(N*.1)],med:v[Math.floor(N*.5)],hi:v[Math.min(N-1,Math.floor(N*.9))]}; });
  const blocSum=(r,ids2)=>ids2.reduce((a,i)=>a+(r[i]||0),0);
  const pr=(fn)=>runs.filter(fn).length/N;
  const first=(r,id)=>ids.every(o=>o===id||(r[o]||0)<=(r[id]||0));
  return {stat,runs:N,
    ppFirst:pr(r=>first(r,'PP')),
    psoeFirst:pr(r=>first(r,'PSOE')),
    derecha:pr(r=>blocSum(r,['PP','VOX','UPN','CC','SALF','ALI'])>=176),
    ppVox:pr(r=>blocSum(r,['PP','VOX'])>=176),
    progresista:pr(r=>blocSum(r,['PSOE','FA','SU','POD','UP','ERC','JUNTS','BILDU','PNV','BNG','AA','CC'])>=176),
    izqEstricta:pr(r=>blocSum(r,['PSOE','FA','SU','POD','UP'])>=176)
  };
}

/* Investidura: primera votación mayoría absoluta; segunda, más síes que noes */
function investiture(seats, stance, cand){
  let yes=0,no=0,abs=0;
  Object.keys(seats).forEach(id=>{ const s=(id===cand)?'si':(stance[id]||'no'); if(s==='si')yes+=seats[id]; else if(s==='abs')abs+=seats[id]; else no+=seats[id]; });
  return {yes,no,abs,first:yes>=176,second:yes>no};
}



/* ===== UTILIDADES ===== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const f1=n=>(Math.round(n*10)/10).toFixed(1).replace('.',',');
const f2=n=>(Math.round(n*100)/100).toFixed(2).replace('.',',');
const COL=id=>PT[id]?PT[id].c:'#888';
const ceil=Math.ceil;
function lsGet(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}

