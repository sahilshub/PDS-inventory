import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Store,
  ArrowDownCircle,
  ArrowUpCircle,
  UserCircle,
  ChevronsLeft,
  ChevronsRight,
  Boxes,
  TruckIcon,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const email = Cookies.get("email");
  const role = Cookies.get("role");

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/products", label: "Products", icon: <Package size={20} /> },
    { path: "/godowns", label: "Godowns", icon: <Warehouse size={20} /> },
    { path: "/shops", label: "Shops", icon: <Store size={20} /> },
    { path: "/transport", label: "Transport", icon: <TruckIcon size={20} /> },
    {
      path: "/stock_in",
      label: "Stock In",
      icon: <ArrowDownCircle size={20} />,
    },
    {
      path: "/stock_out",
      label: "Stock Out",
      icon: <ArrowUpCircle size={20} />,
    },
    { path: "/ask", label: "Ask", icon: <Sparkles size={20} /> },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-gray-900 text-white flex flex-col justify-between min-h-screen p-4 transition-all duration-300 ease-in-out`}
    >
      <div>
        {/* Collapse Toggle */}
        <div className="flex justify-between items-center mb-6">
          {!collapsed ? (
            <div className="flex items-center gap-2 text-white text-xl font-semibold">
              <Boxes size={24} className="text-blue-500" />
              <span>SmartPDS</span>
            </div>
          ) : (
            <Boxes size={24} className="text-blue-500 mx-auto" />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white"
          >
            {collapsed ? (
              <ChevronsRight size={20} />
            ) : (
              <ChevronsLeft size={20} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <div>{item.icon}</div>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Footer */}
      <div
        className={`flex items-center gap-3 mt-10 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors ${
          collapsed ? "justify-center" : ""
        }`}
      >
        {!collapsed && (
          <div className="flex-col">
            <div className="flex gap-x-3">
              <UserCircle size={24} />
              <span className="capitalize">{role}</span>
            </div>
            <p className="text-xs font-small mt-2">{email.toLowerCase()}</p>
          </div>
        )}
        {collapsed && <UserCircle size={26} />}
      </div>
    </div>
  );
};

export default Sidebar;
