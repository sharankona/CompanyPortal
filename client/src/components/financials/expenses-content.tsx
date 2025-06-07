import { useState, useEffect } from 'react';
import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Plus } from "lucide-react";

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export function ExpensesContent() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentExpense, setCurrentExpense] = useState({
    id: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (!expenses.length) return;
    
    if (!startDate && !endDate) {
      setFilteredExpenses(expenses);
      return;
    }

    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      
      if (startDate && endDate) {
        return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
      } else if (startDate) {
        return expenseDate >= new Date(startDate);
      } else if (endDate) {
        return expenseDate <= new Date(endDate);
      }
      
      return true;
    });
    
    setFilteredExpenses(filtered);
  }, [expenses, startDate, endDate]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/financials/expenses');
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch expenses data",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (expense: Expense) => {
    setCurrentExpense({
      id: expense.id.toString(),
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date,
      description: expense.description || ''
    });
    setShowEditDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/financials/expenses/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast({ title: "Success", description: "Expense deleted successfully" });
        fetchExpenses();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete expense", variant: "destructive" });
    }
  };

  const handleAdd = async () => {
    try {
      const amount = parseFloat(currentExpense.amount);
      if (isNaN(amount)) {
        toast({
          title: "Error",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('/api/financials/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: currentExpense.category,
          amount: amount,
          date: currentExpense.date,
          description: currentExpense.description
        })
      });

      if (response.ok) {
        toast({ title: "Success", description: "Expense added successfully" });
        setShowAddDialog(false);
        setCurrentExpense({
          id: '',
          category: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: ''
        });
        fetchExpenses();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add expense", variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    try {
      const amount = parseFloat(currentExpense.amount);
      if (isNaN(amount)) {
        toast({
          title: "Error",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/financials/expenses/${currentExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: currentExpense.category,
          amount: amount,
          date: currentExpense.date,
          description: currentExpense.description
        })
      });

      if (response.ok) {
        toast({ title: "Success", description: "Expense updated successfully" });
        setShowEditDialog(false);
        fetchExpenses();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update expense", variant: "destructive" });
    }
  };

  const columns = [
    {
      accessorKey: "category",
      header: "Category"
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        if (!row?.original) return '₹0.00';
        const amount = row.original.amount;
        return amount !== undefined ? `₹${Number(amount).toFixed(2)}` : '₹0.00';
      }
    },
    {
      accessorKey: "date",
      header: "Date"
    },
    {
      accessorKey: "description",
      header: "Description"
    },
    {
      id: "actions",
      cell: ({ row }) => {
        if (!row?.original) return null;
        const expense = row.original;
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEdit(expense)} 
              className="h-8 w-8 p-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDelete(expense.id)} 
              className="h-8 w-8 p-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </Button>
          </div>
        );
      }
    }
  ];

  // Calculate total expenses from filtered data
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Expenses Overview</h2>
        <div className="flex items-center space-x-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</p>
          </div>
          <Button 
            className="bg-white text-black hover:bg-black hover:text-white"
            onClick={() => {
              setCurrentExpense({
                id: '',
                category: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                description: ''
              });
              setShowAddDialog(true);
            }}>
            <Plus className="h-4 w-4 mr-2" /> Add Expense
          </Button>
        </div>
      </div>
      
      <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-sm font-medium text-gray-500">Filter by Date Range</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Start:</span>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">End:</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Category"
              value={currentExpense.category}
              onChange={(e) => setCurrentExpense({...currentExpense, category: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={currentExpense.amount}
              onChange={(e) => setCurrentExpense({...currentExpense, amount: e.target.value})}
            />
            <Input
              type="date"
              value={currentExpense.date}
              onChange={(e) => setCurrentExpense({...currentExpense, date: e.target.value})}
            />
            <Input
              placeholder="Description"
              value={currentExpense.description}
              onChange={(e) => setCurrentExpense({...currentExpense, description: e.target.value})}
            />
            <Button onClick={handleAdd}>Add Expense</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Category"
              value={currentExpense.category}
              onChange={(e) => setCurrentExpense({...currentExpense, category: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={currentExpense.amount}
              onChange={(e) => setCurrentExpense({...currentExpense, amount: e.target.value})}
            />
            <Input
              type="date"
              value={currentExpense.date}
              onChange={(e) => setCurrentExpense({...currentExpense, date: e.target.value})}
            />
            <Input
              placeholder="Description"
              value={currentExpense.description}
              onChange={(e) => setCurrentExpense({...currentExpense, description: e.target.value})}
            />
            <Button onClick={handleUpdate}>Update Expense</Button>
          </div>
        </DialogContent>
      </Dialog>

      {expenses.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-gray-500">No expenses found. Add your first expense!</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-gray-500">No expenses found in the selected date range.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredExpenses} />
      )}
    </div>
  );
}