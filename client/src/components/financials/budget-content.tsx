
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function BudgetContent() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    allocated: '',
    spent: '0'
  });
  
  const [budgetData, setBudgetData] = useState([
    { category: "Marketing", allocated: 50000, spent: 35000 },
    { category: "Operations", allocated: 80000, spent: 65000 },
    { category: "Development", allocated: 120000, spent: 90000 },
    { category: "HR", allocated: 45000, spent: 40000 }
  ]);

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.allocated) {
      setBudgetData([...budgetData, {
        category: newBudget.category,
        allocated: parseInt(newBudget.allocated),
        spent: parseInt(newBudget.spent)
      }]);
      setShowAddDialog(false);
      setNewBudget({ category: '', allocated: '', spent: '0' });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budget Tracking</h2>
        <Button 
          className="bg-white text-black hover:bg-black hover:text-white"
          onClick={() => setShowAddDialog(true)}>
          Add Budget
        </Button>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Category"
              value={newBudget.category}
              onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Allocated Amount"
              value={newBudget.allocated}
              onChange={(e) => setNewBudget({...newBudget, allocated: e.target.value})}
            />
            <Button onClick={handleAddBudget}>Add Budget</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2">
        {budgetData.map((item) => (
          <Card key={item.category} className="p-4">
            <h3 className="font-semibold">{item.category}</h3>
            <div className="mt-2">
              <Progress value={(item.spent / item.allocated) * 100} />
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Spent: ₹{item.spent.toLocaleString()}</span>
              <span>Budget: ₹{item.allocated.toLocaleString()}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
