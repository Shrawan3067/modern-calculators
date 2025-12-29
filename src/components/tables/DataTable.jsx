import { useState } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal, Download } from 'lucide-react'

export default function DataTable({ data, columns, pagination = true, itemsPerPage = 10 }) {
  // Add null/undefined check for data
  if (!data || !Array.isArray(data)) {
    return (
      <div className="p-8 text-center text-text/60 border border-border rounded-lg bg-surface/50">
        <div className="text-lg font-medium mb-2">No data available</div>
        <p className="text-sm">There's no data to display at the moment.</p>
      </div>
    )
  }

  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(data.length / itemsPerPage)

  // Ensure currentPage is valid
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1)
  const startIndex = (validCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, data.length)
  const currentData = pagination ? data.slice(startIndex, endIndex) : data

  const handlePrevious = () => {
    if (validCurrentPage > 1) setCurrentPage(validCurrentPage - 1)
  }

  const handleNext = () => {
    if (validCurrentPage < totalPages) setCurrentPage(validCurrentPage + 1)
  }

  const formatValue = (value, columnKey) => {
    if (value === null || value === undefined) return '-'
    
    if (typeof value === 'number') {
      // Format currency values
      if (columnKey.includes('payment') || columnKey.includes('principal') || 
          columnKey.includes('interest') || columnKey.includes('balance') ||
          columnKey.includes('amount') || columnKey.includes('total')) {
        return `$${value.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`
      }
      
      // Format percentages
      if (columnKey.includes('rate') || columnKey.includes('percentage')) {
        return `${value.toFixed(2)}%`
      }
      
      // Format regular numbers
      return value.toLocaleString('en-US', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2 
      })
    }
    
    // Format dates
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
    
    return value.toString()
  }

  // Export function (mock)
  const handleExport = () => {
    console.log('Exporting data...')
    // Implement actual export logic here
  }

  return (
    <div className="bg-surface/30 rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Table Header with Controls */}
      <div className="px-4 md:px-6 py-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text">Data Overview</h3>
          <p className="text-sm text-text/60 mt-1">
            {pagination ? `Showing ${startIndex + 1}-${endIndex} of ${data.length} entries` : `${data.length} total entries`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full">
            <thead>
              <tr className="bg-surface/50 border-b border-border">
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    className="px-6 py-4 text-left text-xs font-semibold text-text/70 uppercase tracking-wider whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      {column.header}
                      {column.sortable && (
                        <MoreHorizontal className="h-3 w-3 opacity-50" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {currentData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className="hover:bg-surface/50 transition-colors duration-150"
                >
                  {columns.map((column) => (
                    <td 
                      key={column.key}
                      className="px-6 py-4 text-sm whitespace-nowrap"
                    >
                      <div className={`font-medium ${
                        column.key.includes('amount') || column.key.includes('total') 
                          ? 'text-primary font-semibold' 
                          : 'text-text'
                      }`}>
                        {formatValue(row[column.key], column.key)}
                      </div>
                      {column.subtext && row[column.subtext.key] && (
                        <div className="text-xs text-text/50 mt-1">
                          {row[column.subtext.key]}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tablet Table (Medium screens) */}
      <div className="hidden md:block lg:hidden overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full">
            <thead>
              <tr className="bg-surface/50 border-b border-border">
                {columns.slice(0, 4).map((column) => (
                  <th 
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wider whitespace-nowrap"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {currentData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className="hover:bg-surface/50 transition-colors"
                >
                  {columns.slice(0, 4).map((column) => (
                    <td 
                      key={column.key}
                      className="px-4 py-3 text-sm whitespace-nowrap"
                    >
                      <span className={`font-medium ${
                        column.key.includes('amount') || column.key.includes('total') 
                          ? 'text-primary font-semibold' 
                          : 'text-text'
                      }`}>
                        {formatValue(row[column.key], column.key)}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards (Small screens) */}
      <div className="md:hidden">
        <div className="divide-y divide-border/50">
          {currentData.map((row, rowIndex) => (
            <div 
              key={rowIndex}
              className="p-4 hover:bg-surface/30 transition-colors"
            >
              <div className="grid grid-cols-2 gap-3">
                {columns.slice(0, 4).map((column) => (
                  <div key={column.key} className="space-y-1">
                    <div className="text-xs font-medium text-text/60 uppercase tracking-wider">
                      {column.header}
                    </div>
                    <div className={`text-sm font-medium ${
                      column.key.includes('amount') || column.key.includes('total') 
                        ? 'text-primary' 
                        : 'text-text'
                    }`}>
                      {formatValue(row[column.key], column.key)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Additional columns as accordion */}
              {columns.length > 4 && (
                <details className="mt-3 pt-3 border-t border-border/30">
                  <summary className="text-sm font-medium text-primary cursor-pointer flex items-center justify-between">
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4 transform transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="mt-3 space-y-2 pt-2">
                    {columns.slice(4).map((column) => (
                      <div key={column.key} className="flex justify-between items-center">
                        <span className="text-sm text-text/60">{column.header}:</span>
                        <span className="text-sm font-medium">
                          {formatValue(row[column.key], column.key)}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && data.length > 0 && (
        <div className="px-4 md:px-6 py-4 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-text/60 order-2 sm:order-1">
              Page {validCurrentPage} of {totalPages} • {data.length} total entries
            </div>
            
            <div className="flex items-center space-x-2 order-1 sm:order-2">
              <button
                onClick={handlePrevious}
                disabled={validCurrentPage === 1}
                className="px-3 py-2 rounded-lg bg-surface hover:bg-surface/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              {/* Page Numbers */}
              <div className="hidden md:flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (validCurrentPage <= 3) {
                    pageNum = i + 1
                  } else if (validCurrentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = validCurrentPage - 2 + i
                  }
                  
                  if (pageNum > totalPages) return null
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        validCurrentPage === pageNum
                          ? 'bg-primary text-white'
                          : 'hover:bg-surface'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              <div className="md:hidden text-sm font-medium">
                {validCurrentPage} / {totalPages}
              </div>
              
              <button
                onClick={handleNext}
                disabled={validCurrentPage === totalPages}
                className="px-3 py-2 rounded-lg bg-surface hover:bg-surface/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No data message */}
      {currentData.length === 0 && data.length > 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-lg font-medium text-text/60 mb-2">No matching results</div>
          <p className="text-sm text-text/50">Try adjusting your filters or search</p>
        </div>
      )}
    </div>
  )
}