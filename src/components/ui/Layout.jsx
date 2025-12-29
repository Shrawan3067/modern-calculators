import { useState, useEffect } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { calculatorsByCategory } from '../../utils/calculatorConfig'

export default function Layout({ children, theme, toggleTheme }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen)
  }

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false)
  }

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('mobile-sidebar')
      const hamburger = document.querySelector('[aria-label="Open sidebar"], [aria-label="Close sidebar"]')
      
      if (mobileSidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target) && 
          hamburger && 
          !hamburger.contains(event.target)) {
        closeMobileSidebar()
      }
    }

    if (mobileSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'auto'
    }
  }, [mobileSidebarOpen])

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && mobileSidebarOpen) {
        closeMobileSidebar()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileSidebarOpen])

  return (
    <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-300">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleMobileSidebar={toggleMobileSidebar}
        isSidebarOpen={mobileSidebarOpen}
      />
      
      <div className="flex flex-1 relative">
        {/* Mobile Sidebar Overlay with Transition */}
        <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileSidebarOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible pointer-events-none'
        }`}>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black transition-opacity duration-300 ${
              mobileSidebarOpen ? 'opacity-50' : 'opacity-0'
            }`}
            onClick={closeMobileSidebar}
          />
          
          {/* Sidebar */}
          <div 
            id="mobile-sidebar"
            className={`fixed inset-y-0 top-16 right-0 z-50 w-72 md:w-80 bg-surface shadow-2xl transform transition-transform duration-300 ease-out ${
              mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <Sidebar calculators={calculatorsByCategory} onClose={closeMobileSidebar} />
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block fixed top-16 bottom-0 left-0 w-64 border-r border-border bg-surface/50">
          <Sidebar calculators={calculatorsByCategory} />
        </aside>
        
        {/* Main content - Add left margin to account for fixed sidebar */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}