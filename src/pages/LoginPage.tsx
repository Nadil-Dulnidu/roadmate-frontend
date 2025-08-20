import { SignUp } from "@clerk/clerk-react";
import loginImage from "../assets/login.jpg";
import { Link } from "react-router";
import logo from "@/assets/logo.png";
import { Helmet } from "react-helmet";

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>RoadMate | Login Page</title>
        <meta name="description" content="Login to your account" />
      </Helmet>
      <section className="grid min-h-svh lg:grid-cols-2 font-inter">
        <div className="flex flex-col gap-4 p-2 md:p-4">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link to="/" className="flex text-xl items-center gap-2 font-medium">
              <div className="bg-primary flex size-10 items-center justify-center rounded-md">
                <img src={logo} alt="RoadMate Logo" />
              </div>
              <span className="font-semibold">RoadMate</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full flex items-center justify-center max-w-xs">
              <SignUp
                forceRedirectUrl="/"
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-primary",
                    rootBox: "shadow-none",
                    card: "shadow-none",
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <img src={loginImage} alt="Image" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
        </div>
      </section>
    </>
  );
}
