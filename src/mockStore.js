// Local Storage Mock Database for Tamar Pump Fuel Rationing System

const STORAGE_KEYS = {
  VEHICLES: 'pump_vehicles_db',
  TRANSACTIONS: 'pump_transactions_db',
};

// Default seed data for initial setup or testing
const SEED_VEHICLES = [
  {
    id: 'veh-1',
    owner_name: 'মো. রফিকুল ইসলাম',
    license_number: 'DL-BD-1092837',
    vehicle_number: 'ঢাকা মেট্রো হ ১১-২২৩৩',
    vehicle_type: 'bike',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'veh-2',
    owner_name: 'তানভীর আহমেদ',
    license_number: 'DL-BD-5544332',
    vehicle_number: 'ঢাকা মেট্রো গ ৮৮-৯৯০০',
    vehicle_type: 'car',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'veh-3',
    owner_name: 'কামাল হোসেন',
    license_number: 'DL-BD-7711223',
    vehicle_number: 'ঢাকা মেট্রো ল ৪৫-৬৭৮৯',
    vehicle_type: 'bike',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'veh-4',
    owner_name: 'সালমা খাতুন',
    license_number: 'DL-BD-9988776',
    vehicle_number: 'ঢাকা মেট্রো চ ৩৩-৪৪৫৫',
    vehicle_type: 'car',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const SEED_TRANSACTIONS = [
  {
    id: 'tx-101',
    vehicle_number: 'ঢাকা মেট্রো হ ১১-২২৩৩',
    license_number: 'DL-BD-1092837',
    owner_name: 'মো. রফিকুল ইসলাম',
    vehicle_type: 'bike',
    fuel_amount: 5,
    cooldown_days: 5,
    transaction_date: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    next_allowed_date: new Date(Date.now() + 3 * 86400000).toISOString(), // 3 days remaining (BLOCKED)
    attendant_name: 'আকবর আলী',
  },
  {
    id: 'tx-102',
    vehicle_number: 'ঢাকা মেট্রো গ ৮৮-৯৯০০',
    license_number: 'DL-BD-5544332',
    owner_name: 'তানভীর আহমেদ',
    vehicle_type: 'car',
    fuel_amount: 15,
    cooldown_days: 12,
    transaction_date: new Date(Date.now() - 14 * 86400000).toISOString(), // 14 days ago
    next_allowed_date: new Date(Date.now() - 2 * 86400000).toISOString(), // Expired (ELIGIBLE)
    attendant_name: 'জামাল উদ্দিন',
  },
  {
    id: 'tx-103',
    vehicle_number: 'ঢাকা মেট্রো ল ৪৫-৬৭৮৯',
    license_number: 'DL-BD-7711223',
    owner_name: 'কামাল হোসেন',
    vehicle_type: 'bike',
    fuel_amount: 3,
    cooldown_days: 3,
    transaction_date: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
    next_allowed_date: new Date(Date.now() + 2 * 86400000).toISOString(), // 2 days remaining (BLOCKED)
    attendant_name: 'আকবর আলী',
  },
];

export function getCooldownDays(liters) {
  const l = Number(liters);
  if (l >= 15) return 12;
  if (l >= 10) return 10;
  if (l >= 8)  return 7;
  if (l >= 5)  return 5;
  if (l >= 3)  return 3;
  return 2;
}

export function initLocalStorageDb() {
  if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(SEED_VEHICLES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
  }
}

export function resetToSeedData() {
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(SEED_VEHICLES));
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
}

export function getLocalVehicles() {
  initLocalStorageDb();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES)) || [];
  } catch {
    return SEED_VEHICLES;
  }
}

export function getLocalTransactions() {
  initLocalStorageDb();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [];
  } catch {
    return SEED_TRANSACTIONS;
  }
}

export function localRegisterVehicle(data) {
  const vehicles = getLocalVehicles();
  const vNum = (data.vehicle_number || '').trim().toUpperCase();
  const lNum = (data.license_number || '').trim().toUpperCase();

  // Check duplicate
  const existing = vehicles.find(
    v => v.vehicle_number.toUpperCase() === vNum || v.license_number.toUpperCase() === lNum
  );
  if (existing) {
    throw new Error('এই গাড়ির নম্বর বা লাইসেন্স দিয়ে ইতোমধ্যে একটি গাড়ি নিবন্ধিত আছে।');
  }

  const newVehicle = {
    id: `veh-${Date.now()}`,
    owner_name: data.owner_name.trim(),
    license_number: lNum,
    vehicle_number: vNum,
    vehicle_type: data.vehicle_type || 'bike',
    created_at: new Date().toISOString(),
  };

  vehicles.unshift(newVehicle);
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  return { success: true, vehicle: newVehicle };
}

export function localCheckEligibility({ vehicle_number, license_number }) {
  const vehicles = getLocalVehicles();
  const txs = getLocalTransactions();

  const vNorm = (vehicle_number || '').trim().toUpperCase();
  const lNorm = (license_number || '').trim().toUpperCase();

  const vehicle = vehicles.find(v => {
    if (vNorm && v.vehicle_number.toUpperCase() === vNorm) return true;
    if (lNorm && v.license_number.toUpperCase() === lNorm) return true;
    return false;
  });

  if (!vehicle) {
    throw new Error('কোনো নিবন্ধিত গাড়ি পাওয়া যায়নি। অনুগ্রহ করে প্রথমে রেজিস্ট্রেশন করুন।');
  }

  // Find latest transaction for this vehicle or license
  const relatedTxs = txs.filter(
    t =>
      t.vehicle_number.toUpperCase() === vehicle.vehicle_number.toUpperCase() ||
      t.license_number.toUpperCase() === vehicle.license_number.toUpperCase()
  );

  let lastTx = null;
  if (relatedTxs.length > 0) {
    relatedTxs.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
    lastTx = relatedTxs[0];
  }

  const now = new Date();
  let eligible = true;
  let nextAllowedDate = null;

  if (lastTx && lastTx.next_allowed_date) {
    const nextDate = new Date(lastTx.next_allowed_date);
    if (nextDate > now) {
      eligible = false;
      nextAllowedDate = lastTx.next_allowed_date;
    }
  }

  return {
    eligible,
    vehicle,
    next_allowed_date: nextAllowedDate,
    last_transaction: lastTx,
  };
}

export function localRecordPurchase({ vehicle_number, license_number, fuel_amount, attendant_name }) {
  const liters = Number(fuel_amount);
  if (!liters || liters <= 0) {
    throw new Error('সঠিক পরিমাণে তেলের পরিমাণ প্রদান করুন।');
  }

  // Check eligibility first
  const eligibility = localCheckEligibility({ vehicle_number, license_number });
  if (!eligibility.eligible) {
    throw new Error('এই গাড়িটি বর্তমানে ব্লক আছে। পরবর্তী অনুমোদিত তারিখের আগে তেল দেওয়া সম্ভব নয়।');
  }

  const cooldownDays = getCooldownDays(liters);
  const now = new Date();
  const nextAllowed = new Date(now.getTime() + cooldownDays * 86400000).toISOString();

  const newTx = {
    id: `tx-${Date.now()}`,
    vehicle_number: eligibility.vehicle.vehicle_number,
    license_number: eligibility.vehicle.license_number,
    owner_name: eligibility.vehicle.owner_name,
    vehicle_type: eligibility.vehicle.vehicle_type,
    fuel_amount: liters,
    cooldown_days: cooldownDays,
    transaction_date: now.toISOString(),
    next_allowed_date: nextAllowed,
    attendant_name: attendant_name || 'পাম্প কর্মী',
  };

  const txs = getLocalTransactions();
  txs.unshift(newTx);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));

  return {
    success: true,
    message: 'তেল বিক্রির তথ্য সফলভাবে সংরক্ষিত হয়েছে।',
    transaction: newTx,
    cooldown_days: cooldownDays,
    next_allowed_date: nextAllowed,
  };
}

export function localGetStats() {
  const vehicles = getLocalVehicles();
  const txs = getLocalTransactions();

  const now = new Date();
  const todayDateStr = now.toISOString().slice(0, 10);

  let totalFuel = 0;
  let todayTx = 0;

  txs.forEach(t => {
    totalFuel += Number(t.fuel_amount || 0);
    if (t.transaction_date && t.transaction_date.slice(0, 10) === todayDateStr) {
      todayTx += 1;
    }
  });

  // Calculate distinct blocked vehicles right now
  const blockedVehicles = new Set();
  txs.forEach(t => {
    if (t.next_allowed_date && new Date(t.next_allowed_date) > now) {
      blockedVehicles.add(t.vehicle_number.toUpperCase());
    }
  });

  return {
    totalVehicles: vehicles.length,
    totalTransactions: txs.length,
    totalFuel: Math.round(totalFuel * 10) / 10,
    todayTx,
    blockedVehicles: blockedVehicles.size,
  };
}
