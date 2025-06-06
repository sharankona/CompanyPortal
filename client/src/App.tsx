import { useState, lazy, Suspense } from "react";
import FinancialsOverviewPage from "./pages/financials/overview";

const FinancialsRevenuePage = lazy(() => import("./pages/financials/revenue"));
const FinancialsExpensesPage = lazy(() => import("./pages/financials/expenses"));
const FinancialsInvoicesPage = lazy(() => import("./pages/financials/invoices"));
const FinancialsBudgetPage = lazy(() => import("./pages/financials/budget"));
const FinancialsReportsPage = lazy(() => import("./pages/financials/reports"));
const AllContentPage = lazy(() => import("./pages/content/all-content"));
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { AuthProvider } from "./hooks/use-auth";
import { queryClient } from "./lib/queryClient";
import { ProtectedRoute } from "./lib/protected-route";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import AuthPage from "./pages/auth-page";
import DashboardPage from "./pages/dashboard-page";
import DocumentsPage from "./pages/documents-page";
import UsersPage from "./pages/users-page";
import AnnouncementsPage from "./pages/announcements-page";
import AnalyticsPage from "./pages/analytics-page";
import SettingsPage from "./pages/settings-page";
import NotFound from "./pages/not-found";
import FinancialsPage from "./pages/financials";
import ContentPipelinePage from "./pages/content-pipeline";
import { NotificationProvider } from "./context/NotificationContext";
import ContentViewPage from "./pages/content/content-view";

// Lazy load the analytics pages
const WebsiteAnalytics = lazy(() => import("./pages/analytics/website"));
const SocialMediaAnalytics = lazy(() => import("./pages/analytics/index"));
const InstagramAnalytics = lazy(() => import("./pages/analytics/social/instagram"));
const LinkedinAnalytics = lazy(() => import("./pages/analytics/social/linkedin"));
const YoutubeAnalytics = lazy(() => import("./pages/analytics/social/youtube"));
const FacebookAnalytics = lazy(() => import("./pages/analytics/social/facebook"));
const TwitterAnalytics = lazy(() => import("./pages/analytics/social/twitter"));

// Lazy load the content pages
const BlogPage = lazy(() => import("./pages/content/blog"));
const SocialMediaIndex = lazy(() => import("./pages/content/social-media"));
const InstagramPage = lazy(() => import("./pages/content/social-media/instagram"));
const LinkedInPage = lazy(() => import("./pages/content/social-media/linkedin"));
const YouTubePage = lazy(() => import("./pages/content/social-media/youtube"));
const FacebookPage = lazy(() => import("./pages/content/social-media/facebook"));
const TwitterPage = lazy(() => import("./pages/content/social-media/twitter"));
const ProductListingsPage = lazy(() => import("./pages/content/product-listings"));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <div className="flex h-screen bg-background">
            <Switch>
              <Route path="/login">
                <div className="flex items-center justify-center h-screen">
                  <AuthPage />
                </div>
              </Route>
              <Route path="/register">
                <div className="flex items-center justify-center h-screen">
                  <AuthPage />
                </div>
              </Route>
              <Route>
                <ProtectedRoute>
                  <div className="flex flex-col md:flex-row flex-1 h-screen">
                    <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header toggleSidebar={toggleSidebar} />
                      <div className="flex-1 pt-16 overflow-y-auto">
                        <Switch>
                          <Route path="/" component={DashboardPage} />
                          <Route path="/documents" component={DocumentsPage} />
                          <Route path="/users" component={UsersPage} />
                          <Route path="/announcements" component={AnnouncementsPage} />
                          <Route path="/analytics" component={AnalyticsPage} />
                          <Route path="/analytics/website">
                            <Suspense fallback={<div className="p-6">Loading website analytics...</div>}>
                              <WebsiteAnalytics />
                            </Suspense>
                          </Route>
                          <Route path="/analytics/social">
                            <Suspense fallback={<div className="p-6">Loading social media analytics...</div>}>
                              <SocialMediaAnalytics />
                            </Suspense>
                          </Route>
                          <Route path="/analytics/social/instagram">
                            <Suspense fallback={<div className="p-6">Loading Instagram analytics...</div>}>
                              <InstagramAnalytics />
                            </Suspense>
                          </Route>
                          <Route path="/analytics/social/linkedin">
                            <Suspense fallback={<div className="p-6">Loading LinkedIn analytics...</div>}>
                              <LinkedinAnalytics />
                            </Suspense>
                          </Route>
                          <Route path="/analytics/social/youtube">
                            <Suspense fallback={<div className="p-6">Loading YouTube analytics...</div>}>
                              <YoutubeAnalytics />
                            </Suspense>
                          </Route>
                          <Route path="/analytics/social/facebook">
                            <Suspense fallback={<div className="p-6">Loading Facebook analytics...</div>}>
                              <FacebookAnalytics />
                            </Suspense>
                          </Route>
                          <Route path="/analytics/social/twitter">
                            <Suspense fallback={<div className="p-6">Loading Twitter analytics...</div>}>
                              <TwitterAnalytics />
                            </Suspense>
                          </Route>
                          <Route path="/financials" component={FinancialsPage} />
                          <Route path="/financials/overview">
                            <Suspense fallback={<div className="p-6">Loading financial overview...</div>}>
                              <FinancialsOverviewPage />
                            </Suspense>
                          </Route>
                          <Route path="/financials/revenue">
                            <Suspense fallback={<div className="p-6">Loading revenue data...</div>}>
                              <FinancialsRevenuePage />
                            </Suspense>
                          </Route>
                          <Route path="/financials/expenses">
                            <Suspense fallback={<div className="p-6">Loading expenses data...</div>}>
                              <FinancialsExpensesPage />
                            </Suspense>
                          </Route>
                          <Route path="/financials/invoices">
                            <Suspense fallback={<div className="p-6">Loading invoices...</div>}>
                              <FinancialsInvoicesPage />
                            </Suspense>
                          </Route>
                          <Route path="/financials/budget">
                            <Suspense fallback={<div className="p-6">Loading budget data...</div>}>
                              <FinancialsBudgetPage />
                            </Suspense>
                          </Route>
                          <Route path="/financials/reports">
                            <Suspense fallback={<div className="p-6">Loading reports...</div>}>
                              <FinancialsReportsPage />
                            </Suspense>
                          </Route>
                          <Route path="/content-pipeline" component={ContentPipelinePage} />
                           <Route path="/content/all-content">
                            <Suspense fallback={<div className="p-6">Loading All Content...</div>}>
                              <AllContentPage />
                            </Suspense>
                          </Route>
                          <Route path="/content/blog">
                            <Suspense fallback={<div className="p-6">Loading Blog Page...</div>}>
                              <BlogPage />
                            </Suspense>
                          </Route>
                          <Route path="/content/social-media">
                            <Suspense fallback={<div className="p-6">Loading Social Media Index...</div>}>
                              <SocialMediaIndex />
                            </Suspense>
                          </Route>
                          <Route path="/content/social-media/instagram">
                             <Suspense fallback={<div className="p-6">Loading Instagram Page...</div>}>
                              <InstagramPage />
                              </Suspense>
                          </Route>
                          <Route path="/content/social-media/linkedin">
                             <Suspense fallback={<div className="p-6">Loading LinkedIn Page...</div>}>
                              <LinkedInPage />
                              </Suspense>
                          </Route>
                          <Route path="/content/social-media/youtube">
                             <Suspense fallback={<div className="p-6">Loading YouTube Page...</div>}>
                              <YouTubePage />
                              </Suspense>
                          </Route>
                          <Route path="/content/social-media/facebook">
                             <Suspense fallback={<div className="p-6">Loading Facebook Page...</div>}>
                              <FacebookPage />
                              </Suspense>
                          </Route>
                          <Route path="/content/social-media/twitter">
                             <Suspense fallback={<div className="p-6">Loading Twitter Page...</div>}>
                              <TwitterPage />
                              </Suspense>
                          </Route>
                          <Route path="/content/product-listings">
                             <Suspense fallback={<div className="p-6">Loading Product Listings Page...</div>}>
                              <ProductListingsPage />
                              </Suspense>
                          </Route>
                          <Route path="/settings" component={SettingsPage} />
                          <Route path="/profile" component={lazy(() => import("./pages/profile-page"))} />
                          <Route path="/content/view/:id" component={ContentViewPage} />
                          <Route component={NotFound} />
                        </Switch>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              </Route>
            </Switch>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;