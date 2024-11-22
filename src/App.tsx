import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Manager from "./pages/Manager";
import { GenrePlaylists } from "./pages/Manager/Playlists/GenrePlaylists";
import { MoodPlaylists } from "./pages/Manager/Playlists/MoodPlaylists";
import { PlaylistDetail } from "@/components/playlists/PlaylistDetail";
import Devices from "./pages/Manager/Devices";
import Schedule from "./pages/Manager/Schedule";
import Announcements from "./pages/Manager/Announcements";
import Settings from "./pages/Manager/Settings";
import Notifications from "./pages/Manager/Notifications";
import { AuthProvider } from "@/hooks/useAuth";
import ManagerLogin from "./pages/Manager/Auth/Login";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";

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
    element: <Manager />,
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
        path: "announcements",
        element: <Announcements />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "settings/*",
        element: <Settings />,
      },
    ],
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