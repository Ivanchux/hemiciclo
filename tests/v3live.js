const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync(''+require('path').join(__dirname,'..','index.html')+'','utf8');const errs=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/#e/hoy/5/0',beforeParse(w){w.scrollTo=()=>{};w.addEventListener('error',e=>errs.push(e.message));}});
const w=dom.window,d=w.document;const ok=(c,m)=>{console.log((c?'OK  ':'FAIL')+' '+m);if(!c)process.exitCode=1;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 // 4x para acelerar
 d.querySelector('[data-speed="4"]').click();
 await sleep(9000);
 const txt=()=>d.querySelector('#progTxt').textContent;
 ok(/52 de 52|provincias/.test(txt()),'progreso: '+txt());
 const tot=[...d.querySelectorAll('#tbl [data-f="s"]')].reduce((a,e)=>a+(+e.textContent||0),0);
 console.log('suma escaños tabla',tot);
 await sleep(8000);
 ok(+d.querySelector('#simN').textContent>=2,'pasa a la noche siguiente automáticamente: n='+d.querySelector('#simN').textContent);
 // cambio de escenario
 d.querySelector('[data-scen="vox"]').click();await sleep(300);
 ok(d.querySelector('#simN').textContent==='1','escenario reinicia a noche 1');
 ok(w.location.hash.startsWith('#e/vox/'),'hash '+w.location.hash);
 d.querySelector('#bPause').click();const a=txt();await sleep(2500);ok(txt()===a,'pausa detiene');
 // clic provincia
 d.querySelector('#map .pv[data-id="M"]').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
 ok(/Madrid/.test(d.querySelector('#provcard').textContent),'provcard Madrid');
 // veda
 const d2=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/?veda=1',beforeParse(w){w.scrollTo=()=>{};}});
 await sleep(500);const t2=d2.window.document.body.textContent;
 ok(!d2.window.document.querySelector('[data-scen="hoy"]'),'veda oculta Encuestas hoy');
 ok(/Veda de sondeos/.test(t2),'aviso veda');
 // apuesta
 d.querySelector('[data-tab="bet"]').click();
 ok(d.querySelectorAll('[data-bet]').length>=48,'steppers apuesta');
 ok(errs.length===0,'sin errores '+errs.join('|'));process.exit(process.exitCode||0);
})();
