import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Manager from "./pages/Manager";
import { GenrePlaylists } from "./pages/Manager/Playlists/GenrePlaylists";
import { MoodPlaylists } from "./pages/Manager/Playlists/MoodPlaylists";
import { CategoryPlaylists } from "./pages/Manager/Playlists/CategoryPlaylists";
import { PlaylistDetail } from "@/components/playlists/PlaylistDetail";
import Devices from "./pages/Manager/Devices";
import Schedule from "./pages/Manager/Schedule";
import Settings from "./pages/Manager/Settings";
import { AuthProvider } from "@/hooks/useAuth";
import ManagerLogin from "./pages/Manager/Auth/Login";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";
import SuperAdmin from "./pages/SuperAdmin";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/manager/login",
    element: <ManagerLogin />,
  },
  {
    path: "/super-admin/login",
    element: <SuperAdminLogin />,
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
        path: "playlists/genre/:genreId",
        element: <GenrePlaylists />,
      },
      {
        path: "playlists/mood/:moodId",
        element: <MoodPlaylists />,
      },
      {
        path: "playlists/category/:categoryId",
        element: <CategoryPlaylists />,
      },
      {
        path: "playlists/:id",
        element: <PlaylistDetail />,
      },
      {
        path: "devices",
        element: <Devices />,
      },
      {
        path: "schedule",
        element: <Schedule />,
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