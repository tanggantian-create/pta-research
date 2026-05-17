export interface CompanyData {
  company_id: string
  year: number
  revenue: number
  revenueYoY: number
  netProfit: number
  netProfitYoY: string
  grossMargin: number
  netMargin: number
  roe: number
  debtRatio: number
  operatingCF: number
  operatingCFYoY: number
  totalAssets?: number
  equity?: number
  ptaCapacity: number
}

export interface CompanyInfo {
  id: string
  nameCn: string
  name: string
  code: string
  market: string
  rank: number
}

export interface InternationalCompany {
  id: string
  name: string
  country: string
  ptaCapacity: number
  revenueB: number
  revenueYoY: number
  netProfitB: number
  ebitdaMargin: number
  roe: number
  note: string
}

export interface CostData {
  region: string
  costLow: number
  costHigh: number
}

export interface EstimationData {
  company_id: string
  company: string
  code: string
  year: number
  netProfit: number
  pe: number
  peNext: number
  rating: string
}

export interface ElasticityData {
  company: string
  profitIncrement: number
  elasticity: number
}

export interface InvestmentTheme {
  title: string
  stars: number
  summary: string
  detail: string
}

export const internationalCompanies: InternationalCompany[] = [
  {
    id: 'indorama',
    name: 'Indorama Ventures',
    country: '泰国',
    ptaCapacity: 1000,
    revenueB: 12.8,
    revenueYoY: -17,
    netProfitB: -0.21,
    ebitdaMargin: 7.2,
    roe: -5.7,
    note: '海外最大PTA生产商，PX自给率<30%',
  },
  {
    id: 'alpek',
    name: 'Alpek',
    country: '墨西哥',
    ptaCapacity: 500,
    revenueB: 6.6,
    revenueYoY: -13,
    netProfitB: -0.15,
    ebitdaMargin: 7.4,
    roe: -10,
    note: '美洲最大PET/PTA生产商，杠杆4.4x',
  },
  {
    id: 'lotte',
    name: 'Lotte Chemical',
    country: '韩国',
    ptaCapacity: 300,
    revenueB: 13.5,
    revenueYoY: -7.1,
    netProfitB: -1.49,
    ebitdaMargin: 1.57,
    roe: -15,
    note: '韩国主力石化企业，装置老化成本偏高',
  },
  {
    id: 'reliance',
    name: 'Reliance Industries (O2C)',
    country: '印度',
    ptaCapacity: 500,
    revenueB: 72.9,
    revenueYoY: -5,
    netProfitB: 0,
    ebitdaMargin: 8.8,
    roe: 0,
    note: '印度最大石化企业，O2C板块EBITDA利润率8.8%',
  },
]

export const elasticityData: ElasticityData[] = [
  { company: '桐昆股份', profitIncrement: 29.7, elasticity: 107 },
  { company: '恒逸石化', profitIncrement: 18.2, elasticity: 224 },
  { company: '新凤鸣', profitIncrement: 22.1, elasticity: 123 },
  { company: '荣盛石化', profitIncrement: 10.6, elasticity: 15 },
  { company: '恒力石化', profitIncrement: 17.1, elasticity: 6 },
  { company: '东方盛虹', profitIncrement: 11.2, elasticity: 301 },
]

export const investmentThemes: InvestmentTheme[] = [
  {
    title: '供给收缩 × 反内卷 — 行业拐点',
    stars: 5,
    summary: '2019-2025扩产周期终结，2026年首次全年无新增产能',
    detail: '工信部2025年10月召开PTA反内卷座谈会，头部企业达成联合减产共识超1000万吨。社会库存已去化约190万吨，行业从严重过剩走向紧平衡。华泰证券："扩产周期结束，PTA行业拐点渐显"。',
  },
  {
    title: '盈利从历史极低点修复',
    stars: 4,
    summary: 'PTA加工费从73元/吨历史低点回升至362元/吨',
    detail: 'PTA行业盈利低迷已持续13年。2025年10月加工费一度跌至73元/吨历史极低点，但Q4已修复至362元/吨。2026Q1桐昆净利润同比+211%、荣盛同比+378%，拐点信号明确。',
  },
  {
    title: '长丝"反内卷"执行最坚决',
    stars: 4,
    summary: '涤纶长丝行业减产力度最大，下游库存处于历史低位',
    detail: '长丝CR6超87%，行业协同减产效果显著。下游库存处于历史低位，补库需求有望在下半年释放。桐昆、新凤鸣作为纯聚酯链标的，利润弹性最大（107%-123%）。',
  },
  {
    title: '地缘冲突 + 纺服补库周期',
    stars: 3,
    summary: '美伊冲突推升炼化景气，中美共振开启纺服补库',
    detail: '海外炼厂停产推升中国炼化竞争力。印度取消BIS认证，对印出口预计快速修复。天风证券判断中美2026年有望共振开启纺服补库周期，提振芳烃-聚酯链条需求。',
  },
]
