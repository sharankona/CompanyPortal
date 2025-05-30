import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Document } from "@shared/schema";
import { FileText, MoreHorizontal, Edit, Eye, Trash } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface RecentDocumentsProps {
  documents?: Document[];
  isLoading?: boolean;
}

export function RecentDocuments({ documents = [], isLoading = false }: RecentDocumentsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const getRelativeTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      published: "bg-green-100 text-green-700",
      draft: "bg-yellow-100 text-yellow-800",
      review: "bg-blue-100 text-blue-800",
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Create a copy and ensure we have data before sorting
  const sortedDocuments = documents ? 
    [...documents]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5) 
    : [];

  return (
    <Card className="shadow-sm">
      <CardHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Documents</CardTitle>
        <Link href="/documents" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-opacity-50 border-t-primary rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Created</th>
                  <th className="pb-3 font-medium">Modified</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No documents found
                    </td>
                  </tr>
                ) : (
                  sortedDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b border-border">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-muted-foreground" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground" title={formatDate(doc.createdAt)}>
                        {getRelativeTime(doc.createdAt)}
                      </td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground" title={formatDate(doc.updatedAt)}>
                        {getRelativeTime(doc.updatedAt)}
                      </td>
                      <td className="py-3 pr-4">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Eye size={14} />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Edit size={14} />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                              <Trash size={14} />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}