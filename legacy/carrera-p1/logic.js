/* ===== PARTIDOS FICTICIOS (sobre geografía y votos reales de 2023) ===== */
/* Los nombres son parodia. Cada partido hereda la forma territorial de su equivalente real. */
const FP_TABLE=[
  {id:'PPE',s:'PPE',name:'Partido Popular Español',c:'#2F6FDE',lr:70,bloc:'D',shape:'pp',sh:33.06,play:true,tag:'Todos dicen ser el centro. Este tiene mapa de carreteras.'},
  {id:'PSOP',s:'PSOP',name:'Partido Socialista Obrero Progresista',c:'#D93A4A',lr:30,bloc:'I',shape:'psoe',sh:31.68,play:true,tag:'Siempre es «el proyecto de país». Congreso cada dos años.'},
  {id:'VPV',s:'VPV',name:'Vanguardia Patria Viva',c:'#6DB33F',lr:90,bloc:'D',shape:'vox',sh:12.38,play:true,tag:'Grita más que nadie y le sale a cuenta.'},
  {id:'FP',s:'FP',name:'Frente Plural',c:'#D7338A',lr:10,bloc:'I',shape:'su',sh:9.5,play:true,tag:'Seis siglas dentro de una. Reunión para decidir quién habla.'},
  {id:'PCS',s:'PCS',name:'Partido Comunista Socialista',c:'#9A55D6',lr:5,bloc:'I',shape:'pod',sh:2.83,play:true,tag:'Asambleas eternas. Tiene razón, pero tarde.'},
  {id:'ESO',s:'ESO',name:'Esquerra Soberana',c:'#F5A623',lr:18,bloc:'N',shape:'erc',sh:1.89,play:false},
  {id:'UXC',s:'UxC',name:'Units per Catalunya',c:'#22C4B0',lr:46,bloc:'N',shape:'junts',sh:1.6,play:false},
  {id:'EHA',s:'EHA',name:'Euskal Herria Aurrera',c:'#C6D43A',lr:15,bloc:'N',shape:'bildu',sh:1.36,play:false},
  {id:'PVT',s:'PVT',name:'Partido Vasco Tradicional',c:'#0B7A4B',lr:42,bloc:'N',shape:'pnv',sh:1.12,play:false},
  {id:'BGU',s:'BGU',name:'Bloque Galego Unido',c:'#6CC0F2',lr:17,bloc:'N',shape:'bng',sh:0.62,play:false},
  {id:'CN',s:'CN',name:'Canarias Nuestra',c:'#F2D21B',lr:55,bloc:'N',shape:'cc',sh:0.46,play:false},
  {id:'UNF',s:'UNF',name:'Unión Navarra Foral',c:'#4A74C9',lr:72,bloc:'D',shape:'upn',sh:0.21,play:false}
];
FP_TABLE.forEach(p=>{PT[p.id]={s:p.s,name:p.name,c:p.c,lr:p.lr,bloc:p.bloc,shape:p.shape};});
const CTX={parties:FP_TABLE.map(p=>({id:p.id})).concat([{id:'OTROS'}])};
const BASE23=(function(){const s={};FP_TABLE.forEach(p=>s[p.id]=p.sh);s.OTROS=3.29;return s;})();
const PLAYABLE_IDS=FP_TABLE.filter(p=>p.play).map(p=>p.id);
const PROV_IDX={};PROV.forEach((p,i)=>PROV_IDX[p.id]=i);
const BASE_RES=simulate(CTX.parties,BASE23,{method:'dhondt',thr:3,mode:'prov'});
function baseSeats(party,prov){return BASE_RES.prov[PROV_IDX[prov]].seats[party]||0;}

/* ===== CONSTANTES ===== */
const TURNS=8, MAX_LEG=4;
const STAT_NAMES={L:'Lealtad',C:'Convicción',B:'Base',F:'Fama'};
const STAT_HELP={L:'Lo bien que te ven en la dirección del partido.',C:'Cuánto de ti queda cuando obedeces. No da escaños, pero marca quién eres.',B:'Tu apoyo entre los militantes y los vecinos. Mueve votos en tu provincia.',F:'Cuánta gente sabe quién eres. Ayuda a subir en la lista.'};
const NOMBRES_H=['Alberto','Manuel','Javier','Carlos','Sergio','Pablo','Rubén','Andrés','Ignacio','Álvaro','Raúl','Ángel','Joaquín','Fermín','Eduardo','Tomás','Rafael','Hugo','Marcos','Julián'];
const NOMBRES_M=['Marta','Lucía','Carmen','Elena','Pilar','Nuria','Rocío','Beatriz','Irene','Silvia','Teresa','Cristina','Sonia','Alicia','Mónica','Patricia','Gloria','Inés','Noelia','Amparo'];
const APELLIDOS=['García','Fernández','López','Martínez','Sánchez','Pérez','Gómez','Ruiz','Díaz','Moreno','Álvarez','Romero','Navarro','Torres','Domínguez','Gil','Vázquez','Serrano','Ramos','Blanco','Molina','Castro','Ortega','Rubio','Marín','Sanz','Iglesias','Medina','Cortés','Garrido'];

/* ===== ALEATORIEDAD GUARDABLE (el estado va dentro de la partida) ===== */
let G=null;
function grnd(){let a=(G.rs=(G.rs+0x6D2B79F5)|0);let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}
const gint=(a,b)=>a+Math.floor(grnd()*(b-a+1));
const gpick=arr=>arr[Math.floor(grnd()*arr.length)];
const gnorm=()=>randn(grnd);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const score=o=>.34*o.L+.33*o.B+.33*o.F;
function fullName(female){return gpick(female?NOMBRES_M:NOMBRES_H)+' '+gpick(APELLIDOS)+' '+gpick(APELLIDOS);}

/* ===== RIVALES ===== */
const ARCH={
  hijo:{n:'El hijo del alcalde',L:[18,38],B:[12,30],F:[38,62],g:[.8,.6,1.5],f:'Su apellido abre puertas. Su currículum, no tanto.'},
  sobri:{n:'La sobrina del barón',L:[40,62],B:[15,32],F:[20,40],g:[1.6,.7,.8],f:'Nadie sabe qué hace, pero todos saben de quién es.'},
  sindi:{n:'El sindicalista',L:[15,32],B:[42,64],F:[18,36],g:[.6,1.6,.8],f:'Conoce cada bar y cada comité de empresa.'},
  fiel:{n:'La fiel de la ejecutiva',L:[45,66],B:[12,28],F:[10,26],g:[1.4,.7,.6],f:'Nunca ha dicho una frase que no hubiera dicho otro antes.'},
  tele:{n:'El tertuliano',L:[14,30],B:[8,22],F:[48,68],g:[.6,.5,1.8],f:'Opina de todo en tres cadenas. En ninguna con matices.'},
  vet:{n:'El veterano',L:[40,58],B:[40,58],F:[30,48],g:[.3,.2,.1],f:'Lleva tres legislaturas esperando que le toque.'},
  joven:{n:'La joven promesa',L:[14,28],B:[14,28],F:[14,28],g:[1.5,1.5,1.5],f:'Crece rápido y no pide permiso.'},
  gris:{n:'El gris',L:[28,42],B:[28,42],F:[20,34],g:[1.0,1.0,.8],f:'Ni suma ni resta. Ahí sigue, indestructible.'}
};
const ARCH_KEYS=Object.keys(ARCH);
let RIV_N=0;
function newRival(arch,level){
  const a=ARCH[arch]; const female=grnd()<.5; const lv=level||0;
  const r={id:'r'+(++G.rid),name:fullName(female),look:gint(1,999999),arch:arch,female:female,
    L:gint(a.L[0],a.L[1])+lv,B:gint(a.B[0],a.B[1])+lv,F:gint(a.F[0],a.F[1])+lv,grudge:0,ally:false};
  return r;
}

/* ===== PARTIDA ===== */
function poolSize(party,prov){return clamp(Math.round(3.6*baseSeats(party,prov))+7,8,60);}
function newGame(o){
  const seed=(o.seed>>>0)||1;
  G={v:1,rs:seed,seed:seed,rid:0,party:o.party,prov:o.prov,name:o.name||'',female:!!o.female,look:(seed*7919)%999983+1,
     leg:1,turn:1,phase:'card',st:{L:22,C:50,B:20,F:14},nat:Object.assign({},BASE23),rivals:[],used:[],log:[],
     card:null,offer:[],last:'',camp:0,listNoise:null,list:null,pos:null,el:null,night:null,hist:[],done:false,out:null,flags:{}};
  if(!G.name)G.name=fullName(G.female);
  const n=poolSize(G.party,G.prov)-1;
  for(let i=0;i<n;i++)G.rivals.push(newRival(ARCH_KEYS[i%ARCH_KEYS.length]));
  nextCard(); return G;
}
function provIdx(){return PROV_IDX[G.prov];}
function ovFor(){const ov={};ov[G.prov]={};ov[G.prov][G.party]=(G.st.B-25)/35+G.camp;return ov;}
function runSim(shares){return simulate(CTX.parties,shares,{method:'dhondt',thr:3,mode:'prov',ov:ovFor()});}
let _pm={k:'',v:0};
function projSeats(){const k=JSON.stringify([G.nat,G.st.B,G.camp,G.prov,G.party].map(x=>typeof x==='object'?Object.keys(x).map(i=>Math.round(x[i]*100)):x));
  if(_pm.k!==k){_pm={k:k,v:runSim(G.nat).prov[provIdx()].seats[G.party]||0};}return _pm.v;}
function pool(){return [{id:'me',me:true,name:G.name,look:G.look,female:G.female,L:G.st.L,C:G.st.C,B:G.st.B,F:G.st.F}].concat(G.rivals);}
function ranking(noisy){
  return pool().map(o=>({o:o,s:score(o)+(noisy&&G.listNoise?(G.listNoise[o.id]||0):0)})).sort((a,b)=>b.s-a.s||(a.o.id<b.o.id?-1:1));
}
function myPos(noisy){return ranking(noisy).findIndex(x=>x.o.me)+1;}
const snap=()=>Object.assign({},G.st);
function diffFrom(b){return {L:Math.round(G.st.L-b.L),C:Math.round(G.st.C-b.C),B:Math.round(G.st.B-b.B),F:Math.round(G.st.F-b.F)};}
function applyDelta(d){
  G.st.L=clamp(G.st.L+d[0],0,100);G.st.C=clamp(G.st.C+d[1],0,100);G.st.B=clamp(G.st.B+d[2],0,100);G.st.F=clamp(G.st.F+d[3],0,100);
}

/* ===== CARTAS ===== */
function oc(id,t,x,o,n,d){return {id:id,kind:'orden',t:t,x:x,o:[
  {k:'obey',l:o[0],d:o[1],r:o[2]},{k:'nuance',l:n[0],d:n[1],r:n[2]},{k:'disobey',l:d[0],d:d[1],r:d[2]}]};}
function ev(id,t,x,a,b){return {id:id,kind:'evento',t:t,x:x,o:[{l:a[0],d:a[1],r:a[2]},{l:b[0],d:b[1],r:b[2]}]};}
const ORDERS=[
 oc('carteles','Carteles hasta el amanecer','La secretaria provincial quiere el barrio forrado antes del puente. Te dan pegamento, una escalera prestada y la promesa de un bocadillo.',
   ['Pegar todo el barrio',[3,-1,4,1],'Barrio forrado. Tienes pegamento hasta en las pestañas.'],['Pegar la mitad y dormir',[1,0,2,0],'La mitad del barrio luce cartel. La otra mitad, tu cara de sueño.'],['Irte a casa',[-4,2,0,0],'Duermes como un niño. La secretaria, no.']),
 oc('aplaudir','Aplaudir hasta que duelan las manos','El candidato lee el mismo discurso por quinta vez esta semana. Te piden primera fila y cara de emoción.',
   ['Aplaudir con lágrimas',[3,-2,0,2],'Sales en la foto. Nadie nota que lloras de aburrimiento.'],['Aplaudir con la boca cerrada',[1,0,0,1],'Dicen que tienes «sobriedad». Es sueño.'],['Quedarte sentado',[-4,2,0,3],'Sales en la foto: uno sentado entre mil de pie. Famoso por una tarde.']),
 oc('recorte','Defender un recorte en la radio local','La dirección ha bajado una partida que a ti tampoco te gusta. Te mandan a explicarlo con una sonrisa.',
   ['Defenderlo con una sonrisa',[4,-4,0,2],'Sonríes tanto que algún oyente cree que es una oferta.'],['Decir que «hay que matizar»',[1,-1,0,1],'«Hay que matizar» es lo más largo que nadie recuerda de ti.'],['Decir lo que piensas',[-5,4,1,4],'Aplauso en el bar. Llamada de la ejecutiva por la tarde.']),
 oc('afiliados','Cien afiliados nuevos antes del congreso','Cada carné nuevo es un voto interno. A nadie le importa de dónde salen.',
   ['Llenar autobuses de jubilados',[4,-3,2,0],'Cien carnés. Dos preguntan si hay merienda.'],['Apuntar a familiares',[2,-1,1,0],'Tu cuñado ahora es del partido. Va a opinar.'],['Negarte',[-4,3,1,0],'Tu conciencia respira mejor. Tu carrera, algo peor.']),
 oc('cena','Cena con el barón en la sala de atrás','Pagan unos «amigos del partido». Nadie pregunta cuáles.',
   ['Ir y reír sus chistes',[4,-2,0,1],'El barón te recuerda como «el simpático». Es un comienzo.'],['Ir y pedir agua',[1,0,0,0],'Pides agua en una cena de marisco. Te miran como a un forense.'],['No ir',[-3,2,1,0],'Cenas en casa. Te lo recordarán dentro de dos años.']),
 oc('negar','Negar lo que ya ha visto todo el mundo','Un vídeo muestra lo que todos vieron. La dirección pide negarlo en redes sin pestañear.',
   ['Negarlo todo',[3,-5,0,-1],'El vídeo sigue ahí. Tú también, negándolo.'],['Compartir un gato y no decir nada',[1,-2,0,0],'Compartes un gato. Nadie entiende nada.'],['Decir la verdad',[-6,5,2,3],'Te llaman traidor. Te llaman honesto. Los dos sin cariño.']),
 oc('acto','Llenar la sala de un acto','Han reservado el salón grande. Se han apuntado once personas y un perro.',
   ['Movilizar a tu barrio',[3,-1,4,0],'Llenas la sala. Los asistentes preguntan cuándo es el sorteo.'],['Hacer la foto en ángulo',[1,0,1,1],'Con el encuadre adecuado parece una plaza de toros.'],['No hacer nada',[-3,1,-1,0],'Once personas y un perro. El perro se va a mitad.']),
 oc('alcalde','Abrazarte al alcalde al que llevas años insultando','La dirección quiere un pacto de gobierno en tu pueblo con quien llevas años llamando incompetente.',
   ['Abrazarte al alcalde',[4,-3,-1,1],'Foto de abrazo. Sus votantes lo olvidan. Los tuyos, no.'],['Hablar de «responsabilidad»',[2,-1,0,0],'«Responsabilidad»: la palabra con la que se vende lo que no gusta.'],['Negarte al pacto',[-4,4,2,1],'Tus bases te aplauden. El pacto sale sin ti.']),
 oc('baile','Subir un vídeo bailando','La dirección cree que el partido llega poco a los jóvenes y quiere tu baile el viernes por la tarde.',
   ['Bailar con la mejor sonrisa',[3,-2,0,4],'El vídeo es viral por razones que no te gustan.'],['Bailar a escondidas',[1,0,0,2],'Bailas tan mal que da ternura.'],['Negarte',[-2,2,0,0],'Tu pudor te honra. Sin un solo me gusta.']),
 oc('mesa','Una mesa informativa un sábado','Sol, un toldo y diez vecinos que pasan de largo. Lo de siempre.',
   ['Aguantar la mañana entera',[2,0,4,1],'Convences a una señora. Que ya era del partido.'],['Montarla una hora',[1,0,2,0],'Una hora de mesa, una hora de dignidad.'],['Irte de cañas',[-2,1,1,0],'En el bar hay más votantes que en la mesa.']),
 oc('voto','Votar a una delegada que no conoces','Te piden votar a una candidata en la asamblea. No sabes quién es. Quien te lo pide, sí.',
   ['Votar lo que te dicen',[4,-3,0,0],'Votas sin leer el nombre. Es tradición.'],['Abstenerte',[1,0,0,0],'Te abstienes con cara de profunda reflexión.'],['Votar a la otra',[-4,3,3,0],'Tu voto es secreto. Tus gestos, no.']),
 oc('sede','Mover mesas en la sede','Se ha roto la calefacción y hay que mover muebles, pintar y fregar. Nadie recuerda quién manda aquí.',
   ['Remangarte de verdad',[2,0,4,0],'La sede huele a pintura. Tú, a militancia.'],['Dirigir desde la puerta',[1,0,2,0],'Dirigir es una forma de trabajar. Mirar, otra.'],['Hacerte el ocupado',[-2,1,0,0],'Estás muy ocupado respondiendo a un mensaje de tu madre.']),
 oc('reunion','Reunión de seis horas','Se debate el orden del día. Luego, el orden de los puntos del orden del día.',
   ['Aguantar hasta el final',[3,0,1,0],'Sales con una moción aprobada y sin ganas de vivir.'],['Irte antes del café',[1,0,0,0],'Te vas antes del café. Te lo perdonan. Lo del café, no.'],['Dormirte',[-3,1,0,1],'Alguien te hace una foto roncando. Ya te conocen.']),
 oc('maletero','Llevar al candidato en tu coche','El número uno visita tu pueblo y buscan quien le lleve el equipaje y le abra la puerta.',
   ['Cargar maletas y sonreír',[3,-1,0,2],'Le abres la puerta. Te llama «chaval». Te vale.'],['Llevarle y no hablar',[1,0,0,1],'Treinta kilómetros sin una palabra. Ambos contentos.'],['Decirle que vaya en taxi',[-4,2,0,1],'Va en taxi. Se lo cobran al partido.']),
 oc('acusar','Señalar a un compañero «demasiado crítico»','La ejecutiva sospecha de un compañero que pregunta mucho. Quieren un testimonio amable y sin pruebas.',
   ['Señalarlo',[5,-6,0,0],'Lo expulsan. A ti te premian. Duermes mal, pero con descuento.'],['Decir que no sabes nada',[1,-1,0,0],'«No sé nada» es la defensa más antigua de la política.'],['Defenderlo',[-6,6,2,1],'Compañero salvado. Te quedas solo en la bancada.'])
];
const EVENTS=[
 ev('periodista','Te llama un periodista','Quiere saber qué opinas del presidente provincial. Tienes diez segundos para ser interesante.',
   ['Hablar claro',[-3,3,0,5],'Titular: «Un militante se rebela». Ya eres un nombre.'],['No contestar',[1,0,0,-1],'Cuelgas. Escribe que no supiste qué decir.']),
 ev('rumor','Un rival cuenta cosas de ti','Dicen que no te dejaste ver en el último acto. Es cierto, pero no es justo.',
   ['Responder en público',[-2,2,0,3],'Respondes con elegancia. La gente solo recuerda que respondiste.'],['Ignorarlo',[0,0,-2,-2],'Callas. Nadie sabe que es mentira.']),
 ev('concejal','El concejal de urbanismo tiene un abogado caro','Tiene también una casa en la sierra de la que nunca hablaba.',
   ['Defenderlo',[3,-3,0,-2],'Lo defiendes de corazón. De cartera, lo hace él.'],['Pedir su dimisión',[-3,3,2,3],'Dimite. Te mira en el pasillo. No sonríe.']),
 ev('baron','El barón te invita a su despacho','Quiere conocer a «la gente joven». Tiene un café y mucha memoria.',
   ['Ir con un regalo',[4,-2,0,1],'Un buen regalo es el mejor currículum. Era un libro de cocina.'],['Ir con ideas',[1,2,0,1],'Le gustan tus ideas. No tanto que sean tuyas.']),
 ev('vecina','Una vecina te para en la calle','Quiere que le arregles la farola, la acera y a su yerno.',
   ['Prometer ayuda',[0,-1,4,0],'Prometes mucho. La acera sigue rota.'],['Explicar que no mandas',[0,2,1,0],'Sinceridad inútil. Te cae mejor que el que mintió.']),
 ev('presupuesto','La ejecutiva recorta tu agrupación','Menos presupuesto, menos pegamento, menos sede.',
   ['Protestar',[-2,2,2,1],'Protestas con razón. La razón no paga pegamento.'],['Callar y apretar',[2,-1,0,0],'Callas. Pegas con saliva.']),
 ev('cartel','Tu cara sale en el cartel de otro partido','Dicen que fue un error de imprenta.',
   ['Reírte del asunto',[0,0,1,4],'La gracia se hace viral. Pagas el café a todos.'],['Pedir explicaciones',[0,0,0,-1],'Pides explicaciones. Te las dan en cuatro páginas.']),
 ev('prestamo','Un compañero te pide cien euros','Hasta fin de mes. Lleva tres años con el fin de mes.',
   ['Prestarlos',[1,0,2,0],'Los prestas. Ahora tienes un amigo y un acreedor.'],['Negarte',[0,1,-1,0],'Te llaman roñoso. Pero con cien euros más.']),
 ev('audio','Se filtra un audio en el grupo de mensajes','Alguien dejó el audio del barón criticando a la ejecutiva. Todos saben quién fue. Nadie lo dice.',
   ['Quedarte callado',[1,0,0,0],'Callas. En política callar es coger sitio.'],['Decir que fuiste tú',[-4,3,1,6],'O eres valiente o no has pensado. Aún por decidir.']),
 ev('comida','Un empresario te invita a comer','Quiere «conocer las inquietudes de la juventud del partido». Paga él.',
   ['Aceptar la comida',[2,-3,0,1],'La comida estaba buena. Lo caro es la próxima.'],['Pagar tu parte',[0,3,0,0],'Pagas tu parte. Él te mira con respeto. Y con curiosidad.'])
];
const CARD_BY_ID={};ORDERS.concat(EVENTS).forEach(c=>CARD_BY_ID[c.id]=c);
function nextCard(){
  const wantEvent=grnd()<.38; const src=wantEvent?EVENTS:ORDERS;
  let free=src.filter(c=>G.used.indexOf(c.id)<0); if(!free.length){G.used=G.used.filter(id=>!src.some(c=>c.id===id));free=src;}
  const c=gpick(free); G.used.push(c.id); G.card=c.id; G.phase='card'; G.offer=[]; return c;
}
function answerCard(i){
  const c=CARD_BY_ID[G.card]; const o=c.o[i]; if(!o)return false;
  const b0=snap(); let dd=o.d; if(c.kind==='orden'&&o.k==='disobey')dd=[Math.round(dd[0]*.7),dd[1],dd[2]+1,dd[3]+1]; applyDelta(dd); G.lastD=diffFrom(b0); G.last=o.r; G.log.push(c.t+' → '+o.r); if(G.log.length>30)G.log.shift();
  G.offer=pickOffer(); G.phase='action'; return true;
}

/* ===== ACCIONES LIBRES ===== */
function rivalAbove(){const rk=ranking(false);const i=rk.findIndex(x=>x.o.me);return i>0?rk[i-1].o:(rk[1]?rk[1].o:null);}
const ACTIONS={
 barrio:{n:'Currar el barrio',d:'Puerta a puerta y mesas informativas. Poco brillo, mucha base.',x:'Sube Base. Es lo que mueve votos de verdad en tu provincia.',run:()=>{applyDelta([0,0,5,1]);return 'Conoces cada portal. Cada portal conoce tu cara y ya no la saluda.';}},
 pelota:{n:'Hacerle la pelota a la dirección',d:'Sube Lealtad a costa de Convicción.',x:'Sube Lealtad fuerte. Baja Convicción un poco. Seguro.',run:()=>{applyDelta([5,-2,0,0]);return 'Elogias al barón con tanto entusiasmo que él mismo se sonroja.';}},
 radio:{n:'Salir en la radio local',d:'Sube Fama. Puedes meter la pata.',x:'Sube Fama bastante. Un 25 % de meter la pata y perder algo.',run:()=>{if(grnd()<.25){applyDelta([-1,0,0,-2]);return 'Confundes el nombre de la alcaldesa con el de su perro. Hoy el perro tiene más audiencia.';}applyDelta([0,0,1,5]);return 'Hablas dos minutos. Te reconocen en la panadería.';}},
 agrup:{n:'Montar una agrupación de barrio',d:'Mucha Base. A la dirección no siempre le hace gracia.',x:'Sube Base mucho y baja un poco la Lealtad: la dirección odia lo que no controla.',run:()=>{applyDelta([-1,0,6,0]);return 'Montas una agrupación de barrio. Tienes sede, logo y tres socios ofendidos.';}},
 tertulia:{n:'Tertulia de madrugada',d:'Sube Fama. A veces dices lo que no debes.',x:'Sube Fama mucho. 30 % de decir algo que irrite a la dirección.',run:()=>{if(grnd()<.30){applyDelta([-3,1,0,6]);return 'Dices algo cierto a las tres de la mañana. A las nueve te llaman de la ejecutiva.';}applyDelta([-1,0,0,6]);return 'Tertulia a las tres de la madrugada. Ganas seguidores y pierdes sueño.';}},
 zanja:{n:'Zancadillear a un rival',d:'Baja al que va por delante. Puede salirte mal.',x:'Baja Lealtad y Fama del rival que está justo por encima de ti. 35 % de que se descubra y te cueste caro. El rival lo recuerda.',run:()=>{const r=rivalAbove();if(!r){applyDelta([0,0,0,0]);return 'No tienes a nadie a quien zancadillear. Qué tristeza.';}
   if(grnd()<.35){applyDelta([-5,-1,0,-3]);r.grudge+=1;return 'Tu zancadilla a '+r.name.split(' ')[0]+' se descubre. Ahora te saluda con dos besos y un cuchillo.';}
   r.L=clamp(r.L-8,0,100);r.F=clamp(r.F-5,0,100);r.grudge+=1;return 'Le haces la cama a '+r.name.split(' ')[0]+'. Nadie sabe quién fue. Todos sospechan de ti.';}},
 favor:{n:'Hacer un favor a la ejecutiva',d:'Lealtad y algo de Base.',x:'Sube Lealtad y algo de Base. Ellos recuerdan los favores. A ti te cuestan tiempo.',run:()=>{applyDelta([3,0,2,0]);return 'Recoges a un cargo en el aeropuerto. Te da las gracias con una mano en el hombro.';}},
 curso:{n:'Curso de formación del partido',d:'Un poco de todo. Nada brilla, todo suma.',x:'Sube todo un poco, incluida la Convicción: aprendes lo que hay que decir y lo que piensas de verdad.',run:()=>{applyDelta([2,1,1,1]);return 'Aprendes a decir «sí, pero» en quince idiomas políticos.';}},
 foto:{n:'Foto con el barón',d:'Requiere Lealtad 35. Fama y Lealtad.',x:'Solo si tu Lealtad es de 35 o más. Si no, no te dejan acercarte al barón.',need:s=>s.L>=35,run:()=>{applyDelta([2,0,0,4]);return 'La foto sale perfecta. Tú sales fenomenal. El barón sale cansado.';}},
 estudiar:{n:'Estudiar el programa',d:'Sube Convicción. Casi nadie lo hace.',x:'Sube Convicción bastante. Es lo único del programa que lee alguien.',run:()=>{applyDelta([0,5,0,0]);return 'Lees el programa entero. Descubres que no coincide con lo que dicen en los mítines.';}},
 pacto:{n:'Pactar con un rival',d:'Un aliado: ninguno ataca al otro.',x:'Escoge al rival que tienes justo por debajo. Os apoyáis: él no te zancadillea y tú ganas Lealtad y Base. El pacto se rompe si le atacas.',run:()=>{const rk=ranking(false);const i=rk.findIndex(x=>x.o.me);const r=rk[i+1]?rk[i+1].o:(rk[i-1]?rk[i-1].o:null);if(!r)return 'No hay con quién pactar.';r.ally=true;r.grudge=0;applyDelta([2,0,3,0]);return 'Pactas con '+r.name.split(' ')[0]+'. Ambos juráis lealtad. Ambos mentís un poco.';}}
};
const ACTION_KEYS=Object.keys(ACTIONS);
function pickOffer(){
  const ok=ACTION_KEYS.filter(k=>!ACTIONS[k].need||ACTIONS[k].need(G.st));
  const out=['barrio']; const rest=ok.filter(k=>k!=='barrio');
  while(out.length<4&&rest.length){const i=Math.floor(grnd()*rest.length);out.push(rest.splice(i,1)[0]);}
  return out;
}
function doAction(id){
  if(G.phase!=='action'||G.offer.indexOf(id)<0)return false;
  const a=ACTIONS[id]; if(a.need&&!a.need(G.st))return false;
  const b0=snap(); const msg=a.run(); G.lastD=diffFrom(b0); G.last=msg; G.log.push(a.n+' → '+msg); if(G.log.length>30)G.log.shift();
  endTurn(); return true;
}

/* ===== MUNDO ===== */
function rivalsTurn(){
  G.rivals.forEach(r=>{
    const a=ARCH[r.arch]; r.L=clamp(r.L+a.g[0]*1.35+gnorm()*2.2,0,100);r.B=clamp(r.B+a.g[1]*1.35+gnorm()*2.2,0,100);r.F=clamp(r.F+a.g[2]*1.35+gnorm()*2.2,0,100);
  });
  /* los rivales con rencor te la devuelven */
  G.rivals.filter(r=>r.grudge>0&&!r.ally).forEach(r=>{
    if(grnd()<.18*r.grudge){
      if(grnd()<.5){applyDelta([-4,0,0,0]);G.last+=' · '+r.name.split(' ')[0]+' te la devuelve: habla mal de ti en la ejecutiva.';}
      else{applyDelta([0,0,0,-3]);G.last+=' · '+r.name.split(' ')[0]+' te la devuelve: filtra una foto tuya con la boca llena.';}
    }
  });
}
function driftNat(){
  const s={};Object.keys(G.nat).forEach(id=>s[id]=G.nat[id]*.9+BASE23[id]*.1);
  G.nat=perturb(s,.035,grnd);
}
function endTurn(){
  rivalsTurn(); driftNat(); G.turn++;
  if(G.turn>TURNS){closeLists();}else nextCard();
}
function closeLists(){
  G.listNoise={}; pool().forEach(o=>{G.listNoise[o.id]=gnorm()*(o.me?6*(1-G.st.L/160):6);});
  G.list=ranking(true).map(x=>x.o.id); G.pos=G.list.indexOf('me')+1; G.phase='lists';
}
const CAMPAIGN={
 puerta:{n:'Puerta a puerta',d:'Cada portal cuenta.',x:'+1,2 puntos de voto para tu partido en tu provincia. Sube Base.',bonus:()=>1.2,delta:[0,0,2,0],r:'Tocas mil timbres. Tres puertas se abren y una te regala un tupper.'},
 redes:{n:'Ofensiva en redes',d:'Tu cara en todas las pantallas.',x:'+0,8 puntos de voto. Sube Fama.',bonus:()=>.8,delta:[0,0,0,3],r:'Publicas tanto que tu madre te pide que pares.'},
 baron:{n:'Mitin con el barón',d:'Mucho más con Lealtad alta.',x:'+0,9 puntos de voto si tu Lealtad es 40 o más; +0,3 si no.',bonus:()=>G.st.L>=40?.9:.3,delta:[1,0,0,1],r:'El barón sube al escenario. Tú sales en el fondo, aplaudiendo.'}
};
function doCampaign(id){
  const c=CAMPAIGN[id]; if(G.phase!=='campaign'||!c)return false;
  const b0=snap(); G.camp=c.bonus(); applyDelta(c.delta); G.lastD=diffFrom(b0); G.last=c.r; G.log.push('Campaña → '+c.r); runElection(); return true;
}

/* ===== ELECCIONES ===== */
function runElection(){
  const final=perturb(G.nat,.025,grnd); G.final=final; const res=runSim(final); const idx=provIdx(); const pr=res.prov[idx];
  const won=pr.seats[G.party]||0; const P=PROV[idx]; const V=P.w*1000; const votes={}; let elig=[];
  Object.keys(pr.shares).forEach(id=>{votes[id]=pr.shares[id]/100*V; if(pr.shares[id]>=3&&votes[id]>0)elig.push(id);});
  const cand=[]; elig.forEach(id=>{for(let k=1;k<=P.seats;k++)cand.push([votes[id]/k,id,k]);}); cand.sort((a,b)=>b[0]-a[0]);
  const qWin=cand[P.seats-1]?cand[P.seats-1][0]:0, qLose=cand[P.seats]?cand[P.seats][0]:0;
  const my=votes[G.party]||0; const p=G.pos; let margin,kind;
  if(elig.indexOf(G.party)<0){kind='umbral';margin=Math.max(0,Math.round(V*.03-my));}
  else if(p<=won){kind='dentro';margin=Math.max(1,Math.round(my-p*qLose));}
  else{kind='fuera';margin=Math.max(1,Math.round(p*qWin-my));}
  const z={};CTX.parties.forEach(q=>z[q.id]=gnorm());
  G.el={won:won,pos:p,elected:p<=won,seatsByParty:pr.seats,shares:pr.shares,national:res.seats,margin:margin,kind:kind,V:V,votes:votes,seatsTotal:P.seats,z:z};
  G.night={step:0}; G.phase='night';
}
function nightPartial(step){
  const el=G.el; const out={};let sum=0;
  Object.keys(el.shares).forEach(id=>{const f=1-step/10;out[id]=el.shares[id]*Math.exp((el.z[id]||0)*.22*f*f);sum+=out[id];});
  Object.keys(out).forEach(id=>out[id]=out[id]/sum*100);
  return out;
}
function finishNight(){G.night.step=10;G.phase='result';}
function resultNext(){
  if(G.el.elected){G.phase='end';G.done=true;G.out='diputado';recordRun();return;}
  if(G.leg>=MAX_LEG){G.phase='end';G.done=true;G.out='retiro';recordRun();return;}
  newLegislature();
}
function newLegislature(){
  const seatsWon=G.el.won;
  /* los rivales elegidos se van al Congreso; entran caras nuevas */
  const rk=G.list.slice(0,seatsWon); const out=G.rivals.filter(r=>rk.indexOf(r.id)>=0).length;
  G.rivals=G.rivals.filter(r=>rk.indexOf(r.id)<0);
  for(let i=0;i<out;i++)G.rivals.push(newRival(gpick(ARCH_KEYS),6));
  /* si te quedas cerca sube tu fama; si no, solo la experiencia */
  if(G.el.kind==='fuera'&&G.el.margin<2500)G.st.F=clamp(G.st.F+4,0,100);
  G.st.L=clamp(G.st.L*.92,0,100);G.st.B=clamp(G.st.B*.95,0,100);G.st.F=clamp(G.st.F*.92,0,100);
  G.hist.push({leg:G.leg,pos:G.pos,won:G.el.won,margin:G.el.margin,kind:G.el.kind});
  G.leg++;G.turn=1;G.camp=0;G.list=null;G.listNoise=null;G.pos=null;G.el=null;G.night=null;
  G.nat=Object.assign({},G.final);nextCard();
}
function finalScore(){
  if(G.out!=='diputado')return Math.round((G.st.L+G.st.B+G.st.F+G.st.C)/4*2);
  return 500+(MAX_LEG-G.leg)*200+Math.round((G.st.L+G.st.B+G.st.F)/3)*2+Math.round(G.st.C);
}
function epilogueLines(){
  const s=G.st; const out=[];
  if(G.out==='diputado'){
    out.push('Entras en el Congreso con el número '+G.pos+' de tu lista. Tu partido pone el escaño, tú pones la cara.');
    if(s.L>=60&&s.C<=35)out.push('Eres el voto más obediente del grupo. Te llaman «el botón verde».');
    else if(s.C>=65)out.push('La disciplina de voto te trata como a un virus. Te toleran porque no hay antídoto.');
    else out.push('Tu grupo ya te pide que no hagas ruido. Tú ya piensas en ser portavoz.');
    if(s.F>=60)out.push('Tu cuenta tiene más seguidores que el partido. Tus compañeros lo notan. Y lo anotan.');
    if(s.B>=60)out.push('En tu barrio nadie se sorprende de que ganes. En el Congreso, tampoco entienden cómo.');
  }else{
    out.push('Pasan '+MAX_LEG+' legislaturas sin escaño. Una consultora te ofrece una mesa y un cargo con nombre en inglés.');
    out.push('En tu despedida, la ejecutiva te regala una placa. La placa tiene el nombre de otra persona.');
  }
  return out;
}
function recordRun(){
  const h=lsGet('carrera_hist',[]);
  h.unshift({name:G.name,party:G.party,prov:G.prov,leg:G.leg,out:G.out,score:finalScore(),seed:G.seed});
  lsSet('carrera_hist',h.slice(0,10)); lsSet('carrera_save',null);
}
