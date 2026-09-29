import React, { createContext, useContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const translations = {
  bn: {
    // Brand & System
    brandName: 'তামার পাম্প',
    brandSub: 'ফুয়েল রেশনিং সিস্টেম',
    allRightsReserved: 'তামার পাম্প © সর্বস্বত্ব সংরক্ষিত',
    liveDb: 'ডাটাবেজ সক্রিয়',
    localDb: 'লোকাল স্টোরেজ মোড',

    // Sections
    secMain: 'প্রধান',
    secFuel: 'জ্বালানি',
    secManage: 'ব্যবস্থাপনা',

    // Nav
    navDashboard: 'ড্যাশবোর্ড',
    navCheck: 'যোগ্যতা যাচাই',
    navSell: 'তেল বিক্রি',
    navRegister: 'গাড়ি রেজিস্ট্রেশন',
    navVehicles: 'গাড়ির তালিকা',
    navHistory: 'লেনদেন ইতিহাস',

    // Page titles & subtitles
    pageDashboardTitle: 'ড্যাশবোর্ড',
    pageDashboardSub: 'সামগ্রিক চিত্র ও পরিসংখ্যান',
    pageCheckTitle: 'যোগ্যতা যাচাই',
    pageCheckSub: 'তেল নেওয়ার অনুমতি ও অপেক্ষার সময় পরীক্ষা',
    pageSellTitle: 'তেল বিক্রি করুন',
    pageSellSub: 'গাড়ি যাচাই করে জ্বালানি বিতরণ রেকর্ড করুন',
    pageRegisterTitle: 'গাড়ি রেজিস্ট্রেশন',
    pageRegisterSub: 'নতুন গাড়ি সিস্টেমে যুক্ত করুন',
    pageVehiclesTitle: 'গাড়ির তালিকা',
    pageVehiclesSub: 'নিবন্ধিত সকল গাড়ির তথ্য',
    pageHistoryTitle: 'লেনদেন ইতিহাস',
    pageHistorySub: 'সকল জ্বালানি ক্রয়ের পূর্ণাঙ্গ রেকর্ড',

    // Dashboard
    welcome: 'সুস্বাগতম 👋',
    welcomeSub: 'তামার পাম্পের জ্বালানি বিতরণ ও রেশনিং ব্যবস্থাপনার কেন্দ্রীয় ড্যাশবোর্ড',
    btnSellFuel: '⛽ তেল বিক্রি করুন',
    statTotalVehicles: 'মোট রেজিস্টার্ড গাড়ি',
    statTotalTransactions: 'মোট লেনদেন',
    statTotalFuel: 'মোট তেল বিক্রি (লিটার)',
    statTodayTx: 'আজকের লেনদেন',
    statBlockedVehicles: 'বর্তমানে অপেক্ষমাণ গাড়ি',
    quickActions: '⚡ দ্রুত অ্যাকশন',
    cooldownTitle: '⏱️ তেল কেনার পর অপেক্ষার নিয়মমালা',
    cooldownSub: 'তেলের পরিমাণের ওপর ভিত্তি করে পরবর্তী ক্রয়ের জন্য নির্ধারিত অপেক্ষার সময়',
    waitDays: 'দিন অপেক্ষা',
    systemIntroTitle: 'ℹ️ সিস্টেম পরিচিতি ও নিয়ম',
    systemIntroDesc: 'এই সিস্টেমটি তামার পাম্পে জ্বালানি রেশনিং নিশ্চিত করে। প্রতিটি গাড়িকে প্রথমে গাড়ির নম্বর ও ড্রাইভিং লাইসেন্স দিয়ে রেজিস্ট্রেশন করতে হবে। তেল কেনার পর নির্ধারিত দিন পার না হলে একই গাড়ি বা লাইসেন্স দিয়ে পুনরায় তেল কেনা যাবে না।',
    demoNotice: 'ডেমো ডেটা সক্রিয় আছে। নতুন গাড়ি নিবন্ধন ও তেল বিক্রির তথ্য স্বয়ংক্রিয়ভাবে সেভ থাকবে।',
    resetDemoData: 'ডেমো ডেটা রিসেট করুন',

    // Cooldown Rules table
    fuelRange1: '১–২ লিটার',
    fuelRange2: '৩–৪ লিটার',
    fuelRange3: '৫–৭ লিটার',
    fuelRange4: '৮–৯ লিটার',
    fuelRange5: '১০–১৪ লিটার',
    fuelRange6: '১৫+ লিটার',

    // Eligibility Check Page
    searchCardTitle: '🔎 গাড়ি অনুসন্ধান করুন',
    vehicleNumberLabel: 'গাড়ির নম্বর',
    vehicleNumberPlaceholder: 'যেমন: ঢাকা মেট্রো হ ১২-৩৪৫৬',
    licenseNumberLabel: 'ড্রাইভিং লাইসেন্স নম্বর',
    licenseNumberPlaceholder: 'যেমন: DL-1234567890',
    orDivider: '— অথবা —',
    btnCheckNow: '🔍 যোগ্যতা পরীক্ষা করুন',
    checking: 'যাচাই হচ্ছে...',
    inputRequiredErr: 'গাড়ির নম্বর অথবা ড্রাইভিং লাইসেন্স নম্বর প্রদান করুন।',
    vehicleDetails: '🚗 গাড়ির বিস্তারিত তথ্য',
    ownerName: 'মালিকের নাম',
    vehicleNumber: 'গাড়ির নম্বর',
    licenseNumber: 'লাইসেন্স নম্বর',
    vehicleType: 'গাড়ির ধরন',
    bike: 'বাইক / মোটরসাইকেল',
    car: 'কার / প্রাইভেট কার',
    eligibleBanner: '✅ এই গাড়িটি এখন তেল নিতে পারবে। কোনো বিধিনিষেধ নেই।',
    blockedBanner: '❌ এই গাড়িটি বর্তমানে ব্লক অবস্থায় আছে। নির্ধারিত সময়ের পূর্বে তেল দেওয়া যাবে না।',
    remainingWaitTime: 'অবশিষ্ট অপেক্ষার সময়',
    daysRemaining: 'দিন বাকি',
    nextAllowedDate: 'পরবর্তী আসার অনুমতি তারিখ',
    lastPurchased: 'সর্বশেষ তেল নেওয়া হয়েছে',
    liters: 'লিটার',
    quickFillSample: 'নমুনা গাড়ি দিয়ে পরীক্ষা করুন',

    // Sell Page
    step1: 'গাড়ি যাচাই',
    step2: 'তেলের পরিমাণ',
    step3: 'সম্পন্ন ও রিসিপ্ট',
    step1Title: 'ধাপ ১ — গাড়ি শনাক্ত করুন',
    step2Title: 'ধাপ ২ — তেলের পরিমাণ ও কর্মীর তথ্য',
    step3Title: 'তেল বিক্রি সফল হয়েছে!',
    verifyAndNext: '✅ যাচাই করুন ও পরের ধাপে যান',
    back: '← পেছনে',
    confirmSale: '⛽ তেল বিক্রি নিশ্চিত করুন',
    processing: 'প্রসেসিং হচ্ছে...',
    verifiedVehicle: '✅ শনাক্তকৃত গাড়ি',
    fuelAmountLabel: 'তেলের পরিমাণ (লিটার)',
    fuelAmountPlaceholder: 'যেমন: 10',
    quickPresets: 'দ্রুত পরিমাণ নির্বাচন:',
    fuelPreviewText: 'লিটার তেল কিনলে গাড়িটি পরবর্তী',
    fuelPreviewSub: 'দিন পর পুনরায় তেল নিতে পারবে।',
    attendantLabel: 'পাম্প কর্মীর নাম / আইডি',
    attendantPlaceholder: 'ঐচ্ছিক (যেমন: রহিম আহমেদ)',
    receiptTitle: 'জ্বালানি ক্রয়ের রসিদ',
    cooldownPeriod: 'অপেক্ষার সময়কাল',
    receiptPrint: '🖨️ রসিদ প্রিন্ট করুন',
    newSaleBtn: '➕ নতুন গাড়ির জন্য তেল বিক্রি করুন',
    saleSuccessMsg: 'তেল বিক্রির তথ্য সফলভাবে ডাটাবেজে সংরক্ষণ করা হয়েছে।',
    blockedAlertSell: 'এই গাড়িটি বর্তমানে ব্লক আছে। আরও {days} দিন পর তেল নিতে পারবে।',
    fuelAmountErr: 'সঠিক পরিমাণে তেলের পরিমাণ প্রদান করুন (সর্বনিম্ন ০.৫ লিটার)।',

    // Register Page
    registerHeaderTitle: '📝 নতুন গাড়ি রেজিস্ট্রেশন',
    registerHeaderSub: 'সিস্টেমে নতুন বাইক বা কার যুক্ত করুন। একবার রেজিস্ট্রেশনের পর তেল বিক্রি করা যাবে।',
    registerFormTitle: '📋 গাড়ির তথ্যাবলী পূরণ করুন',
    ownerNamePlaceholder: 'যেমন: মো. আব্দুল করিম',
    registerBtn: '✅ গাড়ি রেজিস্ট্রেশন করুন',
    registering: 'রেজিস্ট্রেশন হচ্ছে...',
    ownerNameReq: 'মালিকের নাম আবশ্যক।',
    licenseReq: 'ড্রাইভিং লাইসেন্স নম্বর আবশ্যক।',
    vehicleNumReq: 'গাড়ির নম্বর আবশ্যক।',
    duplicateWarn: '⚠️ একই গাড়ির নম্বর বা লাইসেন্স দিয়ে দ্বিতীয়বার রেজিস্ট্রেশন করা যাবে না। সকল তথ্য সতর্কতার সাথে যাচাই করুন।',
    regSuccessTitle: 'রেজিস্ট্রেশন সফল হয়েছে!',
    regSuccessSub: 'এর গাড়িটি সফলভাবে ডাটাবেজে অন্তর্ভুক্ত হয়েছে।',
    registerAnother: '➕ আরেকটি গাড়ি রেজিস্ট্রেশন করুন',
    goToSell: '⛽ এখনই তেল বিক্রি করুন',

    // Vehicles Page
    vehiclesTitle: '🚗 নিবন্ধিত গাড়ির তালিকা',
    vehiclesSub: 'সিস্টেমে মোট {count}টি গাড়ি নিবন্ধিত রয়েছে',
    vehiclesCount: '{count}টি গাড়ি',
    searchVehiclesPlaceholder: 'গাড়ি নম্বর, লাইসেন্স বা মালিকের নাম লিখে খুঁজুন...',
    allVehicles: 'সব গাড়ি',
    filterBike: '🏍️ বাইক',
    filterCar: '🚗 কার',
    noVehiclesFound: 'কোনো গাড়ি খুঁজে পাওয়া যায়নি।',
    thIndex: '#',
    thOwner: 'মালিকের নাম',
    thVehicleNo: 'গাড়ির নম্বর',
    thLicense: 'লাইসেন্স নম্বর',
    thType: 'ধরন',
    thRegDate: 'নিবন্ধনের তারিখ',
    thStatus: 'বর্তমান অবস্থা',
    showingResults: '{count}টি ফলাফল প্রদর্শিত হচ্ছে',
    statusEligible: '✅ মুক্ত / যোগ্য',
    statusBlocked: '🚫 ব্লক',
    exportCsv: '📥 CSV এক্সপোর্ট',

    // History Page
    historyTitle: '📋 জ্বালানি বিক্রির লেনদেন ইতিহাস',
    historySub: 'সর্বশেষ তেল বিক্রির রেকর্ড ও রিয়েলটাইম অবস্থা',
    totalTxs: 'মোট: {count}',
    blockedTxs: 'ব্লক: {count}',
    freeTxs: 'মুক্ত: {count}',
    searchHistoryPlaceholder: 'গাড়ির নম্বর, লাইসেন্স বা কর্মীর নাম দিয়ে খুঁজুন...',
    tabAll: 'সব লেনদেন',
    tabBlocked: '🚫 অপেক্ষমাণ (ব্লক)',
    tabFree: '✅ যোগ্য (মুক্ত)',
    noHistoryFound: 'কোনো লেনদেন রেকর্ড পাওয়া যায়নি।',
    thLiters: 'লিটার',
    thWait: 'অপেক্ষা',
    thNextAllowed: 'পরবর্তী তারিখ',
    thTxDate: 'বিক্রির সময়',
    printReport: '🖨️ রিপোর্ট প্রিন্ট',

    // General
    loading: 'লোড হচ্ছে...',
    close: 'বন্ধ করুন',
    daysUnit: 'দিন',
    datePlaceholder: '—',
  },

  en: {
    // Brand & System
    brandName: 'Tamar Pump',
    brandSub: 'Fuel Rationing System',
    allRightsReserved: 'Tamar Pump © All Rights Reserved',
    liveDb: 'Database Live',
    localDb: 'Local Storage Mode',

    // Sections
    secMain: 'Main',
    secFuel: 'Fuel Service',
    secManage: 'Management',

    // Nav
    navDashboard: 'Dashboard',
    navCheck: 'Eligibility Check',
    navSell: 'Sell Fuel',
    navRegister: 'Register Vehicle',
    navVehicles: 'Vehicles List',
    navHistory: 'Transaction History',

    // Page titles & subtitles
    pageDashboardTitle: 'Dashboard',
    pageDashboardSub: 'Overview & Fuel Rationing Statistics',
    pageCheckTitle: 'Eligibility Check',
    pageCheckSub: 'Verify Fuel Purchase Permission & Cooldown Period',
    pageSellTitle: 'Sell Fuel',
    pageSellSub: 'Verify Vehicle and Record Fuel Dispensing',
    pageRegisterTitle: 'Register Vehicle',
    pageRegisterSub: 'Add a New Vehicle to the Rationing System',
    pageVehiclesTitle: 'Registered Vehicles',
    pageVehiclesSub: 'Complete List of Registered Vehicles',
    pageHistoryTitle: 'Transaction History',
    pageHistorySub: 'Complete Audit Log of Fuel Purchases',

    // Dashboard
    welcome: 'Welcome 👋',
    welcomeSub: 'Central Dashboard for Fuel Rationing & Distribution Management at Tamar Pump',
    btnSellFuel: '⛽ Sell Fuel Now',
    statTotalVehicles: 'Total Registered Vehicles',
    statTotalTransactions: 'Total Transactions',
    statTotalFuel: 'Total Fuel Sold (Liters)',
    statTodayTx: "Today's Transactions",
    statBlockedVehicles: 'Currently Blocked Vehicles',
    quickActions: '⚡ Quick Actions',
    cooldownTitle: '⏱️ Fuel Purchase Waiting Rules',
    cooldownSub: 'Mandatory waiting period (cooldown) based on fuel quantity purchased',
    waitDays: 'Days Wait',
    systemIntroTitle: 'ℹ️ System Overview & Rules',
    systemIntroDesc: 'This system enforces fair fuel rationing at Tamar Pump. Every vehicle must first be registered with its Vehicle Number and Driving License. Once fuel is purchased, the vehicle and license are temporarily blocked from repeat purchases until the required cooldown days have elapsed.',
    demoNotice: 'Demo storage active. All vehicle registrations and fuel sales will persist automatically in your browser.',
    resetDemoData: 'Reset Demo Data',

    // Cooldown Rules table
    fuelRange1: '1–2 Liters',
    fuelRange2: '3–4 Liters',
    fuelRange3: '5–7 Liters',
    fuelRange4: '8–9 Liters',
    fuelRange5: '10–14 Liters',
    fuelRange6: '15+ Liters',

    // Eligibility Check Page
    searchCardTitle: '🔎 Search Vehicle',
    vehicleNumberLabel: 'Vehicle Registration Number',
    vehicleNumberPlaceholder: 'e.g. DHAKA METRO HA 12-3456',
    licenseNumberLabel: 'Driving License Number',
    licenseNumberPlaceholder: 'e.g. DL-1234567890',
    orDivider: '— OR —',
    btnCheckNow: '🔍 Check Eligibility',
    checking: 'Checking status...',
    inputRequiredErr: 'Please provide either a Vehicle Number or Driving License Number.',
    vehicleDetails: '🚗 Vehicle Information',
    ownerName: 'Owner Name',
    vehicleNumber: 'Vehicle Number',
    licenseNumber: 'License Number',
    vehicleType: 'Vehicle Type',
    bike: 'Bike / Motorcycle',
    car: 'Car / Private Vehicle',
    eligibleBanner: '✅ This vehicle is eligible to purchase fuel now. No active restrictions.',
    blockedBanner: '❌ This vehicle is currently BLOCKED. Fuel cannot be dispensed until cooldown expires.',
    remainingWaitTime: 'Remaining Waiting Time',
    daysRemaining: 'days remaining',
    nextAllowedDate: 'Next Allowed Purchase Date',
    lastPurchased: 'Last Purchase',
    liters: 'Liters',
    quickFillSample: 'Try with a Sample Vehicle',

    // Sell Page
    step1: 'Verify Vehicle',
    step2: 'Fuel Amount',
    step3: 'Complete & Receipt',
    step1Title: 'Step 1 — Identify Vehicle',
    step2Title: 'Step 2 — Fuel Quantity & Attendant Info',
    step3Title: 'Fuel Sale Successful!',
    verifyAndNext: '✅ Verify & Proceed to Next Step',
    back: '← Back',
    confirmSale: '⛽ Confirm Fuel Sale',
    processing: 'Processing sale...',
    verifiedVehicle: '✅ Verified Vehicle',
    fuelAmountLabel: 'Fuel Quantity (Liters)',
    fuelAmountPlaceholder: 'e.g. 10',
    quickPresets: 'Quick Preset:',
    fuelPreviewText: 'Liters of fuel will require a mandatory',
    fuelPreviewSub: 'day cooldown period before the next allowed purchase.',
    attendantLabel: 'Pump Attendant Name / ID',
    attendantPlaceholder: 'Optional (e.g. Rahim Ahmed)',
    receiptTitle: 'Fuel Purchase Receipt',
    cooldownPeriod: 'Cooldown Period',
    receiptPrint: '🖨️ Print Receipt',
    newSaleBtn: '➕ Dispense to Another Vehicle',
    saleSuccessMsg: 'Fuel transaction has been recorded successfully in the database.',
    blockedAlertSell: 'This vehicle is currently blocked. It can return in {days} days.',
    fuelAmountErr: 'Please enter a valid fuel quantity (minimum 0.5 Liters).',

    // Register Page
    registerHeaderTitle: '📝 Vehicle Registration',
    registerHeaderSub: 'Register a new vehicle in the system. Unique vehicle number and driving license are required.',
    registerFormTitle: '📋 Fill in Vehicle Details',
    ownerNamePlaceholder: 'e.g. Md. Abdul Karim',
    registerBtn: '✅ Register Vehicle',
    registering: 'Registering...',
    ownerNameReq: 'Owner name is required.',
    licenseReq: 'Driving license number is required.',
    vehicleNumReq: 'Vehicle number is required.',
    duplicateWarn: '⚠️ Duplicate registration with the same Vehicle Number or License is prohibited. Please check data accuracy.',
    regSuccessTitle: 'Registration Successful!',
    regSuccessSub: 'has been successfully registered in the system.',
    registerAnother: '➕ Register Another Vehicle',
    goToSell: '⛽ Sell Fuel to This Vehicle',

    // Vehicles Page
    vehiclesTitle: '🚗 Registered Vehicles',
    vehiclesSub: 'Total {count} vehicles registered in the rationing database',
    vehiclesCount: '{count} Vehicles',
    searchVehiclesPlaceholder: 'Search by Vehicle No, License or Owner Name...',
    allVehicles: 'All Vehicles',
    filterBike: '🏍️ Bikes',
    filterCar: '🚗 Cars',
    noVehiclesFound: 'No registered vehicles found matching your criteria.',
    thIndex: '#',
    thOwner: 'Owner Name',
    thVehicleNo: 'Vehicle Number',
    thLicense: 'License Number',
    thType: 'Type',
    thRegDate: 'Registration Date',
    thStatus: 'Current Status',
    showingResults: 'Showing {count} results',
    statusEligible: '✅ Eligible',
    statusBlocked: '🚫 Blocked',
    exportCsv: '📥 Export CSV',

    // History Page
    historyTitle: '📋 Fuel Transaction History',
    historySub: 'Complete log of fuel dispensing and real-time cooldown tracking',
    totalTxs: 'Total: {count}',
    blockedTxs: 'Blocked: {count}',
    freeTxs: 'Free: {count}',
    searchHistoryPlaceholder: 'Search by vehicle, license, or attendant...',
    tabAll: 'All Transactions',
    tabBlocked: '🚫 Blocked (Cooldown)',
    tabFree: '✅ Free (Eligible)',
    noHistoryFound: 'No transaction records found.',
    thLiters: 'Liters',
    thWait: 'Cooldown',
    thNextAllowed: 'Next Date',
    thTxDate: 'Transaction Time',
    printReport: '🖨️ Print Report',

    // General
    loading: 'Loading data...',
    close: 'Close',
    daysUnit: 'days',
    datePlaceholder: '—',
  },
};

const BN_NUMS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function formatNumber(n, lang = 'bn') {
  if (n === null || n === undefined || isNaN(n)) return '—';
  if (lang === 'en') return String(n);
  return String(n).replace(/[0-9]/g, d => BN_NUMS[Number(d)] ?? d);
}

export function formatDateLocale(dateStr, lang = 'bn', withTime = false) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';

    if (lang === 'bn') {
      const options = withTime
        ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        : { year: 'numeric', month: 'long', day: 'numeric' };
      return d.toLocaleString('bn-BD', options);
    } else {
      const options = withTime
        ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        : { year: 'numeric', month: 'short', day: 'numeric' };
      return d.toLocaleDateString('en-US', options);
    }
  } catch {
    return dateStr;
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('pump_lang') || 'bn';
  });

  useEffect(() => {
    localStorage.setItem('pump_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = (key, params = {}) => {
    let text = translations[lang]?.[key] || translations['bn']?.[key] || key;
    Object.keys(params).forEach(p => {
      text = text.replace(`{${p}}`, params[p]);
    });
    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        t,
        formatNumber: n => formatNumber(n, lang),
        formatDate: (d, withTime) => formatDateLocale(d, lang, withTime),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
