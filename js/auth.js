(function(){
  async function config(){try{const r=await fetch('api/config');return r.ok?await r.json():{}}catch{return {}}}
  function route(role,onboarding=true){location.href=role==='brand'?(onboarding?'brand/onboarding.html':'brand/dashboard.html'):(onboarding?'creator/onboarding.html':'creator/dashboard.html')}
  async function supabaseEmailAuth(form,role,isSignup,cfg){
    const email=form.elements.email.value,password=form.elements.password.value;
    const endpoint=isSignup?`${cfg.supabaseUrl}/auth/v1/signup`:`${cfg.supabaseUrl}/auth/v1/token?grant_type=password`;
    const body=isSignup?{email,password,data:{account_type:role}}:{email,password};
    const r=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json','apikey':cfg.supabasePublishableKey},body:JSON.stringify(body)});
    const data=await r.json(); if(!r.ok) throw new Error(data.msg||data.error_description||data.error||'Authentication failed');
    const actualRole=data.user?.user_metadata?.account_type||role;CDOS.storage.set('role',actualRole);CDOS.storage.set('session',{email,role:actualRole,access_token:data.access_token||data.session?.access_token||'',user:data.user||null,at:Date.now()});route(actualRole,isSignup);return true;
  }
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-role-choice]').forEach(b=>b.addEventListener('click',()=>{CDOS.storage.set('role',b.dataset.roleChoice);location.href='login.html'}));
    const form=document.getElementById('authForm'); if(!form)return;
    const isSignup=location.pathname.endsWith('/signup.html')||location.pathname.endsWith('signup.html');
    form.addEventListener('submit',async(e)=>{e.preventDefault();const role=CDOS.storage.get('role','creator');const email=form.elements.email?.value||'demo@example.com';const submit=form.querySelector('[type=submit]');submit.disabled=true;const old=submit.textContent;submit.textContent='Please wait…';try{const cfg=await config();if(cfg.supabaseUrl&&cfg.supabasePublishableKey){await supabaseEmailAuth(form,role,isSignup,cfg)}else{CDOS.storage.set('session',{email,role,at:Date.now(),demo:true});route(role,true)}}catch(err){CDOS.toast(err.message||'Could not sign in')}finally{submit.disabled=false;submit.textContent=old}});
    document.getElementById('googleSignIn')?.addEventListener('click',async()=>{const role=CDOS.storage.get('role','creator');const cfg=await config();if(cfg.supabaseUrl&&cfg.supabasePublishableKey){const redirect=`${location.origin}/auth-callback.html?role=${encodeURIComponent(role)}`;location.href=`${cfg.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirect)}`;}else{CDOS.storage.set('session',{email:'google-demo@example.com',role,at:Date.now(),demo:true});route(role,true)}});
  });
})();
