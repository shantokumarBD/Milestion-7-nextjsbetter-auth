"use client";
import { useState } from "react";
import NextLink from "next/link";
import { Link, Button } from "@heroui/react";
import { signOut, useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const navItems = [
    { label: "Features", href: "#" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pricing", href: "/profile" },
  ];

  if (session?.user) {
    navItems.push({ label: "Profile", href: "/profile" });
  }

  const authActions = isPending ? (
    <Spinner size="sm" />
  ) : session?.user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">Welcome, {session.user?.name}</span>
      <Button variant="danger" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  ) : (
    <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
      <NextLink href="/sign-in" className="w-full md:w-auto">
        <Button variant="ghost" className="w-full">
          Login
        </Button>
      </NextLink>
      <NextLink href="/sign-up" className="w-full md:w-auto">
        <Button variant="primary" className="w-full">
          Sign Up
        </Button>
      </NextLink>
    </div>
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-default-200 bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 -ml-2 text-default-500 hover:text-default-900 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-inherit text-xl">
              ACME
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="text-foreground text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">{authActions}</div>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-default-200 bg-background px-6 py-4">
          <ul className="flex flex-col gap-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="text-foreground w-full text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 pt-4 border-t border-default-200 flex flex-col items-start gap-4 w-full">
              {authActions}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
