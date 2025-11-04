import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import LocationsPage from './pages/LocationsPage';
import ScannerPage from './pages/ScannerPage';
import BottomNav from './components/BottomNav';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;


