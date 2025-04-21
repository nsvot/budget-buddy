"use client";

import { useState } from "react";
import { Trash2, Calendar, Tag, DollarSign, Search } from "lucide-react";
import { Expense } from "@/types/budget";
import { motion } from "framer-motion";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  
  // Get unique categories from expenses
  const categories = Array.from(new Set(expenses.map(expense => expense.category)));
  
  // Filter expenses based on search term and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "" || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Group expenses by date
  const groupedExpenses: Record<string, Expense[]> = {};
  sortedExpenses.forEach(expense => {
    if (!groupedExpenses[expense.date]) {
      groupedExpenses[expense.date] = [];
    }
    groupedExpenses[expense.date].push(expense);
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search expenses..."
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white py-2 px-3 border"
          />
        </div>
        
        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white py-2 px-3 border"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {sortedExpenses.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No expenses found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedExpenses).map(date => (
            <div key={date} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <h4 className="font-medium text-gray-700">{formatDate(date)}</h4>
                </div>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {groupedExpenses[date].map(expense => (
                  <motion.li 
                    key={expense.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center mr-3
                          ${expense.category === 'Food' ? 'bg-green-100 text-green-600' : ''}
                          ${expense.category === 'Rent' ? 'bg-blue-100 text-blue-600' : ''}
                          ${expense.category === 'Transportation' ? 'bg-yellow-100 text-yellow-600' : ''}
                          ${expense.category === 'Entertainment' ? 'bg-purple-100 text-purple-600' : ''}
                          ${expense.category === 'Education' ? 'bg-indigo-100 text-indigo-600' : ''}
                          ${expense.category === 'Utilities' ? 'bg-gray-100 text-gray-600' : ''}
                          ${expense.category === 'Shopping' ? 'bg-pink-100 text-pink-600' : ''}
                          ${expense.category === 'Health' ? 'bg-red-100 text-red-600' : ''}
                          ${expense.category === 'Other' ? 'bg-orange-100 text-orange-600' : ''}
                        `}>
                          <Tag className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {expense.category}
                            {expense.description && (
                              <span className="font-normal text-gray-500 ml-2">
                                - {expense.description}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <p className="font-medium text-gray-900 mr-4">
                          ${expense.amount.toFixed(2)}
                        </p>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
