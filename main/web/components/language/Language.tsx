'use client';
import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {Languages,ChevronDown,Check} from 'lucide-react';
import {dictionary} from '@/lib/language/dictionary';
import styles from './Language.module.css';
import {usePathname} from 'next/navigation';
export type Locale='en'|'hi'|'mr';
const options=[{code:'en' as const,label:'English',search:'english angrezi इंग्रजी अंग्रेजी'},{code:'hi' as const,label:'हिन्दी',search:'hindi हिन्दी हिंदी'},{code:'mr' as const,label:'मराठी',search:'marathi मराठी'}];
const Context=createContext({locale:'en' as Locale,setLocale:(_locale:Locale)=>{},t:(text:string)=>text});
export function LanguageProvider({children}:{children:React.ReactNode}){
 const pathname=usePathname();
 const [locale,setLocaleState]=useState<Locale>('en');
 useEffect(()=>{try{const value=localStorage.getItem('scrapsetu_language');if(value==='hi'||value==='mr')setLocaleState(value);}catch{}},[]);
 const setLocale=(value:Locale)=>{setLocaleState(value);try{localStorage.setItem('scrapsetu_language',value);}catch{}};
 useEffect(()=>{document.documentElement.lang=pathname.startsWith('/auth')?'en':locale;},[locale,pathname]);
 const t=(text:string)=>{if(locale==='en'||pathname.startsWith('/auth'))return text;const key=text.replace(/\s+/g,' ').trim();const translated=dictionary[key]?.[locale==='hi'?0:1];return translated?text.replace(text.trim(),translated):text;};
 return <Context.Provider value={{locale,setLocale,t}}>{children}</Context.Provider>;
}
export const useLocale=()=>useContext(Context);
export function T({children}:{children:React.ReactNode}){const {t}=useLocale();const translate=(node:React.ReactNode):React.ReactNode=>typeof node==='string'?t(node):Array.isArray(node)?node.map(translate):node;return <>{translate(children)}</>;}
export function LanguageSwitcher(){
 const {locale,setLocale}=useLocale();const [open,setOpen]=useState(false);const [query,setQuery]=useState('');const ref=useRef<HTMLDivElement>(null);const button=useRef<HTMLButtonElement>(null);
 useEffect(()=>{const close=(e:MouseEvent)=>{if(!ref.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close);},[]);
 const filtered=options.filter(o=>(o.search+' '+o.label).toLowerCase().includes(query.trim().toLowerCase()));
 return <div className={styles.root} ref={ref} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);button.current?.focus();}}}>
 <button ref={button} className={styles.trigger} type="button" aria-label="Choose language" aria-expanded={open} onClick={()=>{setOpen(!open);setQuery('');}}><Languages size={17}/><span>{options.find(o=>o.code===locale)?.label}</span><ChevronDown size={13}/></button>
 {open&&<div className={styles.panel}><label className={styles.searchLabel}>English · हिन्दी · मराठी<input autoFocus type="search" aria-label="Search languages" placeholder="Search / खोजें / शोधा" value={query} onChange={e=>setQuery(e.target.value)}/></label><div role="group" aria-label="Languages">{filtered.map(o=><button key={o.code} type="button" lang={o.code} aria-pressed={locale===o.code} onClick={()=>{setLocale(o.code);setOpen(false);button.current?.focus();}}>{o.label}{locale===o.code&&<Check size={15}/>}</button>)}{!filtered.length&&<p>No matches / कोई परिणाम नहीं / परिणाम नाही</p>}</div></div>}
 </div>;
}
