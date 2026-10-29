
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  SquareArrowRightExit,
  Settings,
  Home,
  ReceiptTextIcon,
  Store,
  ChartColumnBigIcon,
} from "lucide-react";

import Logo2 from "../assets/LOGO.jpg";

function SideBar({ isOpen }) {
  const navigate = useNavigate();

  const linkStyles = {
    textStyle:
      "gap-2 text-gray font-light items-center w-full p-2 rounded flex hover:bg-dark-soft2/40 hover:text-white transition-all duration-300 ease",
    iconStyle: "w-4 h-4",
  };

  const links = [
    {
      id: 1,
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <Home strokeWidth={1.5} className={linkStyles.iconStyle} />,
    },
    {
      id: 2,
      label: "Orders",
      path: "/admin/orders",
      icon: (
        <ReceiptTextIcon
          strokeWidth={1.5}
          className={linkStyles.iconStyle}
        />
      ),
    },
    {
      id: 3,
      label: "Catalogue",
      path: "/admin/catalogue",
      icon: <Store strokeWidth={1.5} className={linkStyles.iconStyle} />,
    },
    {
      id: 4,
      label: "Analytics",
      path: "/admin/analytics",
      icon: (
        <ChartColumnBigIcon
          strokeWidth={1.5}
          className={linkStyles.iconStyle}
        />
      ),
    },
  ];

  const handleLogout = () => {
    // Remove the admin authentication token.
    sessionStorage.removeItem("vandaluxe_admin_token");

    // Also clear the legacy keys if they were used previously.
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");

    // Return to the admin login page.
    navigate("/admin/login", { replace: true });
  };

  const sidebarContent = (
    <div className="h-screen flex flex-col justify-between ">
      <div>
        <h1
          className="p-4 text-center text-xl text-white"
          style={{ fontFamily: "AccentFont" }}
        >
          VANDALUXE
        </h1>

        <ul className="mt-2 list-none space-y-2 p-2">
          {links.map((link) => (
            <li key={link.id}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 rounded bg-dark-soft2 p-2 text-white"
                    : linkStyles.textStyle
                }
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="">
        <div className="flex w-full flex-col items-center justify-center text-center text-gray">
          <img
            src={Logo2}
            className="h-14 w-14 rounded object-cover"
            alt="Vandaluxe logo"
          />
          <h2 className="mt-2 font-semibold">Vandaluxe CEO</h2>
          <p className="font-light">Alexander</p>
        </div>

        <div className="mt-12 space-y-2 p-2">
          <button
            type="button"
            onClick={() => navigate("/admin/settings")}
            className={linkStyles.textStyle}
          >
            <Settings
              strokeWidth={1.5}
              className="h-5 w-5 rotate-180 text-white"
            />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className={`${linkStyles.textStyle} hover:bg-red-500/10 hover:text-red-300`}
          >
            <SquareArrowRightExit
              strokeWidth={1.5}
              className="h-5 w-5 rotate-180 text-white"
            />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden h-screen w-full max-w-[200px] flex-col justify-between border-r border-gray/20 bg-dark-soft p-2 lg:flex"
      >
        {sidebarContent}
      </motion.aside>

      {/* Animated mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            exit={{ x: -200 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 flex h-screen w-[200px] flex-col justify-between border-r border-gray/20 bg-dark-soft p-2 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export default SideBar;
