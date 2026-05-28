import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleContactClick = () => {
    setIsOpen(false);
    navigate("/");
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-4 backdrop-blur md:px-16 lg:px-24 xl:px-32"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <Link to="/"><img src="/logo.svg" alt="logo" className="h-8.5 w-auto" /></Link>

        <div className="hidden items-center gap-8 transition duration-500 md:flex">
          <Link to="/" className="transition hover:text-pink-500">Home</Link>
          <Link to="/generate" className="transition hover:text-pink-500">Generate</Link>
          <Link to="/my-generation" className="transition hover:text-pink-500">My Generation</Link>
          <button onClick={handleContactClick} className="transition hover:text-pink-500">Contact</button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-zinc-400">{user?.credits} credits</span>
              <button onClick={handleLogout} className="rounded-full border border-pink-600 px-5 py-2 text-pink-400 text-sm transition hover:bg-pink-600 hover:text-white">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/login")} className="rounded-full bg-pink-600 px-6 py-2.5 transition-all hover:bg-pink-700 active:scale-95">
              Get Started
            </button>
          )}
        </div>

        <button onClick={() => setIsOpen(true)} className="md:hidden"><MenuIcon size={26} /></button>
      </motion.nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-black/40 text-lg backdrop-blur transition-transform duration-300 md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Link onClick={() => setIsOpen(false)} to="/">Home</Link>
        <Link onClick={() => setIsOpen(false)} to="/generate">Generate</Link>
        <Link onClick={() => setIsOpen(false)} to="/my-generation">My Generation</Link>
        <button onClick={handleContactClick}>Contact</button>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="text-pink-400">Logout</button>
        ) : (
          <Link onClick={() => setIsOpen(false)} to="/login">Login</Link>
        )}
        <button onClick={() => setIsOpen(false)} className="flex size-10 items-center justify-center rounded-md bg-pink-600 p-1 text-white transition hover:bg-pink-700">
          <XIcon />
        </button>
      </div>
    </>
  );
}
