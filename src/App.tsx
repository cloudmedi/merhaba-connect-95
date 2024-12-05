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
    path: "/manager/*",
    element: (
      <AuthProvider>
        <Manager />
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