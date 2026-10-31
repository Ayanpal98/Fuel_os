import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowDownRight, ArrowUpRight, ArrowRight, Bell, Building2, CalendarDays, Check, CheckCircle2,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardCheck, Download,
  Droplets, Fuel, Gauge, LayoutDashboard, LockKeyhole, LogOut, Mail, Menu, MoreHorizontal, Phone, PlayCircle,
  Search, Settings, ShieldCheck, SlidersHorizontal, TrendingUp, Users, Wallet,
  X, Plus, FileText, Clock3, CircleDollarSign, AlertTriangle, Filter, Eye
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar
} from 'recharts';
import './styles.css';

const dailySales = [
  { day: 'Mon', petrol: 34, diesel: 26 }, { day: 'Tue', petrol: 38, diesel: 28 },
  { day: 'Wed', petrol: 32, diesel: 25 }, { day: 'Thu', petrol: 43, diesel: 31 },
  { day: 'Fri', petrol: 47, diesel: 34 }, { day: 'Sat', petrol: 52, diesel: 39 },
  { day: 'Sun', petrol: 41, diesel: 30 }
];
const initialShifts = [
  { id: 'SH-0241', person: 'Rakesh Debbarma', initials: 'RD', role: 'Attendant', nozzle: 'Petrol · N-02', time: '06:00 – 14:00', sales: '₹ 48,260', status: 'Closed' },
  { id: 'SH-0242', person: 'Milan Saha', initials: 'MS', role: 'Attendant', nozzle: 'Diesel · N-04', time: '06:00 – 14:00', sales: '₹ 36,840', status: 'Closed' },
  { id: 'SH-0243', person: 'Bikash Reang', initials: 'BR', role: 'Shift supervisor', nozzle: 'Petrol · N-01', time: '14:00 – 22:00', sales: '₹ 12,480', status: 'In progress' },
  { id: 'SH-0244', person: 'Ananya Das', initials: 'AD', role: 'Attendant', nozzle: 'Diesel · N-03', time: '14:00 – 22:00', sales: '₹ 9,720', status: 'In progress' }
];
const navGroups = [
  { label: 'WORKSPACE', items: [
    { id: 'Overview', icon: LayoutDashboard }, { id: 'Sales & transactions', icon: Wallet },
    { id: 'Tank & nozzle stock', icon: Droplets }, { id: 'Shift management', icon: Clock3 }
  ]},
  { label: 'MANAGE', items: [
    { id: 'Staff', icon: Users }, { id: 'Expenses & credit', icon: CircleDollarSign },
    { id: 'Reports', icon: FileText }
  ]}
];
const money = n => '₹' + Number(n).toLocaleString('en-IN');

function App() {
  const [route, setRoute] = useState(() => window.location.pathname === '/login' ? 'login' : window.location.pathname === '/dashboard' ? 'dashboard' : 'home');
  const [mobileNav, setMobileNav] = useState(false);

  const navigate = (next) => {
    const path = next === 'home' ? '/' : next === 'login' ? '/login' : '/dashboard';
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setRoute(next);
    setMobileNav(false);
    window.scrollTo({top:0,behavior:'smooth'});
  };

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname;
      setRoute(path === '/login' ? 'login' : path === '/dashboard' ? 'dashboard' : 'home');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.title = route === 'login' ? 'Owner sign in | ATSFY FuelOS' : route === 'dashboard' ? 'Station overview | ATSFY FuelOS' : 'ATSFY FuelOS | Run your station with clarity';
    const description = route === 'login'
      ? 'Sign in to your ATSFY FuelOS station workspace.'
      : 'A simpler way for independent petrol pump owners to track sales, fuel stock, shifts and station performance.';
    let meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
  }, [route]);

  if (route === 'dashboard') return <Dashboard onLogout={() => navigate('home')} />;
  if (route === 'login') return <LoginPage onBack={() => navigate('home')} onDemo={() => navigate('dashboard')} />;

  return <div className="marketing-site">
    <header className="marketing-nav">
      <button className="marketing-brand" onClick={() => navigate('home')} aria-label="ATSFY FuelOS home">
        <span className="marketing-brand-icon"><Fuel size={23}/></span>
        <span className="marketing-brand-copy"><strong>ATSFY <em>FuelOS</em></strong><small>STATION OPERATIONS</small></span>
      </button>
      <button className="marketing-mobile-toggle" onClick={() => setMobileNav(v => !v)} aria-label="Toggle navigation"><Menu size={21}/></button>
      <nav className={mobileNav ? 'marketing-links marketing-links-open' : 'marketing-links'} aria-label="Main navigation">
        <a href="#platform" onClick={() => setMobileNav(false)}>Platform</a>
        <a href="#how-it-works" onClick={() => setMobileNav(false)}>How it works</a>
        <a href="#why-fuelos" onClick={() => setMobileNav(false)}>Why FuelOS</a>
        <button className="marketing-login-link" onClick={() => navigate('login')}>Owner sign in</button>
        <button className="marketing-nav-cta" onClick={() => navigate('login')}>Get started <ArrowRight size={16}/></button>
      </nav>
    </header>

    <main>
      <section className="marketing-hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="hero-live-dot"/> BUILT FOR INDEPENDENT FUEL RETAILERS</div>
          <h1>Your station.<br/><span>Your numbers.</span><br/>Under control.</h1>
          <p className="hero-description">A clearer, calmer way to manage everyday petrol pump operations — from fuel stock and shift handovers to sales, expenses and reports.</p>
          <div className="hero-actions">
            <button className="hero-primary" onClick={() => navigate('login')}>Owner sign in <ArrowRight size={17}/></button>
            <button className="hero-secondary" onClick={() => navigate('dashboard')}><PlayCircle size={18}/> Explore demo dashboard</button>
          </div>
          <div className="hero-trust-row"><span><CheckCircle2 size={16}/> Made for station workflows</span><span><CheckCircle2 size={16}/> Clear, owner-first view</span></div>
          <div className="hero-note"><LockKeyhole size={14}/> Secure owner access is planned for the upcoming backend phase.</div>
        </div>
        <div className="hero-visual" aria-label="FuelOS dashboard preview">
          <div className="visual-orbit orbit-one"></div><div className="visual-orbit orbit-two"></div>
          <div className="preview-window">
            <div className="preview-topbar"><div className="preview-brand"><span><Fuel size={13}/></span> FuelOS <small>OWNER VIEW</small></div><div className="preview-dots"><i/><i/><i/></div></div>
            <div className="preview-body">
              <div className="preview-greeting"><div><small>STATION OVERVIEW</small><h3>Good afternoon, Owner</h3><p>Your day at a glance</p></div><span className="preview-date">TODAY</span></div>
              <div className="preview-metrics">
                <div className="preview-metric"><span>Recorded sales</span><strong>₹ 1.84L</strong><small className="metric-up"><TrendingUp size={12}/> Illustrative</small></div>
                <div className="preview-metric"><span>Fuel dispensed</span><strong>3,248 <small>L</small></strong><small>Petrol + diesel</small></div>
              </div>
              <div className="preview-chart-card"><div className="preview-chart-title"><strong>Sales overview</strong><span>7 days</span></div><div className="mini-chart"><div style={{height:'40%'}}/><div style={{height:'57%'}}/><div style={{height:'45%'}}/><div style={{height:'68%'}}/><div style={{height:'76%'}}/><div style={{height:'91%'}}/><div style={{height:'65%'}}/></div><div className="mini-chart-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div></div>
              <div className="preview-bottom-row"><div className="preview-stock-icon"><Droplets size={16}/></div><div className="preview-stock-copy"><strong>Fuel stock</strong><span>Sample inventory view</span></div><div className="preview-stock-bar"><i/></div><strong className="preview-stock-pct">68%</strong></div>
            </div>
            <div className="preview-footer"><span className="preview-footer-dot"/> Product preview <span>Sample data only</span></div>
          </div>
          <div className="hero-float-card float-shifts"><span className="float-icon"><Clock3 size={17}/></span><div><strong>Shift handover</strong><small>Keep every shift in view</small></div><CheckCircle2 size={17} className="float-check"/></div>
          <div className="hero-float-card float-stock"><span className="float-icon gold"><ShieldCheck size={17}/></span><div><strong>Owner-first clarity</strong><small>See what needs attention</small></div></div>
        </div>
      </section>

      <section className="marketing-proof-strip" aria-label="FuelOS capabilities">
        <div><strong>ONE VIEW</strong><span>Daily station operations</span></div><i/><div><strong>LESS GUESSWORK</strong><span>Clear records and reports</span></div><i/><div><strong>BUILT TO GROW</strong><span>From one station upwards</span></div>
      </section>

      <section className="marketing-section platform-section" id="platform">
        <div className="section-heading"><span className="section-eyebrow">THE PLATFORM</span><h2>Everything your station day revolves around.</h2><p>Bring the everyday operating picture together in one workspace — designed around how a fuel station runs.</p></div>
        <div className="feature-grid">
          <article className="feature-card feature-primary"><div className="feature-icon"><Wallet size={21}/></div><span className="feature-index">01</span><h3>Sales & collections</h3><p>Review daily sales, transaction records and payment collections without hunting through scattered registers.</p><div className="feature-tags"><span>Daily sales</span><span>Payments</span></div></article>
          <article className="feature-card"><div className="feature-icon"><Droplets size={21}/></div><span className="feature-index">02</span><h3>Fuel stock visibility</h3><p>Keep tank levels, nozzle readings and stock reconciliation in one clear operating view.</p><div className="feature-tags"><span>Tank stock</span><span>Nozzles</span></div></article>
          <article className="feature-card"><div className="feature-icon"><Clock3 size={21}/></div><span className="feature-index">03</span><h3>Shifts & handovers</h3><p>See who is on duty, which shifts are active and what needs a closing review.</p><div className="feature-tags"><span>Staff</span><span>Handover</span></div></article>
          <article className="feature-card"><div className="feature-icon"><CircleDollarSign size={21}/></div><span className="feature-index">04</span><h3>Expenses & credit</h3><p>Bring common expenses and outstanding customer balances into a single ledger view.</p><div className="feature-tags"><span>Expenses</span><span>Credit ledger</span></div></article>
          <article className="feature-card"><div className="feature-icon"><Activity size={21}/></div><span className="feature-index">05</span><h3>Reports that make sense</h3><p>Get a more readable view of operating performance and records that need attention.</p><div className="feature-tags"><span>Summaries</span><span>Exports</span></div></article>
          <article className="feature-card feature-cta"><span className="feature-cta-orb"><ArrowRight size={22}/></span><span className="section-eyebrow">TAKE A LOOK</span><h3>See the owner workspace.</h3><p>Explore the current interface using clearly labelled illustrative data.</p><button onClick={() => navigate('dashboard')}>Explore demo <ArrowRight size={16}/></button></article>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-inner"><div className="section-heading align-left"><span className="section-eyebrow">HOW IT WORKS</span><h2>A straightforward way to start.</h2><p>FuelOS is being built in phases so station owners can understand the workflow before live records are introduced.</p></div>
          <div className="steps-grid"><div className="step-item"><span>01</span><h3>Owner access</h3><p>Station owners will sign in to their own workspace after backend authentication is enabled.</p></div><div className="step-item"><span>02</span><h3>Set up your station</h3><p>Configure station details, fuel types, tanks, nozzles and team members.</p></div><div className="step-item"><span>03</span><h3>Run the daily workflow</h3><p>Record sales and readings, manage shifts and review reports from one place.</p></div></div>
        </div>
      </section>

      <section className="why-section" id="why-fuelos"><div className="why-copy"><span className="section-eyebrow">DESIGNED FOR OWNERS</span><h2>Less time chasing registers.<br/><span>More clarity in the day.</span></h2><p>FuelOS aims to make the operating picture easier to understand — especially for independent stations that need practical tools, not unnecessary complexity.</p><ul><li><CheckCircle2 size={18}/> A clean overview instead of scattered screens</li><li><CheckCircle2 size={18}/> Clearer shift and stock review workflows</li><li><CheckCircle2 size={18}/> Reports that help owners ask better questions</li></ul><button className="hero-primary" onClick={() => navigate('login')}>Go to owner sign in <ArrowRight size={17}/></button></div><div className="why-visual"><div className="why-big-icon"><Fuel size={44}/></div><div className="why-statement"><span>BUILT AROUND YOUR DAY</span><strong>One station.<br/>One clear view.</strong><small>ATSFY FuelOS · Product in progress</small></div><div className="why-pill"><ShieldCheck size={16}/> Owner-first by design</div></div></section>

      <section className="marketing-bottom-cta"><div><span className="section-eyebrow">YOUR STATION, MORE VISIBLE</span><h2>Ready to see FuelOS in action?</h2><p>Preview the current owner dashboard, or open the sign-in screen for the upcoming owner workspace.</p></div><div className="bottom-cta-actions"><button className="hero-primary" onClick={() => navigate('login')}>Owner sign in <ArrowRight size={17}/></button><button className="hero-secondary" onClick={() => navigate('dashboard')}>Explore demo</button></div></section>
    </main>

    <footer className="marketing-footer"><button className="marketing-brand" onClick={() => navigate('home')}><span className="marketing-brand-icon"><Fuel size={21}/></span><span className="marketing-brand-copy"><strong>ATSFY <em>FuelOS</em></strong><small>STATION OPERATIONS</small></span></button><span>© 2026 ATSFY Technologies. Product preview.</span><div><a href="mailto:atsfy@atsfy.tech">Contact ATSFY</a><button onClick={() => navigate('login')}>Owner sign in</button></div></footer>
  </div>;
}

function LoginPage({ onBack, onDemo }) {
  return <div className="login-page">
    <header className="login-header"><button className="marketing-brand" onClick={onBack}><span className="marketing-brand-icon"><Fuel size={22}/></span><span className="marketing-brand-copy"><strong>ATSFY <em>FuelOS</em></strong><small>STATION OPERATIONS</small></span></button><button className="login-back" onClick={onBack}><ChevronLeft size={16}/> Back to home</button></header>
    <main className="login-layout">
      <section className="login-story"><div className="hero-kicker"><span className="hero-live-dot"/> OWNER WORKSPACE</div><h1>Your station,<br/><span>in one view.</span></h1><p>Sign in to access your station workspace, operating records and owner dashboard.</p><div className="login-benefit-list"><span><CheckCircle2 size={17}/> Station sales and collections</span><span><CheckCircle2 size={17}/> Fuel stock and shift handovers</span><span><CheckCircle2 size={17}/> Reports and operating summaries</span></div><div className="login-story-foot"><ShieldCheck size={17}/> Authentication and protected station data will be enabled in the backend phase.</div></section>
      <section className="login-card"><div className="login-card-mark"><LockKeyhole size={22}/></div><span className="section-eyebrow">STATION OWNER ACCESS</span><h2>Owner access is coming</h2><p className="login-card-subtitle">Secure sign-in will be enabled after the pilot backend and access controls are reviewed.</p>
        <div className="login-preview-status"><span className="login-preview-status-dot"/> Authentication not connected</div>
        <div className="login-notice" role="status"><ShieldCheck size={17}/><span>This preview does not collect or transmit passwords. No account or station data is connected yet.</span></div>
        <button className="login-demo-button login-demo-primary" onClick={onDemo}><PlayCircle size={17}/> Explore demo dashboard</button>
        <div className="login-security-note"><LockKeyhole size={14}/> The dashboard uses illustrative records only. Changes stay in this browser session.</div>
        <div className="login-request-access">Pilot enquiries: <a href="mailto:atsfy@atsfy.tech?subject=FuelOS%20pilot%20enquiry">Contact ATSFY</a></div>
      </section>
    </main>
    <footer className="login-footer"><span>© 2026 ATSFY Technologies</span><span>FuelOS · Owner access preview</span></footer>
  </div>;
}

function Dashboard({ onLogout }) {
  const [active, setActive] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNewShift, setShowNewShift] = useState(false);
  const [toast, setToast] = useState('');
  const [shifts, setShifts] = useState(initialShifts);
  const [fuelType, setFuelType] = useState('All fuel');
  const [transactionQuery, setTransactionQuery] = useState('');

  const notify = message => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const filteredShifts = useMemo(() => shifts.filter(s =>
    [s.id, s.person, s.nozzle, s.status].join(' ').toLowerCase().includes(query.toLowerCase())
  ), [shifts, query]);

  function exportCsv() {
    const transactions = [
      ['TX-10082','14:32','Petrol','24.6 L','UPI','₹ 2,460'],
      ['TX-10081','14:25','Diesel','31.2 L','Cash','₹ 2,980'],
      ['TX-10080','14:18','Petrol','18.0 L','Card','₹ 1,800'],
      ['TX-10079','14:04','Diesel','42.5 L','UPI','₹ 4,050'],
      ['TX-10078','13:52','Petrol','12.4 L','Cash','₹ 1,240'],
      ['TX-10077','13:46','Diesel','27.8 L','Credit','₹ 2,650']
    ];
    const tanks = [
      ['TK-001','Petrol tank 01','8,240 L','12,000 L','68.7%'],
      ['TK-002','Diesel tank 02','6,180 L','10,000 L','61.8%'],
      ['TK-003','Petrol tank 03','4,000 L','8,000 L','50%']
    ];
    const expenses = [
      ['EX-021','Utilities','Electricity estimate','Station Owner','₹ 3,200'],
      ['EX-020','Maintenance','Equipment service sample','Station Owner','₹ 2,500'],
      ['EX-019','Supplies','Cleaning and station supplies','Shift supervisor','₹ 1,450'],
      ['EX-018','Other','Miscellaneous sample expense','Station Owner','₹ 1,300']
    ];
    let headers = ['Shift ID','Staff','Assignment','Time','Sales','Status'];
    let data = shifts.map(s => [s.id,s.person,s.nozzle,s.time,s.sales,s.status]);
    let filename = 'atsfy-fuelos-demo-shifts.csv';
    if (active === 'Sales & transactions') {
      headers = ['Reference','Time','Fuel type','Volume','Payment','Amount','Status'];
      data = transactions.filter(r => (fuelType === 'All fuel' || r[2] === fuelType) && r.join(' ').toLowerCase().includes(transactionQuery.toLowerCase())).map(r => [...r,'Recorded']);
      filename = 'atsfy-fuelos-demo-transactions.csv';
    } else if (active === 'Tank & nozzle stock') {
      headers = ['Tank ID','Tank','Recorded stock','Capacity','Fill level'];
      data = tanks;
      filename = 'atsfy-fuelos-demo-tank-stock.csv';
    } else if (active === 'Expenses & credit') {
      headers = ['Reference','Category','Description','Recorded by','Amount'];
      data = expenses;
      filename = 'atsfy-fuelos-demo-expenses.csv';
    } else if (active === 'Staff') {
      headers = ['Staff member','Initials','Role','Shift','Status'];
      data = [
        ['Rakesh Debbarma','RD','Attendant','Morning shift','On duty'],
        ['Milan Saha','MS','Attendant','Morning shift','On duty'],
        ['Bikash Reang','BR','Shift supervisor','Evening shift','On duty'],
        ['Ananya Das','AD','Attendant','Evening shift','On duty'],
        ['Suman Paul','SP','Cashier','General','Available'],
        ['Mampi Jamatia','MJ','Attendant','General','Available']
      ];
      filename = 'atsfy-fuelos-demo-staff.csv';
    } else if (active === 'Reports') {
      headers = ['Report','Description','Illustrative value'];
      data = [
        ['Daily sales summary','Sales by fuel type, payment method and shift','₹ 1,84,620'],
        ['Fuel stock reconciliation','Recorded stock movements and variance review','0.42% variance'],
        ['Shift closing report','Staff assignments, meter readings and collections','4 sample shifts'],
        ['Expenses & credit ledger','Sample expenses and outstanding customer balances','₹ 32,600 credit']
      ];
      filename = 'atsfy-fuelos-demo-report-index.csv';
    } else if (active === 'Overview') {
      headers = ['Metric','Illustrative value','Notes'];
      data = [
        ['Total sales today','₹ 1,84,620','Demo data'],
        ['Fuel dispensed','3,248.6 L','Demo data'],
        ['Estimated gross margin','₹ 12,840','Illustrative estimate'],
        ['Stock variance','0.42%','Review sample threshold 0.30%']
      ];
      filename = 'atsfy-fuelos-demo-overview.csv';
    }
    const csv = [headers, ...data].map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\r\n');
    const blob = new Blob(['\uFEFF', csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify(`Demo ${active.toLowerCase()} export prepared`);
  }

  function addShift(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('staff').trim();
    if (!name) return;
    const initials = name.split(/\s+/).slice(0,2).map(s => s[0]).join('').toUpperCase();
    setShifts(prev => [{id:`SH-${String(245 + prev.length - initialShifts.length).padStart(4,'0')}`,person:name,initials,role:'Attendant',nozzle:fd.get('nozzle'),time:fd.get('time'),sales:'₹ 0',status:'In progress'}, ...prev]);
    setShowNewShift(false); notify('Demo shift added — not saved to a server');
  }

  const pageTitles = {
    'Overview': ['Station overview', 'Here’s what’s happening at your station today.'],
    'Sales & transactions': ['Sales & transactions', 'Review recorded sales and payment collections.'],
    'Tank & nozzle stock': ['Tank & nozzle stock', 'Track recorded tank levels, meter readings and stock variance.'],
    'Shift management': ['Shift management', 'Keep handovers, staff assignments and shift totals visible.'],
    'Staff': ['Staff', 'View your station team and current assignments.'],
    'Expenses & credit': ['Expenses & credit', 'Review demo expenses and outstanding customer balances.'],
    'Reports': ['Reports & exports', 'Explore sample operating reports for your station.']
  };
  const [pageTitle, pageSubtitle] = pageTitles[active] || pageTitles.Overview;
  const currentDateLabel = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date()).toUpperCase();

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><Fuel size={22} strokeWidth={2.3}/></div>
        <div><div className="brand-name">ATSFY <span>FuelOS</span></div><div className="brand-caption">STATION OPERATIONS</div></div>
        <button className="icon-btn sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18}/></button>
      </div>
      <div className="station-select" onClick={() => notify('Station selection will be configured during pilot onboarding')} onKeyDown={e => {if(e.key === 'Enter' || e.key === ' '){e.preventDefault();notify('Station selection will be configured during pilot onboarding');}}} role="button" tabIndex="0" aria-label="Sample station selector">
        <div className="station-avatar"><Building2 size={18}/></div>
        <div className="station-copy"><strong>Sample station</strong><span>Location not configured</span></div>
        <ChevronDown size={15} className="muted"/>
      </div>
      <div className="nav-wrap">
        {navGroups.map(group => <div className="nav-group" key={group.label}>
          <div className="nav-label">{group.label}</div>
          {group.items.map(item => <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => {setActive(item.id);setSidebarOpen(false);}}>
            <item.icon size={18} strokeWidth={1.8}/><span>{item.id}</span>{item.id === 'Tank & nozzle stock' && <span className="nav-dot"/>}
          </button>)}
        </div>)}
      </div>
      <div className="sidebar-bottom">
        <div className="support-card"><div className="support-icon"><ShieldCheck size={17}/></div><div><strong>Built for clarity</strong><p>Know your numbers. Own your day.</p></div></div>
        <button className="nav-item" onClick={() => notify('Settings will be available in a later phase')}><Settings size={18}/><span>Settings</span></button>
        <div className="sidebar-foot"><span className="status-dot"/> Demo workspace <span className="version">v0.1</span></div>
      </div>
    </aside>
    {sidebarOpen && <div className="scrim" onClick={() => setSidebarOpen(false)}/>}
    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left">
          <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20}/></button>
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14}/><strong>{active}</strong></div>
        </div>
        <div className="topbar-actions">
          <div className="demo-pill"><span/> DEMO DATA</div>
          <button className="icon-btn alert-btn" aria-label="Notifications" onClick={() => setShowAlerts(v => !v)}><Bell size={18}/><i/></button>
          <div className="profile-wrap">
            <button className="profile-button" onClick={() => setShowProfile(v => !v)}><div className="profile-avatar">AP</div><div className="profile-text"><strong>Station Owner</strong><span>Administrator</span></div><ChevronDown size={14}/></button>
            {showProfile && <div className="dropdown profile-dropdown"><button onClick={() => notify('Owner profile is sample data')}><Users size={15}/> Owner profile</button><button onClick={() => notify('Settings will be available in Phase 2')}><Settings size={15}/> Preferences</button><button onClick={onLogout}><LogOut size={15}/> Sign out</button></div>}
          </div>
        </div>
        {showAlerts && <div className="dropdown alert-dropdown"><div className="dropdown-title">Notifications <span>2 new</span></div><div className="alert-row"><div className="alert-icon amber"><AlertTriangle size={16}/></div><div><strong>Stock review needed</strong><p>Diesel tank variance is flagged in sample data.</p><small>Demo alert · 10 min ago</small></div></div><div className="alert-row"><div className="alert-icon green"><ClipboardCheck size={16}/></div><div><strong>Shift handover pending</strong><p>Two active shifts need a closing entry.</p><small>Demo alert · 35 min ago</small></div></div></div>}
      </header>

      <div className="page-content">
        <div className="page-heading">
          <div><div className="eyebrow"><span className="eyebrow-line"/> {currentDateLabel}</div><h1>{pageTitle}</h1><p>{pageSubtitle}</p></div>
          <div className="heading-actions"><button className="button secondary" onClick={exportCsv}><Download size={16}/> Export report</button><button className="button primary" onClick={() => setShowNewShift(true)}><Plus size={17}/> New shift</button></div>
        </div>

        {active === 'Overview' ? <Overview notify={notify} setActive={setActive} shifts={shifts} /> :
          <GenericPage active={active} query={query} setQuery={setQuery} filteredShifts={filteredShifts} fuelType={fuelType} setFuelType={setFuelType} transactionQuery={transactionQuery} setTransactionQuery={setTransactionQuery} notify={notify} exportCsv={exportCsv} />}
      </div>
      <footer className="footer"><span>© 2026 ATSFY Technologies</span><span><span className="footer-dot"/> Frontend preview · Sample data only</span><button onClick={() => notify('Support contact can be configured before launch')}><CircleHelp size={14}/> Help & support</button></footer>
    </main>

    {showNewShift && <div className="modal-backdrop" onClick={() => setShowNewShift(false)}><div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-head"><div><span className="modal-kicker">SHIFT MANAGEMENT</span><h2>Create a shift</h2><p>Set up a sample shift assignment for your station.</p></div><button className="icon-btn" onClick={() => setShowNewShift(false)}><X size={18}/></button></div>
      <form onSubmit={addShift} className="modal-form"><label>Staff member<input name="staff" placeholder="e.g. Rahul Das" required/></label><label>Nozzle assignment<select name="nozzle"><option>Petrol · N-01</option><option>Petrol · N-02</option><option>Diesel · N-03</option><option>Diesel · N-04</option></select></label><label>Shift timing<select name="time"><option>06:00 – 14:00</option><option>14:00 – 22:00</option><option>22:00 – 06:00</option></select></label><div className="demo-notice"><AlertTriangle size={15}/> This action updates this browser session only. No data is sent to a server.</div><button className="button primary full" type="submit"><Plus size={16}/> Add demo shift</button></form>
    </div></div>}
    {toast && <div className="toast"><Check size={17}/>{toast}</div>}
  </div>;
}

function Overview({notify,setActive,shifts}) {
  const metrics = [
    {label:'Total sales today',value:'₹ 1,84,620',delta:'+8.4%',note:'vs. previous day',icon:Wallet,tone:'green',up:true},
    {label:'Fuel dispensed',value:'3,248.6 L',delta:'+5.2%',note:'vs. previous day',icon:Fuel,tone:'gold',up:true},
    {label:'Estimated gross margin',value:'₹ 12,840',delta:'+2.1%',note:'illustrative estimate',icon:TrendingUp,tone:'blue',up:true},
    {label:'Stock variance',value:'0.42%',delta:'Review',note:'sample threshold: 0.30%',icon:Activity,tone:'rose',up:false}
  ];
  const [period,setPeriod] = useState('7 days');
  const dayCount = Number.parseInt(period, 10);
  const chartData = Array.from({length: dayCount}, (_, i) => {
    const sample = dailySales[i % dailySales.length];
    return { day: dayCount === 7 ? sample.day : `D${i + 1}`, petrol: sample.petrol, diesel: sample.diesel };
  });
  const petrolTotal = chartData.reduce((sum, day) => sum + day.petrol, 0);
  const dieselTotal = chartData.reduce((sum, day) => sum + day.diesel, 0);
  const formatLakhs = value => `₹ ${(value / 100).toFixed(2)}L`;
  return <>
    <div className="metric-grid">{metrics.map((m,i)=><div className="metric-card" key={m.label}>
      <div className="metric-top"><span>{m.label}</span><div className={`metric-icon ${m.tone}`}><m.icon size={18}/></div></div>
      <div className="metric-value">{m.value}</div>
      <div className="metric-bottom"><span className={`metric-delta ${m.up?'positive':'warning'}`}>{m.up?<ArrowUpRight size={14}/>:<AlertTriangle size={13}/>} {m.delta}</span><span className="metric-note">{m.note}</span></div>
      <div className={`metric-accent ${m.tone}`}/>
    </div>)}</div>

    <div className="content-grid">
      <section className="panel sales-panel">
        <div className="panel-heading"><div><h2>Sales performance</h2><p>Daily sales by fuel type · illustrative data</p></div><div className="select-wrap"><CalendarDays size={15}/><select value={period} onChange={e=>setPeriod(e.target.value)}><option>7 days</option><option>14 days</option><option>30 days</option></select><ChevronDown size={13}/></div></div>
        <div className="chart-legend"><span><i className="legend-petrol"/> Petrol <strong>{formatLakhs(petrolTotal)}</strong></span><span><i className="legend-diesel"/> Diesel <strong>{formatLakhs(dieselTotal)}</strong></span><span className="chart-total">{formatLakhs(petrolTotal + dieselTotal)} <small>total</small></span></div>
        <div className="sales-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:8,right:8,left:-18,bottom:0}}><defs><linearGradient id="petrolFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f7254" stopOpacity={0.17}/><stop offset="100%" stopColor="#2f7254" stopOpacity={0}/></linearGradient><linearGradient id="dieselFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d5a449" stopOpacity={0.16}/><stop offset="100%" stopColor="#d5a449" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#e9eee9"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'#8a958d',fontSize:11}} dy={9}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#8a958d',fontSize:11}} tickFormatter={v=>`₹${v}k`}/><Tooltip contentStyle={{border:'1px solid #e4e9e4',borderRadius:12,fontSize:12,boxShadow:'0 8px 24px #172f1c12'}} formatter={(v,n)=>[`₹${v}k`,n==='petrol'?'Petrol':'Diesel']}/><Area type="monotone" dataKey="petrol" stroke="#2f7254" strokeWidth={2.4} fill="url(#petrolFill)"/><Area type="monotone" dataKey="diesel" stroke="#d5a449" strokeWidth={2.2} fill="url(#dieselFill)"/></AreaChart></ResponsiveContainer></div>
        <div className="chart-foot"><span><span className="live-dot"/> Sample data preview</span><button onClick={()=>notify('Detailed analytics will be added in a later phase')}>View analytics <ChevronRight size={14}/></button></div>
      </section>

      <section className="panel stock-panel">
        <div className="panel-heading"><div><h2>Tank inventory</h2><p>Recorded capacity and sample stock</p></div><button className="more-btn" onClick={()=>setActive('Tank & nozzle stock')}><MoreHorizontal size={19}/></button></div>
        <div className="stock-summary"><div><span>Total available</span><strong>18,420 <small>L</small></strong></div><div className="stock-summary-right"><span>Combined capacity</span><strong>30,000 L</strong></div></div>
        <div className="tank-list">
          <Tank name="Petrol tank 01" id="TK-001" current="8,240" capacity="12,000" percent={68.7} tone="green" />
          <Tank name="Diesel tank 02" id="TK-002" current="6,180" capacity="10,000" percent={61.8} tone="gold" />
          <Tank name="Petrol tank 03" id="TK-003" current="4,000" capacity="8,000" percent={50} tone="blue" />
        </div>
        <button className="panel-link" onClick={()=>setActive('Tank & nozzle stock')}>View tank & nozzle details <ChevronRight size={15}/></button>
      </section>
    </div>

    <div className="lower-grid">
      <section className="panel shifts-panel">
        <div className="panel-heading"><div><h2>Shift activity</h2><p>Staff assignments and current status</p></div><button className="text-action" onClick={()=>setActive('Shift management')}>View all <ChevronRight size={14}/></button></div>
        <div className="table-scroll"><table><thead><tr><th>STAFF MEMBER</th><th>ASSIGNMENT</th><th>SHIFT TIME</th><th>SALES</th><th>STATUS</th></tr></thead><tbody>{shifts.slice(0,4).map(s=><tr key={s.id}><td><div className="staff-cell"><div className="staff-avatar">{s.initials}</div><div><strong>{s.person}</strong><small>{s.id}</small></div></div></td><td>{s.nozzle}</td><td>{s.time}</td><td className="sales-cell">{s.sales}</td><td><span className={`status-badge ${s.status==='Closed'?'closed':'progress'}`}><i/>{s.status}</span></td></tr>)}</tbody></table></div>
        <div className="table-foot"><span>Showing {Math.min(4,shifts.length)} of {shifts.length} sample shifts</span><button onClick={()=>setActive('Shift management')}>Open shift manager <ChevronRight size={14}/></button></div>
      </section>
      <section className="panel activity-panel">
        <div className="panel-heading"><div><h2>Station activity</h2><p>Latest demo events</p></div><button className="more-btn" onClick={()=>notify('Activity log is illustrative')}><MoreHorizontal size={19}/></button></div>
        <div className="timeline">
          <ActivityItem icon={Check} tone="green" title="Morning shift closed" detail="Rakesh Debbarma · Petrol N-02" time="2:15 PM"/>
          <ActivityItem icon={Droplets} tone="gold" title="Tank reading recorded" detail="Petrol tank 01 · 8,240 L" time="1:48 PM"/>
          <ActivityItem icon={Wallet} tone="blue" title="UPI collection recorded" detail="Sample collection · ₹ 18,650" time="1:30 PM"/>
          <ActivityItem icon={Users} tone="violet" title="Shift handover started" detail="Bikash Reang · Supervisor" time="1:05 PM"/>
        </div>
        <button className="panel-link" onClick={()=>notify('Full activity log planned for Phase 2')}>View activity log <ChevronRight size={15}/></button>
      </section>
    </div>
    <div className="insight-banner"><div className="insight-icon"><Gauge size={21}/></div><div><strong>A clearer picture of every shift.</strong><p>Track recorded sales, stock movement and collections in one place. FuelOS is a frontend demo; operational figures are illustrative.</p></div><button onClick={()=>setActive('Reports')}>Explore reports <ArrowUpRight size={15}/></button></div>
  </>;
}

function Tank({name,id,current,capacity,percent,tone}) {
  return <div className="tank-item"><div className="tank-top"><div className="tank-title"><span className={`tank-dot ${tone}`}/><div><strong>{name}</strong><small>{id}</small></div></div><div className="tank-value"><strong>{current} <small>L</small></strong><span>of {capacity} L</span></div></div><div className="tank-track"><div className={`tank-fill ${tone}`} style={{width:`${percent}%`}}/></div><div className="tank-foot"><span>{percent}% capacity</span><span>{Number(capacity.replace(',',''))-Number(current.replace(',',''))} L available capacity</span></div></div>;
}
function ActivityItem({icon:Icon,tone,title,detail,time}) {
  return <div className="timeline-item"><div className={`timeline-icon ${tone}`}><Icon size={15}/></div><div className="timeline-copy"><strong>{title}</strong><p>{detail}</p></div><time>{time}</time></div>;
}
function GenericPage({active,query,setQuery,filteredShifts,fuelType,setFuelType,transactionQuery,setTransactionQuery,notify,exportCsv}) {
  if(active==='Shift management') return <><div className="section-stats"><MiniStat label="Total shifts today" value="4" note="2 completed · 2 active"/><MiniStat label="Recorded shift sales" value="₹ 1,07,300" note="Sample values only"/><MiniStat label="Pending handovers" value="2" note="Requires closing entry" warn/></div><section className="panel full-panel"><div className="panel-heading"><div><h2>Shift register</h2><p>Search sample shifts and export the register.</p></div><div className="toolbar"><div className="search-box"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search staff or shift ID"/></div><button className="button secondary compact" onClick={exportCsv}><Download size={15}/> Export</button></div></div><ShiftTable shifts={filteredShifts}/></section></>;
  if(active==='Tank & nozzle stock') return <><div className="section-stats"><MiniStat label="Recorded stock" value="18,420 L" note="Across 3 demo tanks"/><MiniStat label="Active nozzles" value="4" note="Sample configuration"/><MiniStat label="Variance flagged" value="0.42%" note="Sample threshold: 0.30%" warn/></div><section className="panel full-panel"><div className="panel-heading"><div><h2>Tank register</h2><p>Demo capacity and available stock readings</p></div><button className="button secondary compact" onClick={()=>notify('Tank readings form will be implemented in Phase 2')}><Plus size={15}/> Record reading</button></div><div className="inventory-grid"><InventoryCard title="Petrol tank 01" code="TK-001" stock="8,240 L" capacity="12,000 L" pct={68.7} tone="green"/><InventoryCard title="Diesel tank 02" code="TK-002" stock="6,180 L" capacity="10,000 L" pct={61.8} tone="gold"/><InventoryCard title="Petrol tank 03" code="TK-003" stock="4,000 L" capacity="8,000 L" pct={50} tone="blue"/></div><div className="notice-box"><AlertTriangle size={17}/><div><strong>Sample variance alert</strong><p>One illustrative reading exceeds the sample 0.30% review threshold. Confirm measurement procedures before using real operational data.</p></div></div></section><section className="panel full-panel"><div className="panel-heading"><div><h2>Nozzle meter readings</h2><p>Opening and closing readings are demo placeholders.</p></div></div><table><thead><tr><th>NOZZLE</th><th>FUEL</th><th>OPENING (L)</th><th>CLOSING (L)</th><th>DISPENSED</th><th>STATUS</th></tr></thead><tbody>{[['N-01','Petrol','142,820.4','143,118.6','298.2 L'],['N-02','Petrol','108,421.0','108,706.8','285.8 L'],['N-03','Diesel','92,114.6','92,386.2','271.6 L'],['N-04','Diesel','87,550.2','87,804.4','254.2 L']].map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i}>{c}</td>)}<td><span className="status-badge closed"><i/>Recorded</span></td></tr>)}</tbody></table></section></>;
  if(active==='Sales & transactions') return <><div className="section-stats"><MiniStat label="Recorded sales today" value="₹ 1,84,620" note="Illustrative only"/><MiniStat label="UPI collections" value="₹ 74,280" note="40.2% of sample sales"/><MiniStat label="Cash collections" value="₹ 58,340" note="31.6% of sample sales"/></div><section className="panel full-panel"><div className="panel-heading"><div><h2>Transaction register</h2><p>Sample sales entries, not connected to a payment gateway.</p></div><div className="toolbar"><div className="search-box"><Search size={15}/><input value={transactionQuery} onChange={e=>setTransactionQuery(e.target.value)} placeholder="Search reference or payment" aria-label="Search transactions"/></div><select className="filter-select" value={fuelType} onChange={e=>setFuelType(e.target.value)} aria-label="Filter fuel type"><option>All fuel</option><option>Petrol</option><option>Diesel</option></select><button className="button secondary compact" onClick={exportCsv}><Download size={15}/> Export</button></div></div><table><thead><tr><th>REFERENCE</th><th>TIME</th><th>FUEL TYPE</th><th>VOLUME</th><th>PAYMENT</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>{[['TX-10082','14:32','Petrol','24.6 L','UPI','₹ 2,460'],['TX-10081','14:25','Diesel','31.2 L','Cash','₹ 2,980'],['TX-10080','14:18','Petrol','18.0 L','Card','₹ 1,800'],['TX-10079','14:04','Diesel','42.5 L','UPI','₹ 4,050'],['TX-10078','13:52','Petrol','12.4 L','Cash','₹ 1,240'],['TX-10077','13:46','Diesel','27.8 L','Credit','₹ 2,650']].filter(r=>(fuelType==='All fuel'||r[2]===fuelType)&&r.join(' ').toLowerCase().includes(transactionQuery.toLowerCase())).map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i}>{c}</td>)}<td><span className="status-badge closed"><i/>Recorded</span></td></tr>)}</tbody></table></section></>;
  if(active==='Staff') return <><div className="section-stats"><MiniStat label="Team members" value="8" note="Sample roster"/><MiniStat label="On shift now" value="4" note="Across 4 nozzles"/><MiniStat label="Handover status" value="2 pending" note="Sample shift status" warn/></div><section className="panel full-panel"><div className="panel-heading"><div><h2>Station team</h2><p>Illustrative staff roster for the prototype.</p></div><button className="button primary compact" onClick={()=>notify('Staff management form planned for Phase 2')}><Plus size={15}/> Add staff</button></div><div className="staff-grid">{[['Rakesh Debbarma','RD','Attendant','Morning shift','On duty'],['Milan Saha','MS','Attendant','Morning shift','On duty'],['Bikash Reang','BR','Shift supervisor','Evening shift','On duty'],['Ananya Das','AD','Attendant','Evening shift','On duty'],['Suman Paul','SP','Cashier','General','Available'],['Mampi Jamatia','MJ','Attendant','General','Available']].map(s=><div className="staff-card" key={s[0]}><div className="staff-card-top"><div className="staff-avatar large">{s[1]}</div><span className="status-badge closed"><i/>{s[4]}</span></div><h3>{s[0]}</h3><p>{s[2]}</p><div className="staff-card-foot"><Clock3 size={14}/>{s[3]}</div></div>)}</div></section></>;
  if(active==='Expenses & credit') return <><div className="section-stats"><MiniStat label="Recorded expenses" value="₹ 8,450" note="Today's demo entries"/><MiniStat label="Credit outstanding" value="₹ 32,600" note="Illustrative ledger"/><MiniStat label="Credit customers" value="12" note="Sample accounts"/></div><section className="panel full-panel"><div className="panel-heading"><div><h2>Expense register</h2><p>Sample operational costs, not accounting advice.</p></div><button className="button primary compact" onClick={()=>notify('Expense entry form planned for Phase 2')}><Plus size={15}/> Add expense</button></div><table><thead><tr><th>REFERENCE</th><th>CATEGORY</th><th>DESCRIPTION</th><th>RECORDED BY</th><th>AMOUNT</th></tr></thead><tbody>{[['EX-021','Utilities','Electricity estimate','Station Owner','₹ 3,200'],['EX-020','Maintenance','Equipment service sample','Station Owner','₹ 2,500'],['EX-019','Supplies','Cleaning and station supplies','Shift supervisor','₹ 1,450'],['EX-018','Other','Miscellaneous sample expense','Station Owner','₹ 1,300']].map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i}>{c}</td>)}</tr>)}</tbody></table><div className="notice-box"><ShieldCheck size={17}/><div><strong>Demo ledger</strong><p>Credit and expense figures are illustrative. Tax, accounting, and customer-credit workflows require validation before production use.</p></div></div></section></>;
  if(active==='Reports') return <><div className="section-stats"><MiniStat label="Report templates" value="4" note="Available in this preview"/><MiniStat label="Export format" value="CSV" note="Shift register supported"/><MiniStat label="Data source" value="Demo" note="No backend connected"/></div><div className="report-grid">{[['Daily sales summary','Sales by fuel type, payment method and shift.','₹ 1,84,620'],['Fuel stock reconciliation','Recorded stock movements and variance review.','0.42% variance'],['Shift closing report','Staff assignments, meter readings and collections.','4 sample shifts'],['Expenses & credit ledger','Sample expenses and outstanding customer balances.','₹ 32,600 credit']].map((r,i)=><div className="report-card" key={r[0]}><div className="report-card-icon"><FileText size={19}/></div><span className="report-tag">DEMO REPORT</span><h3>{r[0]}</h3><p>{r[1]}</p><div className="report-card-bottom"><strong>{r[2]}</strong><button onClick={()=>i===2?exportCsv():notify('This report will be exportable after backend implementation')}><Download size={15}/> Export</button></div></div>)}</div></>;
  return <section className="panel full-panel"><div className="panel-heading"><div><h2>{active}</h2><p>Feature preview</p></div></div><p className="empty-note">This module is planned for a later implementation phase.</p></section>;
}
function MiniStat({label,value,note,warn}) {return <div className="mini-stat"><span>{label}</span><strong>{value}</strong><small className={warn?'warn-text':''}>{note}</small></div>}
function InventoryCard({title,code,stock,capacity,pct,tone}) {return <div className="inventory-card"><div className="inventory-card-head"><div className={`metric-icon ${tone}`}><Droplets size={18}/></div><span>{code}</span></div><h3>{title}</h3><div className="inventory-stock">{stock}<small> / {capacity}</small></div><div className="tank-track"><div className={`tank-fill ${tone}`} style={{width:`${pct}%`}}/></div><div className="inventory-foot"><span>Fill level</span><strong>{pct}%</strong></div></div>}
function ShiftTable({shifts}) {return <div className="table-scroll"><table><thead><tr><th>SHIFT ID</th><th>STAFF MEMBER</th><th>ASSIGNMENT</th><th>SHIFT TIME</th><th>SALES</th><th>STATUS</th></tr></thead><tbody>{shifts.map(s=><tr key={s.id}><td className="code-cell">{s.id}</td><td><div className="staff-cell"><div className="staff-avatar">{s.initials}</div><div><strong>{s.person}</strong><small>{s.role}</small></div></div></td><td>{s.nozzle}</td><td>{s.time}</td><td className="sales-cell">{s.sales}</td><td><span className={`status-badge ${s.status==='Closed'?'closed':'progress'}`}><i/>{s.status}</span></td></tr>)}</tbody></table>{shifts.length===0&&<div className="empty-note">No demo shifts match your search.</div>}</div>}

createRoot(document.getElementById('root')).render(<App/>);
