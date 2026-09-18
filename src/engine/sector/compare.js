export function compareWithSector(analysis,benchmark){
 if(!benchmark||typeof benchmark!=='object')return {available:false,reason:'No sector benchmark dataset supplied.'};
 const rows=Object.entries(analysis.ratios).filter(([key,value])=>Number.isFinite(value)&&Number.isFinite(benchmark[key])).map(([metric,value])=>({metric,company:value,sector:benchmark[metric],difference:value-benchmark[metric]}));
 return {available:rows.length>0,rows,note:'Sector comparisons are only as reliable as the supplied point-in-time benchmark dataset.'};
}
