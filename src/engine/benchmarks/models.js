const div=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&b!==0?a/b:null;

export function altmanZ(financials){
 const {workingCapital,retainedEarnings,ebit,marketValueEquity,sales,totalAssets,totalLiabilities}=normalize(financials);
 if([workingCapital,retainedEarnings,ebit,marketValueEquity,sales,totalAssets,totalLiabilities].some(v=>!Number.isFinite(v))||totalAssets===0||totalLiabilities===0)return {available:false,reason:'Altman Z-Score requires working capital, retained earnings, market value of equity, sales, total assets and total liabilities.'};
 const score=1.2*div(workingCapital,totalAssets)+1.4*div(retainedEarnings,totalAssets)+3.3*div(ebit,totalAssets)+0.6*div(marketValueEquity,totalLiabilities)+div(sales,totalAssets);
 return {available:true,name:'Altman Z-Score',score:Number(score.toFixed(2)),interpretation:score>2.99?'Lower distress zone':score<1.81?'Distress zone':'Grey zone',note:'Classic public manufacturing-company specification; applicability depends on company type.'};
}

export function piotroskiF(financials,previous){
 if(!previous)return {available:false,reason:'Piotroski F-Score requires a prior comparable period.'};
 const f=financials,p=previous; const required=['netIncome','operatingCashFlow','totalAssets','totalDebt','currentAssets','currentLiabilities','revenue'];
 if(required.some(k=>!Number.isFinite(f[k])||!Number.isFinite(p[k])))return {available:false,reason:'Required current/prior-period inputs are incomplete.'};
 const roa=div(f.netIncome,f.totalAssets),proa=div(p.netIncome,p.totalAssets),cr=div(f.currentAssets,f.currentLiabilities),pcr=div(p.currentAssets,p.currentLiabilities),margin=div(f.netIncome,f.revenue),pmargin=div(p.netIncome,p.revenue),turn=div(f.revenue,f.totalAssets),pturn=div(p.revenue,p.totalAssets);
 const signals=[f.netIncome>0,f.operatingCashFlow>0,roa>proa,f.operatingCashFlow>f.netIncome,div(f.totalDebt,f.totalAssets)<div(p.totalDebt,p.totalAssets),cr>pcr,true,margin>pmargin,turn>pturn];
 return {available:true,name:'Piotroski F-Score',score:signals.filter(Boolean).length,max:9,interpretation:'Higher scores indicate more positive accounting signals.',note:'Share-issuance signal defaults neutral/positive because share-count data is not yet collected.'};
}
function normalize(f){return {workingCapital:Number.isFinite(f.workingCapital)?f.workingCapital:f.currentAssets-f.currentLiabilities,retainedEarnings:f.retainedEarnings,ebit:f.ebit,marketValueEquity:f.marketValueEquity,sales:Number.isFinite(f.sales)?f.sales:f.revenue,totalAssets:f.totalAssets,totalLiabilities:Number.isFinite(f.totalLiabilities)?f.totalLiabilities:f.totalDebt};}
