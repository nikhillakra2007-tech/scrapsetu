'use client';
import { T, useLocale } from '@/components/language/Language';
import { useEffect, useState } from 'react';
import styles from './Pickups.module.css';

type Pickup = { id:string; address:string; phone:string; material:string; weight:number; date:string; status:'pending'|'accepted'|'completed' };
const KEY='scrapsetu_demo_pickups_v1';
function read():Pickup[]{ try { const value:unknown=JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(value)?value.filter((item):item is Pickup=>Boolean(item&&typeof item.id==='string'&&typeof item.address==='string'&&typeof item.phone==='string'&&typeof item.material==='string'&&typeof item.date==='string'&&Number.isFinite(item.weight)&&['pending','accepted','completed'].includes(item.status))):[]; } catch { return []; } }
export default function Pickups({collector=false}:{collector?:boolean}) {
 const {t:translate}=useLocale();

 const [items,setItems]=useState<Pickup[]>([]);
 const [message,setMessage]=useState('');
 const today=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
 useEffect(()=>{ const refresh=()=>setItems(read());refresh();window.addEventListener('storage',refresh);window.addEventListener('pickups-updated',refresh);return()=>{window.removeEventListener('storage',refresh);window.removeEventListener('pickups-updated',refresh);}; },[]);
 function save(next:Pickup[]) { try {localStorage.setItem(KEY,JSON.stringify(next));setItems(next);window.dispatchEvent(new Event('pickups-updated'));return true;} catch {setMessage('Storage is unavailable. Your request has not been saved.');return false;} }
 return <section className={styles.pickups}>
  <div><h1><T>{collector?'Doorstep pickups':'Book a pickup'}</T></h1><p><T>Demo workspace. Requests are shared between roles in this browser; no real pickup is arranged.</T></p></div>
  <T>{!collector && <form className={styles.form} onSubmit={e=>{e.preventDefault();const form=e.currentTarget;const data=new FormData(form);const weight=Number(data.get('weight'));const date=String(data.get('date'));if(weight<=0||date<today)return;const pickup:Pickup={id:'P-'+Date.now().toString(36).toUpperCase(),address:String(data.get('address')).trim(),phone:String(data.get('phone')).trim(),material:String(data.get('material')).trim(),weight,date,status:'pending'};if(!pickup.address||!pickup.material)return;if(save([pickup,...read()])){setMessage('Pickup requested. A collector can now accept it in the demo.');form.reset();}}}>
   <h2><T>Where should we collect?</T></h2>
   <label><T>Pickup address</T><textarea name="address" required maxLength={300} autoComplete="street-address" /></label>
   <div className={styles.fields}><label><T>Phone number</T><input name="phone" type="tel" required pattern="[+0-9 ()-]{10,18}" autoComplete="tel" /></label><label><T>Preferred date</T><input name="date" type="date" min={today} required /></label></div>
   <div className={styles.fields}><label><T>Material</T><input name="material" required maxLength={120} placeholder={translate("For example, old cables")} /></label><label><T>Approximate weight (kg)</T><input name="weight" type="number" min="0.1" max="10000" step="0.1" required /></label></div>
   <button type="submit"><T>Request pickup</T></button>
  </form>}</T>
  <T>{message&&<p role="status"><T>{message}</T></p>}</T>
  <div className={styles.requests}><h2><T>{collector?'Collection requests':'Your requests'}</T></h2>
   <T>{!items.length&&<p><T>No pickup requests yet.</T></p>}</T>
   <T>{items.map(item=><article key={item.id} className={styles.request}>
    <div><small><T>{item.id}</T></small><h3><T>{item.material}</T></h3><p><T>{item.address}</T></p><p><T>{item.phone}</T><T> · </T><T>{item.date}</T><T> · </T><T>{item.weight}</T><T> kg</T></p></div>
    <div><span className={styles.status}><T>{item.status==='pending'?'Awaiting collector':item.status==='accepted'?'Accepted by demo collector':'Collection complete'}</T></span>
    <T>{collector&&item.status!=='completed'&&<button onClick={()=>save(read().map(p=>p.id===item.id?{...p,status:item.status==='pending'?'accepted':'completed'}:p))}><T>{item.status==='pending'?'Accept pickup':'Mark collected'}</T></button>}</T></div>
   </article>)}</T>
  </div>
 </section>;
}
