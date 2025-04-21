import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/ui/logo";
import { Menu } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Calculator", path: "/calculator" },
    { name: "Installers", path: "/installers" },
    { name: "Resources", path: "/resources" },
    { name: "About", path: "/about" },
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <a className="focus:outline-none">
            <Logo />
          </a>
        </Link>

        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={`font-medium ${
                  location === item.path
                    ? "text-primary"
                    : "text-neutral-700 hover:text-primary"
                } transition-colors`}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/calculator">
            <Button
              className="hidden md:block"
              variant="default"
              size="default"
            >
              Get Started
            </Button>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-neutral-700"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <Logo size="sm" />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col mt-6 space-y-4">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <a
                      className={`py-2 ${
                        location === item.path
                          ? "text-primary font-medium"
                          : "text-neutral-700"
                      }`}
                      onClick={closeSheet}
                    >
                      {item.name}
                    </a>
                  </Link>
                ))}
                <Link href="/calculator">
                  <Button className="mt-4" onClick={closeSheet}>
                    Get Started
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
