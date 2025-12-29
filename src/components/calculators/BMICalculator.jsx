import { useState, useMemo, useEffect } from "react";
import InputGroup from "../ui/InputGroup";
import ResultDisplay from "../charts/ResultDisplay";
import DataTable from "../tables/DataTable";

export default function BMICalculator() {
  const [measurementSystem, setMeasurementSystem] = useState("imperial");
  const [formData, setFormData] = useState({
    system: "imperial",
    age: "30",
    gender: "male",
    heightFeet: "5",
    heightInches: "9",
    weight: "160",
    heightCm: "170",
    weightKg: "70",
    activityLevel: "sedentary",
    goal: "maintain",
  });
  const [errors, setErrors] = useState({});

  // All possible inputs
  const allInputs = [
    {
      name: "system",
      label: "Measurement System",
      type: "select",
      default: "imperial",
      required: true,
      options: [
        { value: "imperial", label: "Imperial (US) - lbs, feet/inches" },
        { value: "metric", label: "Metric - kg, cm" },
      ],
    },
    {
      name: "age",
      label: "Age (years)",
      type: "number",
      default: 30,
      required: true,
      min: 2,
      max: 120,
      step: 1,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      default: "male",
      required: true,
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
    },
    {
      name: "activityLevel",
      label: "Activity Level",
      type: "select",
      default: "sedentary",
      required: true,
      options: [
        { value: "sedentary", label: "Sedentary (little or no exercise)" },
        { value: "light", label: "Light (1-3 days/week)" },
        { value: "moderate", label: "Moderate (3-5 days/week)" },
        { value: "active", label: "Active (6-7 days/week)" },
        { value: "veryActive", label: "Very Active (intense daily exercise)" },
      ],
    },
    {
      name: "goal",
      label: "Health Goal",
      type: "select",
      default: "maintain",
      required: true,
      options: [
        { value: "loseWeight", label: "Lose Weight" },
        { value: "maintain", label: "Maintain Weight" },
        { value: "gainWeight", label: "Gain Weight" },
      ],
    },
  ];

  // Dynamic inputs based on measurement system
  const dynamicInputs = useMemo(() => {
    if (measurementSystem === "imperial") {
      return [
        {
          name: "heightFeet",
          label: "Height (Feet)",
          type: "number",
          default: 5,
          required: true,
          min: 1,
          max: 8,
          step: 1,
        },
        {
          name: "heightInches",
          label: "Height (Inches)",
          type: "number",
          default: 9,
          required: true,
          min: 0,
          max: 11,
          step: 1,
        },
        {
          name: "weight",
          label: "Weight (lbs)",
          type: "number",
          default: 160,
          required: true,
          min: 20,
          max: 1000,
          step: 1,
        },
      ];
    } else {
      return [
        {
          name: "heightCm",
          label: "Height (cm)",
          type: "number",
          default: 170,
          required: true,
          min: 50,
          max: 300,
          step: 1,
        },
        {
          name: "weightKg",
          label: "Weight (kg)",
          type: "number",
          default: 70,
          required: true,
          min: 5,
          max: 500,
          step: 0.1,
        },
      ];
    }
  }, [measurementSystem]);

  // Combined inputs
  const inputs = [...allInputs, ...dynamicInputs];

  // Validate inputs
  const validationErrors = useMemo(() => {
    const errors = {};
    inputs.forEach((input) => {
      const value = formData[input.name];

      if (input.required && !value && value !== 0) {
        errors[input.name] = `${input.label} is required`;
      }

      if (value && input.min !== undefined && parseFloat(value) < input.min) {
        errors[input.name] = `Minimum ${input.label} is ${input.min}`;
      }

      if (value && input.max !== undefined && parseFloat(value) > input.max) {
        errors[input.name] = `Maximum ${input.label} is ${input.max}`;
      }
    });
    return errors;
  }, [formData, inputs]);

  // Update errors state only when validationErrors change
  useEffect(() => {
    setErrors(validationErrors);
  }, [validationErrors]);

  // Calculate BMR (Basal Metabolic Rate)
  const calculateBMR = (weightKg, heightCm, age, gender) => {
    if (gender === "male") {
      return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = (bmr, activityLevel) => {
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    return bmr * (activityMultipliers[activityLevel] || 1.2);
  };

  // Calculate daily calorie needs based on goal
  const calculateDailyCalories = (tdee, goal) => {
    switch (goal) {
      case "loseWeight":
        return tdee - 500;
      case "gainWeight":
        return tdee + 500;
      default:
        return tdee;
    }
  };

  // Calculate results - REMOVED setErrors from here
  const results = useMemo(() => {
    if (Object.keys(validationErrors).length > 0) {
      return null;
    }

    try {
      const age = parseInt(formData.age);
      const gender = formData.gender;
      const activityLevel = formData.activityLevel;
      const goal = formData.goal;

      let heightMeters, weightKg, heightCm;

      if (measurementSystem === "imperial") {
        const heightFeet = parseFloat(formData.heightFeet);
        const heightInches = parseFloat(formData.heightInches);
        const totalInches = heightFeet * 12 + heightInches;
        heightMeters = totalInches * 0.0254;
        heightCm = totalInches * 2.54;
        weightKg = parseFloat(formData.weight) * 0.453592;
      } else {
        heightCm = parseFloat(formData.heightCm);
        heightMeters = heightCm / 100;
        weightKg = parseFloat(formData.weightKg);
      }

      // Calculate BMI
      const bmi = weightKg / (heightMeters * heightMeters);

      // Determine BMI category
      let category, color, healthRisk;
      if (bmi < 16) {
        category = "Severe Thinness";
        color = "text-red-600";
        healthRisk = "High risk of nutritional deficiency diseases";
      } else if (bmi < 17) {
        category = "Moderate Thinness";
        color = "text-orange-600";
        healthRisk = "Moderate risk of nutritional deficiency";
      } else if (bmi < 18.5) {
        category = "Mild Thinness";
        color = "text-yellow-600";
        healthRisk = "Low risk but may indicate underweight";
      } else if (bmi < 25) {
        category = "Normal";
        color = "text-green-600";
        healthRisk = "Lowest risk of health problems";
      } else if (bmi < 30) {
        category = "Overweight";
        color = "text-yellow-600";
        healthRisk = "Moderate risk of health problems";
      } else if (bmi < 35) {
        category = "Obese Class I";
        color = "text-orange-600";
        healthRisk = "High risk of health problems";
      } else if (bmi < 40) {
        category = "Obese Class II";
        color = "text-red-600";
        healthRisk = "Very high risk of health problems";
      } else {
        category = "Obese Class III";
        color = "text-red-700";
        healthRisk = "Extremely high risk of health problems";
      }

      // Calculate healthy weight range
      const minHealthyWeight = 18.5 * (heightMeters * heightMeters);
      const maxHealthyWeight = 24.9 * (heightMeters * heightMeters);

      // Convert back to user's system
      let healthyWeightRange, currentWeightDisplay;
      if (measurementSystem === "imperial") {
        const minLbs = minHealthyWeight / 0.453592;
        const maxLbs = maxHealthyWeight / 0.453592;
        const currentLbs = weightKg / 0.453592;
        healthyWeightRange = `${minLbs.toFixed(1)} - ${maxLbs.toFixed(1)} lbs`;
        currentWeightDisplay = `${currentLbs.toFixed(1)} lbs`;
      } else {
        healthyWeightRange = `${minHealthyWeight.toFixed(1)} - ${maxHealthyWeight.toFixed(1)} kg`;
        currentWeightDisplay = `${weightKg.toFixed(1)} kg`;
      }

      // Calculate BMR, TDEE, and Daily Calories
      const bmr = calculateBMR(weightKg, heightCm, age, gender);
      const tdee = calculateTDEE(bmr, activityLevel);
      const dailyCalories = calculateDailyCalories(tdee, goal);

      // Create weight management plan
      const weeksToGoal = Math.abs(
        goal === "loseWeight"
          ? (weightKg - minHealthyWeight) / 0.45
          : goal === "gainWeight"
            ? (minHealthyWeight - weightKg) / 0.45
            : 0
      );

      // Create detailed breakdown table
      const breakdownData = [
        { category: "Current Weight", value: currentWeightDisplay },
        { category: "Height", value: `${heightCm.toFixed(1)} cm` },
        { category: "BMI", value: bmi.toFixed(1) },
        { category: "Category", value: category },
        { category: "BMR", value: `${bmr.toFixed(0)} calories/day` },
        { category: "TDEE", value: `${tdee.toFixed(0)} calories/day` },
        {
          category: "Daily Calories",
          value: `${dailyCalories.toFixed(0)} calories/day`,
        },
        { category: "Healthy Weight Range", value: healthyWeightRange },
      ];

      if (goal !== "maintain") {
        breakdownData.push({
          category: "Estimated Time to Goal",
          value: `${weeksToGoal.toFixed(0)} weeks`,
        });
      }

      return {
        bmi: bmi.toFixed(1),
        category,
        color,
        healthRisk,
        heightCm: heightCm.toFixed(1),
        weightKg: weightKg.toFixed(1),
        age,
        gender: gender === "male" ? "Male" : "Female",
        measurementSystem,
        healthyWeightRange,
        currentWeightDisplay,
        bmr: bmr.toFixed(0),
        tdee: tdee.toFixed(0),
        dailyCalories: dailyCalories.toFixed(0),
        goal,
        activityLevel,
        weeksToGoal: weeksToGoal.toFixed(0),
        breakdownData,
        bmiValues: {
          severeThinness: 16,
          moderateThinness: 17,
          mildThinness: 18.5,
          normal: 25,
          overweight: 30,
          obese1: 35,
          obese2: 40,
        },
      };
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [formData, measurementSystem, validationErrors]);

  const handleInputChange = (name, value) => {
    if (name === "system") {
      setMeasurementSystem(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      system: "imperial",
      age: "30",
      gender: "male",
      heightFeet: "5",
      heightInches: "9",
      weight: "160",
      heightCm: "170",
      weightKg: "70",
      activityLevel: "sedentary",
      goal: "maintain",
    });
    setErrors({});
  };

  const chartConfig = (results) => ({
    bar: {
      data: {
        labels: ["Your BMI", "Underweight", "Normal", "Overweight", "Obese"],
        datasets: [
          {
            label: "BMI Categories",
            data: [
              parseFloat(results.bmi),
              results.bmiValues.mildThinness,
              results.bmiValues.normal,
              results.bmiValues.overweight,
              results.bmiValues.obese1,
            ],
            backgroundColor: [
              "rgb(59, 130, 246)",
              "rgb(253, 224, 71)",
              "rgb(34, 197, 94)",
              "rgb(253, 224, 71)",
              "rgb(239, 68, 68)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                if (context.dataIndex === 0) {
                  return `Your BMI: ${results.bmi}`;
                }
                const labels = ["Underweight", "Normal", "Overweight", "Obese"];
                return `${labels[context.dataIndex - 1]}: < ${context.raw}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "BMI Value",
            },
          },
        },
      },
    },
    pie: {
      data: {
        labels: ["BMR", "Activity"],
        datasets: [
          {
            data: [
              parseFloat(results.bmr),
              parseFloat(results.tdee) - parseFloat(results.bmr),
            ],
            backgroundColor: ["rgb(59, 130, 246)", "rgb(139, 92, 246)"],
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                return `${label}: ${value.toFixed(0)} calories`;
              },
            },
          },
        },
      },
    },
  });

  const tableConfig = (results) => ({
    data: results.breakdownData,
    columns: [
      { key: "category", header: "Metric" },
      { key: "value", header: "Value" },
    ],
    pagination: false,
  });

  return (
    <div className="space-y-8">
      {/* Calculator header */}
      <div>
        <h1 className="text-3xl font-bold text-text">BMI Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Calculate your Body Mass Index with comprehensive health insights
          including BMR, TDEE, and personalized calorie recommendations.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input section */}
        <div className="card space-y-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>

          {inputs.map((input) => (
            <InputGroup
              key={input.name}
              label={input.label}
              name={input.name}
              type={input.type}
              value={formData[input.name]}
              onChange={handleInputChange}
              error={errors[input.name]}
              placeholder={input.placeholder}
              min={input.min}
              max={input.max}
              step={input.step}
              options={input.options}
            />
          ))}

          <div className="flex gap-4 pt-4">
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Reset
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors">
              Calculate
            </button>
          </div>
        </div>

        {/* Results section */}
        <div className="space-y-6">
          {results && (
            <>
              {/* BMI Result Card */}
              <div className="card bg-gradient-to-br from-primary/5 to-transparent">
                <div className="text-center mb-6">
                  <h2 className="text-2xl py-1 text-white bg-green-700 font-bold mb-2">
                    Result
                  </h2>
                  <h2 className="text-xl font-semibold mb-2">
                    Your BMI Results
                  </h2>
                  <p className="text-sm text-text/60">
                    {results.age} year old {results.gender.toLowerCase()}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                  <div className="text-6xl font-bold mb-2">{results.bmi}</div>
                  <div
                    className={`text-xl font-semibold mb-4 ${results.color}`}
                  >
                    {results.category}
                  </div>
                  <div className="text-center max-w-md text-text/70">
                    {results.healthRisk}
                  </div>
                </div>

                {/* BMI Scale */}
                <div className="mt-6 relative">
                  <div className="flex justify-between text-xs text-text/60 mb-1">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                  <div className="h-6 rounded-full overflow-hidden flex">
                    <div className="bg-yellow-400 flex-1"></div>
                    <div className="bg-green-500 flex-1"></div>
                    <div className="bg-yellow-500 flex-1"></div>
                    <div className="bg-red-500 flex-1"></div>
                    <div className="bg-red-600 flex-1"></div>
                    <div className="bg-red-700 flex-1"></div>
                  </div>
                  <div className="flex justify-between text-xs text-text/60 mt-1">
                    <span>16</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>35</span>
                    <span>40</span>
                  </div>

                  {/* BMI Indicator */}
                  <div
                    className="h-8 w-1 bg-primary absolute -bottom-2 transform -translate-x-1/2"
                    style={{
                      left: `${Math.min(Math.max(((parseFloat(results.bmi) - 15) / 30) * 100, 0), 100)}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-primary">
                      {results.bmi}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Display */}
              <ResultDisplay
                results={results}
                chartConfig={chartConfig(results)}
                tableConfig={tableConfig(results)}
              />
            </>
          )}
        </div>
      </div>

      {/* Health Information */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Health Insights & Recommendations
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Metabolism Information</h3>
            {results && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-sm text-text/60">
                    Basal Metabolic Rate (BMR)
                  </div>
                  <div className="text-xl font-bold">
                    {results.bmr} calories/day
                  </div>
                  <p className="text-sm text-text/60 mt-1">
                    Calories burned at rest
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-sm text-text/60">
                    Total Daily Energy Expenditure (TDEE)
                  </div>
                  <div className="text-xl font-bold">
                    {results.tdee} calories/day
                  </div>
                  <p className="text-sm text-text/60 mt-1">
                    Calories burned with activity
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-sm text-text/60">
                    Daily Calorie Target
                  </div>
                  <div className="text-xl font-bold">
                    {results.dailyCalories} calories/day
                  </div>
                  <p className="text-sm text-text/60 mt-1">
                    For {results.goal.replace("Weight", "").toLowerCase()}ing
                    weight
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Personalized Recommendations</h3>
            <div className="space-y-3">
              {results?.category.includes("Thinness") ? (
                <>
                  <div className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span className="text-yellow-600 mr-3">💪</span>
                    <div>
                      <p className="font-medium">
                        Focus on healthy weight gain
                      </p>
                      <p className="text-sm text-text/60">
                        Increase calorie intake with nutrient-dense foods and
                        include strength training
                      </p>
                    </div>
                  </div>
                </>
              ) : results?.category === "Normal" ? (
                <>
                  <div className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-green-600 mr-3">✅</span>
                    <div>
                      <p className="font-medium">
                        Maintain your healthy weight
                      </p>
                      <p className="text-sm text-text/60">
                        Continue balanced nutrition and regular physical
                        activity
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-red-600 mr-3">⚖️</span>
                    <div>
                      <p className="font-medium">
                        Consider gradual weight management
                      </p>
                      <p className="text-sm text-text/60">
                        Aim for 1-2 lbs (0.5-1 kg) weight loss per week through
                        diet and exercise
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-blue-600 mr-3">🏥</span>
                <div>
                  <p className="font-medium">Important Note</p>
                  <p className="text-sm text-text/60">
                    BMI is a screening tool. It doesn't account for muscle mass,
                    bone density, or body composition. Always consult with
                    healthcare professionals for personalized medical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
