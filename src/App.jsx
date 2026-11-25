import { useMemo, useState } from 'react'
import { HashRouter, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'
import {
  FiActivity, FiArrowDownLeft, FiArrowRight, FiArrowUpRight, FiBell, FiBriefcase, FiCalendar,
  FiCheck, FiChevronDown, FiChevronRight, FiCreditCard, FiDollarSign, FiDownload,
  FiEye, FiEyeOff, FiFilter, FiGrid, FiHelpCircle, FiLock, FiLogOut, FiMenu,
  FiMoreHorizontal, FiPlus, FiSearch, FiSend, FiSettings, FiShield, FiShoppingBag,
  FiTarget, FiTrendingDown, FiTrendingUp, FiUser, FiUsers, FiX, FiZap,
} from 'react-icons/fi'
import { WalletProvider } from './context/WalletContext'
import { useWallet } from './context/walletContextValue'
import './App.css'

const navItems = [
  { to: '/', label: 'Overview', icon: FiGrid },
  { to: '/wallet', label: 'My wallet', icon: FiCreditCard },
  { to: '/send', label: 'Send money', icon: FiSend },
  { to: '/transactions', label: 'Transactions', icon: FiActivity },
  { to: '/analytics', label: 'Analytics', icon: FiTrendingUp },
]
const money = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
const shortDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const fullDate = (date) => new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

function Toast({ message, onClose }) {
  if (!message) return null
  return <div className="toast"><span className="toast-check"><FiCheck /></span><span>{message}</span><button aria-label="Dismiss notification" onClick={onClose}><FiX /></button></div>
}

function Sidebar({ mobileOpen, close }) {
  const { user, logout } = useWallet()
  const navigate = useNavigate()
  return <>
    {mobileOpen && <button className="mobile-backdrop" onClick={close} aria-label="Close menu" />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><FiZap /></span><span>luma<span className="brand-dot">.</span></span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={close} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon /><span>{label}</span>{label === 'Transactions' && <span className="nav-count">9</span>}</NavLink>)}
      </nav>
      <div className="sidebar-divider" />
      <div className="workspace-label">PREFERENCES</div>
      <NavLink to="/profile" onClick={close} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><FiSettings /><span>Settings</span></NavLink>
      <button className="nav-link" onClick={() => window.alert('You’re all set — demo support is here to help!')}><FiHelpCircle /><span>Help & support</span></button>
      <div className="sidebar-bottom">
        <div className="upgrade-card"><span className="upgrade-icon"><FiTarget /></span><strong>Make your money work harder.</strong><p>Explore smarter ways to save.</p><button onClick={() => window.alert('Savings goals are coming soon!')}>Explore features <FiArrowRight /></button></div>
        <button className="profile-mini" onClick={() => navigate('/profile')}><span className="avatar">{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span className="profile-mini-copy"><strong>{user.name}</strong><small>Personal account</small></span><FiMoreHorizontal /></button>
        <button className="sidebar-logout" onClick={() => { logout(); navigate('/login') }}><FiLogOut /> Sign out</button>
      </div>
    </aside>
  </>
}

function Topbar({ title, setMobileOpen }) {
  const { user } = useWallet()
  const [today] = useState(() => new Date())
  return <header className="topbar">
    <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><FiMenu /></button>
    <div className="breadcrumbs"><span>Workspace</span><FiChevronRight /><strong>{title}</strong></div>
    <div className="topbar-actions"><div className="topbar-date"><FiCalendar /> {today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div><button className="icon-btn notification-btn" aria-label="Notifications" onClick={() => window.alert('You’re all caught up!')}><FiBell /><i /></button><div className="topbar-user"><span className="avatar avatar-small">{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><FiChevronDown /></div></div>
  </header>
}

function WalletCard({ balance, onAdd }) {
  return <section className="wallet-card">
    <div className="wallet-card-pattern pattern-one" /><div className="wallet-card-pattern pattern-two" />
    <div className="wallet-card-top"><span className="wallet-card-label"><span className="live-dot" /> Total wallet balance</span><button className="card-more" aria-label="Wallet options"><FiMoreHorizontal /></button></div>
    <div className="balance-amount">{money(balance)}<span>USD</span></div>
    <div className="wallet-card-bottom"><div><span className="card-number-label">ACCOUNT NUMBER</span><strong>•••• &nbsp;•••• &nbsp;•••• &nbsp;4829</strong></div><div className="card-chip"><span>VISA</span><i /></div></div>
    <button className="card-add" onClick={onAdd}><FiPlus /> Add money</button>
  </section>
}

function ActionButton({ icon: Icon, label, tone, onClick }) {
  return <button className="action-button" onClick={onClick}><span className={`action-icon ${tone}`}><Icon /></span><span>{label}</span></button>
}

function TransactionIcon({ transaction }) {
  const icons = { Groceries: FiShoppingBag, Income: FiArrowDownLeft, Transport: FiArrowRight, 'Entertainment': FiActivity, 'Food & drink': FiDollarSign, Transfer: FiUsers, Bills: FiZap, Shopping: FiShoppingBag }
  const Icon = icons[transaction.category] || FiCreditCard
  return <span className={`transaction-icon ${transaction.color || 'blue'}`}><Icon /></span>
}

function TransactionRows({ transactions, compact = false }) {
  if (!transactions.length) return <div className="empty-state"><span><FiSearch /></span><strong>No transactions found</strong><p>Try adjusting your search or filters.</p></div>
  return <div className="transaction-list">{transactions.map((transaction) => <div className="transaction-row" key={transaction.id}>
    <TransactionIcon transaction={transaction} />
    <div className="transaction-main"><strong>{transaction.name}</strong><span>{transaction.category} <i /> {shortDate(transaction.date)}{!compact && ` · ${new Date(transaction.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}</span></div>
    {!compact && <span className={`status status-${transaction.status.toLowerCase()}`}><i />{transaction.status}</span>}
    <strong className={`transaction-amount ${transaction.kind}`}>{transaction.kind === 'income' ? '+' : '−'}{money(transaction.amount)}</strong>
  </div>)}</div>
}

function SectionHeading({ title, subtitle, action }) {
  return <div className="section-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>
}

function Dashboard({ notify, openAdd }) {
  const { user, balance, transactions } = useWallet()
  const navigate = useNavigate()
  const monthlyExpenses = transactions.filter((item) => item.kind === 'expense' && new Date(item.date).getMonth() === new Date().getMonth()).reduce((sum, item) => sum + item.amount, 0)
  const monthlyIncome = transactions.filter((item) => item.kind === 'income' && new Date(item.date).getMonth() === new Date().getMonth()).reduce((sum, item) => sum + item.amount, 0)
  const cashflow = [{ label: 'Mon', income: 950, expense: 420 }, { label: 'Tue', income: 620, expense: 330 }, { label: 'Wed', income: 810, expense: 530 }, { label: 'Thu', income: 700, expense: 390 }, { label: 'Fri', income: 1120, expense: 620 }, { label: 'Sat', income: 480, expense: 290 }, { label: 'Sun', income: 780, expense: 410 }]
  return <div className="page-content">
    <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> YOUR MONEY, IN A GOOD PLACE</div><h1>Good morning, {user.name.split(' ')[0]} <span className="wave">✦</span></h1><p>Here’s what’s happening with your wallet today.</p></div><button className="button button-outline" onClick={() => notify('Your statement is ready to download')}><FiDownload /> Download statement</button></div>
    <div className="dashboard-top-grid">
      <WalletCard balance={balance} onAdd={openAdd} />
      <section className="quick-panel panel"><div className="quick-panel-title"><div><h3>Quick actions</h3><p>What would you like to do?</p></div><span className="subtle-icon"><FiZap /></span></div><div className="quick-actions"><ActionButton icon={FiPlus} label="Add money" tone="blue" onClick={openAdd} /><ActionButton icon={FiSend} label="Send money" tone="mint" onClick={() => navigate('/send')} /><ActionButton icon={FiGrid} label="Pay a bill" tone="peach" onClick={() => notify('Bill payments are simulated in this demo')} /><ActionButton icon={FiTarget} label="Scan & pay" tone="lavender" onClick={() => notify('Scan & Pay is a visual demo; no real payments are supported')} /></div></section>
    </div>
    <div className="stat-grid">
      <article className="stat-card"><div className="stat-heading"><span className="stat-icon mint"><FiArrowDownLeft /></span><span className="stat-trend positive"><FiTrendingUp /> 12.8%</span></div><span className="stat-label">Total income</span><strong>{money(monthlyIncome || 5262.5)}</strong><small>Compared to last month</small></article>
      <article className="stat-card"><div className="stat-heading"><span className="stat-icon peach"><FiArrowUpRight /></span><span className="stat-trend negative"><FiTrendingDown /> 4.2%</span></div><span className="stat-label">Total expenses</span><strong>{money(monthlyExpenses || 1230.75)}</strong><small>Compared to last month</small></article>
      <article className="stat-card"><div className="stat-heading"><span className="stat-icon blue"><FiTarget /></span><span className="stat-trend positive"><FiTrendingUp /> 8.1%</span></div><span className="stat-label">Savings this month</span><strong>{money(Math.max(0, monthlyIncome - monthlyExpenses) || 2840)}</strong><small>You’re doing great!</small></article>
    </div>
    <div className="dashboard-bottom-grid">
      <section className="panel chart-panel"><SectionHeading title="Cash flow" subtitle="Your income and spending over time" action={<select className="select-small" aria-label="Chart period"><option>This week</option><option>This month</option></select>} /><div className="chart-legend"><span><i className="legend-dot income-dot" /> Income</span><span><i className="legend-dot expense-dot" /> Expenses</span></div><div className="cashflow-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={cashflow} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}><defs><linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3157d5" stopOpacity={0.17} /><stop offset="95%" stopColor="#3157d5" stopOpacity={0} /></linearGradient><linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#70d6b2" stopOpacity={0.2} /><stop offset="95%" stopColor="#70d6b2" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf0f5" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9aa2b3', fontSize: 11 }} dy={12} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9aa2b3', fontSize: 11 }} tickFormatter={(value) => `$${value}`} /><Tooltip formatter={(value) => money(value)} contentStyle={{ border: 0, borderRadius: 12, boxShadow: '0 8px 30px #152b5518' }} /><Area type="monotone" dataKey="income" name="Income" stroke="#3157d5" strokeWidth={2.5} fill="url(#incomeFill)" /><Area type="monotone" dataKey="expense" name="Expenses" stroke="#70d6b2" strokeWidth={2.5} fill="url(#expenseFill)" /></AreaChart></ResponsiveContainer></div></section>
      <section className="panel budget-panel"><SectionHeading title="Monthly budget" subtitle="You’re right on track" action={<button className="icon-btn" aria-label="Budget settings"><FiMoreHorizontal /></button>} /><div className="budget-ring"><div className="ring-copy"><strong>$1,284</strong><span>of $2,500</span></div><svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="58" /><circle className="ring-progress" cx="70" cy="70" r="58" /></svg></div><div className="budget-foot"><span><i className="legend-dot income-dot" /> Spent so far</span><strong>51.4%</strong></div><div className="budget-note"><span className="note-icon"><FiCheck /></span><span>You have <strong>$1,216</strong> left in your budget this month.</span></div></section>
    </div>
    <section className="panel recent-panel"><SectionHeading title="Recent transactions" subtitle="Your latest wallet activity" action={<NavLink className="text-link" to="/transactions">View all <FiArrowRight /></NavLink>} /><TransactionRows transactions={transactions.slice(0, 5)} compact /></section>
  </div>
}

function WalletPage({ notify, openAdd }) {
  const { balance, transactions } = useWallet()
  return <div className="page-content"><div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> YOUR ACCOUNT</div><h1>My wallet</h1><p>Your money, all in one place.</p></div><button className="button button-primary" onClick={openAdd}><FiPlus /> Add money</button></div><div className="wallet-page-grid"><WalletCard balance={balance} onAdd={openAdd} /><section className="panel payment-methods"><SectionHeading title="Payment methods" subtitle="Manage your linked accounts" action={<button className="icon-btn" onClick={() => notify('Add a payment method in this demo')}><FiPlus /></button>} /><div className="payment-method"><span className="payment-brand visa-brand">VISA</span><div><strong>Visa ending in 4829</strong><span>Default payment method</span></div><span className="method-default">Default</span><FiMoreHorizontal /></div><div className="payment-method"><span className="payment-brand bank-brand"><FiBriefcase /></span><div><strong>Chase Checking</strong><span>•••• 9301 · Connected</span></div><FiMoreHorizontal /></div><button className="add-method" onClick={() => notify('Card linking is not available in the demo')}><FiPlus /> Add payment method</button></section></div><section className="panel recent-panel"><SectionHeading title="Wallet activity" subtitle="Everything in and out of your wallet" action={<NavLink className="text-link" to="/transactions">See history <FiArrowRight /></NavLink>} /><TransactionRows transactions={transactions.slice(0, 6)} compact /></section><div className="demo-banner"><span><FiShield /></span><div><strong>Your wallet is in demo mode</strong><p>All balances and payments are simulated locally and do not involve real money or bank transfers.</p></div></div></div>
}

function AddMoneyModal({ close, notify }) {
  const { addTransaction } = useWallet()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = (event) => {
    event.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) return notify('Enter an amount greater than zero')
    setLoading(true)
    window.setTimeout(() => {
      addTransaction({ name: 'Wallet top up', category: 'Income', kind: 'income', amount: value, icon: 'briefcase', color: 'blue' })
      setLoading(false)
      close()
      notify(`${money(value)} added to your demo wallet`)
    }, 650)
  }
  return <Modal close={close}><div className="modal-icon blue"><FiPlus /></div><h2>Add money</h2><p className="modal-subtitle">Top up your wallet with a simulated payment.</p><form onSubmit={submit}><label className="field-label" htmlFor="add-amount">Amount</label><div className="amount-input"><span>$</span><input id="add-amount" autoFocus type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} required /></div><label className="field-label" htmlFor="fund-from">Add funds from</label><select className="form-input" id="fund-from"><option>Visa ending in 4829</option><option>Chase Checking •••• 9301</option></select><div className="demo-inline"><FiShield /> Demo transaction — no real payment will be made.</div><button className="button button-primary button-full" disabled={loading}>{loading ? <span className="spinner" /> : <FiPlus />}{loading ? 'Adding funds…' : 'Add to wallet'}</button></form></Modal>
}

function Modal({ close, children, wide = false }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true"><button className="modal-close" onClick={close} aria-label="Close dialog"><FiX /></button>{children}</section></div>
}

function SendMoney({ notify }) {
  const { addTransaction, balance } = useWallet()
  const [form, setForm] = useState({ name: '', account: '', amount: '', note: '' })
  const [confirm, setConfirm] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })
  const submit = (event) => {
    event.preventDefault()
    if (Number(form.amount) <= 0) return notify('Please enter a valid amount')
    if (Number(form.amount) > balance) return notify('Your wallet balance is too low for this payment')
    setConfirm(true)
  }
  const pay = () => {
    setConfirm(false)
    setProcessing(true)
    window.setTimeout(() => {
      const entry = addTransaction({ name: form.name, category: 'Transfer', kind: 'expense', amount: Number(form.amount), status: 'Completed', icon: 'user', color: 'lavender', description: form.note || `Demo payment to ${form.account}` })
      setTransactionId(entry.id)
      setProcessing(false)
      setSuccess(true)
    }, 900)
  }
  return <div className="page-content"><div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> QUICK & SECURE</div><h1>Send money</h1><p>Send a little something, in just a few clicks.</p></div></div><div className="send-layout"><section className="panel send-form-panel">
    {success ? <div className="success-view"><div className="success-check"><FiCheck /></div><div className="eyebrow"><span className="live-dot" /> DEMO PAYMENT COMPLETE</div><h2>Money sent!</h2><p>Your simulated payment of <strong>{money(Number(form.amount))}</strong> to <strong>{form.name}</strong> was successful.</p><div className="success-receipt"><span>Recipient<strong>{form.name}</strong></span><span>Transaction ID<strong>{transactionId}</strong></span><span>Payment method<strong>Luma wallet</strong></span><span>Status<strong className="status-text">Completed</strong></span></div><button className="button button-primary button-full" onClick={() => { setSuccess(false); setForm({ name: '', account: '', amount: '', note: '' }); notify('Ready for your next demo payment') }}>Send another payment <FiArrowRight /></button></div> :
      <><div className="form-step"><span>01</span><span>PAYMENT DETAILS</span></div><h2>Who are you sending to?</h2><p className="form-intro">Enter the recipient’s details and amount below.</p><form className="send-form" onSubmit={submit}><label className="field-label" htmlFor="recipient">Recipient name</label><div className="input-with-icon"><FiUser /><input id="recipient" placeholder="e.g. Alex Morgan" value={form.name} onChange={update('name')} required /></div><label className="field-label" htmlFor="account">Recipient account or UPI ID</label><div className="input-with-icon"><FiCreditCard /><input id="account" placeholder="name@example.com" value={form.account} onChange={update('account')} required /></div><label className="field-label" htmlFor="send-amount">Amount</label><div className="amount-input"><span>$</span><input id="send-amount" type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={update('amount')} required /></div><label className="field-label" htmlFor="note">Payment description <span className="optional">(optional)</span></label><textarea id="note" className="form-input" placeholder="What’s it for?" value={form.note} onChange={update('note')} rows="3" /><div className="send-total"><span>You’ll send</span><strong>{form.amount ? money(Number(form.amount)) : '$0.00'} <small>USD</small></strong></div><div className="demo-inline"><FiShield /> Demo payment only — this will not transfer real money.</div><button className="button button-primary button-full" disabled={processing}>{processing ? <><span className="spinner" /> Processing…</> : <>Review payment <FiArrowRight /></>}</button></form></>}
  </section><aside className="send-aside"><div className="send-aside-art"><div className="art-glow" /><div className="floating-card"><span className="brand-mark"><FiZap /></span><span>luma.</span><strong>$ 240.00</strong><small>EVERYDAY SPENDING</small><div className="art-card-bottom"><i /><i /><i /></div></div><span className="art-orbit orbit-a" /><span className="art-orbit orbit-b" /></div><div className="send-aside-copy"><span className="eyebrow">PAYMENTS MADE SIMPLE</span><h3>Fast, friendly, and always in your control.</h3><p>This academic demo simulates wallet payments and saves activity only in this browser.</p><div className="security-line"><FiLock /> Your demo data stays on this device</div></div></aside></div>{confirm && <Modal close={() => setConfirm(false)}><div className="modal-icon mint"><FiSend /></div><h2>Confirm payment</h2><p className="modal-subtitle">Review your simulated payment before sending.</p><div className="confirm-details"><span>Recipient<strong>{form.name}</strong></span><span>Account<strong>{form.account}</strong></span><span>Amount<strong>{money(Number(form.amount))}</strong></span></div><div className="demo-inline"><FiShield /> Demo only. No real funds will move.</div><div className="modal-buttons"><button className="button button-outline" onClick={() => setConfirm(false)}>Go back</button><button className="button button-primary" onClick={pay}>Confirm & send <FiArrowRight /></button></div></Modal>}</div>
}

function Transactions({ notify }) {
  const { transactions } = useWallet()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [period, setPeriod] = useState('Any time')
  const [now] = useState(() => Date.now())
  const shown = useMemo(() => transactions.filter((item) => (filter === 'All' || item.status === filter) && (!query || `${item.name} ${item.category} ${item.id}`.toLowerCase().includes(query.toLowerCase())) && (period === 'Any time' || now - new Date(item.date).getTime() < (period === 'This week' ? 7 : 30) * 86400000)), [transactions, filter, query, period, now])
  return <div className="page-content"><div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> YOUR WALLET ACTIVITY</div><h1>Transactions</h1><p>Keep track of every dollar in and out.</p></div><button className="button button-outline" onClick={() => notify('Your transaction report is ready')}><FiDownload /> Export</button></div><div className="transaction-summary"><div className="mini-summary-card"><span className="stat-icon mint"><FiArrowDownLeft /></span><span>Total incoming<strong>{money(transactions.filter((t) => t.kind === 'income').reduce((n, t) => n + t.amount, 0))}</strong></span></div><div className="mini-summary-card"><span className="stat-icon peach"><FiArrowUpRight /></span><span>Total outgoing<strong>{money(transactions.filter((t) => t.kind === 'expense').reduce((n, t) => n + t.amount, 0))}</strong></span></div><div className="mini-summary-card"><span className="stat-icon blue"><FiActivity /></span><span>Transactions<strong>{transactions.length} total</strong></span></div></div><section className="panel transactions-panel"><SectionHeading title="All transactions" subtitle={`${shown.length} records`} action={<div className="transaction-toolbar"><div className="search-box"><FiSearch /><input placeholder="Search transactions..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><select className="select-small" aria-label="Filter by period" value={period} onChange={(event) => setPeriod(event.target.value)}><option>Any time</option><option>This week</option><option>This month</option></select><button className="filter-button"><FiFilter /> <span>Filter</span></button></div>} /><div className="filter-tabs">{['All', 'Completed', 'Pending', 'Failed'].map((status) => <button key={status} className={filter === status ? 'selected' : ''} onClick={() => setFilter(status)}>{status}{status === 'All' && <span>{transactions.length}</span>}</button>)}</div><div className="transaction-table-head"><span>TRANSACTION</span><span>STATUS</span><span>AMOUNT</span></div>{shown.length ? shown.map((transaction) => <div className="transaction-row transaction-table-row" key={transaction.id}><TransactionIcon transaction={transaction} /><div className="transaction-main"><strong>{transaction.name}</strong><span>{transaction.id} <i /> {fullDate(transaction.date)}</span></div><span className={`status status-${transaction.status.toLowerCase()}`}><i />{transaction.status}</span><strong className={`transaction-amount ${transaction.kind}`}>{transaction.kind === 'income' ? '+' : '−'}{money(transaction.amount)}</strong></div>) : <div className="empty-state"><span><FiSearch /></span><strong>No transactions found</strong><p>Try another search or status filter.</p></div>}<div className="table-foot">Showing <strong>{shown.length}</strong> of <strong>{transactions.length}</strong> transactions <span>All payments are simulated demo records</span></div></section></div>
}

const categoryData = [{ name: 'Shopping', value: 380, color: '#3157d5' }, { name: 'Food & drink', value: 295, color: '#70d6b2' }, { name: 'Transport', value: 178, color: '#f0a77e' }, { name: 'Bills', value: 240, color: '#b8a4ed' }, { name: 'Entertainment', value: 124, color: '#f2ce7e' }]
function Analytics() {
  const [period, setPeriod] = useState('Monthly')
  const { transactions } = useWallet()
  const spending = transactions.filter((item) => item.kind === 'expense').reduce((sum, item) => sum + item.amount, 0)
  const barData = period === 'Weekly' ? [{ month: 'Mon', expense: 75, income: 140 }, { month: 'Tue', expense: 112, income: 130 }, { month: 'Wed', expense: 85, income: 180 }, { month: 'Thu', expense: 142, income: 125 }, { month: 'Fri', expense: 190, income: 260 }, { month: 'Sat', expense: 112, income: 105 }, { month: 'Sun', expense: 95, income: 140 }] : [{ month: 'Jan', expense: 850, income: 3000 }, { month: 'Feb', expense: 1120, income: 3300 }, { month: 'Mar', expense: 940, income: 3400 }, { month: 'Apr', expense: 1420, income: 3800 }, { month: 'May', expense: 1180, income: 3900 }, { month: 'Jun', expense: 1284, income: 4250 }]
  return <div className="page-content"><div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> YOUR FINANCIAL PICTURE</div><h1>Spending insights</h1><p>Small insights today, smarter choices tomorrow.</p></div><select className="select-small period-select" value={period} onChange={(event) => setPeriod(event.target.value)}><option>Monthly</option><option>Weekly</option></select></div><div className="analytics-stats"><div className="analytics-total"><span className="stat-label">Total spending this month</span><strong>{money(spending || 1284)}</strong><span className="stat-trend positive"><FiTrendingDown /> 8.4% less than last month</span></div><div className="analytics-stat"><span className="stat-icon mint"><FiArrowDownLeft /></span><span>Income<strong>{money(5262.5)}</strong></span></div><div className="analytics-stat"><span className="stat-icon peach"><FiArrowUpRight /></span><span>Expenses<strong>{money(spending || 1284)}</strong></span></div></div><div className="analytics-grid"><section className="panel analytics-chart-panel"><SectionHeading title="Income vs. expenses" subtitle={`${period} overview`} action={<button className="icon-btn"><FiMoreHorizontal /></button>} /><div className="chart-legend"><span><i className="legend-dot income-dot" /> Income</span><span><i className="legend-dot expense-dot" /> Expenses</span></div><div className="analytics-bar-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={barData} barGap={5} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}><CartesianGrid vertical={false} stroke="#edf0f5" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9aa2b3', fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9aa2b3', fontSize: 11 }} tickFormatter={(value) => `$${value}`} /><Tooltip formatter={(value) => money(value)} contentStyle={{ border: 0, borderRadius: 12 }} /><Bar dataKey="income" name="Income" fill="#3157d5" radius={[5, 5, 0, 0]} /><Bar dataKey="expense" name="Expenses" fill="#70d6b2" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></section><section className="panel category-panel"><SectionHeading title="By category" subtitle="Where your money goes" action={<button className="icon-btn"><FiMoreHorizontal /></button>} /><div className="donut-wrap"><ResponsiveContainer width="100%" height={205}><PieChart><Pie data={categoryData} innerRadius={64} outerRadius={84} paddingAngle={4} dataKey="value" stroke="none">{categoryData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => money(value)} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{money(spending || 1217)}</strong><span>Total spend</span></div></div><div className="category-list">{categoryData.map((item) => <div key={item.name}><span><i style={{ backgroundColor: item.color }} />{item.name}</span><strong>{money(item.value)}</strong></div>)}</div></section></div><section className="panel insights-banner"><span className="insight-icon"><FiZap /></span><div><span className="eyebrow">A LITTLE INSIGHT</span><h3>You’re building healthy spending habits.</h3><p>Your demo spending is spread across a few everyday categories. Keep checking in to stay in control.</p></div><FiArrowRight /></section></div>
}

function Profile({ notify }) {
  const { user, updateUser, logout } = useWallet()
  const navigate = useNavigate()
  const [form, setForm] = useState(user)
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const save = (event) => {
    event.preventDefault()
    updateUser(form)
    setSaved(true)
    notify('Your profile has been updated')
  }
  const changePassword = (event) => {
    event.preventDefault()
    if (password.next.length < 8) return notify('New password must be at least 8 characters')
    if (password.next !== password.confirm) return notify('Your passwords do not match')
    setPassword({ current: '', next: '', confirm: '' })
    notify('Demo password updated')
  }
  return <div className="page-content"><div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> ACCOUNT PREFERENCES</div><h1>Profile & settings</h1><p>Make Luma feel a little more like you.</p></div><button className="button button-outline" onClick={() => { if (window.confirm('Sign out of your demo wallet?')) { logout(); navigate('/login') } }}><FiLogOut /> Sign out</button></div><div className="settings-layout"><div className="settings-nav"><a className="settings-nav-item selected" href="#personal"><FiUser /> Personal details</a><a className="settings-nav-item" href="#security"><FiShield /> Security</a><a className="settings-nav-item" href="#notifications"><FiBell /> Notifications</a></div><div className="settings-content"><section className="panel settings-panel" id="personal"><SectionHeading title="Personal information" subtitle="Update your details and how we can reach you." /><div className="profile-avatar-row"><span className="avatar avatar-large">{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><strong>Your profile photo</strong><span>This is the avatar shown across your wallet.</span></div><button className="button button-outline button-small" onClick={() => notify('Profile photo upload is not part of this demo')}>Change photo</button></div><form className="profile-form" onSubmit={save}><label className="field-label" htmlFor="profile-name">Full name</label><input id="profile-name" className="form-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /><label className="field-label" htmlFor="profile-email">Email address</label><input id="profile-email" className="form-input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /><label className="field-label" htmlFor="profile-phone">Phone number</label><input id="profile-phone" className="form-input" type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /><div className="form-footer">{saved && <span className="saved-hint"><FiCheck /> Changes saved</span>}<button className="button button-primary">Save changes</button></div></form></section><section className="panel settings-panel" id="security"><SectionHeading title="Security" subtitle="Keep your demo account safe." /><div className="security-setting"><span className="settings-row-icon"><FiLock /></span><div><strong>Change password</strong><p>Use a strong, unique password for your account.</p></div><FiChevronDown /></div><form className="password-form" onSubmit={changePassword}><label className="field-label" htmlFor="current-password">Current password</label><div className="password-field"><input id="current-password" type={showPassword ? 'text' : 'password'} value={password.current} onChange={(event) => setPassword({ ...password, current: event.target.value })} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <FiEyeOff /> : <FiEye />}</button></div><label className="field-label" htmlFor="new-password">New password</label><input className="form-input" id="new-password" type="password" minLength="8" value={password.next} onChange={(event) => setPassword({ ...password, next: event.target.value })} required /><label className="field-label" htmlFor="confirm-password">Confirm new password</label><input className="form-input" id="confirm-password" type="password" value={password.confirm} onChange={(event) => setPassword({ ...password, confirm: event.target.value })} required /><button className="button button-outline button-small">Update password</button></form></section><section className="panel settings-panel" id="notifications"><SectionHeading title="Notifications" subtitle="Choose the updates you’d like to receive." /><ToggleRow title="Transaction updates" description="Get notified about your wallet activity." defaultChecked /><ToggleRow title="Spending insights" description="Helpful monthly summaries and spending patterns." defaultChecked /><ToggleRow title="Product news" description="Updates about new Luma features." /></section><div className="demo-banner"><span><FiShield /></span><div><strong>Demo account security</strong><p>This project stores demo information in your browser’s localStorage. Never enter real financial credentials.</p></div></div></div></div></div>
}

function ToggleRow({ title, description, defaultChecked = false }) {
  const [enabled, setEnabled] = useState(defaultChecked)
  return <div className="toggle-row"><div><strong>{title}</strong><p>{description}</p></div><button className={`toggle ${enabled ? 'on' : ''}`} role="switch" aria-checked={enabled} onClick={() => setEnabled(!enabled)}><span /></button></div>
}

function AuthPage({ register = false }) {
  const { login } = useWallet()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', remember: true })
  const submit = (event) => {
    event.preventDefault()
    setError('')
    if (register && form.password !== form.confirm) return setError('Your passwords do not match.')
    setLoading(true)
    window.setTimeout(() => {
      login(form.email, register ? form.name : undefined, register ? form.phone : undefined)
      navigate('/')
    }, 550)
  }
  return <div className="auth-page"><div className="auth-form-side"><div className="auth-brand"><span className="brand-mark"><FiZap /></span>luma<span className="brand-dot">.</span></div><div className="auth-form-wrap"><span className="eyebrow"><span className="live-dot" /> YOUR MONEY, MADE SIMPLE</span><h1>{register ? 'Create your account' : 'Welcome back'}</h1><p className="auth-lede">{register ? 'A brighter way to manage your money starts here.' : 'Good to see you again. Sign in to your wallet.'}</p><form className="auth-form" onSubmit={submit}>{register && <><label className="field-label" htmlFor="auth-name">Full name</label><div className="input-with-icon"><FiUser /><input id="auth-name" autoComplete="name" placeholder="Olivia Rhye" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></div></>}<label className="field-label" htmlFor="auth-email">Email address</label><div className="input-with-icon"><FiUser /><input id="auth-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></div>{register && <><label className="field-label" htmlFor="auth-phone">Phone number</label><div className="input-with-icon"><FiCreditCard /><input id="auth-phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required /></div></>}<label className="field-label" htmlFor="auth-password">Password</label><div className="input-with-icon password-input"><FiLock /><input id="auth-password" type={showPassword ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} placeholder="At least 8 characters" minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /><button type="button" aria-label="Show or hide password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>{register && <><label className="field-label" htmlFor="auth-confirm">Confirm password</label><div className="input-with-icon"><FiLock /><input id="auth-confirm" type="password" autoComplete="new-password" placeholder="Re-enter your password" minLength="8" value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} required /></div></>}{!register && <div className="remember-row"><label><input type="checkbox" checked={form.remember} onChange={(event) => setForm({ ...form, remember: event.target.checked })} /> Remember me</label><button type="button" onClick={() => setError('Password reset is not available in this demo.')}>Forgot password?</button></div>}{error && <div className="form-error">{error}</div>}<button className="button button-primary button-full auth-submit" disabled={loading}>{loading ? <><span className="spinner" /> Just a moment…</> : <>{register ? 'Create account' : 'Sign in'} <FiArrowRight /></>}</button></form><div className="auth-switch">{register ? 'Already have an account?' : 'New to Luma?'} <NavLink to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</NavLink></div><div className="auth-demo-note"><FiShield /> Demo only. Your account is stored locally in this browser.</div></div><div className="auth-copyright">© 2025 Luma Wallet <span>•</span> An academic demo project</div></div><div className="auth-visual"><div className="auth-visual-top"><span>luma<span className="brand-dot">.</span></span><span><span className="live-dot" /> MADE FOR YOUR EVERYDAY</span></div><div className="auth-art"><div className="auth-halo halo-one" /><div className="auth-halo halo-two" /><div className="auth-mini-card"><div><span className="brand-mark"><FiZap /></span><span>luma.</span><FiMoreHorizontal /></div><small>AVAILABLE BALANCE</small><strong>$ 8,420<span>.50</span></strong><div className="auth-card-bottom"><span>•••• &nbsp;•••• &nbsp;•••• &nbsp;4829</span><span>VISA</span></div></div><div className="float-chip chip-received"><span><FiArrowDownLeft /></span><div><small>Money received</small><strong>+$ 250.00</strong></div></div><div className="float-chip chip-growth"><span><FiTrendingUp /></span><div><small>Your savings</small><strong>Looking good!</strong></div></div><span className="sparkle sparkle-a">✦</span><span className="sparkle sparkle-b">✳</span></div><div className="auth-quote"><span className="eyebrow">A LITTLE MORE CLARITY</span><h2>Your money, with<br />room to breathe.</h2><p>See the whole picture, spend with intention, and feel good about what comes next.</p><div className="quote-dots"><i className="selected" /><i /><i /></div></div><span className="visual-orb" /></div></div>
}

function AppFrame() {
  const { authenticated } = useWallet()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 3500) }
  const titles = { '/': 'Overview', '/wallet': 'My wallet', '/send': 'Send money', '/transactions': 'Transactions', '/analytics': 'Analytics', '/profile': 'Settings' }
  const isAuth = location.pathname === '/login' || location.pathname === '/register'
  if (isAuth) return <Routes><Route path="/login" element={authenticated ? <Navigate to="/" replace /> : <AuthPage />} /><Route path="/register" element={authenticated ? <Navigate to="/" replace /> : <AuthPage register />} /></Routes>
  if (!authenticated) return <Navigate to="/login" replace />
  const currentPage = location.pathname === '/' ? <Dashboard notify={notify} openAdd={() => setAddOpen(true)} /> : location.pathname === '/wallet' ? <WalletPage notify={notify} openAdd={() => setAddOpen(true)} /> : location.pathname === '/send' ? <SendMoney notify={notify} /> : location.pathname === '/transactions' ? <Transactions notify={notify} /> : location.pathname === '/analytics' ? <Analytics /> : <Profile notify={notify} />
  return <div className="app-shell"><Sidebar mobileOpen={mobileOpen} close={() => setMobileOpen(false)} /><main className="main-area"><Topbar title={titles[location.pathname] || 'Settings'} setMobileOpen={setMobileOpen} />{currentPage}<footer className="app-footer"><span>© 2025 Luma Wallet <i /> Made for mindful money moments.</span><span><FiShield /> Demo application · No real funds</span></footer></main>{addOpen && <AddMoneyModal close={() => setAddOpen(false)} notify={notify} />}<Toast message={toast} onClose={() => setToast('')} /></div>
}

export default function App() {
  return <WalletProvider><HashRouter><AppFrame /></HashRouter></WalletProvider>
}
