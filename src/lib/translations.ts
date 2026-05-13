export const translations = {
  ko: {
    // General
    dashboard: "대시보드",
    companies: "기업 관리",
    reports: "리포트",
    settings: "설정",
    logout: "로그아웃",

    // Dashboard Page
    dashboardTitle: "탄소 배출량 대시보드",
    dashboardDesc: "기업의 탄소 발자국을 모니터링하고 분석합니다.",
    companySelect: "기업 선택",
    allCompanies: "기업 전체",
    loadingData: "데이터를 불러오는 중...",
    errorTitle: "오류 발생",
    retry: "다시 시도",

    // Summary Cards
    summaryTotal: "당월 총 배출량",
    summaryGrowth: "전월 대비 증감률",
    summaryMaxScope: "최대 배출 Scope",
    summaryCumulative: "누적 총 배출량",
    currentMonthDesc: "이번 달 합산 배출량",
    vsLastMonth: "전월 대비",
    annualCumulative: "연간 누적 배출 통계",
    growthUp: "상승",
    growthDown: "하락",
    growthEqual: "동일",

    // Charts
    chartTrendTitle: "월별 탄소 배출량 추이",
    chartScopeTitle: "Scope별 배출 비중",
    unitEmission: "배출량 (tCO2eq)",

    // Settings
    settingsTitle: "설정",
    settingsDesc: "대시보드 환경 설정을 관리합니다.",
    langTitle: "언어 설정",
    langDesc: "대시보드에 표시될 언어를 선택하세요.",
    currencyTitle: "표시 통화 (준비 중)",
    currencyDesc: "탄소 비용 계산에 사용될 통화를 선택합니다.",
    comingSoon: "이 기능은 향후 업데이트에서 제공될 예정입니다.",
  },
  en: {
    // General
    dashboard: "Dashboard",
    companies: "Companies",
    reports: "Reports",
    settings: "Settings",
    logout: "Logout",

    // Dashboard Page
    dashboardTitle: "Carbon Emissions Dashboard",
    dashboardDesc: "Monitor and analyze your corporate carbon footprint.",
    companySelect: "Select Company",
    allCompanies: "All Companies",
    loadingData: "Loading data...",
    errorTitle: "Error Occurred",
    retry: "Retry",

    // Summary Cards
    summaryTotal: "Monthly Emissions",
    summaryGrowth: "Month-over-Month",
    summaryMaxScope: "Highest Scope",
    summaryCumulative: "Total Cumulative",
    currentMonthDesc: "Total for current month",
    vsLastMonth: "vs previous month",
    annualCumulative: "Annual cumulative stats",
    growthUp: "Increase",
    growthDown: "Decrease",
    growthEqual: "No Change",

    // Charts
    chartTrendTitle: "Monthly Emission Trends",
    chartScopeTitle: "Emissions by Scope",
    unitEmission: "Emissions (tCO2eq)",

    // Settings
    settingsTitle: "Settings",
    settingsDesc: "Manage your dashboard preferences.",
    langTitle: "Language Settings",
    langDesc: "Choose your preferred language.",
    currencyTitle: "Currency (Coming Soon)",
    currencyDesc: "Select the currency for carbon cost calculation.",
    comingSoon: "This feature will be available in a future update.",
  }
};

export type Language = keyof typeof translations;
export type TranslationKeys = keyof typeof translations['ko'];
