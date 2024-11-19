import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ManagerNav } from "@/components/ManagerNav";

export default function Manager() {
  return (
    <div className="flex">
      <ManagerNav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ManagerDashboard />} />
          <Route path="/media/*" element={<ManagerMedia />} />
          <Route path="/announcements/*" element={<ManagerAnnouncements />} />
          <Route path="/schedule/*" element={<ManagerSchedule />} />
          <Route path="/branches/*" element={<ManagerBranches />} />
          <Route path="/devices/*" element={<ManagerDevices />} />
          <Route path="/reports/*" element={<ManagerReports />} />
          <Route path="/activities/*" element={<ManagerActivities />} />
          <Route path="/settings/*" element={<ManagerSettings />} />
        </Routes>
      </main>
    </div>
  );
}

function ManagerDashboard() {
  return (
    <DashboardLayout
      title="Manager Dashboard"
      description="Control your branch's music and view statistics"
    >
      <div className="grid gap-6">
        {/* Now Playing Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Now Playing</h2>
              <p className="text-sm text-gray-500">Current playlist: Morning Vibes</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <span className="sr-only">Previous</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-3 bg-[#FFD700] rounded-full hover:bg-[#E6C200]">
                <span className="sr-only">Play</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <span className="sr-only">Next</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M4.5 9.75v4.5m0-4.5H8m-3.5 4.5H8" />
            </svg>
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div className="w-1/3 h-full bg-[#FFD700] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-500">Active Playlists</h3>
            <p className="text-2xl font-bold mt-2">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-500">Total Songs</h3>
            <p className="text-2xl font-bold mt-2">248</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-500">Connected Devices</h3>
            <p className="text-2xl font-bold mt-2">3</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">Playlist Changed</p>
                  <p className="text-sm text-gray-500">Evening Chill playlist activated</p>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ManagerMedia() {
  return (
    <DashboardLayout title="Media Library" description="Manage your media content">
      <div>Media Library Content</div>
    </DashboardLayout>
  );
}

function ManagerAnnouncements() {
  return (
    <DashboardLayout title="Announcements" description="Manage announcements">
      <div>Announcements Content</div>
    </DashboardLayout>
  );
}

function ManagerSchedule() {
  return (
    <DashboardLayout title="Schedule" description="Manage your schedules">
      <div>Schedule Content</div>
    </DashboardLayout>
  );
}

function ManagerBranches() {
  return (
    <DashboardLayout title="Branches" description="Manage your branches">
      <div>Branches Content</div>
    </DashboardLayout>
  );
}

function ManagerDevices() {
  return (
    <DashboardLayout title="Devices" description="Manage connected devices">
      <div>Devices Content</div>
    </DashboardLayout>
  );
}

function ManagerReports() {
  return (
    <DashboardLayout title="Reports" description="View system reports">
      <div>Reports Content</div>
    </DashboardLayout>
  );
}

function ManagerActivities() {
  return (
    <DashboardLayout title="Activities" description="Monitor system activities">
      <div>Activities Content</div>
    </DashboardLayout>
  );
}

function ManagerSettings() {
  return (
    <DashboardLayout title="Settings" description="Manage system settings">
      <div>Settings Content</div>
    </DashboardLayout>
  );
}