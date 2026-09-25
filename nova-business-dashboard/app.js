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
