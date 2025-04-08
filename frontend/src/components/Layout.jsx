// Layout Component
import Sidebar from "./Sidebar";
import { useState } from "react";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true); // Always start collapsed

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 h-screen overflow-hidden transition-all duration-300 ${collapsed ? "ml-16" : "ml-52"}`}>
        {/* Scrollable Content */}
        <main className="p-4 sm:p-3 text-sm sm:text-xs flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
