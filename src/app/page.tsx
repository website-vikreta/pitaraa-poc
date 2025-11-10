"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity, 
  Calendar, 
  DollarSign, 
  Loader2, 
  TrendingUp 
} from 'lucide-react';



// Real sales data
const salesData = [
   {
      "Financial_Year": "FY2023-24",
      "monthly": [
         { "month": "Apr", "sales": 37.36 },
         { "month": "May", "sales": 41.7 },
         { "month": "Jun", "sales": 43.48 },
         { "month": "Jul", "sales": 46.84 },
         { "month": "Aug", "sales": 48.63 },
         { "month": "Sep", "sales": 47.12 },
         { "month": "Oct", "sales": 52.68 },
         { "month": "Nov", "sales": 47.64 },
         { "month": "Dec", "sales": 50.1 },
         { "month": "Jan", "sales": 44.37 },
         { "month": "Feb", "sales": 43.78 },
         { "month": "Mar", "sales": 47.53 }
      ]
   },
   {
      "Financial_Year": "FY2024-25",
      "monthly": [
         { "month": "Apr", "sales": 38.71 },
         { "month": "May", "sales": 43.15 },
         { "month": "Jun", "sales": 44.82 },
         { "month": "Jul", "sales": 48.4 },
         { "month": "Aug", "sales": 49.8 },
         { "month": "Sep", "sales": 48.91 },
         { "month": "Oct", "sales": 53.54 },
         { "month": "Nov", "sales": 49.72 },
         { "month": "Dec", "sales": 50.92 },
         { "month": "Jan", "sales": 47.52 },
         { "month": "Feb", "sales": 45.96 },
         { "month": "Mar", "sales": 49.22 }
      ]
   },
   {
      "Financial_Year": "FY2025-26",
      "monthly": [
         { "month": "Apr", "sales": 39.4 },
         { "month": "May", "sales": 44.7 },
         { "month": "Jun", "sales": 47.05 },
         { "month": "Jul", "sales": 50.93 },
         { "month": "Aug", "sales": 51.98 },
         { "month": "Sep", "sales": 50.07 },
         { "month": "Oct", "sales": 56.18 },
         { "month": "Nov", "sales": 51.54 },
         { "month": "Dec", "sales": 52.43 },
         { "month": "Jan", "sales": 48.81 },
         { "month": "Feb", "sales": 46.85 },
         { "month": "Mar", "sales": 51.3 }
      ]
   }
];

// Calculate yearly total from monthly data
const calculateYearlyTotal = (monthly: { month: string; sales: number }[]) => {
   return monthly.reduce((sum, month) => sum + month.sales, 0);
};

// Calculate quarterly data from monthly data
const calculateQuarterly = (monthly: { month: string; sales: number }[]) => {
   const quarters = [
      { quarter: "Q1", months: ["Apr", "May", "Jun"], fill: "hsl(var(--chart-1))" },
      { quarter: "Q2", months: ["Jul", "Aug", "Sep"], fill: "hsl(var(--chart-2))" },
      { quarter: "Q3", months: ["Oct", "Nov", "Dec"], fill: "hsl(var(--chart-3))" },
      { quarter: "Q4", months: ["Jan", "Feb", "Mar"], fill: "hsl(var(--chart-4))" },
   ];

   return quarters.map(q => ({
      quarter: q.quarter,
      sales: parseFloat(monthly
         .filter(m => q.months.includes(m.month))
         .reduce((sum, m) => sum + m.sales, 0)
         .toFixed(2)),
      fill: q.fill,
   }));
};

// Calculate growth rate between two years
const calculateGrowthRate = (current: number, previous: number) => {
   return ((current - previous) / previous * 100).toFixed(1);
};

// Generate predicted data based on growth trend
const generatePredictedData = (yearsAhead: number) => {
   const lastYear = salesData[salesData.length - 1];
   const secondLastYear = salesData[salesData.length - 2];

   const lastYearTotal = calculateYearlyTotal(lastYear.monthly);
   const secondLastYearTotal = calculateYearlyTotal(secondLastYear.monthly);

   const growthRate = (lastYearTotal - secondLastYearTotal) / secondLastYearTotal;

   const predictedMonthly = lastYear.monthly.map(m => ({
      month: m.month,
      sales: parseFloat((m.sales * Math.pow(1 + growthRate, yearsAhead)).toFixed(2)),
   }));

   return {
      monthly: predictedMonthly,
   };
};

// Generate all years including predictions (10 years ahead)
const generateAllYears = () => {
   const actualYears = salesData.map(d => d.Financial_Year);
   const lastYear = actualYears[actualYears.length - 1];
   const lastYearNum = parseInt(lastYear.split("-")[1]);

   const predictedYears = [];
   for (let i = 1; i <= 10; i++) {
      const startYear = lastYearNum + i;
      const endYear = startYear + 1;
      predictedYears.push(`FY20${startYear}-${endYear}`);
   }

   return [...actualYears, ...predictedYears];
};

const allYears = generateAllYears();

// Chart configurations
const yearlyChartConfig = {
   sales: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
   },
};

const monthlyChartConfig = {
   sales: {
      label: "Sales",
      color: "hsl(var(--chart-2))",
   },
};

const quarterlyChartConfig = {
   Q1: {
      label: "Q1",
      color: "hsl(var(--chart-1))",
   },
   Q2: {
      label: "Q2",
      color: "hsl(var(--chart-2))",
   },
   Q3: {
      label: "Q3",
      color: "hsl(var(--chart-3))",
   },
   Q4: {
      label: "Q4",
      color: "hsl(var(--chart-4))",
   },
};

export default function Home() {
   const [selectedYear, setSelectedYear] = useState<string>("FY2024-25");
   const [isLoading, setIsLoading] = useState(false);

   // Simulate loading when year changes
   useEffect(() => {
      setIsLoading(true);
      const timer = setTimeout(() => {
         setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
   }, [selectedYear]);

   // Determine if selected year is a prediction
   const isPrediction = !salesData.find(d => d.Financial_Year === selectedYear);

   // Get data for selected year
   const getCurrentData = () => {
      const actualData = salesData.find(d => d.Financial_Year === selectedYear);
      if (actualData) {
         return actualData;
      }

      // Generate predicted data
      const yearIndex = allYears.indexOf(selectedYear);
      const lastActualYearIndex = salesData.length - 1;
      const yearsAhead = yearIndex - lastActualYearIndex;
      return {
         Financial_Year: selectedYear,
         ...generatePredictedData(yearsAhead),
      };
   };

   const currentData = getCurrentData();
   const currentYearlyTotal = calculateYearlyTotal(currentData.monthly);
   const currentQuarterly = calculateQuarterly(currentData.monthly);

   // Year-on-Year comparison data
   const yearOnYearData = allYears.map((year, index) => {
      const actualData = salesData.find(d => d.Financial_Year === year);

      if (actualData) {
         return {
            year: year.replace("FY", ""),
            sales: parseFloat(calculateYearlyTotal(actualData.monthly).toFixed(2)),
            isPredicted: false,
         };
      } else {
         const yearsAhead = index - salesData.length + 1;
         const predicted = generatePredictedData(yearsAhead);
         return {
            year: year.replace("FY", ""),
            sales: parseFloat(calculateYearlyTotal(predicted.monthly).toFixed(2)),
            isPredicted: true,
         };
      }
   });

   // Calculate growth rate
   const calculateCurrentGrowth = () => {
      const yearIndex = allYears.indexOf(selectedYear);
      if (yearIndex > 0) {
         const prevYearData = yearOnYearData[yearIndex - 1];
         const currentYearData = yearOnYearData[yearIndex];
         return calculateGrowthRate(currentYearData.sales, prevYearData.sales);
      }
      return "0.0";
   };

   const growthRate = calculateCurrentGrowth();

   // Loading skeleton component
   const LoadingSkeleton = () => (
      <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
               <Card key={i} className="shadow-lg border-0">
                  <CardHeader className="pb-3">
                     <Skeleton className="h-4 w-32 mb-2" />
                     <Skeleton className="h-8 w-24" />
                     <Skeleton className="h-6 w-20 mt-2" />
                  </CardHeader>
               </Card>
            ))}
         </div>
         <Card className="shadow-lg border-0">
            <CardHeader>
               <Skeleton className="h-6 w-64 mb-2" />
               <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
               <Skeleton className="h-[400px] w-full" />
            </CardContent>
         </Card>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
               <Card key={i} className="shadow-lg border-0">
                  <CardHeader>
                     <Skeleton className="h-6 w-48 mb-2" />
                     <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                     <Skeleton className="h-[350px] w-full" />
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
         <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
               <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                     <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                           <BarChart3 className="w-6 h-6" />
                        </div>
                        <h1 className="text-white">Pitaara Sales Prediction Dashboard</h1>
                     </div>
                     <p className="text-blue-100">
                        Track, analyze, and forecast sales performance across financial years.
                     </p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                     <Calendar className="w-5 h-5" />
                     <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[220px] bg-white text-slate-900 border-0">
                           <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                           {allYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                 {year}
                                 {!salesData.find(d => d.Financial_Year === year) && " 🔮 Predicted"}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </div>

            {/* Prediction Alert */}
            {isPrediction && !isLoading && (
               <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-purple-100 rounded-full">
                     <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                     <p className="text-purple-900">
                        <span className="font-semibold">📊 Forecasted Data</span>
                     </p>
                     <p className="text-purple-700">
                        Displaying predicted sales data for {selectedYear} based on historical trends and growth patterns.
                     </p>
                  </div>
                  <Badge className="bg-purple-600 hover:bg-purple-700">
                     Prediction Mode
                  </Badge>
               </div>
            )}

            {/* Loading State */}
            {isLoading ? (
               <div className="space-y-6">
                  <div className="flex items-center justify-center py-12">
                     <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                        <p className="text-slate-600">Loading {selectedYear} data...</p>
                     </div>
                  </div>
                  <LoadingSkeleton />
               </div>
            ) : (
               <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <CardHeader className="pb-3 relative z-10">
                           <CardDescription className="flex items-center gap-2 text-emerald-100">
                              <div className="p-2 bg-white/20 rounded-lg">
                                 <DollarSign className="w-4 h-4" />
                              </div>
                              Total Annual Sales
                           </CardDescription>
                           <CardTitle className="text-white mt-2">
                              ₹{currentYearlyTotal.toFixed(2)} L
                           </CardTitle>
                           <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-white/20 text-white hover:bg-white/30">
                                 {isPrediction ? "Forecasted" : "Actual"}
                              </Badge>
                           </div>
                        </CardHeader>
                     </Card>

                     <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-cyan-600 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <CardHeader className="pb-3 relative z-10">
                           <CardDescription className="flex items-center gap-2 text-blue-100">
                              <div className="p-2 bg-white/20 rounded-lg">
                                 <PieChartIcon className="w-4 h-4" />
                              </div>
                              Average Quarterly Sales
                           </CardDescription>
                           <CardTitle className="text-white mt-2">
                              ₹{(currentYearlyTotal / 4).toFixed(2)} L
                           </CardTitle>
                           <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-white/20 text-white hover:bg-white/30">
                                 Per Quarter
                              </Badge>
                           </div>
                        </CardHeader>
                     </Card>

                     <Card className="shadow-lg border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <CardHeader className="pb-3 relative z-10">
                           <CardDescription className="flex items-center gap-2 text-violet-100">
                              <div className="p-2 bg-white/20 rounded-lg">
                                 <Activity className="w-4 h-4" />
                              </div>
                              Growth Rate (YoY)
                           </CardDescription>
                           <CardTitle className="text-white mt-2">
                              {growthRate}%
                           </CardTitle>
                           <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-white/20 text-white hover:bg-white/30">
                                 {parseFloat(growthRate) > 0 ? "📈 Growing" : "📉 Declining"}
                              </Badge>
                           </div>
                        </CardHeader>
                     </Card>
                  </div>

                  {/* Quarterly and Monthly Sales Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     {/* Quarterly Sales - Pie Chart */}
                     <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
                           <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                 <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                       <PieChartIcon className="w-5 h-5 text-purple-600" />
                                    </div>
                                    Quarterly Sales - {selectedYear}
                                 </CardTitle>
                                 <CardDescription className="mt-2">
                                    Sales distribution per quarter (in Lakhs ₹)
                                 </CardDescription>
                              </div>
                              {isPrediction && (
                                 <Badge className="bg-purple-600">
                                    Predicted
                                 </Badge>
                              )}
                           </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                           <ChartContainer config={quarterlyChartConfig} className="h-[350px] w-full">
                              <PieChart>
                                 <ChartTooltip content={<ChartTooltipContent />} />
                                 <Pie
                                    data={currentQuarterly}
                                    dataKey="sales"
                                    nameKey="quarter"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    label={(entry) => `${entry.quarter}: ₹${entry.sales}L`}
                                 >
                                    {currentQuarterly.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                 </Pie>
                                 <ChartLegend content={<ChartLegendContent />} />
                              </PieChart>
                           </ChartContainer>
                        </CardContent>
                     </Card>

                     {/* Monthly Sales - Bar Chart */}
                     <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="border-b bg-gradient-to-r from-teal-50 to-cyan-50">
                           <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                 <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 bg-teal-100 rounded-lg">
                                       <BarChart3 className="w-5 h-5 text-teal-600" />
                                    </div>
                                    Monthly Sales - {selectedYear}
                                 </CardTitle>
                                 <CardDescription className="mt-2">
                                    Month-by-month sales trend (in Lakhs ₹)
                                 </CardDescription>
                              </div>
                              {isPrediction && (
                                 <Badge className="bg-teal-600">
                                    Predicted
                                 </Badge>
                              )}
                           </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                           <ChartContainer config={monthlyChartConfig} className="h-[350px] w-full">
                              <BarChart data={currentData.monthly}>
                                 <defs>
                                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={1} />
                                       <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.7} />
                                    </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                 <XAxis dataKey="month" />
                                 <YAxis />
                                 <ChartTooltip content={<ChartTooltipContent />} />
                                 <Bar
                                    dataKey="sales"
                                    fill="url(#colorBar)"
                                    radius={[8, 8, 0, 0]}
                                 />
                              </BarChart>
                           </ChartContainer>
                        </CardContent>
                     </Card>
                  </div>

                  {/* Year-on-Year Comparison - Area Chart */}
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                     <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                           <div>
                              <CardTitle className="flex items-center gap-2">
                                 <div className="p-2 bg-blue-100 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                 </div>
                                 Year-on-Year Sales Comparison
                              </CardTitle>
                              <CardDescription className="mt-2">
                                 Total sales performance across financial years (in Lakhs ₹)
                              </CardDescription>
                           </div>
                           <Badge className="bg-blue-600">
                              {allYears.length} Years View
                           </Badge>
                        </div>
                     </CardHeader>
                     <CardContent className="pt-6">
                        <ChartContainer config={yearlyChartConfig} className="h-[400px] w-full">
                           <AreaChart data={yearOnYearData}>
                              <defs>
                                 <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis
                                 dataKey="year"
                                 angle={-45}
                                 textAnchor="end"
                                 height={80}
                              />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Area
                                 type="monotone"
                                 dataKey="sales"
                                 stroke="hsl(var(--chart-1))"
                                 strokeWidth={3}
                                 fill="url(#colorSales)"
                                 dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                                 activeDot={{ r: 6 }}
                              />
                           </AreaChart>
                        </ChartContainer>
                     </CardContent>
                  </Card>

                  {/* Footer Info */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-sm">
                     <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-100 rounded-lg">
                              <Calendar className="w-5 h-5 text-slate-600" />
                           </div>
                           <div>
                              <p className="text-slate-900">Current Selection: <span className="font-semibold">{selectedYear}</span></p>
                              <p className="text-slate-600">Data Type: {isPrediction ? "Forecasted based on historical trends" : "Actual sales data"}</p>
                           </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                           <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                              ₹{currentYearlyTotal.toFixed(2)}L Annual
                           </Badge>
                           <Badge variant="outline" className="border-blue-300 text-blue-700">
                              {growthRate}% Growth
                           </Badge>
                           {isPrediction && (
                              <Badge variant="outline" className="border-purple-300 text-purple-700">
                                 🔮 AI Predicted
                              </Badge>
                           )}
                        </div>
                     </div>
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
