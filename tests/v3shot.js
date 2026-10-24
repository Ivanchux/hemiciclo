const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [n,w,h] of [['d',1440,900],['m',390,844]]){
 const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').join(__dirname,'..','index.html')+'#e/r23/7/0');await p.waitForTimeout(9000);
 await p.screenshot({path:require('os').tmpdir()+'/hemi_'+n+'.png',fullPage:n==='m'});
 if(n==='d'){await p.click('[data-tab="pact"]');await p.waitForTimeout(500);await p.screenshot({path:require('os').tmpdir()+'/hemi_pact.png'});await p.click('[data-act="close"]');
  await p.click('[data-tab="hist"]');await p.waitForTimeout(600);await p.screenshot({path:require('os').tmpdir()+'/hemi_hist.png'});}
 // overflow check
 const ov=await p.evaluate(()=>{const r=[];document.querySelectorAll('.ell,.panel,.chip,.btn,.tag,.coal').forEach(e=>{if(e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflow!=='visible'&&!e.classList.contains('ell'))r.push(e.className+':'+e.textContent.slice(0,30));});
   return {r:r.slice(0,10),page:document.documentElement.scrollWidth>innerWidth};});
 console.log(n,JSON.stringify(ov),errs.join('|'));await p.close();}
await b.close();})();
