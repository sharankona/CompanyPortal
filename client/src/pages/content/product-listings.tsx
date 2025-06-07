
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Package } from "lucide-react";
import ContentKanban from "@/components/content/ContentKanban";
import ContentList from "@/components/content/ContentList";
import ContentCalendar from "@/components/content/ContentCalendar";
import ContentForm from "@/components/content/ContentForm";
import { useToast } from "@/hooks/use-toast";

export default function ProductListingsPage() {
  const [activeTab, setActiveTab] = useState("kanban");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  document.title = "Product Listings | Dashboard";
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch product listing content items
  const { data: contentItems, isLoading } = useQuery({
    queryKey: ["/api/content", "product"],
    queryFn: async () => {
      const response = await fetch("/api/content?contentType=product");
      if (!response.ok) throw new Error("Failed to fetch product listings");
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

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, contentType: "product" })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create product listing");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Product Listing Created",
        description: "Your product listing has been created successfully.",
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
        description: "Product listing status has been updated successfully.",
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
        title: "Product Updated",
        description: "Product listing has been updated successfully.",
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
        title: "Product Deleted",
        description: "Product listing has been deleted successfully.",
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

  return (
    <DashboardShell title="Product Listings" description="Manage your product listings and catalog content">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-black" />
            <div className="text-sm text-muted-foreground">
              Manage your product listings and catalog
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Product Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Product Listing</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new product listing.
                </DialogDescription>
              </DialogHeader>
              <ContentForm onSubmit={handleCreateContent} workflows={workflows} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading product listings...</div>
            ) : (
              <ContentKanban 
                contentItems={contentItems || []} 
                onStatusChange={handleUpdateStatus}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                workflows={workflows}
              />
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading product listings...</div>
            ) : (
              <ContentList 
                contentItems={contentItems || []} 
                onStatusChange={handleUpdateStatus}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                workflows={workflows}
              />
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading product listings...</div>
            ) : (
              <ContentCalendar 
                contentItems={contentItems || []} 
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
