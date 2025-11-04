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
      }
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      setError('Failed to start camera. Please check permissions.');
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
      // Mock response for demo
      setResult({
        success: true,
        barcode: code,
        product: {
          name: 'Eco-Friendly Product',
          price: 15000,
          eco_rating: 4.5,
          sustainability_score: 85,
        },
        message: 'Product scanned successfully! (Demo data)',
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
          <h1 className="page-title">Scan Product</h1>
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
              <h3>❌ Error</h3>
              <pre>{error}</pre>
            </div>
          )}

          {result && (
            <div className="scan-result">
              <h3>✅ Scan Result</h3>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
