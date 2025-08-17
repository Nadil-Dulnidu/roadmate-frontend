import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "./ui/sonner";

const Layout = () => {
  return (
    <>
      <section className="flex flex-col min-h-screen font-inter">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </section>
      <Toaster />
    </>
  );
};

export default Layout;
