import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import Manager from "./pages/Manager";
import SuperAdmin from "./pages/SuperAdmin";
import ManagerLogin from "./pages/Manager/Auth/Login";
import ManagerRegister from "./pages/Manager/Auth/Register";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";
import SuperAdminRegister from "./pages/SuperAdmin/Auth/Register";
import { AuthProvider } from '@/hooks/useAuth';
import Dashboard from "./pages/SuperAdmin/Dashboard";
import Users from "./pages/SuperAdmin/Users";
import Music from "./pages/SuperAdmin/Music";
import Genres from "./pages/SuperAdmin/Genres";
import Categories from "./pages/SuperAdmin/Categories";
import Moods from "./pages/SuperAdmin/Moods";
import Playlists from "./pages/SuperAdmin/Playlists";
import { PlaylistDetail as SuperAdminPlaylistDetail } from "./pages/SuperAdmin/Playlists/PlaylistDetail";
import Notifications from "./pages/SuperAdmin/Notifications";
import Performance from "./pages/SuperAdmin/Performance";
import Reports from "./pages/SuperAdmin/Reports";
import Settings from "./pages/SuperAdmin/Settings";
import { ErrorState } from '@/components/ErrorState';
import ManagerDashboard from "./pages/Manager/Dashboard";
import Devices from "./pages/Manager/Devices";
import ManagerPlaylists from "./pages/Manager/Playlists";
import Schedule from "./pages/Manager/Schedule";
import Announcements from "./pages/Manager/Announcements";
import ManagerSettings from "./pages/Manager/Settings";
import ProfileSettings from "./pages/Manager/Settings/Profile";
import { PlaylistDetail as ManagerPlaylistDetail } from "./pages/Manager/Playlists/PlaylistDetail";
import { CategoryPlaylists } from "./pages/Manager/Playlists/CategoryPlaylists";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorState error="Sayfa bulunamadı" onRetry={() => window.location.reload()} />,
  },
  {
    path: "/manager",
    element: <Manager />,
    errorElement: <ErrorState error="Sayfa bulunamadı" onRetry={() => window.location.reload()} />,
    children: [
      { index: true, element: <ManagerDashboard /> },
      { path: "devices/*", element: <Devices /> },
      { path: "playlists", element: <ManagerPlaylists /> },
      { path: "playlists/category/:categoryId", element: <CategoryPlaylists /> },
      { path: "playlists/:id", element: <ManagerPlaylistDetail /> },
      { path: "schedule/*", element: <Schedule /> },
      { path: "announcements/*", element: <Announcements /> },
      { path: "settings", element: <ManagerSettings /> },
      { path: "settings/profile", element: <ProfileSettings /> },
    ],
  },
  {
    path: "/manager/login",
    element: <ManagerLogin />,
  },
  {
    path: "/manager/register",
    element: <ManagerRegister />,
  },
  {
    path: "/super-admin",
    element: <SuperAdmin />,
    errorElement: <ErrorState error="Sayfa bulunamadı" onRetry={() => window.location.reload()} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "users/*", element: <Users /> },
      { path: "music/*", element: <Music /> },
      { path: "genres/*", element: <Genres /> },
      { path: "categories/*", element: <Categories /> },
      { path: "moods/*", element: <Moods /> },
      { path: "playlists", element: <Playlists /> },
      { path: "playlists/:id", element: <SuperAdminPlaylistDetail /> },
      { path: "notifications/*", element: <Notifications /> },
      { path: "performance/*", element: <Performance /> },
      { path: "reports/*", element: <Reports /> },
      { path: "settings/*", element: <Settings /> },
    ],
  },
  {
    path: "/super-admin/login",
    element: <SuperAdminLogin />,
  },
  {
    path: "/super-admin/register",
    element: <SuperAdminRegister />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;