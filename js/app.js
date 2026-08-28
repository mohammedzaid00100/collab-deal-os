(function(){
  const root = window.location.pathname.includes('/creator/') || window.location.pathname.includes('/brand/') ? '..' : '.';
  window.CDOS = window.CDOS || {};
  CDOS.root = root;
  CDOS.storage = {
    get(key, fallback=null){ try { const v=localStorage.getItem('cdos:'+key); return v?JSON.parse(v):fallback; } catch{return fallback;} },
    set(key,val){ localStorage.setItem('cdos:'+key, JSON.stringify(val)); },
    del(key){ localStorage.removeItem('cdos:'+key); }
  };
  CDOS.money=(n,currency='$')=> currency==='₹'?`₹${Number(n).toLocaleString('en-IN')}`:`$${Number(n).toLocaleString('en-US')}`;
  CDOS.compact=n=>Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(n);
  CDOS.toast=(msg)=>{let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2300)};
  CDOS.loadData=async()=>{ if(CDOS.data) return CDOS.data; const fallback={creator:{name:'Maya Patel'},opportunities:[],creators:[],campaigns:[],offers:[]}; try{const r=await fetch(`${root}/data/demo-data.json`); CDOS.data=await r.json();}catch{CDOS.data=fallback;} return CDOS.data; };
  CDOS.icon=(name)=>({dashboard:'▦',ai:'✦',opportunities:'▣',offers:'▤',analytics:'▥',subscription:'▭',settings:'⚙',campaigns:'▣',creators:'⌕',matches:'◎',content:'◇',billing:'▭',team:'♙',profile:'◉'}[name]||'•');
  function nav(role){
    const creator=[['dashboard','Dashboard','dashboard.html'],['ai','AI Deal Advisor','ai-advisor.html'],['opportunities','Opportunities','opportunities.html'],['offers','Offers','offers.html'],['analytics','Analytics','dashboard.html#analytics'],['subscription','Subscription','subscription.html'],['settings','Settings','settings.html']];
    const brand=[['dashboard','Brand Dashboard','dashboard.html'],['campaigns','Campaigns','campaigns.html'],['creators','Creator Discovery','creators.html'],['ai','AI Deal Advisor','ai-advisor.html'],['matches','Matches','creators.html','23'],['offers','Offers','offers.html','12'],['content','Content & Approvals','offers.html#approvals'],['analytics','Analytics','dashboard.html#analytics'],['billing','Spend & Billing','subscription.html'],['settings','Settings','settings.html']];
    return role==='brand'?brand:creator;
  }
  CDOS.renderShell=async()=>{
    const body=document.body;if(!body.classList.contains('app-body'))return;
    const role=body.dataset.role||CDOS.storage.get('role','creator');
    const page=body.dataset.page||'dashboard';
    const data=await CDOS.loadData(); const name=role==='brand'?'Lumière Beauty':data.creator.name; const avatar=role==='brand'?`${root}/assets/images/lumiere-logo.png`:`${root}/assets/images/maya-avatar.png`;
    const links=nav(role).map(([key,label,href,badge])=>`<a class="nav-link ${page===key?'active':''}" href="${href}"><span class="nav-ico">${CDOS.icon(key)}</span><span>${label}</span>${badge?`<span class="nav-badge">${badge}</span>`:''}</a>`).join('');
    body.insertAdjacentHTML('afterbegin',`<div id="overlay" class="overlay"></div><aside id="sidebar" class="sidebar"><a href="${root}/index.html"><img class="brand-logo small" src="${root}/assets/logo/collab-logo.svg" alt="Collab Deal OS"></a><nav class="nav-list">${links}</nav><div class="plan-card"><div class="row-between"><span class="pill">♛ Pro Plan</span></div><p class="caption">Renews on Jun 18, 2025</p><div class="progress"><span></span></div><p class="caption">3 of 5 evaluation(s) used</p><a class="btn btn-outline btn-sm" style="width:100%" href="subscription.html">Manage Plan</a></div></aside><header class="topbar"><button id="mobileMenu" class="mobile-menu" aria-label="Open menu">☰</button><div class="search-box"><input aria-label="Search" placeholder="Search opportunities, brands, deals..."></div><div class="top-actions"><div class="bell">♧<span class="count">3</span></div><div class="user-chip"><img src="${avatar}" alt="${name}"><span>${name}</span>⌄</div></div></header>`);
    document.getElementById('mobileMenu')?.addEventListener('click',()=>{document.getElementById('sidebar').classList.add('open');document.getElementById('overlay').classList.add('open')});
    document.getElementById('overlay')?.addEventListener('click',()=>{document.getElementById('sidebar').classList.remove('open');document.getElementById('overlay').classList.remove('open')});
  };
  document.addEventListener('DOMContentLoaded',()=>{CDOS.renderShell();document.querySelectorAll('[data-demo-toast]').forEach(el=>el.addEventListener('click',()=>CDOS.toast(el.dataset.demoToast||'Demo action completed')))});
})();
