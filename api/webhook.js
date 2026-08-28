const crypto=require('crypto');
function verifyRazorpayWebhook(rawBody,signature){
  const secret=process.env.RAZORPAY_WEBHOOK_SECRET;
  if(!secret) return false;
  const expected=crypto.createHmac('sha256',secret).update(rawBody).digest('hex');
  try{return crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(signature||''));}catch{return false;}
}
module.exports={verifyRazorpayWebhook};
