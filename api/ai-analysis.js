const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
const num=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
function calculate(input={}){
  const followers=Math.max(1000,num(input.followers,50000));
  const views=Math.max(500,num(input.averageViews,followers*.35));
  const engagement=clamp(num(input.engagement,3.5),.1,25);
  const deliverables=Math.max(1,num(input.deliverables,1));
  const productValue=Math.max(0,num(input.productValue,0));
  const payment=Math.max(0,num(input.payment,0));
  const months=Math.max(0,num(input.usageMonths,0));
  const exclusivity=['yes',true].includes(input.exclusivity);
  const paidAds=['yes',true].includes(input.paidAds);
  const base=(views*.022)+(followers*.0045)+(engagement*115);
  const scope=1+(deliverables-1)*.28;
  const rights=1+Math.min(months,12)*.025+(paidAds?.22:0)+(exclusivity?.18:0);
  const nicheBoost=['beauty','finance','tech','fitness'].some(n=>(input.niche||'').toLowerCase().includes(n))?1.09:1;
  const midpoint=Math.max(800,(base*scope*rights*nicheBoost)+(productValue*.35));
  const low=Math.round(midpoint*.86/100)*100;
  const high=Math.round(midpoint*1.18/100)*100;
  const score=clamp(Math.round((payment/Math.max(midpoint,1))*70+Math.min(30,engagement*4.2)),0,100);
  const counter=Math.round(((low+high)/2)*.98/100)*100;
  const confidence=clamp(Math.round(62+engagement*3+Math.min(12,deliverables*2)),55,94);
  return {low,high,midpoint:Math.round(midpoint),score,counter,confidence,underpayment:Math.max(0,low-payment)};
}
async function explain(input,pricing){
  if(!process.env.OPENAI_API_KEY) return null;
  const model=process.env.OPENAI_MODEL||'gpt-5-mini';
  const prompt=`You are the neutral Collab Deal OS deal advisor. The deterministic pricing engine has already calculated the numbers. Do not invent or change numbers. Explain in 2 concise sentences why the offer is fair/weak and what to do next. Inputs: ${JSON.stringify(input)}. Pricing engine: ${JSON.stringify(pricing)}.`;
  const res=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model,input:prompt,max_output_tokens:180})});
  if(!res.ok) throw new Error(`OpenAI request failed: ${res.status}`);
  const data=await res.json();
  if(typeof data.output_text==='string') return data.output_text.trim();
  for(const item of data.output||[]) for(const content of item.content||[]) if(content.type==='output_text'&&content.text) return content.text.trim();
  return null;
}
module.exports={calculate,explain};
