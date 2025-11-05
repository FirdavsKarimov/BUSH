import { apiService } from './api';
import { getUserId } from './auth';

/**
 * Test POST request to /api/returns endpoint
 * This will attempt to register a return with a real item from the catalog
 */
export async function testPostRequest() {
  console.log('🧪 Testing POST /api/returns endpoint...');
  
  const userId = getUserId();
  console.log('👤 User ID:', userId);
  
  try {
    // First, fetch the catalog to get a real item SKU
    console.log('📋 Fetching catalog to get a real item...');
    const catalog = await apiService.getCatalog();
    
    if (!catalog || catalog.length === 0) {
      throw new Error('No items found in catalog. Please add items to the database first.');
    }
    
    // Use the first item from the catalog for testing
    const testItem = catalog[0];
    const testItemSku = testItem.item_sku;
    
    console.log('📦 Using item from catalog:', testItem.name, '(SKU:', testItemSku, ')');
    console.log('📦 Sending POST request with item_sku:', testItemSku);
    
    const result = await apiService.registerReturn(testItemSku);
    
    console.log('✅ Success! Response:', result);
    
    return {
      success: true,
      data: {
        ...result,
        item_tested: {
          sku: testItemSku,
          name: testItem.name,
          points: testItem.points_awarded,
        }
      },
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

