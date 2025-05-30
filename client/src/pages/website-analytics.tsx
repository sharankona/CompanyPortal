// This file has been deprecated in favor of client/src/pages/analytics/website.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DeprecatedWebsiteAnalyticsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new analytics page
    navigate("/analytics/website");
  }, [navigate]);

  return null;
}