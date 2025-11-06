import { useState, useEffect } from 'react';
import { apiService, Product } from '../utils/api';
import StatusBar from '../components/StatusBar';

// Helper function to generate SVG placeholder images
const generatePlaceholderImage = (text: string): string => {
  const svg = `
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="#f5f5f5"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle" dominant-baseline="middle">
        ${text.substring(0, 30)}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

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
      // Set mock data for demo with real eco-friendly products
      setProducts([
        {
          id: '123123',
          name: 'Coca-Cola 1.5L',
          image: 'https://www.spot.uz/media/img/2025/05/QzN7nw17464294466712_l.jpg',
          original_price: 0,
          discounted_price: 0,
          discount_percentage: 0,
          points: 800,
          valid_from: '01.11.2025',
          valid_to: '30.11.2025',
        },
        {
          id: '123124',
          name: 'Fanta 1.5L',
          image: generatePlaceholderImage('Fanta 1.5L'),
          original_price: 0,
          discounted_price: 0,
          discount_percentage: 0,
          points: 800,
          valid_from: '01.11.2025',
          valid_to: '30.11.2025',
        },
        {
          id: '123125',
          name: 'Sprite 1.5L',
          image: generatePlaceholderImage('Sprite 1.5L'),
          original_price: 0,
          discounted_price: 0,
          discount_percentage: 0,
          points: 800,
          valid_from: '01.11.2025',
          valid_to: '30.11.2025',
        },
        {
          id: '123126',
          name: 'Вода 365kun',
          image: generatePlaceholderImage('365kun Water'),
          original_price: 0,
          discounted_price: 0,
          discount_percentage: 0,
          points: 1200,
          valid_from: '01.11.2025',
          valid_to: '30.11.2025',
        },
        {
          id: '123127',
          name: 'Маринованные огурцы Marinella',
          image: generatePlaceholderImage('Pickled Cucumbers'),
          original_price: 0,
          discounted_price: 0,
          discount_percentage: 0,
          points: 2000,
          valid_from: '01.11.2025',
          valid_to: '30.11.2025',
        },
        {
          id: '123128',
          name: 'Маринованные помидоры 365kun',
          image: generatePlaceholderImage('Pickled Tomatoes'),
          original_price: 0,
          discounted_price: 0,
          discount_percentage: 0,
          points: 3500,
          valid_from: '01.11.2025',
          valid_to: '30.11.2025',
        },
        {
          id: '123129',
          name: 'Маринованные шампиньоны 365kun',
          image: generatePlaceholderImage('Pickled Mushrooms'),
          original_price: 0,
          discounted_price: 0,
          discount_percentage: 0,
          points: 4000,
          valid_from: '01.11.2025',
          valid_to: '30.11.2025',
        },
        {
          id: '123130',
          name: 'Пюре Бабушкино лукошко индейка',
          image: generatePlaceholderImage('Baby Food Turkey'),
          original_price: 0,
          discounted_price: 0,
          discount_percentage: 0,
          points: 3000,
          valid_from: '01.11.2025',
          valid_to: '30.11.2025',
        },
        {
          id: '123131',
          name: 'Маринованные томаты Астраханские',
          image: generatePlaceholderImage('Astrakhan Tomatoes'),
          original_price: 0,
          discounted_price: 0,
          discount_percentage: 0,
          points: 3000,
          valid_from: '01.11.2025',
          valid_to: '30.11.2025',
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
          <h1 className="page-title">🌱 Eco-Friendly Products</h1>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            Redeem your BasketPoints for sustainable products
          </p>
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
                  🌿 Eco-Friendly
                </div>
                <div className="price-badge" style={{ background: 'linear-gradient(135deg, #34A853 0%, #0F9D58 100%)' }}>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>
                    {formatPrice(product.points)}
                  </span>
                  <span style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>
                    BasketPoints
                  </span>
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-points" style={{ color: '#34A853', fontWeight: '600' }}>
                  ✓ Available for redemption
                </div>
                <button className="order-button" style={{ background: '#34A853' }}>
                  Redeem Now
                </button>
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


