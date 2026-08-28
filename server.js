const http=require('http');const fs=require('fs');const path=require('path');
function loadEnv(){const f=path.join(__dirname,'.env');if(!fs.existsSync(f))return;for(const line of fs.readFileSync(f,'utf8').split(/\r?\n/)){const m=line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);if(!m||m[1].startsWith('#')||process.env[m[1]])continue;let v=m[2];if((v.startsWith('\"')&&v.endsWith('\"'))||(v.startsWith("'")&&v.endsWith("'")))v=v.slice(1,-1);process.env[m[1]]=v}}
loadEnv();
const {calculate,explain}=require('./api/ai-analysis');const {createSubscription}=require('./api/subscription');const {verifyRazorpayWebhook}=require('./api/webhook');
const ROOT=__dirname;const PORT=Number(process.env.PORT||4173);const hits=new Map();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.md':'text/markdown; charset=utf-8'};
const publicRootFiles=new Set(['index.html','login.html','signup.html','pricing.html','auth-callback.html']);const publicDirectories=new Set(['creator','brand','css','js','assets']);
function isPublicFile(relative){if(publicRootFiles.has(relative)||relative==='data/demo-data.json')return true;return publicDirectories.has(relative.split('/')[0])}
function send(res,status,body,type='application/json; charset=utf-8'){res.writeHead(status,{'content-type':type,'cache-control':'no-store','x-content-type-options':'nosniff'});res.end(typeof body==='string'?body:JSON.stringify(body))}
function body(req,limit=1024*256){return new Promise((resolve,reject)=>{let data='';req.on('data',c=>{data+=c;if(data.length>limit){reject(new Error('Body too large'));req.destroy()}});req.on('end',()=>resolve(data));req.on('error',reject)})}
function rateLimit(req){const ip=req.socket.remoteAddress||'local';const now=Date.now();let r=hits.get(ip)||{start:now,count:0};if(now-r.start>60000)r={start:now,count:0};r.count++;hits.set(ip,r);return r.count<=30}
const server=http.createServer(async(req,res)=>{try{
  const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);
  if(url.pathname==='/api/config'&&req.method==='GET')return send(res,200,{supabaseUrl:process.env.SUPABASE_URL||'',supabasePublishableKey:process.env.SUPABASE_PUBLISHABLE_KEY||'',razorpayKeyId:process.env.RAZORPAY_KEY_ID||''});
  if(url.pathname==='/api/ai-analysis'&&req.method==='POST'){
    if(!rateLimit(req)) return send(res,429,{error:'Too many analysis requests. Try again shortly.'});
    const raw=await body(req);let input={};try{input=JSON.parse(raw||'{}')}catch{return send(res,400,{error:'Invalid JSON'})}
    const fields=['followers','averageViews','engagement','payment','productValue','deliverables','usageMonths'];for(const f of fields)if(input[f]!==undefined&&!Number.isFinite(Number(input[f])))return send(res,400,{error:`Invalid ${f}`});
    const pricing=calculate(input);let explanation=null;try{explanation=await explain(input,pricing)}catch(e){console.warn(e.message)}
    return send(res,200,{...pricing,explanation:explanation||`The offer is ${Number(input.payment||0)<pricing.low?'below':'within'} the modeled fair range. Review deliverables, usage rights, and exclusivity before finalizing.`});
  }
  if(url.pathname==='/api/subscription'&&req.method==='POST'){
    const raw=await body(req);let payload={};try{payload=JSON.parse(raw||'{}')}catch{return send(res,400,{error:'Invalid JSON'})}if(!['Pro','Premium'].includes(payload.plan))return send(res,400,{error:'Unknown plan'});try{return send(res,200,await createSubscription(payload.plan))}catch(e){return send(res,502,{error:e.message})}
  }
  if(url.pathname==='/api/webhook'&&req.method==='POST'){
    const raw=await body(req,1024*1024);const sig=req.headers['x-razorpay-signature'];if(!verifyRazorpayWebhook(raw,sig))return send(res,401,{error:'Invalid webhook signature'});let event={};try{event=JSON.parse(raw)}catch{};console.log('Razorpay webhook:',event.event||'unknown');return send(res,200,{ok:true});
  }
  let filePath=decodeURIComponent(url.pathname);if(filePath==='/'||filePath==='')filePath='/index.html';const abs=path.resolve(ROOT,filePath.replace(/^[/\\]+/,''));const relative=path.relative(ROOT,abs).split(path.sep).join('/');if(!relative||relative.startsWith('../')||path.isAbsolute(relative))return send(res,403,'Forbidden','text/plain');if(!isPublicFile(relative))return send(res,404,'Not found','text/plain');
  fs.stat(abs,(err,stat)=>{if(err||!stat.isFile())return send(res,404,'Not found','text/plain');const ext=path.extname(abs).toLowerCase();res.writeHead(200,{'content-type':types[ext]||'application/octet-stream','cache-control':ext==='.html'?'no-cache':'public, max-age=3600'});fs.createReadStream(abs).pipe(res)});
}catch(e){console.error(e);send(res,500,{error:'Server error'})}});
server.listen(PORT,()=>console.log(`Collab Deal OS running at http://localhost:${PORT}`));
