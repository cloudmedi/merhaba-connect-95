import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Register from '@/pages/Manager/Auth/Register';
import Login from '@/pages/Manager/Auth/Login';
import SuperAdminLogin from '@/pages/SuperAdmin/Auth/Login';
import SuperAdminRegister from '@/pages/SuperAdmin/Auth/Register';
import Dashboard from '@/pages/Manager/Dashboard';
import Announcements from '@/pages/Manager/Announcements';
import Playlists from '@/pages/Manager/Playlists';
import Devices from '@/pages/Manager/Devices';
import Settings from '@/pages/Manager/Settings';
import NotFound from '@/pages/NotFound';
import SuperAdmin from '@/pages/SuperAdmin';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/manager/register" element={<Register />} />
          <Route path="/manager/login" element={<Login />} />
          <Route path="/manager/dashboard" element={<Dashboard />} />
          <Route path="/manager/announcements" element={<Announcements />} />
          <Route path="/manager/playlists" element={<Playlists />} />
          <Route path="/manager/devices" element={<Devices />} />
          <Route path="/manager/settings" element={<Settings />} />
          
          {/* Super Admin Routes */}
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/super-admin/register" element={<SuperAdminRegister />} />
          <Route path="/super-admin/*" element={<SuperAdmin />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;