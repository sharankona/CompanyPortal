
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar, Clock, AlertCircle, ArrowLeft, Edit } from "lucide-react";
import ContentEditForm from "@/components/content/ContentEditForm";
import { useState } from "react";

export default function ContentViewPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch content item
  const { data: contentItem, isLoading, error } = useQuery({
    queryKey: [`/api/content/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/content/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch content item");
      }
      return response.json();
    },
    enabled: !!id
  });

  // Fetch users for assignments
  const { data: users } = useQuery({
    queryKey: ["/api/users"],
    select: (data: any) => {
      return data.map((user: any) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    },
  });

  // Edit content mutation
  const editContentMutation = useMutation({
    mutationFn: async (data: any) => {
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
      queryClient.invalidateQueries({ queryKey: [`/api/content/${id}`] });
      setEditDialogOpen(false);
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

  const handleEditSubmit = (data: any) => {
    editContentMutation.mutate(data);
  };

  const getUserName = (userId: number) => {
    if (!users) return "Unknown";
    const user = users.find((u: any) => u.id === userId);
    return user ? user.fullName : "Unknown";
  };

  const getUserInitials = (userId: number) => {
    if (!users) return "?";
    const user = users.find((u: any) => u.id === userId);
    if (!user) return "?";
    return user.fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "blog":
        return "Blog Post";
      case "instagram":
        return "Instagram";
      case "linkedin":
        return "LinkedIn";
      case "youtube":
        return "YouTube";
      case "facebook":
        return "Facebook";
      case "twitter":
        return "X (Twitter)";
      case "product":
        return "Product Listing";
      case "social":
        return "Social Media";
      default:
        return type;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "blog":
        return "bg-blue-100 text-blue-800";
      case "instagram":
        return "bg-pink-100 text-pink-800";
      case "linkedin":
        return "bg-blue-100 text-blue-700";
      case "youtube":
        return "bg-red-100 text-red-800";
      case "facebook":
        return "bg-blue-100 text-blue-900";
      case "twitter":
        return "bg-gray-100 text-gray-900";
      case "product":
        return "bg-green-100 text-green-800";
      case "social":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "review":
        return "In Review";
      case "approved":
        return "Approved";
      case "scheduled":
        return "Scheduled";
      case "published":
        return "Published";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "published":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isDeadlineSoon = (deadline?: string) => {
    if (!deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  const isDeadlinePassed = (deadline?: string) => {
    if (!deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center p-8">Loading content...</div>
        </div>
      </div>
    );
  }

  if (error || !contentItem) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center p-8 text-red-600">
            Error loading content: {error?.message || "Content not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => window.close()}
            className="flex items-center gap-2"
          >
            Close Tab
          </Button>
        </div>

        {/* Main Content Card */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">{contentItem.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getContentTypeColor(contentItem.contentType)}>
                    {getContentTypeLabel(contentItem.contentType)}
                  </Badge>
                  <Badge className={getStatusColor(contentItem.status)}>
                    {getStatusLabel(contentItem.status)}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {contentItem.description || "No description provided"}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assignment */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Assigned To
                </h4>
                <div className="flex items-center">
                  {contentItem.assignedTo ? (
                    <>
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="text-sm">
                          {getUserInitials(contentItem.assignedTo)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-slate-900 font-medium">
                        {getUserName(contentItem.assignedTo)}
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-500">Not assigned</span>
                  )}
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Deadline
                </h4>
                {contentItem.deadline ? (
                  <div className="flex items-center">
                    {isDeadlinePassed(contentItem.deadline) ? (
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    ) : isDeadlineSoon(contentItem.deadline) ? (
                      <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                    ) : (
                      <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                    )}
                    <div>
                      <div className="text-slate-900 font-medium">
                        {format(new Date(contentItem.deadline), "MMMM d, yyyy")}
                      </div>
                      {isDeadlinePassed(contentItem.deadline) && (
                        <div className="text-red-600 text-sm">Overdue</div>
                      )}
                      {isDeadlineSoon(contentItem.deadline) && (
                        <div className="text-yellow-600 text-sm">Due soon</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-500">No deadline set</span>
                )}
              </div>

              {/* Created By */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Created By
                </h4>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="text-sm">
                      {getUserInitials(contentItem.createdBy)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-slate-900 font-medium">
                    {getUserName(contentItem.createdBy)}
                  </span>
                </div>
              </div>

              {/* Created Date */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Created Date
                </h4>
                <div className="text-slate-900 font-medium">
                  {format(new Date(contentItem.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </div>
              </div>

              {/* Last Updated */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Last Updated
                </h4>
                <div className="text-slate-900 font-medium">
                  {format(new Date(contentItem.updatedAt), "MMMM d, yyyy 'at' h:mm a")}
                </div>
              </div>

              {/* Content ID */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Content ID
                </h4>
                <div className="text-slate-900 font-mono text-sm">
                  #{contentItem.id}
                </div>
              </div>
            </div>

            {/* Additional Content Fields */}
            {contentItem.notes && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">Notes</h3>
                <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">
                  {contentItem.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        {contentItem && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Content</DialogTitle>
                <DialogDescription>
                  Make changes to the content item.
                </DialogDescription>
              </DialogHeader>
              <ContentEditForm 
                initialData={{
                  title: contentItem.title,
                  description: contentItem.description || "",
                  contentType: contentItem.contentType,
                  assignedTo: contentItem.assignedTo ? contentItem.assignedTo.toString() : "unassigned",
                  deadline: contentItem.deadline,
                }}
                onSubmit={handleEditSubmit}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
