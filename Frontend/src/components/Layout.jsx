import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CodePlayground from "./codes/CodePlayground";
import Sidebar from './Sidebar';
import Feature from './Feature';

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-15">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;

