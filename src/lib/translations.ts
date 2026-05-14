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
    summaryCarbonTax: "예상 탄소세",
    carbonTaxDesc: "배출량 기준 세금 추정치",
    currencyKrw: "원",

    // Charts
    chartTrendTitle: "월별 탄소 배출량 추이",
    chartScopeTitle: "Scope별 배출 비중",
    chartPcfTitle: "PCF 생애주기 분석 (시뮬레이션)",
    unitEmission: "배출량 (tCO2eq)",

    // Settings
    settingsTitle: "설정",
    settingsDesc: "대시보드 환경 설정을 관리합니다.",
    langTitle: "언어 설정",
    langDesc: "대시보드에 표시될 언어를 선택하세요.",
    currencyTitle: "표시 통화 (준비 중)",
    currencyDesc: "탄소 비용 계산에 사용될 통화를 선택합니다.",
    comingSoon: "이 기능은 향후 업데이트에서 제공될 예정입니다.",

    // Company Management
    companyManagementTitle: "기업 관리",
    companyManagementDesc: "등록된 기업 정보를 확인하고 수정합니다.",
    companyName: "기업명",
    country: "국가",
    actions: "관리",
    edit: "수정",
    save: "저장",
    cancel: "취소",
    updateSuccess: "기업 정보가 성공적으로 업데이트되었습니다.",
    updateError: "기업 정보 업데이트 중 오류가 발생했습니다.",
    
    // Emissions Management
    emissionsData: "배출량 데이터",
    basicInfo: "기본 정보",
    monthlyEmissions: "월별 배출 내역",
    month: "연월",
    source: "배출원",
    amount: "배출량 (tCO2eq)",
    scope: "스코프",
    addEntry: "내역 추가",
    delete: "삭제",
    noEmissions: "등록된 배출 내역이 없습니다.",
    manageEmissions: "배출 내역 관리",
    pcfStages: {
      rawMaterial: "원재료",
      manufacturing: "제조",
      distribution: "유통",
      use: "사용",
      disposal: "폐기",
    },
    aiInsightTitle: "AI 탄소 관리 인사이트",
    aiInsightLoading: "AI가 전문가 의견을 분석 중입니다...",
    aiInsightError: "인사이트를 가져오는 중 오류가 발생했습니다.",
    aiInsightExpertName: "HanaLoop AI 환경 컨설턴트",
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
    summaryCarbonTax: "Estimated Carbon Tax",
    carbonTaxDesc: "Estimated tax based on emissions",
    currencyKrw: "KRW",

    // Charts
    chartTrendTitle: "Monthly Emission Trends",
    chartScopeTitle: "Emissions by Scope",
    chartPcfTitle: "PCF Lifecycle Analysis (Simulated)",
    unitEmission: "Emissions (tCO2eq)",

    // Settings
    settingsTitle: "Settings",
    settingsDesc: "Manage your dashboard preferences.",
    langTitle: "Language Settings",
    langDesc: "Choose your preferred language.",
    currencyTitle: "Currency (Coming Soon)",
    currencyDesc: "Select the currency for carbon cost calculation.",
    comingSoon: "This feature will be available in a future update.",

    // Company Management
    companyManagementTitle: "Company Management",
    companyManagementDesc: "View and edit registered company information.",
    companyName: "Company Name",
    country: "Country",
    actions: "Actions",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    updateSuccess: "Company information updated successfully.",
    updateError: "An error occurred while updating company information.",

    // Emissions Management
    emissionsData: "Emissions Data",
    basicInfo: "Basic Info",
    monthlyEmissions: "Monthly Emissions",
    month: "Month",
    source: "Source",
    amount: "Amount (tCO2eq)",
    scope: "Scope",
    addEntry: "Add Entry",
    delete: "Delete",
    noEmissions: "No emission entries found.",
    manageEmissions: "Manage Emissions",
    pcfStages: {
      rawMaterial: "Raw Material",
      manufacturing: "Manufacturing",
      distribution: "Distribution",
      use: "Use",
      disposal: "Disposal",
    },
    aiInsightTitle: "AI Carbon Insights",
    aiInsightLoading: "AI is analyzing expert opinions...",
    aiInsightError: "An error occurred while fetching insights.",
    aiInsightExpertName: "HanaLoop AI Sustainability Consultant",
  }
};

export type Language = keyof typeof translations;
export type TranslationKeys = keyof typeof translations['ko'];
