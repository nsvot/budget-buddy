"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  Trash2, 
  PieChart, 
  BarChart3, 
  DollarSign, 
  Target, 
  Calendar, 
  Tag, 
  FileText, 
  Save
} from "lucide-react";
import ExpenseForm from "@/components/ExpenseForm";
import BudgetGoalForm from "@/components/BudgetGoalForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseChart from "@/components/ExpenseChart";
import BudgetProgress from "@/components/BudgetProgress";
import { Expense, BudgetGoal } from "@/types/budget";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetGoal, setBudgetGoal] = useState<BudgetGoal | null>(null);
  const [activeTab, setActiveTab] = useState<'expenses' | 'budget' | 'charts'>('expenses');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      const savedExpenses = localStorage.getItem('budgetBuddy_expenses');
      const savedBudgetGoal = localStorage.getItem('budgetBuddy_budgetGoal');
      
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
      
      if (savedBudgetGoal) {
        setBudgetGoal(JSON.parse(savedBudgetGoal));
      }
      
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('budgetBuddy_expenses', JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined' && budgetGoal) {
      localStorage.setItem('budgetBuddy_budgetGoal', JSON.stringify(budgetGoal));
    }
  }, [budgetGoal, isLoaded]);

  const addExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const setBudget = (goal: BudgetGoal) => {
    setBudgetGoal(goal);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budgetGoal ? budgetGoal.amount - totalExpenses : 0;
  const budgetStatus = remainingBudget >= 0 ? 'under' : 'over';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-blue-600 py-16 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2011&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">BudgetBuddy</h1>
            <p className="text-xl md:text-2xl mb-8">A Simple Budget Planner for Students</p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('expenses')}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-colors",
                  activeTab === 'expenses' 
                    ? "bg-white text-blue-600" 
                    : "bg-blue-700 text-white hover:bg-blue-800"
                )}
              >
                Track Expenses
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('budget')}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-colors",
                  activeTab === 'budget' 
                    ? "bg-white text-blue-600" 
                    : "bg-blue-700 text-white hover:bg-blue-800"
                )}
              >
                Set Budget Goals
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('charts')}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-colors",
                  activeTab === 'charts' 
                    ? "bg-white text-blue-600" 
                    : "bg-blue-700 text-white hover:bg-blue-800"
                )}
              >
                View Analytics
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Budget Summary Card */}
        {budgetGoal && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Budget Goal</p>
                  <p className="text-2xl font-bold">${budgetGoal.amount.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <DollarSign className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`${budgetStatus === 'under' ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-full mr-4`}>
                  <DollarSign className={`h-8 w-8 ${budgetStatus === 'under' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining Budget</p>
                  <p className={`text-2xl font-bold ${budgetStatus === 'under' ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(remainingBudget).toFixed(2)}
                    {budgetStatus === 'over' && ' over budget'}
                  </p>
                </div>
              </div>
            </div>
            <BudgetProgress 
              current={totalExpenses} 
              goal={budgetGoal.amount} 
              className="mt-6" 
            />
          </motion.div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'expenses' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Track Your Expenses</h2>
              <ExpenseForm onAddExpense={addExpense} />
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Recent Expenses</h3>
                <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
              </div>
            </motion.div>
          )}

          {activeTab === 'budget' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Set Your Budget Goals</h2>
              <BudgetGoalForm onSetBudget={setBudget} currentBudget={budgetGoal} />
              
              {budgetGoal && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Current Budget</h3>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-gray-600">Monthly Budget</p>
                        <p className="text-3xl font-bold">${budgetGoal.amount.toFixed(2)}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">Budget Period</p>
                    <p className="font-medium">{budgetGoal.period}</p>
                    
                    {budgetGoal.notes && (
                      <>
                        <p className="text-gray-600 mt-4 mb-2">Notes</p>
                        <p className="italic text-gray-700">{budgetGoal.notes}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'charts' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Expense Analytics</h2>
              
              {expenses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <PieChart className="mr-2 h-5 w-5 text-blue-600" />
                      Expenses by Category
                    </h3>
                    <ExpenseChart 
                      expenses={expenses} 
                      type="pie" 
                      height={300}
                    />
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                      Expenses by Date
                    </h3>
                    <ExpenseChart 
                      expenses={expenses} 
                      type="bar" 
                      height={300}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No expense data yet</h3>
                  <p className="text-gray-500 mb-6">Add some expenses to see your analytics</p>
                  <button 
                    onClick={() => setActiveTab('expenses')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Expenses
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">BudgetBuddy</h2>
              <p className="text-gray-300 max-w-md">
                A user-friendly web app designed to help students track expenses, 
                set budget goals, and visualize spending habits.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Expense Tracking
                </li>
                <li className="flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Budget Goal Setting
                </li>
                <li className="flex items-center">
                  <PieChart className="h-4 w-4 mr-2" />
                  Spending Analytics
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} BudgetBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
