import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EmployeeCard from "@/components/employees/EmployeeCard";
import EmployeeFilter from "@/components/employees/EmployeeFilter";
import { departmentEnum } from "@shared/schema";

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const { data: employees, isLoading } = useQuery({
    queryKey: ["/api/users"],
  });

  const departments = Object.values(departmentEnum.enumValues);

  const filteredEmployees = employees
    ? employees.filter((employee: any) => {
        // Department filter
        if (departmentFilter && employee.department !== departmentFilter) {
          return false;
        }

        // Search filter (case insensitive)
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            employee.fullName.toLowerCase().includes(query) ||
            employee.title.toLowerCase().includes(query) ||
            employee.email.toLowerCase().includes(query)
          );
        }

        return true;
      })
    : [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Employee Directory</h2>
        <p className="text-slate-500 mt-1">
          Browse and search for employees across all departments.
        </p>
      </div>

      <EmployeeFilter
        onSearch={setSearchQuery}
        onFilterByDepartment={setDepartmentFilter}
        departments={departments}
      />

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Loading employees...</p>
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((employee: any) => (
            <EmployeeCard
              key={employee.id}
              id={employee.id}
              name={employee.fullName}
              title={employee.title}
              department={employee.department}
              email={employee.email}
              profileImage={employee.profileImage}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-white">
          <p className="text-slate-500">No employees found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
