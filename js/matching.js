(function(){
  const norm=s=>(s||'').toLowerCase();
  function score(creator,campaign){
    const niche=norm(creator.niche).includes(norm(campaign.targetNiche||campaign.niche).split('&')[0].trim())?100:75;
    const location=norm(campaign.targetLocation||campaign.location).includes('united states')?92:76;
    const size=Math.min(100,60+(creator.followers||0)/5000);
    const engagement=Math.min(100,(creator.engagement||3)*13);
    const budget=(campaign.budget||campaign.payment||0)>=(creator.rate||0)*.7?100:70;
    const platform=!campaign.platform||norm(campaign.platform)===norm(creator.platform)?100:75;
    return Math.round(niche*.30+location*.20+size*.15+engagement*.15+budget*.10+platform*.10);
  }
  window.MatchingEngine={score};
})();
