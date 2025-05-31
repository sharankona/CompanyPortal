import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import NewsCard from "@/components/news/NewsCard";
import NewsForm from "@/components/news/NewsForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export default function News() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["/api/announcements"],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  const getAuthorData = (authorId: number) => {
    if (!users) return { name: "Unknown", initials: "UN", department: "Unknown" };
    
    const author = users.find((u: any) => u.id === authorId);
    if (!author) return { name: "Unknown", initials: "UN", department: "Unknown" };
    
    return {
      name: author.fullName,
      initials: author.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase(),
      department: author.department,
    };
  };

  const filteredAnnouncements = announcements
    ? announcements.filter((announcement: any) => {
        // Department filter
        if (departmentFilter !== "All") {
          if (announcement.department && announcement.department !== departmentFilter) {
            return false;
          }
        }

        // Search filter (case insensitive)
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            announcement.title.toLowerCase().includes(query) ||
            announcement.content.toLowerCase().includes(query)
          );
        }

        return true;
      })
    : [];

  // Group announcements - important ones first, then by date
  const importantAnnouncements = filteredAnnouncements.filter(
    (a: any) => a.isImportant
  );
  const regularAnnouncements = filteredAnnouncements.filter(
    (a: any) => !a.isImportant
  );

  // Check if user can create announcements (management or admin)
  const canCreateAnnouncement = user && ["admin", "management"].includes(user.role);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Company News</h2>
          <p className="text-slate-500 mt-1">
            Stay updated with the latest company announcements.
          </p>
        </div>
        {canCreateAnnouncement && (
          <div className="mt-4 sm:mt-0">
            <NewsForm />
          </div>
        )}
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search announcements..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Announcements</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length > 0 ? (
            <div className="space-y-6">
              {importantAnnouncements.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-slate-600">Important Announcements</h3>
                  {importantAnnouncements.map((announcement: any) => {
                    const author = getAuthorData(announcement.authorId);
                    return (
                      <NewsCard
                        key={announcement.id}
                        id={announcement.id}
                        title={announcement.title}
                        content={announcement.content}
                        author={author}
                        createdAt={new Date(announcement.createdAt)}
                        isImportant={true}
                        department={announcement.department}
                      />
                    );
                  })}
                </div>
              )}
              
              {regularAnnouncements.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-slate-600">Regular Announcements</h3>
                  {regularAnnouncements.map((announcement: any) => {
                    const author = getAuthorData(announcement.authorId);
                    return (
                      <NewsCard
                        key={announcement.id}
                        id={announcement.id}
                        title={announcement.title}
                        content={announcement.content}
                        author={author}
                        createdAt={new Date(announcement.createdAt)}
                        department={announcement.department}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-white">
              <p className="text-slate-500">No announcements found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="important">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading announcements...</p>
            </div>
          ) : importantAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {importantAnnouncements.map((announcement: any) => {
                const author = getAuthorData(announcement.authorId);
                return (
                  <NewsCard
                    key={announcement.id}
                    id={announcement.id}
                    title={announcement.title}
                    content={announcement.content}
                    author={author}
                    createdAt={new Date(announcement.createdAt)}
                    isImportant={true}
                    department={announcement.department}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-white">
              <p className="text-slate-500">No important announcements found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
