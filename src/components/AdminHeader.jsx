import Logo2 from "../assets/LOGO.jpg";
import { NavLink } from "react-router-dom";

import { Bell, MessageSquare } from "lucide-react";

function AdminHeader({ pageName, onMenuClick }) {
  return (
    <div>
      <header className="w-full border-b border-gray/20 flex justify-between p-4">
        <h1
          style={{ fontFamily: "Castoro titling" }}
          className="flex space-x-0.5 items-center text-white"
        >
          {pageName}
        </h1>

        <nav className="flex items-center gap-2">
          <button className="flex border border-gray/20 text-gray/20 hover:text-gray hover:border-gray transition-all duration-150 ease-out p-2 rounded-md">
            <NavLink to="/admin/messages">
              <MessageSquare
                className="lg:h-5 lg:w-5 md:h-5 md:w-5 sm:h-4 sm:w-4 h-4 w-4"
                strokeWidth={1.5}
              />
            </NavLink>
          </button>

          <button className="border  border-gray/20 text-gray/20 hover:text-gray hover:border-gray transition-all duration-150 ease-out p-2 rounded-md">
            <NavLink to="/admin/notifications">
              <Bell
                className="lg:h-5 lg:w-5 md:h-5 md:w-5 sm:h-4 sm:w-4 h-4 w-4"
                strokeWidth={1.5}
              />
            </NavLink>
          </button>
          <img
            src={Logo2}
            className="
            
        w-10 h-10 rounded-md border  border-gray/20 text-gray/20 hover:text-gray hover:border-gray transition-all duration-150 ease-out"
            alt="profile"
            title="profile"
            onClick={onMenuClick}
          />
        </nav>
      </header>
    </div>
  );
}

export default AdminHeader;
