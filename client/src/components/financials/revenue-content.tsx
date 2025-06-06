
import { useState, useEffect } from 'react';
import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Plus } from "lucide-react";

interface Revenue {
  id: number;
  source: string;
  amount: number;
  date: string;
  description: string;
}

export function RevenueContent() {
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const [filteredRevenue, setFilteredRevenue] = useState<Revenue[]>([]);
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentRevenue, setCurrentRevenue] = useState({
    id: '',
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    fetchRevenue();
  }, []);
  
  useEffect(() => {
    if (!revenue.length) return;
    
    if (!startDate && !endDate) {
      setFilteredRevenue(revenue);
      return;
    }

    const filtered = revenue.filter(item => {
      const itemDate = new Date(item.date);
      
      if (startDate && endDate) {
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      } else if (startDate) {
        return itemDate >= new Date(startDate);
      } else if (endDate) {
        return itemDate <= new Date(endDate);
      }
      
      return true;
    });
    
    setFilteredRevenue(filtered);
  }, [revenue, startDate, endDate]);

  const fetchRevenue = async () => {
    try {
      const response = await fetch('/api/financials/revenue');
      if (!response.ok) {
        throw new Error('Failed to fetch revenue');
      }
      const data = await response.json();
      setRevenue(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch revenue data",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (revenue: Revenue) => {
    setCurrentRevenue({
      id: revenue.id.toString(),
      source: revenue.source,
      amount: revenue.amount.toString(),
      date: revenue.date,
      description: revenue.description || ''
    });
    setShowEditDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/financials/revenue/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast({ title: "Success", description: "Revenue entry deleted successfully" });
        fetchRevenue();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete revenue entry", variant: "destructive" });
    }
  };

  const handleAdd = async () => {
    try {
      const amount = parseFloat(currentRevenue.amount);
      if (isNaN(amount)) {
        toast({
          title: "Error",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('/api/financials/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: currentRevenue.source,
          amount: amount,
          date: currentRevenue.date,
          description: currentRevenue.description
        })
      });

      if (response.ok) {
        toast({ title: "Success", description: "Revenue entry added successfully" });
        setShowAddDialog(false);
        setCurrentRevenue({
          id: '',
          source: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: ''
        });
        fetchRevenue();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add revenue entry", variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    try {
      const amount = parseFloat(currentRevenue.amount);
      if (isNaN(amount)) {
        toast({
          title: "Error",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/financials/revenue/${currentRevenue.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: currentRevenue.source,
          amount: amount,
          date: currentRevenue.date,
          description: currentRevenue.description
        })
      });

      if (response.ok) {
        toast({ title: "Success", description: "Revenue entry updated successfully" });
        setShowEditDialog(false);
        fetchRevenue();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update revenue entry", variant: "destructive" });
    }
  };

  const columns = [
    {
      accessorKey: "source",
      header: "Source"
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
        const revenueItem = row.original;
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEdit(revenueItem)} 
              className="h-8 w-8 p-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDelete(revenueItem.id)} 
              className="h-8 w-8 p-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </Button>
          </div>
        );
      }
    }
  ];

  // Calculate total revenue from filtered data
  const totalRevenue = filteredRevenue.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Revenue Overview</h2>
        <div className="flex items-center space-x-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</p>
          </div>
          <Button 
            className="bg-white text-black hover:bg-black hover:text-white"
            onClick={() => {
              setCurrentRevenue({
                id: '',
                source: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                description: ''
              });
              setShowAddDialog(true);
            }}>
            <Plus className="h-4 w-4 mr-2" /> Add Revenue
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
            <DialogTitle>Add Revenue</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Source"
              value={currentRevenue.source}
              onChange={(e) => setCurrentRevenue({...currentRevenue, source: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={currentRevenue.amount}
              onChange={(e) => setCurrentRevenue({...currentRevenue, amount: e.target.value})}
            />
            <Input
              type="date"
              value={currentRevenue.date}
              onChange={(e) => setCurrentRevenue({...currentRevenue, date: e.target.value})}
            />
            <Input
              placeholder="Description"
              value={currentRevenue.description}
              onChange={(e) => setCurrentRevenue({...currentRevenue, description: e.target.value})}
            />
            <Button onClick={handleAdd}>Add Revenue</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Revenue</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Source"
              value={currentRevenue.source}
              onChange={(e) => setCurrentRevenue({...currentRevenue, source: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={currentRevenue.amount}
              onChange={(e) => setCurrentRevenue({...currentRevenue, amount: e.target.value})}
            />
            <Input
              type="date"
              value={currentRevenue.date}
              onChange={(e) => setCurrentRevenue({...currentRevenue, date: e.target.value})}
            />
            <Input
              placeholder="Description"
              value={currentRevenue.description}
              onChange={(e) => setCurrentRevenue({...currentRevenue, description: e.target.value})}
            />
            <Button onClick={handleUpdate}>Update Revenue</Button>
          </div>
        </DialogContent>
      </Dialog>

      {revenue.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-gray-500">No revenue entries found. Add your first revenue entry!</p>
        </div>
      ) : filteredRevenue.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-gray-500">No revenue entries found in the selected date range.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredRevenue} />
      )}
    </div>
  );
}
