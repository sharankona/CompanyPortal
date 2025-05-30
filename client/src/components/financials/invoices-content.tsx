
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function InvoicesContent() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState([
    { id: "INV-001", client: "Tech Corp", amount: 5000, status: "Paid", date: "2024-01-15" },
    { id: "INV-002", client: "Global Solutions", amount: 7500, status: "Pending", date: "2024-01-20" },
    { id: "INV-003", client: "Digital Systems", amount: 3200, status: "Overdue", date: "2024-01-10" },
    { id: "INV-004", client: "Smart Services", amount: 4800, status: "Paid", date: "2024-01-25" },
  ]);

  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    amount: "",
    status: "Pending",
    date: new Date().toISOString().split('T')[0]
  });

  const handleEdit = (invoice) => {
    setEditingInvoice({ ...invoice });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    toast({
      title: "Invoice deleted",
      description: "The invoice has been removed successfully."
    });
  };

  const handleAdd = () => {
    const newId = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    const invoice = {
      id: newId,
      ...newInvoice
    };
    setInvoices([...invoices, invoice]);
    setIsDialogOpen(false);
    setNewInvoice({
      client: "",
      amount: "",
      status: "Pending",
      date: new Date().toISOString().split('T')[0]
    });
    toast({
      title: "Invoice added",
      description: "New invoice has been created successfully."
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <Button 
          className="bg-white text-black hover:bg-black hover:text-white"
          onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Invoice
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.client}</TableCell>
              <TableCell>₹{invoice.amount}</TableCell>
              <TableCell>
                <Badge variant={invoice.status === "Paid" ? "default" : invoice.status === "Pending" ? "secondary" : "destructive"}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(invoice)} title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(invoice.id)} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingInvoice ? 'Edit Invoice' : 'Add New Invoice'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Client"
              value={editingInvoice ? editingInvoice.client : newInvoice.client}
              onChange={(e) => editingInvoice 
                ? setEditingInvoice({...editingInvoice, client: e.target.value})
                : setNewInvoice({...newInvoice, client: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={editingInvoice ? editingInvoice.amount : newInvoice.amount}
              onChange={(e) => editingInvoice
                ? setEditingInvoice({...editingInvoice, amount: e.target.value})
                : setNewInvoice({...newInvoice, amount: e.target.value})}
            />
            <Select
              value={editingInvoice ? editingInvoice.status : newInvoice.status}
              onValueChange={(value) => editingInvoice
                ? setEditingInvoice({...editingInvoice, status: value})
                : setNewInvoice({...newInvoice, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={editingInvoice ? editingInvoice.date : newInvoice.date}
              onChange={(e) => editingInvoice
                ? setEditingInvoice({...editingInvoice, date: e.target.value})
                : setNewInvoice({...newInvoice, date: e.target.value})}
            />
            <Button onClick={editingInvoice ? handleSave : handleAdd}>
              {editingInvoice ? 'Save Changes' : 'Add Invoice'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
