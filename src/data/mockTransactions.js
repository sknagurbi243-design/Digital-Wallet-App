const daysAgo = (days, hour = 12) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hour, 24, 0, 0)
  return date.toISOString()
}

export const mockTransactions = [
  { id: 'TXN-849201', name: 'Whole Foods Market', category: 'Groceries', kind: 'expense', amount: 86.42, status: 'Completed', date: daysAgo(0, 11), icon: 'basket', color: 'mint' },
  { id: 'TXN-849187', name: 'Salary deposit', category: 'Income', kind: 'income', amount: 4250, status: 'Completed', date: daysAgo(1, 9), icon: 'briefcase', color: 'blue' },
  { id: 'TXN-849166', name: 'Uber ride', category: 'Transport', kind: 'expense', amount: 18.5, status: 'Completed', date: daysAgo(2, 18), icon: 'car', color: 'lavender' },
  { id: 'TXN-849142', name: 'Netflix subscription', category: 'Entertainment', kind: 'expense', amount: 15.99, status: 'Pending', date: daysAgo(3, 10), icon: 'play', color: 'peach' },
  { id: 'TXN-849103', name: 'Coffee & Co.', category: 'Food & drink', kind: 'expense', amount: 8.75, status: 'Completed', date: daysAgo(4, 8), icon: 'coffee', color: 'mint' },
  { id: 'TXN-849087', name: 'Alex Morgan', category: 'Transfer', kind: 'expense', amount: 120, status: 'Completed', date: daysAgo(5, 14), icon: 'user', color: 'lavender' },
  { id: 'TXN-849021', name: 'Electricity bill', category: 'Bills', kind: 'expense', amount: 64.2, status: 'Failed', date: daysAgo(7, 16), icon: 'bolt', color: 'peach' },
  { id: 'TXN-848998', name: 'Online Store', category: 'Shopping', kind: 'expense', amount: 92.4, status: 'Completed', date: daysAgo(8, 13), icon: 'bag', color: 'blue' },
  { id: 'TXN-848942', name: 'Cashback reward', category: 'Income', kind: 'income', amount: 12.5, status: 'Completed', date: daysAgo(10, 10), icon: 'gift', color: 'mint' },
]
