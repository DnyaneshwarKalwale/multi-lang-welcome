import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import UsersPage from "./pages/UsersPage";
import ContentPage from "./pages/ContentPage";
import CarouselRequestsPage from "./pages/CarouselRequestsPage";
import SettingsPage from "./pages/SettingsPage";
import UserLimitsPage from "./pages/UserLimitsPage";

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "content",
        element: <ContentPage />,
      },
      {
        path: "carousel-requests",
        element: <CarouselRequestsPage />,
      },
      {
        path: "user-limits",
        element: <UserLimitsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]); 