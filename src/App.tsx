import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import Manager from "./pages/Manager";
import SuperAdmin from "./pages/SuperAdmin";
import ManagerLogin from "./pages/Manager/Auth/Login";
import ManagerRegister from "./pages/Manager/Auth/Register";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";
import SuperAdminRegister from "./pages/SuperAdmin/Auth/Register";

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
    path: "/manager/register",
    element: <ManagerRegister />,
  },
  {
    path: "/manager/*",
    element: <Manager />,
  },
  {
    path: "/super-admin/login",
    element: <SuperAdminLogin />,
  },
  {
    path: "/super-admin/register",
    element: <SuperAdminRegister />,
  },
  {
    path: "/super-admin/*",
    element: <SuperAdmin />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;