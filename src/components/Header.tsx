import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useAuth, SignInButton, UserButton } from "@clerk/clerk-react";
import { Menu, Bell } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/logo.png";

export function Header() {
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={cn("flex items-center gap-6 text-sm font-medium", mobile && "flex-col items-start gap-4")}>
      <Link to="/" className="hover:font-semibold transition-all delay-75" onClick={() => mobile && setIsOpen(false)}>
        Vehicles
      </Link>
      <Link to="/" className="hover:font-semibold transition-all delay-75" onClick={() => mobile && setIsOpen(false)}>
        About Us
      </Link>
      <Link to="/" className="hover:font-semibold transition-all delay-75"  onClick={() => mobile && setIsOpen(false)}>
        Become a Host
      </Link>
    </nav>
  );
  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex items-center gap-2", mobile && "flex-col items-stretch gap-4 w-full")}>
      {isSignedIn ? (
        <>
          <Link to="/dashboard" className={cn(mobile && "w-full")} onClick={() => mobile && setIsOpen(false)}>
            <Button variant="ghost" className={cn(mobile && "w-full")}>
              Dashboard
            </Button>
          </Link>
          <div className={cn("flex items-center", mobile && "w-full justify-center")}>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </>
      ) : (
        <>
          <SignInButton
            forceRedirectUrl="/dashboard"
            mode="modal"
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary",
              },
            }}
          >
            <Button variant="secondary" className={cn(mobile && "w-full")}>
              Login
            </Button>
          </SignInButton>
          <Link to="/login">
            <Button variant={"secondary"} className={cn("bg-primary text-primary-foreground hover:bg-primary/90", mobile && "w-full")}>
              Sign up
            </Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 py-2 text-black bg-white w-full ">
      <div className="container flex flex-wrap h-14 items-center justify-between mx-auto px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="SkillMentor Logo" className="size-12 rounded-full" />
            <span className="font-semibold text-xl">RoadMate</span>
          </Link>
          <div className="ml-6 hidden md:block">
            <NavItems />
          </div>
        </div>
        {/* Desktop Auth Buttons */}
        <div className="flex gap-1">
          <div className="flex gap-2">
            <Button variant={"ghost"}>
              <Bell className="size-6" />
            </Button>
            <div className="hidden md:block">
              <AuthButtons />
            </div>
          </div>
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="border-primary">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="size-6 text-black" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white text-black p-6">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                      <img src={logo} alt="SkillMentor Logo" className="size-10 rounded-full" />
                      <span className="font-semibold text-lg">RoadMate</span>
                    </Link>
                  </div>

                  <div className="space-y-6 flex-1">
                    <NavItems mobile />
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <AuthButtons mobile />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
