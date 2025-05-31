import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, Eye, MoreVertical, FileText, Image, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";

export interface DocumentItem {
  id: number;
  name: string;
  type: string;
  uploadedBy: {
    name: string;
    initials: string;
  };
  date: Date;
}

interface DocumentsTableProps {
  documents: DocumentItem[];
  onDownload?: (id: number) => void;
  onView?: (id: number) => void;
}

export default function DocumentsTable({ 
  documents,
  onDownload,
  onView 
}: DocumentsTableProps) {
  const getDocumentIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-slate-400" />;
      case 'PNG':
      case 'JPG':
        return <Image className="h-5 w-5 text-slate-400" />;
      case 'XLSX':
      case 'CSV':
        return <FileSpreadsheet className="h-5 w-5 text-slate-400" />;
      default:
        return <FileText className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Document Name
            </TableHead>
            <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Type
            </TableHead>
            <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Uploaded By
            </TableHead>
            <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Date
            </TableHead>
            <TableHead className="py-3.5 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100 bg-white">
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center">
                  {getDocumentIcon(document.type)}
                  <span className="text-sm font-medium text-slate-700 ml-3">
                    {document.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-500">
                {document.type}
              </TableCell>
              <TableCell className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="text-xs">
                      {document.uploadedBy.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-700">
                    {document.uploadedBy.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-500">
                {format(document.date, "MMM d, yyyy")}
              </TableCell>
              <TableCell className="px-4 py-3.5 whitespace-nowrap text-sm">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-primary hover:text-primary-dark"
                    onClick={() => onDownload && onDownload(document.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-500 hover:text-slate-700"
                    onClick={() => onView && onView(document.id)}
                  >
                    <Eye className="h-4 w-4" />
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
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
