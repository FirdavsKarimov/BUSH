import { useState, useEffect } from 'react';
import { apiService, Product } from '../utils/api';
import StatusBar from '../components/StatusBar';

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const productsData = await apiService.getProducts();
      setProducts(productsData);
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.message || 'Failed to load products');
      // Set mock data for demo
      setProducts([
        {
          id: '1',
          name: 'Г.Грудинка, вес**',
          image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Beef+Brisket',
          original_price: 99990,
          discounted_price: 89990,
          discount_percentage: 10,
          points: 3,
          valid_from: '25.10.2025',
          valid_to: '12.11.2025',
        },
        {
          id: '2',
          name: 'Г.Корейка, вес**',
          image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Beef+Loin',
          original_price: 125990,
          discounted_price: 97990,
          discount_percentage: 22,
          points: 2,
          valid_from: '25.10.2025',
          valid_to: '12.11.2025',
        },
        {
          id: '3',
          name: 'Г.Ребра, вес**',
          image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Beef+Ribs',
          original_price: 119990,
          discounted_price: 92990,
          discount_percentage: 22,
          points: 2,
          valid_from: '25.10.2025',
          valid_to: '12.11.2025',
        },
        {
          id: '4',
          name: 'Г.Вырезка, вес**',
          image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Beef+Tenderloin',
          original_price: 127990,
          discounted_price: 99990,
          discount_percentage: 21,
          points: 3,
          valid_from: '25.10.2025',
          valid_to: '12.11.2025',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US').replace(/,/g, ' ');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <StatusBar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Beef price drop!</h1>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-badge">
                  {product.valid_from}-{product.valid_to}
                </div>
                <div className="price-badge">
                  <span className="original-price">{formatPrice(product.original_price)}</span>
                  <span className="discounted-price">{formatPrice(product.discounted_price)}</span>
                  <div className="discount-percent">-{product.discount_percentage}%</div>
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-points">{product.points} Балла</div>
                <button className="order-button">Order</button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <div className="empty-state-text">No products available</div>
          </div>
        )}

        {error && (
          <div className="error-message">
            Using demo data. {error}
          </div>
        )}
      </div>
    </>
  );
}


