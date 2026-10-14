import SideBar from "../components/SideBar";
import React from "react";
import AdminHeader from "../components/AdminHeader";


function Orders() {
    const  [isSideBarOpen, setIsSideBarOpen] = React.useState(false)
  const  toggleSidebar = () => setIsSideBarOpen(prevState => !prevState)
  return (
    <section className="flex overflow-y-hidden">
      <SideBar isOpen={isSideBarOpen} />
      <section className="flex-1">
        <AdminHeader onMenuClick={toggleSidebar} pageName="Orders" />
        <main className="bg-dark p-5 h-[calc(100vh-73px)]"></main>
      </section>
    </section>
  );
}

export default Orders;
