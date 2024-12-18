import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/hooks/useAuth';
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import GymSector from "./pages/sectors/GymSector";
import { ErrorState } from '@/components/ErrorState';

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
    path: "/landing",
    element: <Landing />,
  },
  {
    path: "/sectors/gym",
    element: <GymSector />,
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
