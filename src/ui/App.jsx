import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { analyzeDobrofsky } from '../engine/dobrofsky/model.js';
import { compareStress } from '../engine/risk/stress.js';
import { analyzeHistory } from '../engine/risk/history.js';

const sample=[
 {period:'2023',financials:{revenue:1000,currentAssets:520,currentLiabilities:250,totalAssets:1500,totalDebt:430,totalEquity:1070,ebit:210,interestExpense:38,operatingIncome:210,netIncome:150,operatingCashFlow:190,accountsReceivable:110,inventory:90}},
 {period:'2024',financials:{revenue:1050,currentAssets:500,currentLiabilities:290,totalAssets:1540,totalDebt:520,totalEquity:1020,ebit:185,interestExpense:52,operatingIncome:185,netIncome:120,operatingCashFlow:145,accountsReceivable:145,inventory:110}},
 {period:'2025',financials:{revenue:1080,currentAssets:470,currentLiabilities:340,totalAssets:1570,totalDebt:650,totalEquity:920,ebit:145,interestExpense:70,operatingIncome:145,netIncome:78,operatingCashFlow:92,accountsReceivable:180,inventory:135}},
 {period:'2026',financials:{revenue:1100,currentAssets:430,currentLiabilities:390,totalAssets:1600,totalDebt:760,totalEquity:840,ebit:115,interestExpense:88,operatingIncome:115,netIncome:48,operatingCashFlow:55,accountsReceivable:220,inventory:150}}
];
const pct=n=>Number(n)/100;
function Score({value,label}){return <div className="score"><div className="scoreNum">{value}</div><div>/100</div><strong>{label.toUpperCase()}</strong></div>}
function App(){
 const [periods,setPeriods]=useState(sample); const [company,setCompany]=useState('Example Company');
 const latest=periods.at(-1)?.financials; const analysis=useMemo(()=>latest?analyzeDobrofsky(latest):null,[latest]);
 const history=useMemo(()=>analyzeHistory(periods),[periods]);
 const [stress,setStress]=useState({revenuePct:-10,ebitPct:-20,operatingCashFlowPct:-25,interestExpensePct:20});
 const stressed=useMemo(()=>latest?compareStress(latest,Object.fromEntries(Object.entries(stress).map(([k,v])=>[k,pct(v)]))):null,[latest,stress]);
 if(!analysis?.ok)return <main><h1>Dobrofsky Risk Analyzer</h1><p>Financial data is incomplete.</p></main>;
 const decomposition=Object.entries(analysis.components).map(([factor,risk])=>({factor,risk}));
 const trend=history.series.filter(x=>x.ok).map(x=>({period:x.period,risk:x.score}));
 const quality=periods.map(x=>({period:x.period,netIncome:x.financials.netIncome,operatingCashFlow:x.financials.operatingCashFlow}));
 const update=(key,val)=>setPeriods(p=>p.map((x,i)=>i===p.length-1?{...x,financials:{...x.financials,[key]:Number(val)}}:x));
 return <main>
  <header><div><span className="eyebrow">FINANCIAL RISK INTELLIGENCE</span><h1>Dobrofsky Risk Analyzer</h1><input className="company" value={company} onChange={e=>setCompany(e.target.value)}/></div><Score value={analysis.score} label={analysis.classification}/></header>
  <section className="grid metrics">{Object.entries(analysis.components).map(([k,v])=><article key={k}><span>{k}</span><b>{v}/100</b></article>)}</section>
  <section className="grid two"><article><h2>Risk evolution</h2><p>Historical deterioration of the Dobrofsky score.</p><ResponsiveContainer width="100%" height={280}><LineChart data={trend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="period"/><YAxis domain={[0,100]}/><Tooltip/><ReferenceLine y={65}/><Line type="monotone" dataKey="risk" strokeWidth={3}/></LineChart></ResponsiveContainer></article>
  <article><h2>Risk decomposition</h2><p>Contribution by core financial dimension.</p><ResponsiveContainer width="100%" height={280}><BarChart data={decomposition} layout="vertical"><CartesianGrid strokeDasharray="3 3"/><XAxis type="number" domain={[0,100]}/><YAxis dataKey="factor" type="category" width={90}/><Tooltip/><Bar dataKey="risk"/></BarChart></ResponsiveContainer></article></section>
  <section className="grid two"><article><h2>Quality of earnings</h2><p>Net income compared with operating cash flow.</p><ResponsiveContainer width="100%" height={280}><LineChart data={quality}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="period"/><YAxis/><Tooltip/><Line dataKey="netIncome" strokeWidth={2}/><Line dataKey="operatingCashFlow" strokeWidth={2}/></LineChart></ResponsiveContainer></article>
  <article><h2>Stress simulator</h2><div className="stress">{Object.entries(stress).map(([k,v])=><label key={k}>{k}<input type="number" value={v} onChange={e=>setStress({...stress,[k]:Number(e.target.value)})}/><small>%</small></label>)}</div><div className="compare"><div>Baseline <b>{stressed.baseline.score}</b></div><div>Stressed <b>{stressed.stressed.score}</b></div></div></article></section>
  <section className="grid two"><article><h2>Early warnings</h2>{history.alerts.length?history.alerts.map(a=><div className="alert" key={a}>{a}</div>):<p>No historical warning triggered.</p>}<h3>Top risk drivers</h3>{analysis.drivers.map(d=><div className="driver" key={d.factor}><span>{d.factor}</span><b>{d.risk}/100</b></div>)}</article>
  <article><h2>Latest financial inputs</h2><div className="inputs">{['revenue','currentAssets','currentLiabilities','totalAssets','totalDebt','totalEquity','ebit','interestExpense','operatingIncome','netIncome','operatingCashFlow'].map(k=><label key={k}>{k}<input type="number" value={latest[k]} onChange={e=>update(k,e.target.value)}/></label>)}</div></article></section>
  <footer>Research model {analysis.model.version}. Not a bankruptcy probability. Calibration and out-of-sample backtesting are required before predictive use.</footer>
 </main>
}
export default App;
