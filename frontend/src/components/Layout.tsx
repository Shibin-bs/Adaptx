import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout() {
  return (
    <div className="min-h-screen w-full bg-[#020817] text-white flex flex-col font-sans">
      {/* TOP HEADER: Compact mission telemetry bar */}
      <TopBar />

      {/* APP BODY: Collapsible Left Sidebar + Vertically Scrollable Main Content */}
      <div className="flex-1 flex flex-row w-full min-h-[calc(100vh-3.5rem)]">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-[#020817] flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
