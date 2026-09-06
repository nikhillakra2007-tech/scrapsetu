'use client';
import { T } from '@/components/language/Language';
import {useEffect,useState} from 'react';
import AppShell from '@/components/shell/AppShell';
import CollectorPortal from '@/features/collector/CollectorPortal';
import Pickups from '@/features/pickups/Pickups';
export default function CitizenWorkspace(){
 const [tab,setTab]=useState('estimate');
 const [user,setUser]=useState<{name:string}|null>(null);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('scrapsetu_auth_user')||'null');if(!saved){location.href='/auth';return;}setUser(saved);}catch{location.href='/auth';}},[]);
 return <AppShell role="citizen" activeTab={tab} onSelectTab={setTab} currentUser={user} onSignOut={()=>{localStorage.removeItem('scrapsetu_auth_user');location.href='/auth';}}>
 <T>{tab==='estimate'?<><h1><T>Know your scrap’s worth.</T></h1><p style={{margin:'12px 0 32px',color:'var(--text-secondary)'}}><T>Estimate your materials, then arrange a demo pickup.</T></p><CollectorPortal citizen onLotCreated={()=>{}} onNavigateToRecyclerQueue={()=>setTab('pickup')}/></>:<Pickups/>}</T>
 </AppShell>;
}
