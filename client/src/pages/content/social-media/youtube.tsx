import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Youtube } from "lucide-react";
import ContentKanban from "@/components/content/ContentKanban";
import ContentList from "@/components/content/ContentList";
import ContentCalendar from "@/components/content/ContentCalendar";
import ContentForm from "@/components/content/ContentForm";
import { useToast } from "@/hooks/use-toast";

export default function YouTubePage() {
  const [activeTab, setActiveTab] = useState("kanban");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  document.title = "YouTube Content | Dashboard";
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: contentItems, isLoading } = useQuery({
    queryKey: ["/api/content", "youtube"],
    queryFn: async () => {
      const response = await fetch("/api/content?contentType=youtube");
      if (!response.ok) throw new Error("Failed to fetch YouTube content");
      return response.json();
    }
  });

  const { data: workflows } = useQuery({
    queryKey: ["/api/workflows"],
    queryFn: async () => {
      const response = await fetch("/api/workflows");
      if (!response.ok) throw new Error("Failed to fetch workflows");
      return response.json();
    }
  });

  const createContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, contentType: "youtube" })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create YouTube content");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "YouTube Content Created",
        description: "Your YouTube content has been created successfully.",
      });
    }
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number, status: string, notes?: string }) => {
      const response = await fetch(`/api/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes })
      });
      if (!response.ok) throw new Error("Failed to update content");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Content Updated", description: "Content status has been updated successfully." });
    }
  });

  const editContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const response = await fetch(`/api/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to edit content");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Content Updated", description: "Content has been updated successfully." });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/content/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete content");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Content Deleted", description: "Content has been deleted successfully." });
    }
  });

  return (
    <DashboardShell title="YouTube Content" description="Manage your YouTube videos and channel content">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Youtube className="h-6 w-6 text-black" />
            <div className="text-sm text-muted-foreground">
              Manage your YouTube videos and content
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create YouTube Video
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New YouTube Content</DialogTitle>
                <DialogDescription>Fill in the details to create a new YouTube video.</DialogDescription>
              </DialogHeader>
              <ContentForm onSubmit={(data) => createContentMutation.mutate(data)} workflows={workflows} />
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
              <div className="text-center p-8">Loading YouTube content...</div>
            ) : (
              <ContentKanban 
                contentItems={contentItems || []} 
                onStatusChange={(id, status, notes) => updateContentMutation.mutate({ id, status, notes })}
                onEdit={(id, data) => editContentMutation.mutate({ id, data })}
                onDelete={(id) => deleteContentMutation.mutate(id)}
                workflows={workflows}
              />
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading YouTube content...</div>
            ) : (
              <ContentList 
                contentItems={contentItems || []} 
                onStatusChange={(id, status, notes) => updateContentMutation.mutate({ id, status, notes })}
                onEdit={(id, data) => editContentMutation.mutate({ id, data })}
                onDelete={(id) => deleteContentMutation.mutate(id)}
                workflows={workflows}
              />
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading YouTube content...</div>
            ) : (
              <ContentCalendar 
                contentItems={contentItems || []} 
                onStatusChange={(id, status, notes) => updateContentMutation.mutate({ id, status, notes })}
                onEdit={(id, data) => editContentMutation.mutate({ id, data })}
                onDelete={(id) => deleteContentMutation.mutate(id)}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}