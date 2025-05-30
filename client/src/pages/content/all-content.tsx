
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import ContentKanban from "@/components/content/ContentKanban";
import ContentList from "@/components/content/ContentList";
import ContentCalendar from "@/components/content/ContentCalendar";
import { useToast } from "@/hooks/use-toast";

export default function AllContentPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedContentType, setSelectedContentType] = useState("all");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  document.title = "All Content | Dashboard";
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all content items
  const { data: allContentItems, isLoading, error } = useQuery({
    queryKey: ["/api/content", "all"],
    queryFn: async () => {
      console.log("Fetching all content...");
      try {
        // First try to get all content without filter
        const response = await fetch("/api/content");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched content data:", data);
          return data;
        }
        
        // If that fails, try to fetch from each content type individually
        console.log("Main endpoint failed, trying individual content types...");
        const contentTypes = ["blog", "instagram", "linkedin", "youtube", "facebook", "twitter", "product"];
        const allContent = [];
        
        for (const contentType of contentTypes) {
          try {
            const typeResponse = await fetch(`/api/content?contentType=${contentType}`);
            if (typeResponse.ok) {
              const typeData = await typeResponse.json();
              if (Array.isArray(typeData)) {
                allContent.push(...typeData);
              }
            }
          } catch (err) {
            console.warn(`Failed to fetch ${contentType} content:`, err);
          }
        }
        
        console.log("Fetched combined content data:", allContent);
        return allContent;
      } catch (err) {
        console.error("Error fetching content:", err);
        throw err;
      }
    }
  });

  // Fetch workflows
  const { data: workflows } = useQuery({
    queryKey: ["/api/workflows"],
    queryFn: async () => {
      const response = await fetch("/api/workflows");
      if (!response.ok) throw new Error("Failed to fetch workflows");
      return response.json();
    }
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number, status: string, notes?: string }) => {
      const response = await fetch(`/api/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update content");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content Updated",
        description: "Content status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Edit content mutation
  const editContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const response = await fetch(`/api/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to edit content");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content Updated",
        description: "Content has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/content/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete content");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content Deleted",
        description: "Content has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleUpdateStatus = (id: number, status: string, notes?: string) => {
    updateContentMutation.mutate({ id, status, notes });
  };

  const handleEditContent = (id: number, data: any) => {
    editContentMutation.mutate({ id, data });
  };

  const handleDeleteContent = (id: number) => {
    deleteContentMutation.mutate(id);
  };

  // Filter and sort content items
  const filteredAndSortedItems = () => {
    if (!allContentItems) return [];

    let filtered = allContentItems;
    
    // Apply content type filter
    if (selectedContentType !== "all") {
      filtered = filtered.filter((item: any) => item.contentType === selectedContentType);
    }

    // Apply sorting
    filtered.sort((a: any, b: any) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle date sorting
      if (sortBy === "createdAt" || sortBy === "updatedAt" || sortBy === "deadline") {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      // Handle string sorting
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const contentTypeOptions = [
    { value: "all", label: "All Content Types" },
    { value: "blog", label: "Blog Posts" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "youtube", label: "YouTube" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "X (Twitter)" },
    { value: "product", label: "Product Listings" }
  ];

  const sortOptions = [
    { value: "updatedAt", label: "Last Updated" },
    { value: "createdAt", label: "Created Date" },
    { value: "title", label: "Title" },
    { value: "status", label: "Status" },
    { value: "contentType", label: "Content Type" },
    { value: "deadline", label: "Deadline" }
  ];

  const contentItems = filteredAndSortedItems();

  if (error) {
    return (
      <DashboardShell title="All Content" description="View and manage all content across platforms">
        <div className="text-center p-8 text-red-600">
          Error loading content: {error.message}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="All Content" description="View and manage all content across platforms">
      <div className="space-y-6">
        {/* Filters and Sort Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              {/* Content Type Filter */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Content Type</label>
                <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">
                      <div className="flex items-center gap-2">
                        <SortDesc className="h-4 w-4" />
                        Descending
                      </div>
                    </SelectItem>
                    <SelectItem value="asc">
                      <div className="flex items-center gap-2">
                        <SortAsc className="h-4 w-4" />
                        Ascending
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {contentItems.length} {contentItems.length === 1 ? 'item' : 'items'}
              {selectedContentType !== "all" && (
                <span> for {contentTypeOptions.find(opt => opt.value === selectedContentType)?.label}</span>
              )}
              {isLoading && <span> (Loading...)</span>}
              {allContentItems && <span> (Total available: {allContentItems.length})</span>}
            </div>
          </CardContent>
        </Card>

        {/* Content Views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading content...</div>
            ) : contentItems.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <h3 className="text-lg font-medium mb-2">No content found</h3>
                <p>No content entries are available. Create some content in the individual content pages to see them here.</p>
              </div>
            ) : (
              <ContentKanban 
                contentItems={contentItems} 
                onStatusChange={handleUpdateStatus}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                workflows={workflows}
              />
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading content...</div>
            ) : contentItems.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <h3 className="text-lg font-medium mb-2">No content found</h3>
                <p>No content entries are available. Create some content in the individual content pages to see them here.</p>
              </div>
            ) : (
              <ContentList 
                contentItems={contentItems} 
                onStatusChange={handleUpdateStatus}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                workflows={workflows}
              />
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading content...</div>
            ) : contentItems.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <h3 className="text-lg font-medium mb-2">No content found</h3>
                <p>No content entries are available. Create some content in the individual content pages to see them here.</p>
              </div>
            ) : (
              <ContentCalendar 
                contentItems={contentItems} 
                onStatusChange={handleUpdateStatus}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
