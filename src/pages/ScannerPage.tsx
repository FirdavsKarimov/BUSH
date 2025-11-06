import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { apiService } from '../utils/api';
import { testPostRequest } from '../utils/testApi';
import StatusBar from '../components/StatusBar';

export default function ScannerPage() {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [barcode, setBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (mode === 'scan') {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [mode]);

  const startScanner = async () => {
    try {
      // Check if the site is served over HTTPS (required for camera access)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setError('Camera access requires HTTPS. Please use the "Manual Input" tab instead.');
        setMode('manual');
        return;
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera access is not supported in your browser. Please use the "Manual Input" tab instead.');
        setMode('manual');
        return;
      }

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      }

      const qrCodeScanner = html5QrCodeRef.current;
      
      if (!scanning) {
        await qrCodeScanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleScan(decodedText);
          },
          (_errorMessage) => {
            // Ignore scanning errors (continuous scanning)
          }
        );
        setScanning(true);
        setError(null);
      }
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      
      // Provide specific error messages based on the error type
      let errorMessage = 'Failed to start camera. ';
      
      if (err.name === 'NotAllowedError' || err.message?.includes('NotAllowedError')) {
        errorMessage += 'Camera access was denied. Please:\n\n' +
          '1. Click the camera icon in your browser\'s address bar\n' +
          '2. Allow camera access for this site\n' +
          '3. Refresh the page\n\n' +
          'Or use the "Manual Input" tab to enter barcode manually.';
      } else if (err.name === 'NotFoundError' || err.message?.includes('NotFoundError')) {
        errorMessage += 'No camera found on this device. Please use the "Manual Input" tab.';
      } else if (err.name === 'NotReadableError' || err.message?.includes('NotReadableError')) {
        errorMessage += 'Camera is already in use by another application. Please close other apps using the camera.';
      } else if (err.name === 'SecurityError' || err.message?.includes('SecurityError')) {
        errorMessage += 'Camera access blocked due to security settings. Please use the "Manual Input" tab.';
      } else {
        errorMessage += err.message || 'Unknown error. Please use the "Manual Input" tab.';
      }
      
      setError(errorMessage);
      
      // Automatically switch to manual mode after showing the error
      setTimeout(() => {
        setMode('manual');
      }, 3000);
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrCodeRef.current && scanning) {
        await html5QrCodeRef.current.stop();
        setScanning(false);
      }
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  const handleScan = async (code: string) => {
    setBarcode(code);
    await submitBarcode(code);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      await submitBarcode(barcode);
    }
  };

  const submitBarcode = async (code: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiService.scanBarcode(code);
      setResult(response);
    } catch (err: any) {
      console.error('Error scanning barcode:', err);
      setError(err.message || 'Failed to scan barcode');
      // Mock response for demo - show BasketPoints earned
      const mockProducts: { [key: string]: any } = {
        '123123': { name: 'Coca-Cola 1.5L', points: 800, image: 'https://www.spot.uz/media/img/2025/05/QzN7nw17464294466712_l.jpg' },
        '123124': { name: 'Fanta 1.5L', points: 800 },
        '123125': { name: 'Sprite 1.5L', points: 800 },
        '123126': { name: 'Вода 365kun', points: 1200 },
        '123127': { name: 'Маринованные огурцы Marinella', points: 2000 },
        '123128': { name: 'Маринованные помидоры 365kun', points: 3500 },
        '123129': { name: 'Маринованные шампиньоны 365kun', points: 4000 },
        '123130': { name: 'Пюре Бабушкино лукошко индейка', points: 3000 },
        '123131': { name: 'Маринованные томаты Астраханские', points: 3000 },
      };
      
      const product = mockProducts[code] || { name: 'Unknown Product', points: 500 };
      
      setResult({
        success: true,
        barcode: code,
        product: {
          name: product.name,
          image: product.image,
          points_earned: product.points,
          eco_friendly: true,
        },
        message: '✅ Purchase confirmed! You earned BasketPoints for choosing an eco-friendly product.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const testResult = await testPostRequest();
    
    if (testResult.success) {
      setResult({
        success: true,
        message: 'API Test Successful!',
        ...testResult.data,
      });
    } else {
      setError(JSON.stringify(testResult.error, null, 2));
    }

    setLoading(false);
  };

  return (
    <>
      <StatusBar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">🌱 Earn BasketPoints</h1>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            Scan eco-friendly products to earn points
          </p>
        </div>

        <div className="scanner-container">
          <div className="scanner-tabs">
            <button
              className={`tab-button ${mode === 'scan' ? 'active' : ''}`}
              onClick={() => setMode('scan')}
            >
              📷 Camera Scan
            </button>
            <button
              className={`tab-button ${mode === 'manual' ? 'active' : ''}`}
              onClick={() => setMode('manual')}
            >
              ⌨️ Manual Input
            </button>
          </div>

          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            <button
              className="test-api-button"
              onClick={handleTestApi}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              🧪 Test API POST Request
            </button>
          </div>

          {mode === 'scan' ? (
            <div className="scanner-box">
              <div id="qr-reader"></div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="manual-input-container">
              <input
                type="text"
                className="barcode-input"
                placeholder="Enter barcode number..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
              <button
                type="submit"
                className="submit-button"
                disabled={!barcode.trim() || loading}
              >
                {loading ? 'Scanning...' : 'Submit'}
              </button>
            </form>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          )}

          {error && (
            <div className="scan-result error">
              <h3>❌ Camera Access Issue</h3>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{error}</pre>
              {mode === 'manual' && (
                <button
                  className="submit-button"
                  onClick={() => setMode('scan')}
                  style={{ marginTop: '12px' }}
                >
                  🔄 Try Camera Again
                </button>
              )}
            </div>
          )}

          {result && (
            <div className="scan-result" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '2px solid #34A853' }}>
              <h3 style={{ color: '#34A853', marginBottom: '16px' }}>🎉 Success!</h3>
              {result.product?.points_earned && (
                <div style={{ 
                  background: '#34A853', 
                  color: 'white', 
                  padding: '20px', 
                  borderRadius: '12px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>You earned</div>
                  <div style={{ fontSize: '48px', fontWeight: '700', margin: '8px 0' }}>
                    {result.product.points_earned.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>BasketPoints</div>
                </div>
              )}
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                {result.product?.name || 'Product'}
              </div>
              {result.product?.eco_friendly && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  background: '#fff',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginTop: '12px'
                }}>
                  <span style={{ fontSize: '20px' }}>🌿</span>
                  <span style={{ color: '#34A853', fontWeight: '600' }}>Eco-Friendly Product</span>
                </div>
              )}
              <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
                {result.message}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
