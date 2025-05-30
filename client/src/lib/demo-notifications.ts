
// This is a utility to generate demo notifications for demonstration purposes

import { useNotifications } from "@/context/NotificationContext";

export const useDemoNotifications = () => {
  const { addNotification } = useNotifications();

  const triggerDemoNotifications = () => {
    // Demo notifications
    const demoNotifications = [
      {
        title: "New Document Shared",
        message: "Marketing team shared 'Q3 Marketing Plan.pdf' with you",
        type: "info" as const,
        link: "/documents"
      },
      {
        title: "Calendar Event Reminder",
        message: "Weekly team meeting starts in 15 minutes",
        type: "warning" as const,
        link: "/calendar"
      },
      {
        title: "Analytics Report Ready",
        message: "Your monthly analytics report for April has been generated",
        type: "success" as const,
        link: "/analytics"
      },
      {
        title: "System Maintenance",
        message: "Scheduled maintenance will occur this weekend",
        type: "warning" as const
      }
    ];

    // Add notifications with delay to simulate real-time notifications
    demoNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification);
      }, index * 3000); // Add a new notification every 3 seconds
    });
  };

  return { triggerDemoNotifications };
};
