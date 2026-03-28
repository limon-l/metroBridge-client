import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Learn",
    submenu: [
      { label: "How it Works", href: "#how" },
      { label: "Features", href: "#features" },
      { label: "Reviews", href: "#reviews" },
    ],
  },
  {
    label: "Resources",
    submenu: [
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function ProfessionalNavbar() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const navItemClass =
    "group relative rounded-lg px-4 py-2 text-small font-medium text-neutral transition duration-200 hover:bg-slate-100 hover:text-primary";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="content-container h-16">
        <div className="flex h-full items-center justify-between">
          <Link
            className="flex items-center gap-2 transition hover:opacity-90"
            to="/">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light text-sm font-bold text-white">
              MB
            </div>
            <span className="hidden font-bold text-primary sm:inline">
              MetroBridge
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) =>
              item.submenu ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}>
                  <button className={navItemClass} type="button">
                    {item.label}
                    <span className="absolute bottom-1.5 left-4 h-[2px] w-0 bg-accent transition-all duration-200 group-hover:w-[calc(100%-2rem)]" />
                  </button>
                  {openDropdown === item.label ? (
                    <div className="absolute right-0 top-full mt-1 w-48 origin-top rounded-card border border-border bg-white shadow-soft animate-[scale-up_220ms_ease-out]">
                      {item.submenu.map((subitem) => (
                        <a
                          key={subitem.label}
                          className="block border-b border-border px-4 py-3 text-small font-medium text-gray-700 transition hover:bg-slate-50 hover:text-primary last:border-b-0"
                          href={subitem.href}>
                          {subitem.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <a key={item.label} className={navItemClass} href={item.href}>
                  {item.label}
                  <span className="absolute bottom-1.5 left-4 h-[2px] w-0 bg-accent transition-all duration-200 group-hover:w-[calc(100%-2rem)]" />
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              className="hidden text-small font-medium text-neutral transition hover:text-primary md:inline"
              to="/admin-login">
              Admin
            </Link>
            <Link to="/login">
              <Button
                className="border-primary text-primary hover:bg-primary/5"
                size="sm"
                variant="secondary">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" variant="cta">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
