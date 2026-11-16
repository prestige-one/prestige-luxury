import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const web=path.join(root,'web'),require=createRequire(path.join(web,'package.json')),sharp=require('sharp');
const developers=JSON.parse(await fs.readFile(path.join(web,'content/developers.json'),'utf8'));
const neighbourhoods=JSON.parse(await fs.readFile(path.join(root,'crawl/neighbourhood-photography-sources.json'),'utf8'));
const alias={'dubai-land-residence-complex':'dubai-land','mohammed-bin-rashid-city':'meydan','meydan-city':'meydan','dubai-islands':'dubai-islands','dubai-production-city':'dubai-production-city-impz','damac-hills':'damac-hills-akoya-by-damac'};
const editorial={'jad-global':'selected-jad','stamn-real-estate-development':'selected-stamn','binghatti-developers':'selected-binghatti','taraf-development':'selected-taraf','forum-real-estate-development':'selected-forum','casagrand-developers':'selected-islands','the-heart-of-europe':'selected-thoe','nexus-developers':'selected-nexus','eagle-hills':'official-eagle-hills','omniyat':'official-omniyat','devmark':'downtown-dubai','mana-comco-real-estate':'dubai-marina','one-broker-group':'business-bay'};
const kept={
'prestige-one-developments':['/wp-content/uploads/2023/05/The-Residence-banner-5-scaled-1.jpg','The Residence by Prestige One in Jumeirah Village Circle'],
'emaar-properties':['/images/blog/SIRDHANA-by-EMAAR-properties-329d24bc0e.webp','Sirdhana by Emaar Properties'],
'damac-properties':['/images/blog/damac-properties-1024x576-84683db6e1.webp','DAMAC residential development in Dubai'],
'nakheel':['/wp-content/uploads/2021/04/aerial-view-of-dubai-palm-jumeirah-island-1170x785.jpg','Palm Jumeirah, a Nakheel master community'],
'meraas':['/images/blog/dubai-city-walk-781f808b78.webp','City Walk, a Meraas destination in Dubai']};
const used=new Set(),seenPixels=new Set(),cache=new Map(),records=[];
const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const attribute=(t,n)=>(t.match(new RegExp('\\b'+n+'="([^"]*)"','i'))?.[1]||'').replaceAll('&amp;','&');
async function candidates(slug){
 const selected={
 'selected-jad':{src:'https://backend.jadglobal.ae/storage/projects/media/ci-2026-01-05-457100-ozvq8c6jnjbyx1dx-cover-img-j188.webp',alt:'J188 by JAD Global',sourcePage:'https://jadglobal.ae/'},
 'selected-stamn':{src:'https://stamndevelopment.com/uploads/images/20260120/dc1a92857eb21aaf789ea85a5ff9f7b2.jpg',alt:'MIA Tower by STAMN Development',sourcePage:'https://stamndevelopment.com/'},
 'selected-binghatti':{src:'https://binghattiweb.imgix.net/aquarise-home-banner-exterior-2.webp?auto=format,compress&q=85&w=1600',alt:'Binghatti Aquarise',sourcePage:'https://www.binghatti.com/'},
 'selected-taraf':{src:'https://d3ob0s3rxbjyep.cloudfront.net/content/Apartments_in_Palm_Jumeirah_885e7bcc7e.jpg',alt:'Apartment buildings in Palm Jumeirah',sourcePage:'https://www.bayut.com/area-guides/palm-jumeirah/'},
 'selected-forum':{src:'https://d3ob0s3rxbjyep.cloudfront.net/content/gardenapartment3_5352a4bb7a.jpg',alt:'Apartments in Jebel Ali',sourcePage:'https://www.bayut.com/area-guides/jebel-ali/'},
 'selected-islands':{src:'/images/dubai-Islands-1.webp',alt:'The Dubai Islands waterfront community',sourcePage:null},
 'selected-thoe':{src:'https://d159guvtjjsjmp.cloudfront.net/uploads/2026/01/first-bg-1.png',alt:'The Heart of Europe island destination',sourcePage:'https://thoe.com/'},
 'selected-nexus':{src:'https://nexusdeveloper.com/wp-content/uploads/2024/07/DubaiSkyline-TravelRepublic-iStock-816341758.jpg',alt:'Dubai skyline',sourcePage:'https://nexusdeveloper.com/'}
 }; if(selected[slug])return [selected[slug]];
 if(slug==="official-eagle-hills")return [{src:"https://eaglehills.com/wp-content/uploads/2024/04/Eagle-Hills-Projects-United-Arab-Emirates.jpeg",alt:"Eagle Hills waterfront development",sourcePage:"https://eaglehills.com"}];
 if(slug==="official-omniyat")return [{src:"https://cdn.prod.website-files.com/64cd0df1806781d956403b26/64d117230a5dee8c2936236a_sidenav-home.webp",alt:"OMNIYAT architectural development",sourcePage:"https://omniyat.com"}];
 if(cache.has(slug))return cache.get(slug);
 const local=neighbourhoods.find(r=>r.slug===slug);
 let list=[];
 if(local)list=[{src:local.image,alt:local.sourceAlt,sourcePage:local.sourcePage},...local.alternatives.map(p=>({...p,sourcePage:local.sourcePage}))];
 else{const url='https://www.bayut.com/area-guides/'+slug+'/';try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});if(r.ok){const h=await r.text();list=(h.match(/<img\b[^>]*>/gi)||[]).map(t=>({src:attribute(t,'src'),alt:attribute(t,'alt'),sourcePage:url})).filter(p=>p.src.includes('cloudfront.net/content/')&&/\.(jpg|jpeg|png|webp)(\?|$)/i.test(p.src));}}catch{}}
 list=list.filter(p=>! /\bmap\b|overview by|consultant|logo|school|hospital|clinic|mall|supermarket|mosque|metro|bus stop|fitness|restaurant|church|temple|attractions|gym|cinema|clinic|hotel|pool|kitchen|bedroom|interior/i.test(p.alt));cache.set(slug,list);return list;
}
await fs.mkdir(path.join(web,'public/images/developers'),{recursive:true});
const only=new Set((process.argv.find(arg=>arg.startsWith('--only='))?.slice(7)||'').split(',').filter(Boolean));
let previous=[];try{previous=JSON.parse(await fs.readFile(path.join(root,'crawl/developer-photography-sources.json'),'utf8'));}catch{}
for(const d of developers){
 if(only.size&&!only.has(d.slug)){const record=previous.find(r=>r.slug===d.slug);if(record){records.push(record);used.add(record.sourceImage||record.src);continue;}}

 if(kept[d.slug]){records.push({slug:d.slug,src:kept[d.slug][0],alt:kept[d.slug][1],sourcePage:null});used.add(kept[d.slug][0]);continue;}
 const slugs=editorial[d.slug]?[editorial[d.slug]]:d.communities.map(n=>alias[slugify(n)]||slugify(n));
 let selected;
 for(const slug of slugs){for(const p of await candidates(slug)){if(used.has(p.src))continue;try{const b=p.src.startsWith('/')?await fs.readFile(path.join(web,'public',p.src)):Buffer.from(await(await fetch(p.src,{signal:AbortSignal.timeout(20000)})).arrayBuffer());const meta=await sharp(b).metadata();if(meta.width<1000||meta.height<600)continue;const {data,info}=await sharp(b).rotate().resize({width:1200,height:800,fit:'inside',withoutEnlargement:true}).webp({quality:86,effort:4}).toBuffer({resolveWithObject:true});const hash=require('node:crypto').createHash('sha256').update(data).digest('hex');if(seenPixels.has(hash))continue;seenPixels.add(hash);const version=['jad-global','binghatti-developers'].includes(d.slug)?'-architecture':'';const src='/images/developers/'+d.slug+version+'.webp';await fs.writeFile(path.join(web,'public',src),data);selected={slug:d.slug,src,alt:p.alt,sourceImage:p.src,sourcePage:p.sourcePage,width:info.width,height:info.height};used.add(p.src);break;}catch(e){console.log(d.slug+': skipped '+String(e).slice(0,80));}}
 if(selected)break;}
 if(!selected){console.log('MISSING: '+d.slug);continue;}
 records.push(selected);console.log(d.slug+': '+selected.alt);
}
await fs.writeFile(path.join(web,'content/developer-images.json'),JSON.stringify(Object.fromEntries(records.map(r=>[r.slug,{src:r.src,alt:r.alt}])),null,2)+'\n');
await fs.writeFile(path.join(root,'crawl/developer-photography-sources.json'),JSON.stringify(records,null,2)+'\n');
console.log('Imported '+records.length+' distinct developer directory photographs.'); if(records.length!==developers.length)process.exitCode=1;
