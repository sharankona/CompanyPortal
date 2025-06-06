import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventForm from "@/components/calendar/EventForm";
import EventCard from "@/components/dashboard/EventCard";
import { 
  format, 
  isToday, 
  isSameMonth, 
  isWithinInterval, 
  parseISO,
  startOfDay,
  endOfDay,
  isSameDay,
  addDays
} from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function CalendarPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [view, setView] = useState("day"); // day, week, month

  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  // Check if user can create events (management or admin)
  const canCreateEvent = user && ["admin", "management"].includes(user.role);

  const getOrganizerName = (organizerId: number) => {
    if (!users) return "Unknown";
    const organizer = users.find((u: any) => u.id === organizerId);
    return organizer ? organizer.fullName : "Unknown";
  };

  // Function to check if an event is within the selected view
  const isEventInView = (event: any) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    
    // Department filter
    if (departmentFilter !== "All" && event.department && event.department !== departmentFilter) {
      return false;
    }
    
    // Date filter based on view
    if (view === "day") {
      return isSameDay(eventStart, selectedDate) || 
             isSameDay(eventEnd, selectedDate) || 
             isWithinInterval(selectedDate, { start: eventStart, end: eventEnd });
    } else if (view === "week") {
      const weekStart = startOfDay(addDays(selectedDate, -selectedDate.getDay())); // Start of week (Sunday)
      const weekEnd = endOfDay(addDays(weekStart, 6)); // End of week (Saturday)
      
      return (
        isWithinInterval(eventStart, { start: weekStart, end: weekEnd }) ||
        isWithinInterval(eventEnd, { start: weekStart, end: weekEnd }) ||
        (eventStart <= weekStart && eventEnd >= weekEnd)
      );
    } else { // month view
      return isSameMonth(eventStart, selectedDate);
    }
  };

  // Filter events based on selected filters
  const filteredEvents = events
    ? events
        .filter(isEventInView)
        .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    : [];

  // Generate date cells for displaying events in day view
  const dateCells = () => {
    if (view === "day") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
            {isToday(selectedDate) && (
              <Badge className="ml-2 bg-blue-100 text-blue-800">Today</Badge>
            )}
          </h3>
          {filteredEvents.length > 0 ? (
            <div className="space-y-4">
              {filteredEvents.map((event: any) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  startDate={new Date(event.startDate)}
                  endDate={new Date(event.endDate)}
                  location={event.location}
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 py-4">No events scheduled for this day.</p>
          )}
        </div>
      );
    } else if (view === "week") {
      const weekStart = addDays(selectedDate, -selectedDate.getDay()); // Start of week (Sunday)
      
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Week of {format(weekStart, "MMMM d, yyyy")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, index) => {
              const date = addDays(weekStart, index);
              const dayEvents = events
                ? events.filter((event: any) => {
                    const eventStart = parseISO(event.startDate);
                    const eventEnd = parseISO(event.endDate);
                    
                    // Department filter
                    if (departmentFilter !== "All" && event.department && event.department !== departmentFilter) {
                      return false;
                    }
                    
                    return (
                      isSameDay(eventStart, date) || 
                      isSameDay(eventEnd, date) || 
                      isWithinInterval(date, { start: eventStart, end: eventEnd })
                    );
                  })
                  .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                : [];
                
              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-lg border p-3 ${
                    isToday(date) ? "border-blue-300 bg-blue-50" : "border-slate-200"
                  }`}
                >
                  <div className="text-center mb-2">
                    <div className="text-sm font-medium">{format(date, "EEE")}</div>
                    <div className={`text-lg ${isToday(date) ? "font-bold text-blue-600" : ""}`}>
                      {format(date, "d")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {dayEvents.length > 0 ? (
                      dayEvents.map((event: any) => (
                        <div 
                          key={event.id} 
                          className="text-xs p-1 rounded bg-blue-50 border border-blue-100"
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-slate-500">
                            {format(parseISO(event.startDate), "h:mm a")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 text-center py-2">No events</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {format(selectedDate, "MMMM yyyy")}
          </h3>
          <div className="space-y-2">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event: any) => (
                <Card key={event.id} className="mb-2">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-50 rounded-lg w-12 h-12 flex flex-col items-center justify-center border border-primary-100 flex-shrink-0">
                        <span className="text-xs font-medium text-primary uppercase">
                          {format(parseISO(event.startDate), "MMM")}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {format(parseISO(event.startDate), "d")}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{event.title}</h4>
                        <div className="text-sm text-slate-500">
                          {format(parseISO(event.startDate), "EEE, MMMM d • h:mm a")} - 
                          {isSameDay(parseISO(event.startDate), parseISO(event.endDate)) 
                            ? format(parseISO(event.endDate), " h:mm a") 
                            : format(parseISO(event.endDate), " EEE, MMMM d, h:mm a")}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          {event.location} • Organizer: {getOrganizerName(event.organizerId)}
                        </div>
                        {event.department && (
                          <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-600">
                            {event.department}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-slate-500 py-4">No events scheduled for this month.</p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Event Calendar</h2>
          <p className="text-slate-500 mt-1">
            View and manage upcoming company events.
          </p>
        </div>
        {canCreateEvent && (
          <div className="mt-4 sm:mt-0">
            <EventForm />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">View</label>
                  <Select value={view} onValueChange={setView}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Department</label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Departments</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {view === "day" ? "Daily Schedule" : view === "week" ? "Weekly Schedule" : "Monthly Schedule"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">Loading events...</p>
                </div>
              ) : (
                dateCells()
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
