async function createSubscription(plan){
  const ids={Pro:process.env.RAZORPAY_PRO_PLAN_ID,Premium:process.env.RAZORPAY_PREMIUM_PLAN_ID};
  const planId=ids[plan];
  if(!process.env.RAZORPAY_KEY_ID||!process.env.RAZORPAY_KEY_SECRET||!planId){
    return {demo:true,message:`${plan} selected in demo mode. Add Razorpay credentials to create a live subscription.`};
  }
  const auth=Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  const res=await fetch('https://api.razorpay.com/v1/subscriptions',{method:'POST',headers:{'content-type':'application/json','authorization':`Basic ${auth}`},body:JSON.stringify({plan_id:planId,total_count:12,quantity:1,customer_notify:true,notes:{product:'Collab Deal OS',tier:plan}})});
  const data=await res.json();
  if(!res.ok) throw new Error(data.error?.description||`Razorpay ${res.status}`);
  return {demo:false,message:`${plan} subscription created.`,checkout:{key:process.env.RAZORPAY_KEY_ID,subscription_id:data.id,name:'Collab Deal OS',description:`${plan} plan`}};
}
module.exports={createSubscription};
