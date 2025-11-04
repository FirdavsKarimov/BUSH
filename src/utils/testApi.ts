import { apiService } from './api';
import { getUserId } from './auth';

/**
 * Test POST request to /api/returns endpoint
 * This will attempt to register a return with a test item
 */
export async function testPostRequest() {
  console.log('🧪 Testing POST /api/returns endpoint...');
  
  const userId = getUserId();
  console.log('👤 User ID:', userId);
  
  try {
    // Test with a sample item SKU
    const testItemSku = 'TEST_ITEM_001';
    
    console.log('📦 Sending POST request with item_sku:', testItemSku);
    
    const result = await apiService.registerReturn(testItemSku);
    
    console.log('✅ Success! Response:', result);
    
    return {
      success: true,
      data: result,
      message: 'POST request successful!',
    };
    
  } catch (error: any) {
    console.error('❌ Error:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      return {
        success: false,
        error: error.response.data,
        status: error.response.status,
        message: error.message,
      };
    }
    
    return {
      success: false,
      error: error.message,
      message: 'Network or unknown error',
    };
  }
}

/**
 * Test with custom item SKU
 */
export async function testPostWithCustomItem(itemSku: string) {
  console.log('🧪 Testing POST /api/returns with custom item:', itemSku);
  
  try {
    const result = await apiService.registerReturn(itemSku);
    console.log('✅ Success! Response:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Error:', error);
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
}

