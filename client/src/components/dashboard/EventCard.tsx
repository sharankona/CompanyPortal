import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";

interface EventCardProps {
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
}

export default function EventCard({
  title,
  startDate,
  endDate,
  location,
}: EventCardProps) {
  const formatTime = (start: Date, end: Date) => {
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };

  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 bg-primary-50 rounded-lg w-12 h-12 flex flex-col items-center justify-center mr-4 border border-primary-100">
        <span className="text-xs font-medium text-primary uppercase">
          {format(startDate, "MMM")}
        </span>
        <span className="text-lg font-bold text-primary">
          {format(startDate, "d")}
        </span>
      </div>
      <div>
        <h4 className="font-medium text-slate-800">{title}</h4>
        <div className="flex items-center mt-1 text-sm text-slate-500">
          <Clock className="text-sm mr-1 h-3 w-3" />
          <span>{formatTime(startDate, endDate)}</span>
        </div>
        <div className="flex items-center mt-1 text-sm text-slate-500">
          <MapPin className="text-sm mr-1 h-3 w-3" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}
