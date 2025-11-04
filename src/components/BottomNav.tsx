import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav">
      <Link 
        to="/" 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
      >
        <div className="nav-icon">🏠</div>
        <div className="nav-label">Home</div>
      </Link>
      
      <Link 
        to="/catalogue" 
        className={`nav-item ${isActive('/catalogue') ? 'active' : ''}`}
      >
        <div className="nav-icon">📋</div>
        <div className="nav-label">Catalogue</div>
      </Link>
      
      <Link 
        to="/scanner" 
        className={`nav-item ${isActive('/scanner') ? 'active' : ''}`}
      >
        <div className="nav-icon scan-icon">📷</div>
        <div className="nav-label">Scan</div>
      </Link>
      
      <Link 
        to="/locations" 
        className={`nav-item ${isActive('/locations') ? 'active' : ''}`}
      >
        <div className="nav-icon">📍</div>
        <div className="nav-label">Locations</div>
      </Link>
    </nav>
  );
}

