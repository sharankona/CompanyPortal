import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface EmployeeFilterProps {
  onSearch: (query: string) => void;
  onFilterByDepartment: (department: string) => void;
  departments: string[];
}

export default function EmployeeFilter({
  onSearch,
  onFilterByDepartment,
  departments,
}: EmployeeFilterProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, title, or email..."
              className="pl-9"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="w-48">
              <Select onValueChange={onFilterByDepartment}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Department" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
