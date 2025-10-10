import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

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
    </>
  );
};

export default Layout;
