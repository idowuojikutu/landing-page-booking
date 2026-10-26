const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY='clearpath-items-v1';let items=loadItems(),page='home',editingId=null;
function loadItems(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return []}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(items));return true}catch{toast('Browser storage is full. Export your data to keep a backup.');return false}}
function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}
function today(){const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)}
function prettyDate(d){if(!d)return 'No due date';return new Date(d+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:new Date(d+'T12:00:00').getFullYear()!==new Date().getFullYear()?'numeric':undefined})}
function money(n){return new Intl.NumberFormat(undefined,{style:'currency',currency:localStorage.getItem('clearpath-currency')||'USD',maximumFractionDigits:2}).format(Number(n)||0)}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>t.classList.remove('on'),2600)}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function typeName(t){return {task:'Task',bill:'Bill / renewal',goal:'Goal'}[t]||'Task'}
function typeColor(t){return t==='bill'?'bg-amber-50 text-amber-700':t==='goal'?'bg-violet-50 text-violet-700':'bg-emerald-50 text-emerald-700'}
function saveItem(e){e.preventDefault();const title=$('#itemTitle').value.trim();if(!title)return;const type=$('#itemType').value;const data={id:editingId||uid(),title,type,date:$('#itemDate').value,notes:$('#itemNotes').value.trim(),amount:type==='bill'?$('#itemAmount').value:'',progress:type==='goal'?Number($('#itemProgress').value):0,done:editingId?!!items.find(x=>x.id===editingId)?.done:false,created:editingId?items.find(x=>x.id===editingId)?.created||Date.now():Date.now()};if(editingId)items=items.map(x=>x.id===editingId?data:x);else items.unshift(data);persist();closeModal();render();toast(editingId?'Item updated.':'Saved — one less thing to remember.')}
function openModal(type='task',id=null){editingId=id;const item=id?items.find(x=>x.id===id):null;$('#itemForm').reset();$('#modalTitle').textContent=item?'Edit item':'Capture an item';$('#itemTitle').value=item?.title||'';$('#itemType').value=item?.type||type;$('#itemDate').value=item?.date||'';$('#itemNotes').value=item?.notes||'';$('#itemAmount').value=item?.amount||'';$('#itemProgress').value=item?.progress||0;toggleFields();$('#modal').classList.remove('hidden');$('#modal').classList.add('flex');setTimeout(()=>$('#itemTitle').focus(),50)}
function closeModal(){$('#modal').classList.add('hidden');$('#modal').classList.remove('flex');editingId=null}
function toggleFields(){const t=$('#itemType').value;$('#amountWrap').classList.toggle('hidden',t!=='bill');$('#goalWrap').classList.toggle('hidden',t!=='goal');$('#progressLabel').textContent=$('#itemProgress').value+'%'}
function setPage(next){page=next;$('#homePage').classList.toggle('hidden',next!=='home');$('#listPage').classList.toggle('hidden',next==='home');$$('[data-page]').forEach(b=>{b.classList.toggle('active',b.dataset.page===next);b.classList.toggle('text-slate-500',b.dataset.page!==next);b.classList.toggle('font-bold',b.dataset.page===next)});const labels={tasks:['Tasks & plans','Get it out of your head and into your plan.','MAKE IT MANAGEABLE'],bills:['Bills & renewals','Stay ahead of payments and important renewals.','NO MORE SURPRISES'],goals:['Goals','Keep the things that matter moving forward.','YOUR FUTURE, IN PROGRESS']};if(next!=='home'){const l=labels[next];$('#heading').textContent=l[0];$('#listHeading').textContent=l[0];$('#listDescription').textContent=l[1];$('#listEyebrow').textContent=l[2];renderList()}else $('#heading').textContent='Make room for life.';$('#sidebar').classList.add('-translate-x-full')}
function taskRow(x){return '<div class="surface flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"><input aria-label="Mark '+esc(x.title)+' complete" type="checkbox" data-done="'+x.id+'" '+(x.done?'checked':'')+' class="task-check h-4 w-4 accent-emerald-600"><span class="min-w-0 flex-1 text-sm font-semibold">'+esc(x.title)+'</span><span class="hidden text-[11px] text-slate-400 sm:block">'+prettyDate(x.date)+'</span><button data-edit="'+x.id+'" aria-label="Edit '+esc(x.title)+'" class="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100">✎</button></div>'}
function renderHome(){const tasks=items.filter(x=>x.type==='task'),open=tasks.filter(x=>!x.done),bills=items.filter(x=>x.type==='bill'&&!x.done).sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')),goals=items.filter(x=>x.type==='goal');$('#focusCount').textContent=open.length;$('#upcomingCount').textContent=bills.length;$('#goalCount').textContent=goals.length;const complete=tasks.length?Math.round(tasks.filter(x=>x.done).length/tasks.length*100):0;$('#momentum').textContent=complete+'%';$('#momentumBar').style.width=complete+'%';$('#todayTasks').innerHTML=open.slice().sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')).slice(0,5).map(taskRow).join('');$('#emptyTasks').classList.toggle('hidden',open.length>0);$('#upcomingList').innerHTML=bills.slice(0,4).map(x=>'<div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">◷</span><div class="min-w-0 flex-1"><p class="truncate text-sm font-bold">'+esc(x.title)+'</p><p class="text-xs text-slate-400">'+prettyDate(x.date)+'</p></div><b class="text-xs">'+(x.amount?esc(money(x.amount)):'')+'</b></div>').join('')||'<p class="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800">No bills tracked yet. Add a renewal or payment date to stay ahead.</p>';$('#goalPreview').innerHTML=goals.slice(0,3).map(x=>'<div class="rounded-xl bg-violet-50/70 p-4 dark:bg-violet-400/10"><div class="flex justify-between gap-2"><p class="text-sm font-bold">'+esc(x.title)+'</p><span class="text-xs font-bold text-violet-700">'+x.progress+'%</span></div><div class="mt-3 h-1.5 rounded-full bg-violet-100 dark:bg-slate-700"><div class="h-full rounded-full bg-violet-500" style="width:'+x.progress+'%"></div></div><button data-edit="'+x.id+'" class="mt-3 text-xs font-bold text-violet-700">Update goal ↗</button></div>').join('')||'<p class="text-sm text-slate-500">What would you love to make progress on? Add your first goal.</p>';bindDynamic()}
function renderList(){const kind={tasks:'task',bills:'bill',goals:'goal'}[page];let arr=items.filter(x=>x.type===kind);const q=$('#filterInput').value.toLowerCase().trim();if(q)arr=arr.filter(x=>(x.title+' '+x.notes).toLowerCase().includes(q));if($('#sortSelect').value==='created')arr.sort((a,b)=>b.created-a.created);else arr.sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999'));$('#listContent').innerHTML=arr.map(x=>'<article class="surface lift rounded-2xl border border-slate-200/80 bg-white p-5"><div class="flex items-start justify-between gap-3"><span class="pill px-3 py-1 text-[10px] font-bold '+typeColor(x.type)+'">'+typeName(x.type)+'</span><button data-edit="'+x.id+'" class="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100" aria-label="Edit item">✎</button></div><div class="mt-4 flex items-start gap-3"><input data-done="'+x.id+'" type="checkbox" '+(x.done?'checked':'')+' class="mt-1 h-4 w-4 accent-emerald-600" aria-label="Mark complete"><div class="min-w-0 flex-1"><h3 class="font-bold '+(x.done?'line-through opacity-50':'')+'">'+esc(x.title)+'</h3><p class="mt-1 text-xs text-slate-400">'+prettyDate(x.date)+(x.type==='bill'&&x.amount?' · '+esc(money(x.amount)):'')+'</p>'+(x.notes?'<p class="mt-3 whitespace-pre-wrap text-sm leading-5 text-slate-500">'+esc(x.notes)+'</p>':'')+(x.type==='goal'?'<div class="mt-4"><div class="mb-1 flex justify-between text-xs"><span>Progress</span><b>'+x.progress+'%</b></div><div class="h-1.5 rounded-full bg-slate-100"><div class="h-full rounded-full bg-violet-500" style="width:'+x.progress+'%"></div></div></div>':'')+'</div></div><div class="mt-5 flex justify-between border-t border-slate-100 pt-3 dark:border-slate-700"><span class="text-[11px] text-slate-400">'+(x.done?'Completed':'In progress')+'</span><button data-delete="'+x.id+'" class="text-xs font-bold text-rose-500">Delete</button></div></article>').join('');$('#listEmpty').classList.toggle('hidden',arr.length>0);$('#listContent').classList.toggle('hidden',arr.length===0);bindDynamic()}
function render(){renderHome();if(page!=='home')renderList()}
function bindDynamic(){$$('[data-edit]').forEach(b=>b.onclick=()=>openModal(items.find(x=>x.id===b.dataset.edit)?.type||'task',b.dataset.edit));$$('[data-done]').forEach(c=>c.onchange=()=>{const x=items.find(x=>x.id===c.dataset.done);if(x){x.done=c.checked;persist();render();toast(x.done?'Nice work — marked complete.':'Item reopened.')}});$$('[data-delete]').forEach(b=>b.onclick=()=>{const x=items.find(x=>x.id===b.dataset.delete);if(!x)return;if(confirm('Delete “'+x.title+'”? This cannot be undone.')){items=items.filter(i=>i.id!==x.id);persist();render();toast('Item deleted.')}});$$('[data-goto]').forEach(b=>b.onclick=()=>setPage(b.dataset.goto))}
$('#itemForm').addEventListener('submit',saveItem);$('#itemType').addEventListener('change',toggleFields);$('#itemProgress').addEventListener('input',toggleFields);$('#modalClose').onclick=closeModal;$('#cancelModal').onclick=closeModal;$('#addOpen').onclick=()=>openModal(page==='home'?'task':({tasks:'task',bills:'bill',goals:'goal'}[page]||'task'));$('#heroAdd').onclick=()=>openModal('task');$('#emptyAdd').onclick=()=>openModal(({tasks:'task',bills:'bill',goals:'goal'}[page]||'task'));$('#jumpTasks').onclick=()=>setPage('tasks');$$('[data-page]').forEach(b=>b.onclick=()=>setPage(b.dataset.page));$('#filterInput').addEventListener('input',renderList);$('#sortSelect').addEventListener('change',renderList);
$('#menu').onclick=()=>$('#sidebar').classList.toggle('-translate-x-full');$('#dailyPrompt').onclick=()=>{const prompts=['Choose one thing that would make tomorrow easier.','Two focused minutes can break the starting barrier.','You are allowed to do the important thing slowly.','Progress is a direction, not a perfect streak.','If it takes less than two minutes, consider doing it now.'];toast(prompts[new Date().getDate()%prompts.length])};
$('#theme').onclick=()=>{const dark=document.documentElement.classList.toggle('dark');localStorage.setItem('clearpath-theme',dark?'dark':'light');$('#theme').textContent=dark?'☀':'☾'};if(localStorage.getItem('clearpath-theme')==='dark'){document.documentElement.classList.add('dark');$('#theme').textContent='☀'}
function openSearch(){$('#searchModal').classList.remove('hidden');$('#searchModal').classList.add('flex');$('#searchInput').focus()}function closeSearch(){$('#searchModal').classList.add('hidden');$('#searchModal').classList.remove('flex')}$('#searchOpen').onclick=openSearch;$('#searchInput').addEventListener('input',e=>{const q=e.target.value.toLowerCase().trim();const found=q?items.filter(x=>(x.title+' '+x.notes+' '+typeName(x.type)).toLowerCase().includes(q)).slice(0,8):[];$('#searchResults').innerHTML=found.map(x=>'<button data-result="'+x.id+'" class="flex w-full items-center justify-between rounded-xl bg-slate-50 p-3 text-left text-sm dark:bg-slate-800"><span class="font-semibold">'+esc(x.title)+'</span><span class="text-xs text-slate-400">'+typeName(x.type)+'</span></button>').join('')||(q?'<p class="p-3 text-sm text-slate-500">No matches yet.</p>':'<p class="p-3 text-xs text-slate-400">Search everything you have saved.</p>');$$('[data-result]').forEach(b=>b.onclick=()=>{const x=items.find(i=>i.id===b.dataset.result);closeSearch();setPage(({task:'tasks',bill:'bills',goal:'goals'})[x.type]);$('#filterInput').value=x.title;renderList()})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeSearch()}if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();openSearch()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}});
$('#searchModal').addEventListener('click',e=>{if(e.target.id==='searchModal')closeSearch()});$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
$('#dateLine').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'}).toUpperCase();render();


/* ClearPath upgrades: recurring items, data portability, weekly reflection */
const REVIEW_KEY='clearpath-weekly-review-v1';
const reviews=()=>{try{return JSON.parse(localStorage.getItem(REVIEW_KEY))||{}}catch{return {}}};
function exportBackup(){
 const payload={app:'ClearPath',version:1,exportedAt:new Date().toISOString(),items,reviews:reviews()};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='clearpath-backup-'+today()+'.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);toast('Backup downloaded to your device.');
}
$('#exportData').addEventListener('click',()=>{
 const panel=$('#backupModal');panel.classList.remove('hidden');panel.classList.add('flex');
});
function closeBackup(){$('#backupModal').classList.add('hidden');$('#backupModal').classList.remove('flex');$('#importFile').value=''}
$('#cancelBackup').addEventListener('click',closeBackup);
$('#importBackup').addEventListener('click',async()=>{
 const file=$('#importFile').files[0];if(!file){toast('Choose a ClearPath JSON backup first.');return}
 try{
  const data=JSON.parse(await file.text());
  if(data.app!=='ClearPath'||!Array.isArray(data.items)||!data.items.every(x=>x&&typeof x.id==='string'&&typeof x.title==='string'&&['task','bill','goal'].includes(x.type))){throw new Error('Invalid backup')}
  if(!confirm('Restore '+data.items.length+' items? This replaces your current ClearPath items.'))return;
  items=data.items;persist();
  if(data.reviews&&typeof data.reviews==='object')localStorage.setItem(REVIEW_KEY,JSON.stringify(data.reviews));
  closeBackup();render();toast('Backup restored successfully.');
 }catch(err){toast('That file is not a valid ClearPath backup.')}
});
$('#backupModal').addEventListener('click',e=>{if(e.target.id==='backupModal')closeBackup()});

function reviewKey(){const d=new Date();const jan=new Date(d.getFullYear(),0,1);const week=Math.ceil((((d-jan)/86400000)+jan.getDay()+1)/7);return d.getFullYear()+'-W'+String(week).padStart(2,'0')}
function openReview(){
 const key=reviewKey(),all=reviews(),saved=all[key]||{};
 const done=items.filter(x=>x.type==='task'&&x.done).length;
 const open=items.filter(x=>x.type==='task'&&!x.done).length;
 const overdue=items.filter(x=>!x.done&&x.date&&x.date<today()).length;
 $('#reviewStats').innerHTML=[
  ['Tasks completed',done,'text-emerald-700'],
  ['Still on your list',open,'text-violet-700'],
  ['Past due',overdue,'text-rose-600']
 ].map(a=>'<div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-800"><p class="text-xs text-slate-500">'+a[0]+'</p><p class="display mt-2 text-2xl font-extrabold '+a[2]+'">'+a[1]+'</p></div>').join('');
 $('#reviewWins').value=saved.wins||'';$('#reviewNext').value=saved.next||'';
 $('#reviewPanel').classList.remove('hidden');$('#reviewPanel').scrollIntoView({behavior:'smooth',block:'start'});
}
$('#weeklyReview').addEventListener('click',openReview);
$('#closeReview').addEventListener('click',()=>$('#reviewPanel').classList.add('hidden'));
$('#saveReview').addEventListener('click',()=>{
 const all=reviews();all[reviewKey()]={wins:$('#reviewWins').value.trim(),next:$('#reviewNext').value.trim(),updatedAt:new Date().toISOString()};
 localStorage.setItem(REVIEW_KEY,JSON.stringify(all));toast('Your weekly reflection is saved on this device.');
});

const originalSaveItem=saveItem;
saveItem=function(e){
 const before=editingId?items.find(x=>x.id===editingId):null;
 originalSaveItem(e);
 if(before&&before.repeat&&items.some(x=>x.id===before.id)){
  const current=items.find(x=>x.id===before.id);if(current)current.repeat=before.repeat;
 }
};
const repeatLabel=document.createElement('label');
repeatLabel.className='mt-4 block text-xs font-bold';
repeatLabel.innerHTML='Repeat <select id="itemRepeat" class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"><option value="none">Does not repeat</option><option value="weekly">Every week</option><option value="monthly">Every month</option><option value="yearly">Every year</option></select>';
$('#itemDate').closest('label').parentElement.insertAdjacentElement('afterend',repeatLabel);
const baseOpenModal=openModal;
openModal=function(type='task',id=null){
 baseOpenModal(type,id);
 $('#itemRepeat').value=(id&&items.find(x=>x.id===id)?.repeat)||'none';
};
const baseSaveItem=saveItem;
saveItem=function(e){
 e.preventDefault();
 const title=$('#itemTitle').value.trim();if(!title)return;
 const type=$('#itemType').value;
 const prior=editingId?items.find(x=>x.id===editingId):null;
 const data={id:editingId||uid(),title,type,date:$('#itemDate').value,notes:$('#itemNotes').value.trim(),amount:type==='bill'?$('#itemAmount').value:'',progress:type==='goal'?Number($('#itemProgress').value):0,done:prior?!!prior.done:false,created:prior?.created||Date.now(),repeat:$('#itemRepeat').value};
 if(editingId)items=items.map(x=>x.id===editingId?data:x);else items.unshift(data);
 persist();closeModal();render();toast(data.repeat!=='none'?'Repeating item saved. Future occurrences are shown as a schedule rule.':prior?'Item updated.':'Saved — one less thing to remember.');
};
const baseRenderList=renderList;
renderList=function(){
 baseRenderList();
 const kind={tasks:'task',bills:'bill',goals:'goal'}[page];
 const repeatItems=items.filter(x=>x.type===kind&&x.repeat&&x.repeat!=='none');
 if(repeatItems.length){
  const note=document.createElement('p');note.className='md:col-span-2 xl:col-span-3 text-xs text-slate-400';
  note.textContent='↻ '+repeatItems.length+' repeating item'+(repeatItems.length===1?'':'s')+' · recurrence is saved as a rule; automatic reminders and auto-generation require a future backend.';
  $('#listContent').prepend(note);
 }
};
