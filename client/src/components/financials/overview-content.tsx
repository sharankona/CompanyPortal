
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function OverviewContent() {
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    profit: 0,
    activeProjects: 24, // Default value for active projects
    revenueTrend: 0,
    expensesTrend: 0,
    profitTrend: 0
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Fetch revenue data
        const revenueResponse = await fetch('/api/financials/revenue');
        // Fetch expenses data
        const expensesResponse = await fetch('/api/financials/expenses');
        
        if (!revenueResponse.ok || !expensesResponse.ok) {
          throw new Error('Failed to fetch financial data');
        }
        
        const revenueData = await revenueResponse.json();
        const expensesData = await expensesResponse.json();
        
        // Calculate totals
        const totalRevenue = revenueData.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalExpenses = expensesData.reduce((sum, item) => sum + Number(item.amount), 0);
        const profit = totalRevenue - totalExpenses;
        
        // Calculate current month data
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Filter for current month revenue and expenses
        const currentMonthRevenue = revenueData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        });
        
        const currentMonthExpenses = expensesData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        });
        
        // Filter for previous month
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        const prevMonthRevenue = revenueData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === prevMonth && itemDate.getFullYear() === prevYear;
        });
        
        const prevMonthExpenses = expensesData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === prevMonth && itemDate.getFullYear() === prevYear;
        });
        
        // Calculate previous month totals
        const prevMonthTotalRevenue = prevMonthRevenue.reduce((sum, item) => sum + Number(item.amount), 0);
        const prevMonthTotalExpenses = prevMonthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
        const prevMonthProfit = prevMonthTotalRevenue - prevMonthTotalExpenses;
        
        // Calculate current month totals
        const currentMonthTotalRevenue = currentMonthRevenue.reduce((sum, item) => sum + Number(item.amount), 0);
        const currentMonthTotalExpenses = currentMonthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
        const currentMonthProfit = currentMonthTotalRevenue - currentMonthTotalExpenses;
        
        // Calculate trends (percentage change)
        const calculateTrend = (current, previous) => {
          if (previous === 0) return current > 0 ? 100 : 0;
          return Math.round(((current - previous) / previous) * 100);
        };
        
        setFinancialData({
          totalRevenue,
          totalExpenses,
          profit,
          activeProjects: 24,
          revenueTrend: calculateTrend(currentMonthTotalRevenue, prevMonthTotalRevenue),
          expensesTrend: calculateTrend(currentMonthTotalExpenses, prevMonthTotalExpenses),
          profitTrend: calculateTrend(currentMonthProfit, prevMonthProfit)
        });
      } catch (error) {
        console.error('Error fetching financial data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch financial data",
          variant: "destructive"
        });
      }
    };
    
    fetchFinancialData();
  }, [toast]);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{financialData.totalRevenue.toLocaleString()}</div>
          <div className={`flex items-center text-sm ${financialData.revenueTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {financialData.revenueTrend >= 0 ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            {financialData.revenueTrend >= 0 ? '+' : ''}{financialData.revenueTrend}% from last month
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{financialData.totalExpenses.toLocaleString()}</div>
          <div className={`flex items-center text-sm ${financialData.expensesTrend >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {financialData.expensesTrend >= 0 ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            {financialData.expensesTrend >= 0 ? '+' : ''}{financialData.expensesTrend}% from last month
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{financialData.profit.toLocaleString()}</div>
          <div className={`flex items-center text-sm ${financialData.profitTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {financialData.profitTrend >= 0 ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            {financialData.profitTrend >= 0 ? '+' : ''}{financialData.profitTrend}% from last month
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{financialData.activeProjects}</div>
          <div className="flex items-center text-sm text-green-500">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            +3 new this month
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
