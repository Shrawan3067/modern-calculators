import { BarChart, PieChart } from './ChartComponents'
import DataTable from '../tables/DataTable'

export default function ResultDisplay({ results, chartConfig, tableConfig }) {
  if (!results) return null

  // Handle null configs
  const barChartData = chartConfig?.bar?.data
  const pieChartData = chartConfig?.pie?.data
  const tableData = tableConfig?.data

  return (
    <>
      {/* Chart visualization - only show if we have chart data */}
      {(barChartData || pieChartData) && (
        <div className="grid md:grid-cols-2 gap-6">
          {barChartData && (
            <div className="card">
              <h3 className="font-semibold mb-4">Visual Breakdown</h3>
              <BarChart 
                data={barChartData} 
                options={chartConfig.bar.options} 
              />
            </div>
          )}
          
          {pieChartData && (
            <div className="card">
              <h3 className="font-semibold mb-4">Distribution</h3>
              <PieChart 
                data={pieChartData} 
                options={chartConfig.pie.options} 
              />
            </div>
          )}
        </div>
      )}

      {/* Data table - only show if we have table data */}
      {tableData && tableConfig && (
        <div className="card mt-6">
          <h3 className="font-semibold mb-4">Detailed Breakdown</h3>
          <DataTable 
            data={tableData}
            columns={tableConfig.columns}
            pagination={tableConfig.pagination}
          />
        </div>
      )}
    </>
  )
}