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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/manager/*",
    element: <Manager />,
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
    path: "/super-admin/*",
    element: <SuperAdmin />,
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