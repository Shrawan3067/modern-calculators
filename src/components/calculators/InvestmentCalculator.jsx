import { useState, useMemo, useEffect } from "react";
import InputGroup from "../ui/InputGroup";
import ResultDisplay from "../charts/ResultDisplay";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function InvestmentCalculator() {
  const [calculationType, setCalculationType] = useState("futureValue");
  const [formData, setFormData] = useState({
    // Future Value
    fv_initialInvestment: "10000",
    fv_monthlyContribution: "500",
    fv_investmentPeriod: "20",
    fv_expectedReturn: "7",
    fv_compoundingFrequency: "monthly",
    fv_inflationRate: "2.5",

    // ROI
    roi_initialInvestment: "10000",
    roi_finalValue: "25000",
    roi_investmentPeriod: "5",

    // Compound Interest
    ci_principal: "10000",
    ci_annualRate: "7",
    ci_years: "10",
    ci_compounding: "monthly",
    ci_regularContribution: "500",
    ci_contributionFrequency: "monthly",

    // Investment Growth
    ig_initialAmount: "10000",
    ig_monthlyContribution: "500",
    ig_annualReturn: "7",
    ig_years: "30",
    ig_taxRate: "15",
    ig_fees: "0.5",

    // Lump Sum
    ls_initialAmount: "100000",
    ls_expectedReturn: "7",
    ls_years: "20",
    ls_inflation: "2.5",

    // Retirement
    ret_currentAge: "30",
    ret_retirementAge: "65",
    ret_currentSavings: "50000",
    ret_monthlyContribution: "1000",
    ret_expectedReturn: "7",
    ret_inflation: "2.5",
    ret_withdrawalRate: "4",

    // Comparison
    comp_investment1: "10000",
    comp_return1: "7",
    comp_investment2: "10000",
    comp_return2: "9",
    comp_years: "20",
    comp_monthlyContribution: "500",
  });
  const [errors, setErrors] = useState({});

  // Add chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const BAR_COLORS = ['#3b82f6', '#10b981'];

  // Add these table rendering functions
  const renderInvestmentTable = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">No data available</div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Year
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Contributions
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Interest
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  {row.year}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  ${row.contributions?.toLocaleString() || "0"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  ${row.interest?.toLocaleString() || "0"}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">
                  ${row.balance?.toLocaleString() || "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderLumpSumTable = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">No data available</div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Year
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Value
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Gains
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Inflation Adjusted
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  {row.year}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  ${row.value?.toLocaleString() || "0"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  ${row.gains?.toLocaleString() || "0"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  ${row.inflationAdjusted?.toLocaleString() || "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRetirementWithdrawalTable = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">No data available</div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Year
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Remaining Balance
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Annual Withdrawal
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  {row.year}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  ${row.remainingBalance?.toLocaleString() || "0"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  ${row.annualWithdrawal?.toLocaleString() || "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderComparisonTable = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">No data available</div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Year
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Investment 1
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Investment 2
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  {row.year}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  ${row.investment1?.toLocaleString() || "0"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                  ${row.investment2?.toLocaleString() || "0"}
                </td>
                <td
                  className={`px-4 py-3 text-sm font-medium border-b border-gray-100 ${
                    row.difference > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${Math.abs(row.difference || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Add chart rendering functions
  const renderPieChart = (data, title) => {
    if (!data || data.length === 0) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderBarChart = (data, title, xKey, bars) => {
    if (!data || data.length === 0) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={xKey} />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              {bars.map((bar, index) => (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  name={bar.name}
                  fill={bar.color || BAR_COLORS[index % BAR_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Add function to prepare chart data based on calculation type
  const prepareChartData = (results) => {
    if (!results) return { pieData: [], barData: [] };

    switch (calculationType) {
      case "futureValue":
      case "compoundInterest":
      case "investmentGrowth": {
        const pieData = [
          { name: "Initial Investment", value: results.initial || 0 },
          { name: "Contributions", value: (results.totalContributions || 0) - (results.initial || 0) },
          { name: "Interest Earned", value: results.totalInterest || 0 },
        ].filter(item => item.value > 0);

        // Prepare bar chart data (first 10 years or all years if less than 10)
        const barData = results.breakdown?.slice(0, 10).map(item => ({
          year: item.year,
          "Total Contributions": item.contributions,
          "Interest Earned": item.interest,
          "Total Balance": item.balance
        })) || [];

        return { pieData, barData };
      }

      case "lumpSum": {
        const pieData = [
          { name: "Initial Investment", value: results.initial || 0 },
          { name: "Total Gains", value: results.totalGains || 0 },
        ].filter(item => item.value > 0);

        const barData = results.breakdown?.slice(0, 10).map(item => ({
          year: item.year,
          "Initial Investment": results.initial || 0,
          "Gains": item.gains,
          "Total Value": item.value
        })) || [];

        return { pieData, barData };
      }

      case "retirement": {
        const pieData = [
          { name: "Current Savings", value: results.currentSavings || 0 },
          { name: "Future Contributions", value: (results.monthlyContribution || 0) * 12 * (results.yearsToRetirement || 0) },
          { name: "Interest Earned", value: (results.retirementSavings || 0) - (results.currentSavings || 0) - ((results.monthlyContribution || 0) * 12 * (results.yearsToRetirement || 0)) },
        ].filter(item => item.value > 0);

        const barData = results.withdrawalSchedule?.map(item => ({
          year: item.year,
          "Remaining Balance": item.remainingBalance,
          "Annual Withdrawal": item.annualWithdrawal
        })) || [];

        return { pieData, barData };
      }

      case "comparison": {
        const pieData = [
          { name: "Investment 1", value: results.investment1 || 0 },
          { name: "Investment 2", value: results.investment2 || 0 },
          { name: "Future Value Difference", value: Math.abs(results.difference || 0) },
        ].filter(item => item.value > 0);

        const barData = results.breakdown?.slice(0, 10).map(item => ({
          year: item.year,
          "Investment 1": item.investment1,
          "Investment 2": item.investment2,
        })) || [];

        return { pieData, barData };
      }

      case "roi": {
        const pieData = [
          { name: "Initial Investment", value: results.initial || 0 },
          { name: "Total Profit", value: results.profit || 0 },
        ].filter(item => item.value > 0);

        // For ROI, create a simple bar showing initial vs final
        const barData = [
          { name: "Initial", value: results.initial || 0 },
          { name: "Final", value: results.final || 0 },
        ];

        return { pieData, barData };
      }

      default:
        return { pieData: [], barData: [] };
    }
  };

  const calculationTypes = [
    {
      id: "futureValue",
      label: "Future Value",
      description: "Calculate future value of investments",
    },
    {
      id: "roi",
      label: "Return on Investment",
      description: "Calculate ROI percentage",
    },
    {
      id: "compoundInterest",
      label: "Compound Interest",
      description: "Compound interest with contributions",
    },
    {
      id: "investmentGrowth",
      label: "Investment Growth",
      description: "Project investment growth over time",
    },
    {
      id: "lumpSum",
      label: "Lump Sum Investment",
      description: "Single investment growth",
    },
    {
      id: "retirement",
      label: "Retirement Planning",
      description: "Retirement savings projection",
    },
    {
      id: "comparison",
      label: "Investment Comparison",
      description: "Compare different investments",
    },
  ];

  // Rest of your existing functions remain the same...
  const getCurrentInputs = () => {
    switch (calculationType) {
      case "futureValue":
        return [
          {
            name: "fv_initialInvestment",
            label: "Initial Investment ($)",
            type: "currency",
            default: 10000,
            required: true,
            min: 0,
            max: 10000000,
            step: 100,
          },
          {
            name: "fv_monthlyContribution",
            label: "Monthly Contribution ($)",
            type: "currency",
            default: 500,
            required: true,
            min: 0,
            max: 100000,
            step: 10,
          },
          {
            name: "fv_investmentPeriod",
            label: "Investment Period (years)",
            type: "number",
            default: 20,
            required: true,
            min: 1,
            max: 100,
            step: 1,
          },
          {
            name: "fv_expectedReturn",
            label: "Expected Annual Return (%)",
            type: "percentage",
            default: 7,
            required: true,
            min: 0,
            max: 50,
            step: 0.1,
          },
          {
            name: "fv_compoundingFrequency",
            label: "Compounding Frequency",
            type: "select",
            default: "monthly",
            required: true,
            options: [
              { value: "daily", label: "Daily" },
              { value: "monthly", label: "Monthly" },
              { value: "quarterly", label: "Quarterly" },
              { value: "annually", label: "Annually" },
            ],
          },
          {
            name: "fv_inflationRate",
            label: "Inflation Rate (%)",
            type: "percentage",
            default: 2.5,
            required: true,
            min: 0,
            max: 20,
            step: 0.1,
          },
        ];

      case "roi":
        return [
          {
            name: "roi_initialInvestment",
            label: "Initial Investment ($)",
            type: "currency",
            default: 10000,
            required: true,
            min: 1,
            max: 10000000,
            step: 100,
          },
          {
            name: "roi_finalValue",
            label: "Final Value ($)",
            type: "currency",
            default: 25000,
            required: true,
            min: 1,
            max: 10000000,
            step: 100,
          },
          {
            name: "roi_investmentPeriod",
            label: "Investment Period (years)",
            type: "number",
            default: 5,
            required: true,
            min: 0.1,
            max: 100,
            step: 0.5,
          },
        ];

      case "compoundInterest":
        return [
          {
            name: "ci_principal",
            label: "Initial Principal ($)",
            type: "currency",
            default: 10000,
            required: true,
            min: 0,
            max: 10000000,
            step: 100,
          },
          {
            name: "ci_annualRate",
            label: "Annual Interest Rate (%)",
            type: "percentage",
            default: 7,
            required: true,
            min: 0,
            max: 50,
            step: 0.1,
          },
          {
            name: "ci_years",
            label: "Time Period (years)",
            type: "number",
            default: 10,
            required: true,
            min: 1,
            max: 100,
            step: 1,
          },
          {
            name: "ci_compounding",
            label: "Compounding Frequency",
            type: "select",
            default: "monthly",
            required: true,
            options: [
              { value: "annually", label: "Annually" },
              { value: "semi-annually", label: "Semi-Annually" },
              { value: "quarterly", label: "Quarterly" },
              { value: "monthly", label: "Monthly" },
              { value: "daily", label: "Daily" },
            ],
          },
          {
            name: "ci_regularContribution",
            label: "Regular Contribution ($)",
            type: "currency",
            default: 500,
            required: true,
            min: 0,
            max: 100000,
            step: 10,
          },
          {
            name: "ci_contributionFrequency",
            label: "Contribution Frequency",
            type: "select",
            default: "monthly",
            required: true,
            options: [
              { value: "monthly", label: "Monthly" },
              { value: "quarterly", label: "Quarterly" },
              { value: "annually", label: "Annually" },
            ],
          },
        ];

      case "investmentGrowth":
        return [
          {
            name: "ig_initialAmount",
            label: "Initial Amount ($)",
            type: "currency",
            default: 10000,
            required: true,
            min: 0,
            max: 10000000,
            step: 100,
          },
          {
            name: "ig_monthlyContribution",
            label: "Monthly Contribution ($)",
            type: "currency",
            default: 500,
            required: true,
            min: 0,
            max: 100000,
            step: 10,
          },
          {
            name: "ig_annualReturn",
            label: "Expected Annual Return (%)",
            type: "percentage",
            default: 7,
            required: true,
            min: 0,
            max: 50,
            step: 0.1,
          },
          {
            name: "ig_years",
            label: "Investment Period (years)",
            type: "number",
            default: 30,
            required: true,
            min: 1,
            max: 100,
            step: 1,
          },
          {
            name: "ig_taxRate",
            label: "Tax Rate on Gains (%)",
            type: "percentage",
            default: 15,
            required: true,
            min: 0,
            max: 50,
            step: 1,
          },
          {
            name: "ig_fees",
            label: "Annual Fees (%)",
            type: "percentage",
            default: 0.5,
            required: true,
            min: 0,
            max: 5,
            step: 0.1,
          },
        ];

      case "lumpSum":
        return [
          {
            name: "ls_initialAmount",
            label: "Initial Investment ($)",
            type: "currency",
            default: 100000,
            required: true,
            min: 100,
            max: 10000000,
            step: 1000,
          },
          {
            name: "ls_expectedReturn",
            label: "Expected Annual Return (%)",
            type: "percentage",
            default: 7,
            required: true,
            min: 0,
            max: 50,
            step: 0.1,
          },
          {
            name: "ls_years",
            label: "Investment Period (years)",
            type: "number",
            default: 20,
            required: true,
            min: 1,
            max: 100,
            step: 1,
          },
          {
            name: "ls_inflation",
            label: "Inflation Rate (%)",
            type: "percentage",
            default: 2.5,
            required: true,
            min: 0,
            max: 20,
            step: 0.1,
          },
        ];

      case "retirement":
        return [
          {
            name: "ret_currentAge",
            label: "Current Age",
            type: "number",
            default: 30,
            required: true,
            min: 18,
            max: 80,
            step: 1,
          },
          {
            name: "ret_retirementAge",
            label: "Retirement Age",
            type: "number",
            default: 65,
            required: true,
            min: 25,
            max: 100,
            step: 1,
          },
          {
            name: "ret_currentSavings",
            label: "Current Savings ($)",
            type: "currency",
            default: 50000,
            required: true,
            min: 0,
            max: 10000000,
            step: 1000,
          },
          {
            name: "ret_monthlyContribution",
            label: "Monthly Contribution ($)",
            type: "currency",
            default: 1000,
            required: true,
            min: 0,
            max: 50000,
            step: 100,
          },
          {
            name: "ret_expectedReturn",
            label: "Expected Annual Return (%)",
            type: "percentage",
            default: 7,
            required: true,
            min: 0,
            max: 20,
            step: 0.1,
          },
          {
            name: "ret_inflation",
            label: "Inflation Rate (%)",
            type: "percentage",
            default: 2.5,
            required: true,
            min: 0,
            max: 10,
            step: 0.1,
          },
          {
            name: "ret_withdrawalRate",
            label: "Withdrawal Rate (%)",
            type: "percentage",
            default: 4,
            required: true,
            min: 1,
            max: 10,
            step: 0.1,
          },
        ];

      case "comparison":
        return [
          {
            name: "comp_investment1",
            label: "Investment 1 Amount ($)",
            type: "currency",
            default: 10000,
            required: true,
            min: 0,
            max: 10000000,
            step: 100,
          },
          {
            name: "comp_return1",
            label: "Investment 1 Return (%)",
            type: "percentage",
            default: 7,
            required: true,
            min: 0,
            max: 50,
            step: 0.1,
          },
          {
            name: "comp_investment2",
            label: "Investment 2 Amount ($)",
            type: "currency",
            default: 10000,
            required: true,
            min: 0,
            max: 10000000,
            step: 100,
          },
          {
            name: "comp_return2",
            label: "Investment 2 Return (%)",
            type: "percentage",
            default: 9,
            required: true,
            min: 0,
            max: 50,
            step: 0.1,
          },
          {
            name: "comp_years",
            label: "Investment Period (years)",
            type: "number",
            default: 20,
            required: true,
            min: 1,
            max: 100,
            step: 1,
          },
          {
            name: "comp_monthlyContribution",
            label: "Monthly Contribution ($)",
            type: "currency",
            default: 500,
            required: true,
            min: 0,
            max: 100000,
            step: 10,
          },
        ];

      default:
        return [];
    }
  };

  const validationErrors = useMemo(() => {
    const errors = {};
    const inputs = getCurrentInputs();

    inputs.forEach((input) => {
      const value = parseFloat(formData[input.name]) || 0;

      if (
        input.required &&
        !formData[input.name] &&
        formData[input.name] !== 0
      ) {
        errors[input.name] = `${input.label} is required`;
      }

      if (input.min !== undefined && value < input.min) {
        errors[input.name] = `Minimum ${input.label} is ${input.min}`;
      }

      if (input.max !== undefined && value > input.max) {
        errors[input.name] = `Maximum ${input.label} is ${input.max}`;
      }
    });

    // Special validation for retirement age
    if (calculationType === "retirement") {
      const currentAge = parseFloat(formData.ret_currentAge);
      const retirementAge = parseFloat(formData.ret_retirementAge);
      if (retirementAge <= currentAge) {
        errors.ret_retirementAge =
          "Retirement age must be greater than current age";
      }
    }

    return errors;
  }, [formData, calculationType]);

  useEffect(() => {
    setErrors(validationErrors);
  }, [validationErrors]);

  const getCompoundingFactor = (frequency) => {
    switch (frequency) {
      case "daily":
        return 365;
      case "monthly":
        return 12;
      case "quarterly":
        return 4;
      case "semi-annually":
        return 2;
      case "annually":
        return 1;
      default:
        return 12;
    }
  };

  const calculateFutureValue = (
    principal,
    monthlyContribution,
    years,
    annualRate,
    compoundingFreq,
    inflationRate
  ) => {
    const n = getCompoundingFactor(compoundingFreq);
    const periodicRate = annualRate / 100 / n;
    const totalPeriods = years * n;
    const periodicContribution = monthlyContribution * (12 / n);

    // Future value of lump sum
    const fvLumpSum = principal * Math.pow(1 + periodicRate, totalPeriods);

    // Future value of annuity (regular contributions)
    let fvAnnuity = 0;
    if (periodicContribution > 0) {
      fvAnnuity =
        periodicContribution *
        ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
    }

    const totalFV = fvLumpSum + fvAnnuity;

    // Adjust for inflation
    const inflationAdjustedFV =
      totalFV / Math.pow(1 + inflationRate / 100, years);

    // Calculate total contributions
    const totalContributions = principal + monthlyContribution * 12 * years;
    const totalInterest = totalFV - totalContributions;

    // Generate yearly breakdown
    const breakdown = [];
    let balance = principal;
    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthlyRate = annualRate / 100 / 12;
        balance = balance * (1 + monthlyRate) + monthlyContribution;
      }
      breakdown.push({
        year,
        contributions: principal + monthlyContribution * 12 * year,
        interest: balance - (principal + monthlyContribution * 12 * year),
        balance: balance,
      });
    }

    return {
      totalFV,
      inflationAdjustedFV,
      totalContributions,
      totalInterest,
      breakdown,
    };
  };

  const results = useMemo(() => {
    if (Object.keys(validationErrors).length > 0) {
      return null;
    }

    try {
      switch (calculationType) {
        case "futureValue": {
          const initial = parseFloat(formData.fv_initialInvestment);
          const monthly = parseFloat(formData.fv_monthlyContribution);
          const years = parseFloat(formData.fv_investmentPeriod);
          const rate = parseFloat(formData.fv_expectedReturn);
          const compounding = formData.fv_compoundingFrequency;
          const inflation = parseFloat(formData.fv_inflationRate);

          const result = calculateFutureValue(
            initial,
            monthly,
            years,
            rate,
            compounding,
            inflation
          );

          return {
            type: "futureValue",
            initial,
            monthly,
            years,
            rate,
            compounding,
            inflation,
            ...result,
            calculation: `Future Value = $${initial.toLocaleString()} + $${monthly.toLocaleString()}/month at ${rate}% for ${years} years`,
            summary: [
              {
                label: "Initial Investment",
                value: `$${initial.toLocaleString()}`,
              },
              {
                label: "Monthly Contribution",
                value: `$${monthly.toLocaleString()}`,
              },
              { label: "Investment Period", value: `${years} years` },
              { label: "Expected Return", value: `${rate}%` },
              {
                label: "Total Contributions",
                value: `$${result.totalContributions.toLocaleString()}`,
              },
              {
                label: "Total Interest Earned",
                value: `$${result.totalInterest.toLocaleString()}`,
              },
              {
                label: "Future Value",
                value: `$${result.totalFV.toLocaleString()}`,
              },
              {
                label: "Inflation Adjusted",
                value: `$${result.inflationAdjustedFV.toLocaleString()}`,
              },
            ],
          };
        }

        case "roi": {
          const initial = parseFloat(formData.roi_initialInvestment);
          const final = parseFloat(formData.roi_finalValue);
          const years = parseFloat(formData.roi_investmentPeriod);

          const profit = final - initial;
          const roiPercentage = (profit / initial) * 100;
          const annualizedROI =
            (Math.pow(final / initial, 1 / years) - 1) * 100;

          return {
            type: "roi",
            initial,
            final,
            years,
            profit,
            roiPercentage,
            annualizedROI,
            calculation: `ROI = ((${final.toLocaleString()} - ${initial.toLocaleString()}) / ${initial.toLocaleString()}) × 100`,
            summary: [
              {
                label: "Initial Investment",
                value: `$${initial.toLocaleString()}`,
              },
              { label: "Final Value", value: `$${final.toLocaleString()}` },
              { label: "Investment Period", value: `${years} years` },
              { label: "Total Profit", value: `$${profit.toLocaleString()}` },
              {
                label: "ROI Percentage",
                value: `${roiPercentage.toFixed(2)}%`,
              },
              {
                label: "Annualized ROI",
                value: `${annualizedROI.toFixed(2)}%`,
              },
            ],
          };
        }

        case "compoundInterest": {
          const principal = parseFloat(formData.ci_principal);
          const rate = parseFloat(formData.ci_annualRate);
          const years = parseFloat(formData.ci_years);
          const compounding = formData.ci_compounding;
          const contribution = parseFloat(formData.ci_regularContribution);
          const contribFreq = formData.ci_contributionFrequency;

          const n = getCompoundingFactor(compounding);
          const periodicRate = rate / 100 / n;
          const totalPeriods = years * n;

          // Adjust contribution frequency
          let periodsPerContribution;
          switch (contribFreq) {
            case "monthly":
              periodsPerContribution = n / 12;
              break;
            case "quarterly":
              periodsPerContribution = n / 4;
              break;
            case "annually":
              periodsPerContribution = n;
              break;
            default:
              periodsPerContribution = n / 12;
          }

          // Calculate compound amount
          let balance = principal;
          const breakdown = [];
          let totalContributions = principal;

          for (let period = 1; period <= totalPeriods; period++) {
            // Add interest
            balance = balance * (1 + periodicRate);

            // Add contribution at appropriate frequency
            if (contribution > 0 && period % periodsPerContribution === 0) {
              balance += contribution;
              totalContributions += contribution;
            }

            // Record yearly values
            if (period % n === 0) {
              const year = period / n;
              breakdown.push({
                year,
                contributions: totalContributions,
                interest: balance - totalContributions,
                balance: balance,
              });
            }
          }

          const totalInterest = balance - totalContributions;

          return {
            type: "compoundInterest",
            principal,
            rate,
            years,
            compounding,
            contribution,
            contribFreq,
            finalBalance: balance,
            totalContributions,
            totalInterest,
            breakdown,
            calculation: `Compound Interest: $${principal.toLocaleString()} at ${rate}% compounded ${compounding}`,
            summary: [
              {
                label: "Initial Principal",
                value: `$${principal.toLocaleString()}`,
              },
              { label: "Annual Rate", value: `${rate}%` },
              { label: "Compounding", value: compounding },
              { label: "Time Period", value: `${years} years` },
              {
                label: "Total Contributions",
                value: `$${totalContributions.toLocaleString()}`,
              },
              {
                label: "Total Interest",
                value: `$${totalInterest.toLocaleString()}`,
              },
              { label: "Final Balance", value: `$${balance.toLocaleString()}` },
            ],
          };
        }

        case "investmentGrowth": {
          const initial = parseFloat(formData.ig_initialAmount);
          const monthly = parseFloat(formData.ig_monthlyContribution);
          const rate = parseFloat(formData.ig_annualReturn);
          const years = parseFloat(formData.ig_years);
          const taxRate = parseFloat(formData.ig_taxRate) / 100;
          const fees = parseFloat(formData.ig_fees) / 100;

          // Adjust rate for fees
          const netRate = rate - fees;
          const monthlyRate = netRate / 100 / 12;
          const totalMonths = years * 12;

          let balance = initial;
          const breakdown = [];
          let totalContributions = initial;
          let totalInterest = 0;

          for (let year = 1; year <= years; year++) {
            for (let month = 1; month <= 12; month++) {
              // Add interest
              const interest = balance * monthlyRate;
              balance += interest;
              totalInterest += interest;

              // Add monthly contribution
              balance += monthly;
              totalContributions += monthly;
            }

            // Apply tax on gains annually
            const gains = balance - totalContributions;
            const tax = gains * taxRate;
            balance -= tax;

            breakdown.push({
              year,
              contributions: totalContributions,
              interest: totalInterest,
              afterTaxBalance: balance,
              taxPaid: tax,
            });
          }

          const afterTaxGains = balance - totalContributions;

          return {
            type: "investmentGrowth",
            initial,
            monthly,
            rate,
            years,
            taxRate: taxRate * 100,
            fees,
            finalBalance: balance,
            totalContributions,
            totalInterest,
            afterTaxGains,
            breakdown,
            calculation: `Investment Growth: $${initial.toLocaleString()} + $${monthly.toLocaleString()}/month at ${rate}% for ${years} years`,
            summary: [
              {
                label: "Initial Investment",
                value: `$${initial.toLocaleString()}`,
              },
              {
                label: "Monthly Contribution",
                value: `$${monthly.toLocaleString()}`,
              },
              { label: "Annual Return", value: `${rate}%` },
              { label: "Investment Period", value: `${years} years` },
              {
                label: "Total Contributions",
                value: `$${totalContributions.toLocaleString()}`,
              },
              {
                label: "Total Interest Earned",
                value: `$${totalInterest.toLocaleString()}`,
              },
              {
                label: "After-tax Balance",
                value: `$${balance.toLocaleString()}`,
              },
              {
                label: "After-tax Gains",
                value: `$${afterTaxGains.toLocaleString()}`,
              },
            ],
          };
        }

        case "lumpSum": {
          const initial = parseFloat(formData.ls_initialAmount);
          const rate = parseFloat(formData.ls_expectedReturn);
          const years = parseFloat(formData.ls_years);
          const inflation = parseFloat(formData.ls_inflation);

          const futureValue = initial * Math.pow(1 + rate / 100, years);
          const inflationAdjusted =
            futureValue / Math.pow(1 + inflation / 100, years);
          const totalGains = futureValue - initial;

          const breakdown = [];
          for (let year = 1; year <= years; year++) {
            const value = initial * Math.pow(1 + rate / 100, year);
            breakdown.push({
              year,
              value: value,
              gains: value - initial,
              inflationAdjusted: value / Math.pow(1 + inflation / 100, year),
            });
          }

          return {
            type: "lumpSum",
            initial,
            rate,
            years,
            inflation,
            futureValue,
            inflationAdjusted,
            totalGains,
            breakdown,
            calculation: `Lump Sum: $${initial.toLocaleString()} at ${rate}% for ${years} years`,
            summary: [
              {
                label: "Initial Investment",
                value: `$${initial.toLocaleString()}`,
              },
              { label: "Annual Return", value: `${rate}%` },
              { label: "Investment Period", value: `${years} years` },
              {
                label: "Future Value",
                value: `$${futureValue.toLocaleString()}`,
              },
              {
                label: "Total Gains",
                value: `$${totalGains.toLocaleString()}`,
              },
              {
                label: "Inflation Adjusted",
                value: `$${inflationAdjusted.toLocaleString()}`,
              },
            ],
          };
        }

        case "retirement": {
          const currentAge = parseFloat(formData.ret_currentAge);
          const retirementAge = parseFloat(formData.ret_retirementAge);
          const currentSavings = parseFloat(formData.ret_currentSavings);
          const monthlyContribution = parseFloat(
            formData.ret_monthlyContribution
          );
          const rate = parseFloat(formData.ret_expectedReturn);
          const inflation = parseFloat(formData.ret_inflation);
          const withdrawalRate = parseFloat(formData.ret_withdrawalRate);

          const yearsToRetirement = retirementAge - currentAge;
          const monthlyRate = rate / 100 / 12;
          const totalMonths = yearsToRetirement * 12;

          // Calculate retirement savings
          let retirementSavings = currentSavings;
          for (let month = 1; month <= totalMonths; month++) {
            retirementSavings =
              retirementSavings * (1 + monthlyRate) + monthlyContribution;
          }

          // Calculate annual withdrawal amount
          const annualWithdrawal = retirementSavings * (withdrawalRate / 100);
          const monthlyWithdrawal = annualWithdrawal / 12;

          // Calculate how long savings will last
          const inflationAdjustedRate =
            ((1 + rate / 100) / (1 + inflation / 100) - 1) * 100;
          const monthlyInflationRate = inflationAdjustedRate / 100 / 12;

          let yearsSavingsLast = 0;
          let remainingBalance = retirementSavings;
          const withdrawalSchedule = [];

          while (remainingBalance > 0 && yearsSavingsLast < 100) {
            for (let month = 1; month <= 12; month++) {
              // Add investment growth
              remainingBalance = remainingBalance * (1 + monthlyInflationRate);
              // Withdraw monthly amount
              remainingBalance -= monthlyWithdrawal;

              if (remainingBalance <= 0) break;
            }
            yearsSavingsLast++;

            withdrawalSchedule.push({
              year: yearsSavingsLast,
              remainingBalance: Math.max(remainingBalance, 0),
              annualWithdrawal: annualWithdrawal,
            });

            if (remainingBalance <= 0) break;
          }

          return {
            type: "retirement",
            currentAge,
            retirementAge,
            currentSavings,
            monthlyContribution,
            rate,
            inflation,
            withdrawalRate,
            yearsToRetirement,
            retirementSavings,
            annualWithdrawal,
            monthlyWithdrawal,
            yearsSavingsLast,
            withdrawalSchedule: withdrawalSchedule.slice(0, 10),
            calculation: `Retirement at ${retirementAge}: $${currentSavings.toLocaleString()} + $${monthlyContribution.toLocaleString()}/month`,
            summary: [
              { label: "Current Age", value: `${currentAge}` },
              { label: "Retirement Age", value: `${retirementAge}` },
              { label: "Years to Retirement", value: `${yearsToRetirement}` },
              {
                label: "Current Savings",
                value: `$${currentSavings.toLocaleString()}`,
              },
              {
                label: "Monthly Contribution",
                value: `$${monthlyContribution.toLocaleString()}`,
              },
              {
                label: "Retirement Savings",
                value: `$${retirementSavings.toLocaleString()}`,
              },
              {
                label: "Annual Withdrawal",
                value: `$${annualWithdrawal.toLocaleString()}`,
              },
              {
                label: "Savings Will Last",
                value: `${yearsSavingsLast} years`,
              },
            ],
          };
        }

        case "comparison": {
          const investment1 = parseFloat(formData.comp_investment1);
          const return1 = parseFloat(formData.comp_return1);
          const investment2 = parseFloat(formData.comp_investment2);
          const return2 = parseFloat(formData.comp_return2);
          const years = parseFloat(formData.comp_years);
          const monthlyContribution = parseFloat(
            formData.comp_monthlyContribution
          );

          // Calculate future values
          const fv1 = calculateFutureValue(
            investment1,
            monthlyContribution,
            years,
            return1,
            "monthly",
            0
          );
          const fv2 = calculateFutureValue(
            investment2,
            monthlyContribution,
            years,
            return2,
            "monthly",
            0
          );

          const difference = fv2.totalFV - fv1.totalFV;
          const percentageDifference = (difference / fv1.totalFV) * 100;

          const breakdown = [];
          for (let year = 1; year <= years; year++) {
            const yearFV1 = calculateFutureValue(
              investment1,
              monthlyContribution,
              year,
              return1,
              "monthly",
              0
            );
            const yearFV2 = calculateFutureValue(
              investment2,
              monthlyContribution,
              year,
              return2,
              "monthly",
              0
            );

            breakdown.push({
              year,
              investment1: yearFV1.totalFV,
              investment2: yearFV2.totalFV,
              difference: yearFV2.totalFV - yearFV1.totalFV,
            });
          }

          return {
            type: "comparison",
            investment1,
            return1,
            investment2,
            return2,
            years,
            monthlyContribution,
            futureValue1: fv1.totalFV,
            futureValue2: fv2.totalFV,
            difference,
            percentageDifference,
            breakdown,
            calculation: `Comparison: ${return1}% vs ${return2}% over ${years} years`,
            summary: [
              {
                label: "Investment 1 Amount",
                value: `$${investment1.toLocaleString()}`,
              },
              { label: "Investment 1 Return", value: `${return1}%` },
              {
                label: "Investment 2 Amount",
                value: `$${investment2.toLocaleString()}`,
              },
              { label: "Investment 2 Return", value: `${return2}%` },
              { label: "Investment Period", value: `${years} years` },
              {
                label: "Future Value 1",
                value: `$${fv1.totalFV.toLocaleString()}`,
              },
              {
                label: "Future Value 2",
                value: `$${fv2.totalFV.toLocaleString()}`,
              },
              { label: "Difference", value: `$${difference.toLocaleString()}` },
              {
                label: "Percentage Difference",
                value: `${percentageDifference.toFixed(2)}%`,
              },
            ],
          };
        }

        default:
          return null;
      }
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [formData, calculationType, validationErrors]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setCalculationType(type);
  };

  const resetForm = () => {
    setFormData({
      fv_initialInvestment: "10000",
      fv_monthlyContribution: "500",
      fv_investmentPeriod: "20",
      fv_expectedReturn: "7",
      fv_compoundingFrequency: "monthly",
      fv_inflationRate: "2.5",
      roi_initialInvestment: "10000",
      roi_finalValue: "25000",
      roi_investmentPeriod: "5",
      ci_principal: "10000",
      ci_annualRate: "7",
      ci_years: "10",
      ci_compounding: "monthly",
      ci_regularContribution: "500",
      ci_contributionFrequency: "monthly",
      ig_initialAmount: "10000",
      ig_monthlyContribution: "500",
      ig_annualReturn: "7",
      ig_years: "30",
      ig_taxRate: "15",
      ig_fees: "0.5",
      ls_initialAmount: "100000",
      ls_expectedReturn: "7",
      ls_years: "20",
      ls_inflation: "2.5",
      ret_currentAge: "30",
      ret_retirementAge: "65",
      ret_currentSavings: "50000",
      ret_monthlyContribution: "1000",
      ret_expectedReturn: "7",
      ret_inflation: "2.5",
      ret_withdrawalRate: "4",
      comp_investment1: "10000",
      comp_return1: "7",
      comp_investment2: "10000",
      comp_return2: "9",
      comp_years: "20",
      comp_monthlyContribution: "500",
    });
  };

  // Prepare chart data when results exist
  const chartData = useMemo(() => {
    if (!results) return { pieData: [], barData: [] };
    return prepareChartData(results);
  }, [results, calculationType]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Investment Calculator
        </h1>
        <p className="text-gray-600">
          Calculate various investment scenarios to plan your financial future
        </p>
      </div>

      {/* Calculation Type Selection */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {calculationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                calculationType === type.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {type.label}
                </h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {calculationTypes.find((t) => t.id === calculationType)?.label}{" "}
                Inputs
              </h2>
              <button
                onClick={resetForm}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-4">
              {getCurrentInputs().map((input) => (
                <InputGroup
                  key={input.name}
                  label={input.label}
                  name={input.name}
                  value={formData[input.name]}
                  type={input.type}
                  error={errors[input.name]}
                  onChange={handleInputChange}
                  options={input.options}
                  min={input.min}
                  max={input.max}
                  step={input.step}
                />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Note:</span> All calculations
                  are estimates. Actual results may vary based on market
                  conditions and other factors.
                </p>
                <p className="text-xs text-gray-500">
                  The calculator assumes consistent returns and contributions
                  throughout the investment period.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {Object.keys(errors).length > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Please fix the following errors:
              </h3>
              <ul className="space-y-1">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field} className="text-red-700 text-sm">
                    • {message}
                  </li>
                ))}
              </ul>
            </div>
          ) : results ? (
            <div className="space-y-6">
              {/* Results Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Results
                </h2>
                <p className="text-gray-600 mb-6">{results.calculation}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {results.summary.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Pie Chart */}
                  {chartData.pieData.length > 0 && (
                    renderPieChart(chartData.pieData, "Investment Composition")
                  )}

                  {/* Bar Chart */}
                  {chartData.barData.length > 0 && calculationType !== "roi" && (
                    renderBarChart(
                      chartData.barData,
                      calculationType === "comparison" 
                        ? "Investment Comparison Over Time" 
                        : calculationType === "retirement"
                        ? "Retirement Withdrawal Schedule"
                        : "Growth Over Time",
                      "year",
                      calculationType === "comparison"
                        ? [
                            { dataKey: "Investment 1", name: "Investment 1", color: BAR_COLORS[0] },
                            { dataKey: "Investment 2", name: "Investment 2", color: BAR_COLORS[1] }
                          ]
                        : calculationType === "retirement"
                        ? [
                            { dataKey: "Remaining Balance", name: "Remaining Balance", color: BAR_COLORS[0] },
                            { dataKey: "Annual Withdrawal", name: "Annual Withdrawal", color: BAR_COLORS[1] }
                          ]
                        : [
                            { dataKey: "Total Contributions", name: "Contributions", color: BAR_COLORS[0] },
                            { dataKey: "Interest Earned", name: "Interest", color: BAR_COLORS[1] },
                            { dataKey: "Total Balance", name: "Total", color: "#FFBB28" }
                          ]
                    )
                  )}

                  {/* Special ROI Bar Chart */}
                  {calculationType === "roi" && chartData.barData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">ROI Comparison</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData.barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                            <Bar 
                              dataKey="value" 
                              name="Value" 
                              fill={BAR_COLORS[0]} 
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Results Display */}
                <div className="mb-8">
                  <ResultDisplay
                    results={results}
                    calculationType={calculationType}
                  />
                </div>
              </div>

              {/* Detailed Breakdown */}
              {results.breakdown && results.breakdown.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Year-by-Year Breakdown
                  </h3>
                  {(() => {
                    if (calculationType === "lumpSum") {
                      return renderLumpSumTable(results.breakdown);
                    } else if (calculationType === "comparison") {
                      return renderComparisonTable(results.breakdown);
                    } else if (
                      [
                        "futureValue",
                        "compoundInterest",
                        "investmentGrowth",
                      ].includes(calculationType)
                    ) {
                      return renderInvestmentTable(results.breakdown);
                    }
                    return null;
                  })()}
                </div>
              )}

              {/* Withdrawal Schedule for Retirement */}
              {calculationType === "retirement" &&
                results.withdrawalSchedule && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Withdrawal Schedule
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Based on a {results.withdrawalRate}% withdrawal rate, your
                      savings will last approximately {results.yearsSavingsLast}{" "}
                      years.
                    </p>
                    {renderRetirementWithdrawalTable(
                      results.withdrawalSchedule
                    )}
                  </div>
                )}

              {/* Comparison Results */}
              {calculationType === "comparison" && results.breakdown && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Performance Comparison
                  </h3>
                  <div className="mb-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">
                          Investment 1 (${results.return1}%)
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          ${results.futureValue1.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Difference</p>
                        <p
                          className={`text-2xl font-bold ${
                            results.difference > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ${Math.abs(results.difference).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Investment 2 (${results.return2}%)
                        </p>
                        <p className="text-2xl font-bold text-green-700">
                          ${results.futureValue2.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {renderComparisonTable(results.breakdown)}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Calculate
                </h3>
                <p className="text-gray-600">
                  Enter your investment details in the form to see calculations
                  and projections.
                </p>
              </div>
            </div>
          )}

          {/* Information Section */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              About This Calculator
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              {calculationType === "futureValue" && (
                <>
                  <p>
                    The Future Value calculator helps you project how much your
                    investments could grow over time, accounting for compound
                    interest and inflation.
                  </p>
                  <p>
                    <strong>Key Assumptions:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Returns are compounded according to your selected
                      frequency
                    </li>
                    <li>Contributions are made at the end of each period</li>
                    <li>
                      Inflation is applied to show the purchasing power of
                      future amounts
                    </li>
                    <li>
                      Returns are consistent throughout the investment period
                    </li>
                  </ul>
                </>
              )}
              {calculationType === "roi" && (
                <>
                  <p>
                    The Return on Investment (ROI) calculator measures the
                    profitability of an investment relative to its cost.
                  </p>
                  <p>
                    <strong>How it's calculated:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Total ROI:</strong> (Final Value - Initial
                      Investment) ÷ Initial Investment × 100
                    </li>
                    <li>
                      <strong>Annualized ROI:</strong> Average yearly return
                      that would produce the total ROI over the period
                    </li>
                  </ul>
                </>
              )}
              {calculationType === "compoundInterest" && (
                <>
                  <p>
                    Compound interest is interest calculated on the initial
                    principal and also on the accumulated interest of previous
                    periods.
                  </p>
                  <p>
                    <strong>The power of compounding:</strong> Your money grows
                    faster because you earn returns on both your original
                    investment and the returns it generates over time.
                  </p>
                </>
              )}
              {calculationType === "investmentGrowth" && (
                <>
                  <p>
                    This calculator projects investment growth while accounting
                    for taxes on gains and management fees.
                  </p>
                  <p>
                    <strong>Important notes:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Taxes are applied annually to gains</li>
                    <li>Fees are deducted from the annual return</li>
                    <li>
                      This assumes capital gains tax is applied annually (like
                      in some retirement accounts)
                    </li>
                  </ul>
                </>
              )}
              {calculationType === "lumpSum" && (
                <>
                  <p>
                    The Lump Sum calculator shows the growth potential of a
                    single, one-time investment.
                  </p>
                  <p>
                    <strong>Considerations:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Lump sum investing typically performs better over long
                      periods
                    </li>
                    <li>
                      The inflation-adjusted value shows the real purchasing
                      power
                    </li>
                    <li>This doesn't include taxes or fees</li>
                  </ul>
                </>
              )}
              {calculationType === "retirement" && (
                <>
                  <p>
                    The Retirement Planning calculator helps you estimate how
                    much you need to save for retirement and how long your
                    savings might last.
                  </p>
                  <p>
                    <strong>The 4% Rule:</strong> A common retirement guideline
                    suggesting you can withdraw 4% of your portfolio annually
                    with a high probability it will last 30 years.
                  </p>
                </>
              )}
              {calculationType === "comparison" && (
                <>
                  <p>
                    Compare two different investment scenarios to see how small
                    differences in returns can significantly impact your wealth
                    over time.
                  </p>
                  <p>
                    <strong>Key Insight:</strong> Even a 1-2% difference in
                    annual returns can result in substantially different
                    outcomes over decades.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          <strong>Disclaimer:</strong> This calculator provides estimates for
          educational purposes only. It is not financial advice. Past
          performance does not guarantee future results. Consult with a
          qualified financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
}