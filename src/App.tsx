import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { PlaylistDetail } from "./pages/Manager/Playlists/PlaylistDetail";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/manager/login",
    element: (
      <AuthProvider>
        <ManagerLogin />
      </AuthProvider>
    ),
  },
  {
    path: "/super-admin/login",
    element: (
      <AuthProvider>
        <SuperAdminLogin />
      </AuthProvider>
    ),
  },
  {
    path: "/manager",
    element: (
      <AuthProvider>
        <Manager />
      </AuthProvider>
    ),
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
        element: <PlaylistDetail />,
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