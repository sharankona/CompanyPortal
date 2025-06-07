
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import ContentKanban from "@/components/content/ContentKanban";
import ContentList from "@/components/content/ContentList";
import ContentCalendar from "@/components/content/ContentCalendar";
import ContentForm from "@/components/content/ContentForm";
import { useToast } from "@/hooks/use-toast";

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState("kanban");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  document.title = "Blog Content | Dashboard";
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch content items filtered for blog
  const { data: contentItems, isLoading } = useQuery({
    queryKey: ["/api/content", "blog"],
    queryFn: async () => {
      const response = await fetch("/api/content?contentType=blog");
      if (!response.ok) throw new Error("Failed to fetch blog content");
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
        body: JSON.stringify({ ...data, contentType: "blog" })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create blog content");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Blog Content Created",
        description: "Your blog content has been created successfully.",
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

  return (
    <DashboardShell title="Blog Content" description="Manage and track your blog content creation workflow">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Manage your blog posts and articles
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Blog Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new blog post.
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
              <div className="text-center p-8">Loading blog content...</div>
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
              <div className="text-center p-8">Loading blog content...</div>
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
              <div className="text-center p-8">Loading blog content...</div>
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
