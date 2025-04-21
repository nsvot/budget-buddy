"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Expense } from "@/types/budget";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface ExpenseChartProps {
  expenses: Expense[];
  type: "pie" | "bar";
  height?: number;
}

// Define colors for categories
const CATEGORY_COLORS: Record<string, { bg: string; border: string }> = {
  Food: { bg: "rgba(75, 192, 192, 0.2)", border: "rgba(75, 192, 192, 1)" },
  Rent: { bg: "rgba(54, 162, 235, 0.2)", border: "rgba(54, 162, 235, 1)" },
  Transportation: { bg: "rgba(255, 206, 86, 0.2)", border: "rgba(255, 206, 86, 1)" },
  Entertainment: { bg: "rgba(153, 102, 255, 0.2)", border: "rgba(153, 102, 255, 1)" },
  Education: { bg: "rgba(63, 81, 181, 0.2)", border: "rgba(63, 81, 181, 1)" },
  Utilities: { bg: "rgba(96, 125, 139, 0.2)", border: "rgba(96, 125, 139, 1)" },
  Shopping: { bg: "rgba(233, 30, 99, 0.2)", border: "rgba(233, 30, 99, 1)" },
  Health: { bg: "rgba(244, 67, 54, 0.2)", border: "rgba(244, 67, 54, 1)" },
  Other: { bg: "rgba(255, 152, 0, 0.2)", border: "rgba(255, 152, 0, 1)" }
};

export default function ExpenseChart({ expenses, type, height = 400 }: ExpenseChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (type === "pie") {
      // Group expenses by category
      const categoryTotals: Record<string, number> = {};
      expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
          categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
      });

      // Prepare data for pie chart
      const labels = Object.keys(categoryTotals);
      const data = Object.values(categoryTotals);
      const backgroundColors = labels.map(label => 
        CATEGORY_COLORS[label]?.bg || "rgba(128, 128, 128, 0.2)"
      );
      const borderColors = labels.map(label => 
        CATEGORY_COLORS[label]?.border || "rgba(128, 128, 128, 1)"
      );

      setChartData({
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      });
    } else if (type === "bar") {
      // Group expenses by date (last 7 days)
      const today = new Date();
      const dates: string[] = [];
      const dateExpenses: Record<string, number> = {};

      // Generate last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dates.push(dateStr);
        dateExpenses[dateStr] = 0;
      }

      // Sum expenses by date
      expenses.forEach(expense => {
        if (dateExpenses[expense.date] !== undefined) {
          dateExpenses[expense.date] += expense.amount;
        }
      });

      // Format dates for display
      const formattedDates = dates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

      // Prepare data for bar chart
      setChartData({
        labels: formattedDates,
        datasets: [
          {
            label: 'Daily Expenses',
            data: dates.map(date => dateExpenses[date]),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [expenses, type]);

  if (!isClient || !chartData) {
    return <div className="flex items-center justify-center h-64">Loading chart...</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: type === "pie" ? "right" as const : "top" as const,
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      {type === "pie" ? (
        <Pie data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}
