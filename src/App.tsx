import React from 'react';
import Header from './components/Header';
import AddStockForm from './components/AddStockForm';
import StockList from './components/StockList';

function App() {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleStockAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <AddStockForm onStockAdded={handleStockAdded} />
        
        <StockList key={refreshTrigger} />
      </main>
      
      <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} StockfolioPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;