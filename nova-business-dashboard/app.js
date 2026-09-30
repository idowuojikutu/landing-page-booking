const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const state = { dark: localStorage.getItem('nova-theme') === 'dark' };
document.documentElement.classList.toggle('dark', state.dark);

function toast(message){
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(window.__toast); window.__toast = setTimeout(()=>el.classList.remove('show'), 2400);
}

function openMenu(open=true){
  $('#sidebar').classList.toggle('-translate-x-full', !open);
  $('#overlay').classList.toggle('hidden', !open);
}
$('#menuBtn').addEventListener('click',()=>openMenu(true));
$('#overlay').addEventListener('click',()=>openMenu(false));

$('#themeBtn').addEventListener('click',()=>{
  state.dark=!state.dark;
  document.documentElement.classList.toggle('dark',state.dark);
  localStorage.setItem('nova-theme',state.dark?'dark':'light');
  $('#themeBtn').textContent=state.dark?'☀':'☾';
  toast(state.dark?'Dark mode enabled':'Light mode enabled');
});
$('#themeBtn').textContent=state.dark?'☀':'☾';

const labels={
  overview:['Overview','Your command center is ready.'],
  analytics:['Analytics','Deep-dive performance data and trends.'],
  customers:['Customers','Track relationships, retention and customer value.'],
  projects:['Projects','Keep delivery, deadlines and milestones visible.'],
  invoices:['Invoices','Monitor billing, payment status and cash flow.'],
  settings:['Settings','Customize your workspace and preferences.']
};

$$('[data-section]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    $$('.sidebar-item').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const key=btn.dataset.section;
    const isOverview=key==='overview';
    $('#overview').classList.toggle('hidden',!isOverview);
    $('#emptySection').classList.toggle('hidden',isOverview);
    if(!isOverview){
      $('#emptyIcon').textContent={analytics:'◫',customers:'◎',projects:'◇',invoices:'▤',settings:'⚙'}[key];
      $('#emptyTitle').textContent=labels[key][0];
      $('#emptyText').textContent=labels[key][1];
    }
    $('#pageTitle').textContent=key==='overview'?'Good evening, Idowu':labels[key][0];
    openMenu(false);
  });
});

$('#exportBtn').addEventListener('click',()=>{
  const report='NOVA BUSINESS REPORT\nGenerated: 25 Sep 2026\n\nNet revenue: $128,420\nActive clients: 1,284\nConversion: 8.72%\nAverage order: $642\nPipeline: $482k\n';
  const blob=new Blob([report],{type:'text/plain'}), url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url;a.download='nova-business-report.txt';a.click();URL.revokeObjectURL(url);toast('Report exported successfully.');
});
$('#upgradeBtn').addEventListener('click',()=>toast('Pro workspace preview opened.'));
$('#notifyBtn').addEventListener('click',()=>toast('You have 3 new workspace notifications.'));
$('#viewAllBtn').addEventListener('click',()=>toast('Showing all transactions.'));
$('#periodSelect').addEventListener('change',e=>toast('Chart updated: '+e.target.value));

function openSearch(){ $('#searchModal').classList.remove('hidden'); $('#searchModal').classList.add('grid'); setTimeout(()=>$('#searchInput').focus(),50); }
$('#searchBtn').addEventListener('click',openSearch);
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}
  if(e.key==='Escape'){ $('#searchModal').classList.add('hidden'); $('#searchModal').classList.remove('grid');}
});
$('#searchModal').addEventListener('click',e=>{if(e.target.id==='searchModal'){e.currentTarget.classList.add('hidden');e.currentTarget.classList.remove('grid');}});
$('#searchInput').addEventListener('input',e=>{
  if(e.target.value.trim()) toast('Search ready for: '+e.target.value.trim());
});


/* Nova 2.0 premium interactions */
const quickModal = $('#quickModal');
const taskInput = $('#taskInput');

function closeQuick(){
  quickModal.classList.add('hidden');
  quickModal.classList.remove('grid');
  taskInput.value='';
}
$('#quickAddBtn').addEventListener('click',()=>{
  quickModal.classList.remove('hidden'); quickModal.classList.add('grid');
  setTimeout(()=>taskInput.focus(),60);
});
$('#closeQuick').addEventListener('click',closeQuick);
$('#cancelQuick').addEventListener('click',closeQuick);
$('#saveTask').addEventListener('click',()=>{
  const value=taskInput.value.trim();
  if(!value){ toast('Please enter a task first.'); return; }
  const row=document.createElement('div');
  row.className='flex items-center gap-3';
  row.innerHTML='<span class="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600">+</span><div class="min-w-0 flex-1"><p class="truncate text-xs font-bold"></p><p class="text-[10px] text-slate-400">New task</p></div><button class="taskDone text-[10px] font-bold text-violet-500">mark done</button>';
  row.querySelector('p').textContent=value;
  row.querySelector('.taskDone').addEventListener('click',()=>{
    row.querySelector('.taskDone').textContent='done';
    row.querySelector('.taskDone').className='text-[10px] font-bold text-emerald-500';
    row.querySelector('span').textContent='✓';
    row.querySelector('span').className='grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600';
    toast('Task completed.');
  });
  $('#taskList').prepend(row);
  closeQuick(); toast('New task added to your focus list.');
});
taskInput.addEventListener('keydown',e=>{if(e.key==='Enter')$('#saveTask').click();});

$('#notifyBtn').addEventListener('click',e=>{
  e.stopPropagation();
  $('#notifyPanel').classList.toggle('hidden');
});
$('#clearNotifications').addEventListener('click',()=>{
  $('#notificationList').innerHTML='<p class="rounded-xl bg-slate-100 p-4 text-xs text-slate-500 dark:bg-white/5">You are all caught up.</p>';
  toast('Notifications cleared.');
});
document.addEventListener('click',e=>{
  if(!e.target.closest('#notifyBtn') && !e.target.closest('#notifyPanel')) $('#notifyPanel')?.classList.add('hidden');
  if(e.target===quickModal) closeQuick();
});

function animateCounters(){
  $$('[data-counter]').forEach(el=>{
    const target=Number(el.dataset.counter), prefix=el.dataset.prefix||'', suffix=el.dataset.suffix||'';
    const start=performance.now(), duration=1100;
    function tick(now){
      const p=Math.min((now-start)/duration,1), eased=1-Math.pow(1-p,4);
      const value=target<100 ? (target*eased).toFixed(2) : Math.round(target*eased).toLocaleString();
      el.textContent=prefix+value+suffix;
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
window.addEventListener('load',animateCounters);

const originalPeriodHandler=$('#periodSelect').onchange;
$('#periodSelect').addEventListener('change',()=>{
  const heights={
    'Last 7 months':[48,63,52,78,65,92,76],
    'Last 30 days':[35,58,44,70,61,82,96],
    'Last 12 months':[62,49,71,58,84,68,91]
  };
  const bars=[...document.querySelectorAll('#overview .grid.h-64 .bg-gradient-to-t')];
  (heights[$('#periodSelect').value]||heights['Last 7 months']).forEach((v,i)=>{if(bars[i])bars[i].style.height=v+'%';});
});
