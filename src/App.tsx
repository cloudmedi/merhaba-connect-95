import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import Manager from "./pages/Manager";
import Devices from "./pages/Manager/Devices";
import Schedule from "./pages/Manager/Schedule";
import Settings from "./pages/Manager/Settings";
import { AuthProvider } from "@/hooks/useAuth";
import ManagerLogin from "./pages/Manager/Auth/Login";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";
import SuperAdmin from "./pages/SuperAdmin";
import Announcements from "./pages/Manager/Announcements";
import { CategoryPlaylists } from "./pages/Manager/Playlists/CategoryPlaylists";
import { PlaylistDetailLoader } from "@/components/loaders/PlaylistDetailLoader";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const PlaylistDetail = lazy(() => import("./pages/Manager/Playlists/PlaylistDetail").then(module => ({
  default: module.PlaylistDetail
})));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/manager/login",
    element: (
      <AuthProvider>
        <ManagerLogin />
      </AuthProvider>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: "/super-admin/login",
    element: (
      <AuthProvider>
        <SuperAdminLogin />
      </AuthProvider>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: "/manager",
    element: (
      <AuthProvider>
        <Manager />
      </AuthProvider>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "devices",
        element: <Devices />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
      {
        path: "announcements",
        element: <Announcements />,
      },
      {
        path: "playlists/:id",
        element: (
          <Suspense fallback={<PlaylistDetailLoader />}>
            <PlaylistDetail />
          </Suspense>
        ),
      },
      {
        path: "playlists/category/:categoryId",
        element: <CategoryPlaylists />,
      },
      {
        path: "settings/*",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/super-admin/*",
    element: (
      <AuthProvider>
        <SuperAdmin />
      </AuthProvider>
    ),
    errorElement: <ErrorBoundary />
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;