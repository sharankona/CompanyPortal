import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar, Clock, AlertCircle, MoreVertical, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ContentEditForm from "./ContentEditForm";
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContentItem {
  id: number;
  title: string;
  description?: string;
  contentType: string;
  status: string;
  assignedTo?: number;
  deadline?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface ContentKanbanProps {
  contentItems: ContentItem[];
  onStatusChange: (id: number, status: string, notes?: string) => void;
  onEdit: (id: number, data: any) => void;
  onDelete: (id: number) => void;
  workflows?: any[];
}

export default function ContentKanban({ contentItems, onStatusChange, onEdit, onDelete, workflows }: ContentKanbanProps) {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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

  const columns = [
    { id: "draft", title: "Draft" },
    { id: "review", title: "In Review" },
    { id: "approved", title: "Approved" },
    { id: "scheduled", title: "Scheduled" },
    { id: "published", title: "Published" }
  ];

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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    const itemId = parseInt(draggableId);

    onStatusChange(itemId, newStatus);
  };

  const getItemsForColumn = (columnId: string) => {
    return contentItems.filter(item => item.status === columnId);
  };

  const handleEdit = (item: ContentItem) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEditSubmit = (data: any) => {
    if (selectedItem) {
      onEdit(selectedItem.id, data);
      setEditDialogOpen(false);
    }
  };

  return (
    <div className="w-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4 min-w-fit">
            {columns.map(column => (
                <div key={column.id} className="w-56 flex-shrink-0">
                  <div className="bg-slate-100 rounded-t-lg p-3 border border-slate-200 border-b-0">
                    <h3 className="font-medium text-sm text-slate-700">
                      {column.title} ({getItemsForColumn(column.id).length})
                    </h3>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-slate-50 p-2 rounded-b-lg min-h-[500px] border border-slate-200"
                      >
                        {getItemsForColumn(column.id).map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2 hover:shadow-md border border-slate-200"
                              >
                                <CardContent className="p-3">
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                      <h4
                                        className="text-sm font-medium cursor-pointer"
                                        onClick={() => {
                                          setSelectedItem(item);
                                          setDetailsOpen(true);
                                        }}
                                      >
                                        {item.title}
                                      </h4>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                                            <MoreVertical className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                    <Badge className={getContentTypeColor(item.contentType)}>
                                      {getContentTypeLabel(item.contentType)}
                                    </Badge>
                                    {item.assignedTo && (
                                      <div className="flex items-center mt-2">
                                        <Avatar className="h-5 w-5 mr-1">
                                          <AvatarFallback className="text-xs">
                                            {getUserInitials(item.assignedTo)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-slate-600">
                                          {getUserName(item.assignedTo)}
                                        </span>
                                      </div>
                                    )}
                                    {item.deadline && (
                                      <div className="flex items-center mt-1">
                                        {isDeadlinePassed(item.deadline) ? (
                                          <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                                        ) : isDeadlineSoon(item.deadline) ? (
                                          <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                                        ) : (
                                          <Calendar className="h-3 w-3 text-blue-500 mr-1" />
                                        )}
                                        <span className="text-xs text-slate-600">
                                          {format(new Date(item.deadline), "MMM d, yyyy")}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
          </div>
        </div>
      </DragDropContext>

      {/* Details Dialog */}
      {selectedItem && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedItem.title}</DialogTitle>
              <DialogDescription>
                Created by {getUserName(selectedItem.createdBy)} on{" "}
                {format(new Date(selectedItem.createdAt), "MMM d, yyyy")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Badge className={getContentTypeColor(selectedItem.contentType)}>
                  {getContentTypeLabel(selectedItem.contentType)}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      setDetailsOpen(false);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setDetailsOpen(false);
                      handleDelete(selectedItem.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-slate-600">{selectedItem.description || "No description"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Assigned To</h4>
                  <div className="flex items-center">
                    {selectedItem.assignedTo ? (
                      <>
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {getUserInitials(selectedItem.assignedTo)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{getUserName(selectedItem.assignedTo)}</span>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500">Not assigned</span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Deadline</h4>
                  {selectedItem.deadline ? (
                    <div className="flex items-center">
                      {isDeadlinePassed(selectedItem.deadline) ? (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      ) : isDeadlineSoon(selectedItem.deadline) ? (
                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                      ) : (
                        <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                      )}
                      <span className="text-sm">
                        {format(new Date(selectedItem.deadline), "MMMM d, yyyy")}
                        {isDeadlinePassed(selectedItem.deadline) && " (Overdue)"}
                        {isDeadlineSoon(selectedItem.deadline) && " (Soon)"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500">No deadline</span>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      {selectedItem && (
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
                title: selectedItem.title,
                description: selectedItem.description || "",
                contentType: selectedItem.contentType,
                assignedTo: selectedItem.assignedTo ? selectedItem.assignedTo.toString() : "unassigned",
                deadline: selectedItem.deadline,
              }}
              onSubmit={handleEditSubmit}
              workflows={workflows}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the content item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}