(function(){
  document.addEventListener('DOMContentLoaded',async()=>{
    if(document.body.dataset.role!=='creator')return; const data=await CDOS.loadData();
    if(document.body.dataset.page==='dashboard') renderDashboard(data);
    if(document.body.dataset.page==='profile') renderProfile(data);
    const form=document.getElementById('creatorOnboarding'); if(form){populateOnboarding(data.creator,form);form.addEventListener('input',()=>updatePreview(form));form.addEventListener('submit',e=>{e.preventDefault();const p=Object.fromEntries(new FormData(form).entries());CDOS.storage.set('creatorProfile',p);CDOS.toast('Creator profile saved');setTimeout(()=>location.href='dashboard.html',450)});updatePreview(form)}
  });
  function renderDashboard(d){
    document.querySelector('[data-follower]')?.replaceChildren(document.createTextNode(CDOS.compact(d.creator.metrics.instagram)));
    document.querySelector('[data-engagement]')?.replaceChildren(document.createTextNode(d.creator.metrics.engagement+'%'));
    const recent=document.getElementById('recentOpportunities'); if(recent) recent.innerHTML=d.opportunities.slice(0,5).map(o=>`<div class="recent-item"><div class="recent-logo">${o.brand.slice(0,2).toUpperCase()}</div><div><strong>${o.brand}</strong><div class="caption">${o.title}</div></div><div><strong>$${o.payment.toLocaleString()}</strong><div class="caption">Budget</div></div></div>`).join('');
  }
  function populateOnboarding(p,f){[['instagramUrl',p.instagramUrl],['instagramFollowers',p.metrics.instagram],['facebookFollowers',p.metrics.facebook],['youtubeSubscribers',p.metrics.youtube],['tiktokFollowers',p.metrics.tiktok],['averageViews',p.metrics.averageViews],['engagement',p.metrics.engagement],['location',p.location],['niche',p.niche],['audienceRegion',p.audienceRegion]].forEach(([n,v])=>{const el=f.elements[n];if(el)el.value=v})}
  function updatePreview(f){const q=n=>f.elements[n]?.value||'—';document.querySelector('[data-preview-name]')&&(document.querySelector('[data-preview-name]').textContent='Maya Patel');document.querySelector('[data-preview-niche]')&&(document.querySelector('[data-preview-niche]').textContent=q('niche'));document.querySelector('[data-preview-location]')&&(document.querySelector('[data-preview-location]').textContent=q('location'));document.querySelector('[data-preview-followers]')&&(document.querySelector('[data-preview-followers]').textContent=CDOS.compact(Number(q('instagramFollowers'))||0));document.querySelector('[data-preview-engagement]')&&(document.querySelector('[data-preview-engagement]').textContent=q('engagement')+'%')}
  function renderProfile(d){const target=document.getElementById('profileBody');if(!target)return;target.innerHTML=`<div class="card dash-card"><div class="profile-head"><img src="../assets/images/maya-avatar.png"><div><h2>${d.creator.name} <span class="badge-check">●</span></h2><p class="muted">${d.creator.niche}</p><span class="pill">${d.creator.metricStatus}</span></div></div></div>`}
})();
