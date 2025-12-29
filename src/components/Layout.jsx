// src/components/Layout.jsx
import Header from './ui/Header'
import Sidebar from './ui/Sidebar'
import { calculatorsByCategory } from '../utils/calculatorConfig'

export default function Layout({ children, theme, setTheme }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} setTheme={setTheme} />
      
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden lg:block w-64 border-r border-border">
          <Sidebar calculators={calculatorsByCategory} />
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile calculate button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-border">
        <button className="btn-primary w-full">
          Calculate
        </button>
      </div>
    </div>
  )
}