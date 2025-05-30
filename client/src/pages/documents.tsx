import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload from "@/components/documents/DocumentUpload";
import DocumentCard from "@/components/documents/DocumentCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";

export default function Documents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);

  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/documents"],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/documents/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully.",
      });
      setDocumentToDelete(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete document",
      });
    },
  });

  const documentTypes = ["PDF", "DOCX", "XLSX", "PPTX", "PNG", "JPG", "TXT", "CSV", "Other"];

  const getUserName = (userId: number) => {
    if (!users) return "Unknown User";
    const user = users.find((u: any) => u.id === userId);
    return user ? user.fullName : "Unknown User";
  };

  const getUserInitials = (userId: number) => {
    const name = getUserName(userId);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredDocuments = documents
    ? documents.filter((doc: any) => {
        // Type filter
        if (typeFilter && doc.type !== typeFilter) {
          return false;
        }

        // Search filter (case insensitive)
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return doc.name.toLowerCase().includes(query);
        }

        return true;
      })
    : [];

  const handleDocumentDownload = (id: number, fileUrl: string) => {
    toast({
      title: "Download started",
      description: "Your document is being downloaded...",
    });
    // In a real app, this would trigger the actual download
    console.log(`Downloading document ${id} from ${fileUrl}`);
  };

  const handleDocumentView = (id: number, fileUrl: string) => {
    toast({
      title: "Opening document",
      description: "The document viewer is opening...",
    });
    // In a real app, this would open the document viewer
    console.log(`Viewing document ${id} from ${fileUrl}`);
  };

  const handleDocumentDelete = (id: number) => {
    setDocumentToDelete(id);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      deleteDocument.mutate(documentToDelete);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Document Management</h2>
          <p className="text-slate-500 mt-1">
            Access, upload, and manage company documents.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <DocumentUpload />
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search documents..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Loading documents...</p>
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((doc: any) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              name={doc.name}
              type={doc.type}
              fileUrl={doc.fileUrl}
              description={doc.description}
              uploadedBy={{
                id: doc.uploadedById,
                name: getUserName(doc.uploadedById),
                initials: getUserInitials(doc.uploadedById),
              }}
              createdAt={new Date(doc.createdAt)}
              onDownload={handleDocumentDownload}
              onView={handleDocumentView}
              onDelete={handleDocumentDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-white">
          <p className="text-slate-500">No documents found matching your criteria.</p>
        </div>
      )}

      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteDocument.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
