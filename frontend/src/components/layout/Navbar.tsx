import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Moon, Sun, LogOut, User, Menu, X, ChevronDown, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/features/auth/authStore";
import { useThemeStore } from "@/store/themeStore";
import { authApi } from "@/features/auth/authApi";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { darkMode, toggle } = useThemeStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    const rt = localStorage.getItem("refresh_token");
    if (rt) await authApi.logout(rt).catch(() => {});
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <BookOpen className="w-6 h-6" />
          <span>E-Library</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-6 text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Library</Link>
          <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          {isAuthenticated() && (
            <Link to="/survey" className="hover:text-foreground transition-colors">Survey</Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isAuthenticated() ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-accent"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  {user?.is_admin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary font-medium hover:bg-accent transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <div className="my-1 border-t border-border" />
                  <button
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-lg hover:opacity-90 transition"
            >
              Sign in
            </Link>
          )}

          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Library</Link>
          <Link to="/faq" onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">FAQ</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Contact</Link>
          {isAuthenticated() && (
            <>
              <Link to="/survey" onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Survey</Link>
              {user?.is_admin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-primary font-semibold">Admin</Link>
              )}
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Profile</Link>
              <button onClick={handleLogout} className="text-left text-red-500">Logout</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
