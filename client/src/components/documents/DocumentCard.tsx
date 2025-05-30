import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Trash } from "lucide-react";
import { format } from "date-fns";

interface DocumentCardProps {
  id: number;
  name: string;
  type: string;
  fileUrl: string;
  description?: string;
  uploadedBy: {
    id: number;
    name: string;
    initials: string;
  };
  createdAt: Date;
  onDownload: (id: number, fileUrl: string) => void;
  onView: (id: number, fileUrl: string) => void;
  onDelete: (id: number) => void;
}

export default function DocumentCard({
  id,
  name,
  type,
  fileUrl,
  description,
  uploadedBy,
  createdAt,
  onDownload,
  onView,
  onDelete,
}: DocumentCardProps) {
  const getDocumentTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "PDF":
        return "bg-red-100 text-red-600";
      case "DOCX":
        return "bg-blue-100 text-blue-600";
      case "XLSX":
        return "bg-green-100 text-green-600";
      case "PPTX":
        return "bg-orange-100 text-orange-600";
      case "PNG":
      case "JPG":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-20 bg-slate-100 flex items-center justify-center">
        <FileText className="h-10 w-10 text-slate-400" />
      </div>
      <CardContent className="pt-4 pb-2">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-slate-800 truncate mr-2">{name}</h3>
          <Badge variant="outline" className={getDocumentTypeColor(type)}>
            {type}
          </Badge>
        </div>
        {description && (
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center text-xs text-slate-500 mt-3">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarFallback className="text-xs">
              {uploadedBy.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-slate-700 text-sm">{uploadedBy.name}</p>
            <p>{format(createdAt, "MMM d, yyyy")}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-100 p-2 bg-slate-50 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-600"
          onClick={() => onDownload(id, fileUrl)}
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-600"
          onClick={() => onView(id, fileUrl)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500"
          onClick={() => onDelete(id)}
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
