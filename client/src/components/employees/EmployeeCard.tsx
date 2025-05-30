import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

interface EmployeeCardProps {
  id: number;
  name: string;
  title: string;
  department: string;
  email: string;
  phone?: string;
  profileImage?: string;
}

export default function EmployeeCard({
  id,
  name,
  title,
  department,
  email,
  phone,
  profileImage,
}: EmployeeCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const departmentColors: Record<string, string> = {
    Engineering: "bg-blue-100 text-blue-800",
    Marketing: "bg-purple-100 text-purple-800",
    Sales: "bg-green-100 text-green-800",
    Finance: "bg-yellow-100 text-yellow-800",
    HR: "bg-pink-100 text-pink-800",
    Operations: "bg-orange-100 text-orange-800",
    Executive: "bg-red-100 text-red-800",
  };

  const departmentColor = departmentColors[department] || "bg-slate-100 text-slate-800";

  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600"></div>
      <CardContent className="pt-0 pb-3">
        <div className="flex flex-col items-center -mt-12">
          <Avatar className="h-20 w-20 border-4 border-white">
            {profileImage ? (
              <AvatarImage src={profileImage} alt={name} />
            ) : null}
            <AvatarFallback className="text-lg bg-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <h3 className="mt-3 text-lg font-medium">{name}</h3>
          <p className="text-sm text-slate-500">{title}</p>
          <Badge variant="outline" className={`mt-2 ${departmentColor}`}>
            {department}
          </Badge>
        </div>
        <div className="mt-5 space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-slate-400" />
            <a href={`mailto:${email}`} className="text-slate-700 hover:text-primary">
              {email}
            </a>
          </div>
          {phone && (
            <div className="flex items-center text-sm">
              <Phone className="mr-2 h-4 w-4 text-slate-400" />
              <a href={`tel:${phone}`} className="text-slate-700 hover:text-primary">
                {phone}
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-100 bg-slate-50 p-3">
        <Button variant="outline" size="sm" className="w-full">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
