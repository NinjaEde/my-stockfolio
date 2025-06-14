import { useState, useEffect } from "react";
import Header from "./components/Header";
import AddStockForm from "./components/AddStockForm";
import StockList from "./components/StockList";
import Auth from "./components/Auth";
import AddMultiNotesPanel from "./components/AddMultiNotesPanel";
import AddFilterPanel from "./components/AddFilterPanel";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize darkMode from localStorage or default to light mode
    return localStorage.getItem("darkMode") === "true";
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem("username")
  );
  const [filterColor, setFilterColor] = useState("");
  const [groupByColor, setGroupByColor] = useState(false);

  useEffect(() => {
    // Add or remove the 'dark' class on the <html> element
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Persist the user's preference in localStorage
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const handleStockAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAuthSuccess = (token: string, username: string) => {
    setToken(token);
    setUsername(username);
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  const handleColorFilterChange = (colorValue: string) => {
    setFilterColor(colorValue);
  };

  const handleGroupByColor = () => {
    setGroupByColor((prev) => !prev);
  };

  if (!token) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div>
      <div className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen flex flex-col">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
          username={username ?? undefined}
        />
        <main className="container mx-auto px-4 py-8 max-w-8xl flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            <AddStockForm onStockAdded={handleStockAdded} />
            <AddMultiNotesPanel />
            <AddFilterPanel
              filterColor={filterColor}
              onFilterColorChange={handleColorFilterChange}
              groupByColor={groupByColor}
              onGroupByColor={handleGroupByColor}
            />
          </div>
          <hr className="mt-8 mb-4 border-gray-200 dark:border-gray-700" />
          <StockList
            filterColor={filterColor}
            groupByColor={groupByColor}
            refreshTrigger={refreshTrigger}
          />
        </main>
        <footer className="bg-blue-600 dark:bg-violet-900 text-gray-300 py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} StockfolioPro. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
