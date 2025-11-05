// Simple Node.js script to test the POST /api/returns endpoint
// Run with: node test-api.js

const API_BASE_URL = process.env.API_URL || 'https://api.bush.uz';

async function testPostRequest() {
  console.log('🧪 Testing POST /api/returns endpoint...\n');
  
  const testData = {
    user_id_string: 'test_user_' + Date.now(),
    item_sku: 'TEST_ITEM_001'
  };
  
  console.log('📤 Sending request:');
  console.log('URL:', `${API_BASE_URL}/api/returns`);
  console.log('Body:', JSON.stringify(testData, null, 2));
  console.log('');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/returns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Response Status:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('📥 Response Body:', JSON.stringify(data, null, 2));
    console.log('');
    
    if (response.ok) {
      console.log('✅ Success! API is working.');
    } else {
      console.log('❌ API returned an error.');
      if (data.detail === 'Сервис базы данных недоступен.') {
        console.log('⚠️  Database service is unavailable. Please check your backend database connection.');
      }
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.error('⚠️  Could not connect to API. Please check if the server is running.');
  }
}

// Run the test
testPostRequest();

