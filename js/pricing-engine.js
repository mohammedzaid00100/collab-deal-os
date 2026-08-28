(function(){
  function num(v,f=0){const n=Number(v);return Number.isFinite(n)?n:f}
  function calculate(input={}){
    const followers=Math.max(1000,num(input.followers,50000));
    const views=Math.max(500,num(input.averageViews,followers*.35));
    const engagement=Math.min(25,Math.max(.1,num(input.engagement,3.5)));
    const deliverables=Math.max(1,num(input.deliverables,1));
    const productValue=Math.max(0,num(input.productValue,0));
    const payment=Math.max(0,num(input.payment,0));
    const months=Math.max(0,num(input.usageMonths,0));
    const exclusivity=input.exclusivity===true||input.exclusivity==='yes';
    const paidAds=input.paidAds===true||input.paidAds==='yes';
    const base=(views*0.022)+(followers*0.0045)+(engagement*115);
    const scope=1+(deliverables-1)*0.28;
    const rights=1+Math.min(months,12)*0.025+(paidAds?.22:0)+(exclusivity?.18:0);
    const nicheBoost=['beauty','finance','tech','fitness'].some(n=>(input.niche||'').toLowerCase().includes(n))?1.09:1;
    const midpoint=Math.max(800,(base*scope*rights*nicheBoost)+(productValue*.35));
    const low=Math.round(midpoint*.86/100)*100; const high=Math.round(midpoint*1.18/100)*100;
    const score=Math.max(0,Math.min(100,Math.round((payment/Math.max(midpoint,1))*70 + Math.min(30,engagement*4.2))));
    const counter=Math.round(((low+high)/2)*.98/100)*100;
    const confidence=Math.max(55,Math.min(94,Math.round(62+engagement*3+Math.min(12,deliverables*2))));
    return {low,high,midpoint:Math.round(midpoint),score,counter,confidence,underpayment:Math.max(0,low-payment)};
  }
  window.PricingEngine={calculate};
})();
