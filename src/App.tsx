import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import Manager from "./pages/Manager";
import SuperAdmin from "./pages/SuperAdmin";
import ManagerLogin from "./pages/Manager/Auth/Login";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";
import { AuthProvider } from "@/hooks/useAuth";
import { PlaylistDetailLoader } from "@/components/loaders/PlaylistDetailLoader";

// Lazy load the PlaylistDetail component
const PlaylistDetail = lazy(() => import("./pages/Manager/Playlists/PlaylistDetail").then(module => ({
  default: module.PlaylistDetail
})));

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  // Manager Routes
  {
    path: "/manager/login",
    element: (
      <AuthProvider>
        <ManagerLogin />
      </AuthProvider>
    ),
  },
  {
    path: "/manager/*",
    element: (
      <AuthProvider>
        <Manager />
      </AuthProvider>
    ),
  },
  // Super Admin Routes
  {
    path: "/super-admin/login",
    element: (
      <AuthProvider>
        <SuperAdminLogin />
      </AuthProvider>
    ),
  },
  {
    path: "/super-admin/*",
    element: (
      <AuthProvider>
        <SuperAdmin />
      </AuthProvider>
    ),
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