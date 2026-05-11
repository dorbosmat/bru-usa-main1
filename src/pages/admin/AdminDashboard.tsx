import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { PhoneCall, Share2 } from "lucide-react";

type LeadRow = { id:string; status:string; service:string; source:string; service_area:string|null; zip:string; created_at:string; callback_requested:boolean; utm_source:string|null; landing_page:string|null };

const STATUS_COLORS:Record<string,string> = { new:"hsl(215,65%,18%)",contacted:"hsl(24,95%,53%)",qualified:"hsl(150,60%,40%)",scheduled:"hsl(260,50%,50%)",won:"hsl(130,60%,35%)",lost:"hsl(0,60%,50%)",distributed:"hsl(200,70%,50%)" };

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-36"/>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">{Array.from({length:6}).map((_,i)=><Card key={i} className="p-4 space-y-2"><Skeleton className="h-3 w-20"/><Skeleton className="h-8 w-12"/></Card>)}</div>
      <div className="grid md:grid-cols-2 gap-6">{Array.from({length:2}).map((_,i)=><Card key={i} className="p-4 space-y-3"><Skeleton className="h-4 w-40"/><div className="flex items-end gap-2 h-[200px]">{Array.from({length:10}).map((_,j)=><Skeleton key={j} className="flex-1 rounded-t" style={{height:`${40+Math.random()*50}%`}}/>)}</div></Card>)}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [leads,setLeads]=useState<LeadRow[]>([]); const [distCount,setDistCount]=useState(0); const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([
      supabase.from("leads").select("id,status,service,source,service_area,zip,created_at,callback_requested,utm_source,landing_page"),
      supabase.from("lead_distributions").select("*",{count:"exact",head:true}),
    ]).then(([leadsRes,distRes])=>{ setLeads((leadsRes.data as LeadRow[]|null)??[]); setDistCount(distRes.count??0); setLoading(false); });
  },[]);

  if(loading)return <DashboardSkeleton/>;

  const total=leads.length; const today=new Date().toISOString().slice(0,10);
  const leadsToday=leads.filter(l=>l.created_at.slice(0,10)===today).length;
  const callbackCount=leads.filter(l=>l.callback_requested).length;
  const statusCounts=leads.reduce((a,l)=>({...a,[l.status]:(a[l.status]||0)+1}),{} as Record<string,number>);
  const serviceCounts=leads.reduce((a,l)=>({...a,[l.service]:(a[l.service]||0)+1}),{} as Record<string,number>);
  const cityCounts=leads.reduce((a,l)=>({...a,[l.service_area||"Unknown"]:(a[l.service_area||"Unknown"]||0)+1}),{} as Record<string,number>);
  const zipCounts=leads.reduce((a,l)=>({...a,[l.zip]:(a[l.zip]||0)+1}),{} as Record<string,number>);
  const sourceCounts=leads.reduce((a,l)=>({...a,[l.utm_source||l.source||"direct"]:(a[l.utm_source||l.source||"direct"]||0)+1}),{} as Record<string,number>);
  const pageCounts=leads.reduce((a,l)=>({...a,[l.landing_page||"/"]:(a[l.landing_page||"/"]||0)+1}),{} as Record<string,number>);

  const serviceData=Object.entries(serviceCounts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);
  const cityData=Object.entries(cityCounts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);
  const topZipData=Object.entries(zipCounts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([name,count])=>({name,count}));
  const sourceData=Object.entries(sourceCounts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);
  const pageData=Object.entries(pageCounts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,10);
  const statusData=Object.entries(statusCounts).map(([name,value])=>({name,value}));
  const dayMap:Record<string,number>={};
  const now=new Date();
  for(let i=13;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);dayMap[d.toISOString().slice(0,10)]=0;}
  leads.forEach(l=>{const day=l.created_at.slice(0,10);if(day in dayMap)dayMap[day]++;});
  const dailyData=Object.entries(dayMap).map(([date,count])=>({date:date.slice(5),count}));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[{label:"Total Leads",value:total,color:"text-foreground"},{label:"Leads Today",value:leadsToday,color:"text-accent"},{label:"Callbacks",value:callbackCount,icon:<PhoneCall size={12}/>,color:"text-accent"},{label:"Distributed",value:distCount,icon:<Share2 size={12}/>,color:"text-foreground"},{label:"Won",value:statusCounts["won"]??0,color:"text-foreground"},{label:"Lost",value:statusCounts["lost"]??0,color:"text-destructive"}].map(({label,value,icon,color})=>(
          <Card key={label} className="p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">{icon}{label}</p><p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p></Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4"><h3 className="font-display font-semibold text-foreground mb-4">Leads by Day (14d)</h3><ResponsiveContainer width="100%" height={250}><BarChart data={dailyData}><XAxis dataKey="date" tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))"/><YAxis allowDecimals={false} tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))"/><Tooltip/><Bar dataKey="count" fill="hsl(24,95%,53%)" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></Card>
        <Card className="p-4"><h3 className="font-display font-semibold text-foreground mb-4">By Status</h3><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({name,value})=>`${name}: ${value}`}>{statusData.map(e=><Cell key={e.name} fill={STATUS_COLORS[e.name]||"#888"}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></Card>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[{title:"By Service",data:serviceData,fill:"hsl(215,65%,18%)",yWidth:150},{title:"By City",data:cityData,fill:"hsl(150,60%,40%)",yWidth:120},{title:"Top ZIP Codes",data:topZipData,fill:"hsl(200,70%,50%)",yWidth:80},{title:"By Traffic Source",data:sourceData,fill:"hsl(260,50%,50%)",yWidth:100}].map(({title,data,fill,yWidth})=>(
          <Card key={title} className="p-4"><h3 className="font-display font-semibold text-foreground mb-4">{title}</h3><ResponsiveContainer width="100%" height={250}><BarChart data={data} layout="vertical"><XAxis type="number" allowDecimals={false} tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))"/><YAxis type="category" dataKey="name" width={yWidth} tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))"/><Tooltip/><Bar dataKey="count" fill={fill} radius={[0,4,4,0]}/></BarChart></ResponsiveContainer></Card>
        ))}
        <Card className="p-4 md:col-span-2"><h3 className="font-display font-semibold text-foreground mb-4">Top Landing Pages</h3><ResponsiveContainer width="100%" height={250}><BarChart data={pageData} layout="vertical"><XAxis type="number" allowDecimals={false} tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))"/><YAxis type="category" dataKey="name" width={180} tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))"/><Tooltip/><Bar dataKey="count" fill="hsl(24,95%,53%)" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer></Card>
      </div>
    </div>
  );
}
