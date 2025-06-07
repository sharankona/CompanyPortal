import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Calendar, Clock, AlertCircle, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ContentEditForm from "./ContentEditForm";

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

interface ContentListProps {
  contentItems: ContentItem[];
  onStatusChange: (id: number, status: string, notes?: string) => void;
  onEdit: (id: number, data: any) => void;
  onDelete: (id: number) => void;
  workflows?: any[];
}

export default function ContentList({ contentItems, onStatusChange, onEdit, onDelete, workflows }: ContentListProps) {
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

  const handleStatusChange = (id: number, status: string) => {
    onStatusChange(id, status);
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
    <div className="space-y-6 w-full">
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Title
                </TableHead>
                <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </TableHead>
                <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Assigned To
                </TableHead>
                <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Deadline
                </TableHead>
                <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created
                </TableHead>
                <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 bg-white">
              {contentItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50">
                  <TableCell className="px-4 py-3.5 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 max-w-[200px] truncate">
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 whitespace-nowrap">
                    <Badge className={getContentTypeColor(item.contentType)}>
                      {getContentTypeLabel(item.contentType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 whitespace-nowrap">
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 whitespace-nowrap">
                    {item.assignedTo ? (
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {getUserInitials(item.assignedTo)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-slate-700">
                          {getUserName(item.assignedTo)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 whitespace-nowrap">
                    {item.deadline ? (
                      <div className="flex items-center">
                        {isDeadlinePassed(item.deadline) ? (
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                        ) : isDeadlineSoon(item.deadline) ? (
                          <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                        ) : (
                          <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                        )}
                        <span className="text-sm text-slate-700">
                          {format(new Date(item.deadline), "MMM d, yyyy")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">No deadline</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-500">
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-500 hover:text-slate-700"
                        onClick={() => {
                          setSelectedItem(item);
                          setDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-500 hover:text-slate-700"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-500 hover:text-slate-700"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "draft")}>
                            Set as Draft
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "review")}>
                            Move to Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "approved")}>
                            Mark as Approved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "scheduled")}>
                            Set as Scheduled
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "published")}>
                            Mark as Published
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

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
                <div>
                  <Badge className={getContentTypeColor(selectedItem.contentType)}>
                    {getContentTypeLabel(selectedItem.contentType)}
                  </Badge>
                  <Badge className={`ml-2 ${getStatusColor(selectedItem.status)}`}>
                    {getStatusLabel(selectedItem.status)}
                  </Badge>
                </div>
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