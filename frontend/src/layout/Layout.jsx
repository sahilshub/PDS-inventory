import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const Layout = () => {
  const [sidebarWidth, setSidebarWidth] = useState(256); // default expanded

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setSidebarWidth(entry.contentRect.width);
      }
    });

    const sidebarEl = document.getElementById("sidebar");
    if (sidebarEl) observer.observe(sidebarEl);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        id="sidebar"
        className="fixed top-0 left-0 bottom-0 z-10 transition-all duration-300"
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className="flex-1 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
