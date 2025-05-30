
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Twitter, SortAsc, SortDesc } from "lucide-react";
import ContentKanban from "@/components/content/ContentKanban";
import ContentList from "@/components/content/ContentList";
import ContentCalendar from "@/components/content/ContentCalendar";
import ContentForm from "@/components/content/ContentForm";
import { useToast } from "@/hooks/use-toast";

export default function TwitterPage() {
  const [activeTab, setActiveTab] = useState("kanban");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  document.title = "X (Twitter) Content | Dashboard";
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch content items filtered for Twitter
  const { data: contentItems, isLoading } = useQuery({
    queryKey: ["/api/content", "twitter"],
    queryFn: async () => {
      const response = await fetch("/api/content?contentType=twitter");
      if (!response.ok) throw new Error("Failed to fetch Twitter content");
      return response.json();
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

  // Create content item mutation
  const createContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, contentType: "twitter" })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create Twitter content");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Twitter Content Created",
        description: "Your Twitter content has been created successfully.",
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

  const handleCreateContent = (data: any) => {
    createContentMutation.mutate(data);
  };

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
    if (!contentItems) return [];

    let filtered = contentItems;
    
    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((item: any) => item.status === selectedStatus);
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

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "in_progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "approved", label: "Approved" },
    { value: "published", label: "Published" }
  ];

  const sortOptions = [
    { value: "updatedAt", label: "Last Updated" },
    { value: "createdAt", label: "Created Date" },
    { value: "title", label: "Title" },
    { value: "status", label: "Status" },
    { value: "deadline", label: "Deadline" }
  ];

  return (
    <DashboardShell title={
      <div className="flex items-center space-x-2">
        <Twitter className="h-6 w-6 text-black" />
        <span>X (Twitter) Content</span>
      </div>
    } description="Manage your tweets and Twitter content">
      <div className="space-y-6">
        {/* Filters and Sort Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-end justify-between">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Status Filter */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
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

              {/* Create Button */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">&nbsp;</label>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Tweet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create New Tweet</DialogTitle>
                      <DialogDescription>
                        Fill in the details to create a new tweet.
                      </DialogDescription>
                    </DialogHeader>
                    <ContentForm onSubmit={handleCreateContent} workflows={workflows} defaultContentType="twitter" />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredAndSortedItems().length} {filteredAndSortedItems().length === 1 ? 'item' : 'items'}
              {selectedStatus !== "all" && (
                <span> with status {statusOptions.find(opt => opt.value === selectedStatus)?.label}</span>
              )}
              {isLoading && <span> (Loading...)</span>}
              {contentItems && <span> (Total available: {contentItems.length})</span>}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading Twitter content...</div>
            ) : (
              <ContentKanban 
                contentItems={filteredAndSortedItems()} 
                onStatusChange={handleUpdateStatus}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                workflows={workflows}
              />
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading Twitter content...</div>
            ) : (
              <ContentList 
                contentItems={filteredAndSortedItems()} 
                onStatusChange={handleUpdateStatus}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                workflows={workflows}
              />
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading Twitter content...</div>
            ) : (
              <ContentCalendar 
                contentItems={filteredAndSortedItems()} 
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
