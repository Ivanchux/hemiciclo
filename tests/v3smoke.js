const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync(''+require('path').join(__dirname,'..','index.html')+'','utf8');
const errs=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/?x=1',beforeParse(w){w.scrollTo=()=>{};w.addEventListener('error',e=>errs.push(e.message));}});
const w=dom.window,d=w.document;
const ok=(c,m)=>{console.log((c?'OK  ':'FAIL')+' '+m);if(!c)process.exitCode=1;};
setTimeout(()=>{
  ok(errs.length===0,'sin errores de script '+errs.join('|'));
  ok(d.querySelectorAll('#map .pv').length===52,'52 provincias en el mapa: '+d.querySelectorAll('#map .pv').length);
  ok(d.querySelectorAll('#hemi circle').length>=350,'hemiciclo 350 círculos');
  ok(d.querySelectorAll('#chips .chip').length>=7,'chips escenario');
  ok(!!d.querySelector('#tbl .trow'),'tabla de resultados');
  // avanzar la noche
  const t0=Date.now();
  (async()=>{
    for(const tab of ['hist','pact','bet','share','car']){
      const b=d.querySelector('[data-tab="'+tab+'"]')||d.querySelector('[data-win="'+tab+'"]');
      if(!b){ok(false,'no botón '+tab);continue;}
      b.click();ok(!d.querySelector('#win').hidden,'abre '+tab+' sin error');
      d.querySelector('[data-act="close"]').click();
    }
    ok(errs.length===0,'sin errores tras ventanas '+errs.join('|'));
    w.close();process.exit(process.exitCode||0);
  })();
},1500);
