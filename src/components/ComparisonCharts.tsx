import ReactECharts from 'echarts-for-react'
import { useYear } from '../contexts/YearContext'
import financialsData from '../data/financials.json'
import companiesMeta from '../data/companies.json'
import costCurveData from '../data/costCurve.json'
import marketSizeData from '../data/marketSize.json'
import estimationsData from '../data/estimations.json'
import type { CompanyData, CompanyInfo, CostData, EstimationData } from '../data/financials'

type MergedCompany = CompanyInfo & CompanyData

export default function ComparisonCharts() {
  const { year } = useYear()
  const financials = financialsData as CompanyData[]
  const yearData = financials.filter((d) => d.year === year)
  const cnCompanies = companiesMeta
    .map((meta) => {
      const fin = yearData.find((d) => d.company_id === meta.id)
      if (!fin) return null
      return { ...meta, ...fin } as MergedCompany
    })
    .filter((c): c is MergedCompany => c !== null)
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))

  const hasData = cnCompanies.length > 0

  const profitOption = hasData ? {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' as const },
    legend: { textStyle: { color: '#94a3b8' }, top: 0 },
    grid: { left: '12%', right: '4%', top: 40, bottom: 40 },
    xAxis: {
      type: 'category',
      data: cnCompanies.map((c) => c.nameCn),
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'value',
      name: '亿元',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    series: [
      {
        name: '归母净利润',
        type: 'bar',
        data: cnCompanies.map((c) => c.netProfit),
        itemStyle: {
          color: (p: any) =>
            p.value > 20 ? '#14b8a0' : p.value > 5 ? '#d4b96a' : '#64748b',
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '50%',
        label: {
          show: true,
          position: 'top',
          color: '#94a3b8',
          fontSize: 10,
          formatter: (p: any) => p.value.toFixed(1) + '亿',
        },
      },
    ],
  } : {}

  const marginOption = hasData ? {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' as const },
    legend: { textStyle: { color: '#94a3b8' }, top: 0 },
    grid: { left: '12%', right: '12%', top: 40, bottom: 40 },
    xAxis: {
      type: 'category',
      data: cnCompanies.map((c) => c.nameCn),
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: [
      {
        type: 'value',
        name: '%',
        axisLabel: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#1e293b' } },
      },
      {
        type: 'value',
        name: '%',
        axisLabel: { color: '#94a3b8' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '毛利率',
        type: 'bar',
        data: cnCompanies.map((c) => c.grossMargin),
        itemStyle: { color: '#14b8a0', borderRadius: [4, 4, 0, 0] },
        barWidth: '35%',
        barGap: '20%',
        label: { show: true, position: 'top', color: '#94a3b8', fontSize: 10 },
      },
      {
        name: 'ROE',
        type: 'bar',
        yAxisIndex: 1,
        data: cnCompanies.map((c) => c.roe),
        itemStyle: { color: '#d4b96a', borderRadius: [4, 4, 0, 0] },
        barWidth: '35%',
        label: { show: true, position: 'top', color: '#94a3b8', fontSize: 10 },
      },
    ],
  } : {}

  const costOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' as const, formatter: (p: any) => `${p[0].name}<br/>现金成本: $${p[0].data[0]}–$${p[0].data[1]}/吨` },
    grid: { left: '20%', right: '4%', top: 20, bottom: 30 },
    xAxis: {
      type: 'value',
      name: '美元/吨',
      min: 400,
      max: 750,
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    yAxis: {
      type: 'category',
      data: (costCurveData as CostData[]).map((d) => d.region),
      axisLabel: { color: '#e2e8f0', fontSize: 12 },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    series: [
      {
        type: 'bar' as const,
        data: (costCurveData as CostData[]).map((d) => [d.costLow, d.costHigh]),
        itemStyle: {
          color: (p: any) => {
            const colors = ['#14b8a0', '#f59e0b', '#f97316', '#ef4444']
            return colors[p.dataIndex] || '#64748b'
          },
          borderRadius: [0, 6, 6, 0],
        },
        barWidth: '50%',
        label: {
          show: true,
          position: 'right' as const,
          color: '#94a3b8',
          fontSize: 11,
          formatter: (p: any) => `$${p.value[0]}–$${p.value[1]}`,
        },
      },
    ],
  }

  const marketOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' as const },
    grid: { left: '12%', right: '4%', top: 20, bottom: 40 },
    xAxis: {
      type: 'category' as const,
      data: (marketSizeData as { year: number; value: number }[]).map((d) => d.year.toString()),
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'value' as const,
      name: '十亿美元',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    series: [
      {
        name: '全球PTA市场规模',
        type: 'line',
        data: (marketSizeData as { year: number; value: number }[]).map((d) => d.value),
        smooth: true,
        lineStyle: { color: '#d4b96a', width: 3 },
        itemStyle: { color: '#d4b96a' },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(212, 185, 106, 0.3)' },
              { offset: 1, color: 'rgba(212, 185, 106, 0.02)' },
            ],
          },
        },
        markLine: {
          silent: true,
          data: [
            {
              xAxis: year.toString(),
              label: { formatter: year.toString(), color: '#94a3b8', fontSize: 10 },
              lineStyle: { color: '#64748b', type: 'dashed' as const },
            },
          ],
        },
      },
    ],
  }

  const estYearData = (estimationsData as EstimationData[]).filter((e) => e.year === year)
  const valuationOption = estYearData.length > 0 ? {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item' as const,
      formatter: (p: any) => `${p.name}<br/>${year}E PE: ${p.value[0]}x<br/>利润增速: ${p.value[1]}%`,
    },
    grid: { left: '15%', right: '4%', top: 20, bottom: 40 },
    xAxis: {
      type: 'value',
      name: year + 'E PE',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    yAxis: {
      type: 'value',
      name: '利润增速 %',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    series: [
      {
        type: 'scatter',
        data: estYearData.map((e) => {
          const prevYear = yearData.find((f) => f.company_id === e.company_id)
          const growth = prevYear && prevYear.netProfit > 0
            ? ((e.netProfit - prevYear.netProfit) / prevYear.netProfit * 100)
            : 0
          return { name: e.company, value: [e.pe, Math.round(growth)] }
        }),
        symbolSize: (val: number[]) => Math.max(Math.abs(val[1]) / 8, 20),
        itemStyle: {
          color: (p: any) => {
            const colors = ['#14b8a0', '#d4b96a', '#f59e0b', '#f97316']
            return colors[p.dataIndex] || '#64748b'
          },
          shadowBlur: 10,
          shadowColor: 'rgba(20, 184, 160, 0.5)',
        },
        label: {
          show: true,
          position: 'right',
          color: '#e2e8f0',
          fontSize: 11,
          formatter: (p: any) => p.name,
        },
      },
    ],
  } : {}

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <h3 className="text-2xl font-bold text-white mb-10 text-center">数据可视化</h3>

      {hasData ? (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <h4 className="text-sm text-slate-400 mb-4 text-center">{year}年归母净利润对比</h4>
            <ReactECharts option={profitOption} style={{ height: 320 }} />
          </div>
          <div className="glass-card p-6">
            <h4 className="text-sm text-slate-400 mb-4 text-center">毛利率与ROE对比</h4>
            <ReactECharts option={marginOption} style={{ height: 320 }} />
          </div>
          <div className="glass-card p-6">
            <h4 className="text-sm text-slate-400 mb-4 text-center">全球PTA现金成本曲线 (美元/吨)</h4>
            <ReactECharts option={costOption} style={{ height: 280 }} />
          </div>
          <div className="glass-card p-6">
            <h4 className="text-sm text-slate-400 mb-4 text-center">全球PTA市场规模趋势 (十亿美元)</h4>
            <ReactECharts option={marketOption} style={{ height: 280 }} />
          </div>
          {estYearData.length > 0 && (
            <div className="glass-card p-6 md:col-span-2">
              <h4 className="text-sm text-slate-400 mb-4 text-center">{year}E PE vs 利润增速 (气泡大小=市值权重)</h4>
              <ReactECharts option={valuationOption} style={{ height: 320 }} />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-500">暂无{year}年度数据</p>
        </div>
      )}
    </section>
  )
}
