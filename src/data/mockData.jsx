// Mock Data for ICP Finance Dashboard

export const MODULES = [
  'onboarding', 'rekyc', 'authorise'
];

export const SECTORS = ['Banking', 'Insurance', 'Fintech', 'Government', 'Healthcare'];

// Two entities for split ratio
export const ENTITIES = ['ICP', 'Dalil'];

// Single default split ratio (ICP: 60%, Dalil: 40%)
export const DEFAULT_SPLIT_RATIO = { icp: 60, dalil: 40 };



const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateMonthlyData = () => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      monthIndex: i,
      date: date.toISOString()
    });
  }
  return months;
};

export const MONTHS = generateMonthlyData();

const clientNames = [
  'Emirates NBD', 'Abu Dhabi Commercial Bank', 'First Abu Dhabi Bank',
  'Dubai Islamic Bank', 'Mashreq Bank', 'ADNOC Distribution',
  'Etisalat', 'Dubai Electricity', 'Abu Dhabi Health Services',
  'Dubai Health Authority', 'Careem Pay', 'Tabby', 'Tamara',
  'Sarwa', 'Beehive', 'YAP', 'Liv Bank', 'Wio Bank',
  'Ziina', 'PayBy'
];

export const generateClients = () => {
  return clientNames.map((name, index) => {
    const sector = SECTORS[index % SECTORS.length];
    const splitRatio = { ...DEFAULT_SPLIT_RATIO };
    const totalTransactions = generateRandomNumber(5000, 50000);
    const avgRevenuePerTx = generateRandomNumber(2, 15);
    const totalRevenue = totalTransactions * avgRevenuePerTx;
    const icpShare = Math.round((totalRevenue * (splitRatio.icp / 100)) * 100) / 100;
    const dalilShare = Math.round((totalRevenue - icpShare) * 100) / 100;

    return {
      id: `client-${index + 1}`,
      name,
      sector,
      totalTransactions,
      revenue: totalRevenue,
      splitRatio,
      icpShare,
      dalilShare,
      status: index % 10 === 0 ? 'inactive' : 'active',
      activeSince: new Date(2020 + Math.floor(index / 5), index % 12, 1).toISOString(),
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin@icp.ae',
      splitHistory: [
        {
          date: new Date(2023, 0, 1).toISOString(),
          icp: 60,
          dalil: 40,
          changedBy: 'admin@icp.ae',
          status: 'approved'
        }
      ],
      pendingSplit: null
    };
  });
};

export const generateClientModuleData = (clientId) => {
  const client = CLIENTS.find(c => c.id === clientId);
  if (!client) return [];
  
  const totalTx = client.totalTransactions;
  let remaining = totalTx;
  
  return MODULES.map((module, index) => {
    const isLast = index === MODULES.length - 1;
    const txCount = isLast ? remaining : Math.floor(remaining * (Math.random() * 0.15 + 0.01));
    remaining -= txCount;
    
    const revenuePerTx = generateRandomNumber(2, 12);
    const revenue = txCount * revenuePerTx;
    
    return {
      module,
      displayName: module.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      transactionCount: Math.max(txCount, 0),
      revenue,
      percentage: ((txCount / totalTx) * 100).toFixed(1)
    };
  }).sort((a, b) => b.transactionCount - a.transactionCount);
};

export const generateMonthlyRevenue = () => {
  return MONTHS.map(m => ({
    month: m.month,
    revenue: generateRandomNumber(800000, 1500000),
    transactions: generateRandomNumber(50000, 120000)
  }));
};

export const generateSectorData = () => {
  return SECTORS.map(sector => {
    const sectorClients = CLIENTS.filter(c => c.sector === sector);
    const totalRevenue = sectorClients.reduce((sum, c) => sum + c.revenue, 0);
    const totalTransactions = sectorClients.reduce((sum, c) => sum + c.totalTransactions, 0);
    
    return {
      sector,
      clientCount: sectorClients.length,
      totalRevenue,
      totalTransactions,
      avgRevenuePerClient: Math.round(totalRevenue / sectorClients.length)
    };
  });
};

export const generateModuleDistribution = () => {
  const distribution = MODULES.slice(0, 8).map(module => ({
    module,
    displayName: module.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value: generateRandomNumber(5, 20)
  }));
  
  const total = distribution.reduce((sum, d) => sum + d.value, 0);
  return distribution.map(d => ({
    ...d,
    percentage: ((d.value / total) * 100).toFixed(1)
  }));
};

export const generateTransactionHistory = (clientId) => {
  const history = [];
  MONTHS.forEach(m => {
    MODULES.forEach(module => {
      history.push({
        id: `${clientId}-${m.month}-${module}`,
        date: m.date,
        month: m.month,
        module,
        displayName: module.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        transactions: generateRandomNumber(100, 2000),
        revenue: generateRandomNumber(500, 15000)
      });
    });
  });
  return history;
};

// Generate daily transaction data for a client
export const generateDailyTransactionHistory = (clientId) => {
  const history = [];
  const now = new Date();

  // Generate data for last 90 days
  for (let i = 0; i < 90; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayData = {
      id: `${clientId}-${date.toISOString().split('T')[0]}`,
      date: date.toISOString(),
      dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      modules: {}
    };

    let totalTransactions = 0;
    let totalRevenue = 0;

    // Generate data for each module
    MODULES.forEach(module => {
      const transactions = generateRandomNumber(10, 200);
      const revenue = generateRandomNumber(50, 1500);
      dayData.modules[module] = {
        transactions,
        revenue,
        displayName: module.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      };
      totalTransactions += transactions;
      totalRevenue += revenue;
    });

    dayData.totalTransactions = totalTransactions;
    dayData.totalRevenue = totalRevenue;

    history.push(dayData);
  }

  return history;
};

export const generateScheduledReports = () => [
  {
    id: 'report-1',
    name: 'Monthly Client Summary',
    type: 'Client Summary',
    frequency: 'Monthly',
    dayOfMonth: 1,
    recipients: ['finance@icp.ae', 'management@icp.ae'],
    lastSent: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'report-2',
    name: 'Sector Performance Report',
    type: 'Sector Summary',
    frequency: 'Monthly',
    dayOfMonth: 5,
    recipients: ['analytics@icp.ae'],
    lastSent: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'report-3',
    name: 'Full Reconciliation Report',
    type: 'Full Reconciliation',
    frequency: 'Monthly',
    dayOfMonth: 15,
    recipients: ['finance@icp.ae', 'accounting@icp.ae', 'cfo@icp.ae'],
    lastSent: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'inactive'
  }
];

export const CLIENTS = generateClients();
export const MONTHLY_REVENUE = generateMonthlyRevenue();
export const SECTOR_DATA = generateSectorData();
export const MODULE_DISTRIBUTION = generateModuleDistribution();
export const SCHEDULED_REPORTS = generateScheduledReports();

// Summary calculations
export const getDashboardSummary = () => {
  const totalRevenue = CLIENTS.reduce((sum, c) => sum + c.revenue, 0);
  const totalTransactions = CLIENTS.reduce((sum, c) => sum + c.totalTransactions, 0);
  const activeClients = CLIENTS.filter(c => c.status === 'active').length;
  const inactiveClients = CLIENTS.filter(c => c.status === 'inactive').length;

  return {
    totalRevenue,
    totalTransactions,
    activeClients,
    inactiveClients,
    totalClients: CLIENTS.length,
    avgRevenuePerClient: Math.round(totalRevenue / activeClients),
    revenuePerTransaction: Math.round((totalRevenue / totalTransactions) * 100) / 100,
    previousPeriodRevenue: totalRevenue * 0.92,
    previousPeriodTransactions: totalTransactions * 0.88
  };
};

// Get top clients by revenue
export const getTopClients = (limit = 5) => {
  return [...CLIENTS]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
    .map((client, index) => ({
      ...client,
      rank: index + 1
    }));
};

// Get module revenue breakdown (aggregate across all clients)
export const getModuleRevenueBreakdown = () => {
  const moduleData = {
    onboarding: { transactions: 0, revenue: 0 },
    rekyc: { transactions: 0, revenue: 0 },
    authorise: { transactions: 0, revenue: 0 }
  };

  // Aggregate from all clients
  CLIENTS.forEach(client => {
    const clientModules = generateClientModuleData(client.id);
    clientModules.forEach(mod => {
      if (moduleData[mod.module]) {
        moduleData[mod.module].transactions += mod.transactionCount;
        moduleData[mod.module].revenue += mod.revenue;
      }
    });
  });

  const totalRevenue = Object.values(moduleData).reduce((sum, m) => sum + m.revenue, 0);

  return Object.entries(moduleData).map(([module, data]) => ({
    module,
    displayName: module.charAt(0).toUpperCase() + module.slice(1),
    transactions: data.transactions,
    revenue: data.revenue,
    percentage: ((data.revenue / totalRevenue) * 100).toFixed(1)
  }));
};

// Get client status breakdown
export const getClientStatusBreakdown = () => {
  const active = CLIENTS.filter(c => c.status === 'active').length;
  const inactive = CLIENTS.filter(c => c.status === 'inactive').length;
  const total = CLIENTS.length;

  return [
    { status: 'Active', count: active, percentage: ((active / total) * 100).toFixed(1), color: '#16A34A' },
    { status: 'Inactive', count: inactive, percentage: ((inactive / total) * 100).toFixed(1), color: '#DC2626' }
  ];
};

// Get client growth over months
export const getClientGrowthData = () => {
  return MONTHS.map((m, index) => {
    // Simulate client growth - starts from 5 clients and grows
    const cumulativeClients = 5 + Math.floor(index * 1.5) + generateRandomNumber(0, 2);
    const newClients = index === 0 ? 5 : generateRandomNumber(1, 3);

    return {
      month: m.month,
      totalClients: Math.min(cumulativeClients, CLIENTS.length),
      newClients
    };
  });
};

// Get weekly transaction volume (last 12 weeks)
export const getWeeklyTransactionVolume = () => {
  const weeks = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i * 7));

    weeks.push({
      week: `W${12 - i}`,
      weekLabel: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      transactions: generateRandomNumber(8000, 15000),
      revenue: generateRandomNumber(60000, 120000)
    });
  }

  return weeks;
};

// Get month-over-month comparison
export const getMonthComparison = () => {
  const currentMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1];
  const previousMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 2];

  const revenueChange = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const transactionChange = ((currentMonth.transactions - previousMonth.transactions) / previousMonth.transactions * 100).toFixed(1);

  return {
    currentMonth: currentMonth.month,
    previousMonth: previousMonth.month,
    currentRevenue: currentMonth.revenue,
    previousRevenue: previousMonth.revenue,
    currentTransactions: currentMonth.transactions,
    previousTransactions: previousMonth.transactions,
    revenueChange: parseFloat(revenueChange),
    transactionChange: parseFloat(transactionChange)
  };
};

// Generate daily transaction data for a specific month (for charts)
export const generateDailyDataForMonth = (monthStr) => {
  // Parse month string like "Jan 2025" to get year and month
  const [monthName, year] = monthStr.split(' ');
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
  const yearNum = parseInt(year);

  // Get number of days in the month
  const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
  const numDays = Math.min(daysInMonth, 30); // Show up to 30 days

  const dailyData = [];

  for (let day = 1; day <= numDays; day++) {
    const onboardingTxn = generateRandomNumber(50, 300);
    const rekycTxn = generateRandomNumber(30, 200);
    const authoriseTxn = generateRandomNumber(20, 150);

    dailyData.push({
      day: day.toString(),
      date: `${day} ${monthName}`,
      onboarding: onboardingTxn,
      rekyc: rekycTxn,
      authorise: authoriseTxn,
      onboardingRevenue: onboardingTxn * generateRandomNumber(5, 12),
      rekycRevenue: rekycTxn * generateRandomNumber(4, 10),
      authoriseRevenue: authoriseTxn * generateRandomNumber(3, 8),
      totalRevenue: (onboardingTxn * 8) + (rekycTxn * 6) + (authoriseTxn * 5)
    });
  }

  return dailyData;
};