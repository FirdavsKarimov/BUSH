#!/usr/bin/env node

/**
 * API Connection Test Script
 * Tests if the API is accessible and returns the test data we added
 */

import axios from 'axios';

const API_BASE_URL = 'https://api.bush.uz';

async function testAPI() {
  console.log('🧪 Testing API Connection...\n');
  console.log(`📡 API URL: ${API_BASE_URL}\n`);

  let allTestsPassed = true;

  // Test 1: Get Catalog
  console.log('1️⃣ Testing GET /api/catalog');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/catalog`);
    console.log(`   ✅ Success! Found ${response.data.length} catalog items`);
    if (response.data.length > 0) {
      console.log(`   📦 Sample item: ${response.data[0].name} (${response.data[0].item_sku})`);
      console.log(`   💰 Points: ${response.data[0].points_awarded}`);
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    allTestsPassed = false;
  }
  console.log();

  // Test 2: Get Locations
  console.log('2️⃣ Testing GET /api/locations');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/locations`);
    console.log(`   ✅ Success! Found ${response.data.length} locations`);
    if (response.data.length > 0) {
      console.log(`   📍 Sample location: ${response.data[0].name}`);
      console.log(`   📮 Address: ${response.data[0].address}`);
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    allTestsPassed = false;
  }
  console.log();

  // Test 3: Get User Balance
  console.log('3️⃣ Testing GET /api/users/{user_id}/balance');
  try {
    const testUserId = 'TEST_USER_123';
    const response = await axios.get(`${API_BASE_URL}/api/users/${testUserId}/balance`);
    console.log(`   ✅ Success! Balance endpoint is working`);
    console.log(`   👤 User: ${response.data.user_id_string}`);
    console.log(`   💰 Balance: ${response.data.balance} points`);
  } catch (error) {
    console.log(`   ⚠️  Expected (user may not exist): ${error.response?.status} - ${error.response?.data?.detail || error.message}`);
  }
  console.log();

  // Test 4: Get User History
  console.log('4️⃣ Testing GET /api/users/{user_id}/history');
  try {
    const testUserId = 'TEST_USER_123';
    const response = await axios.get(`${API_BASE_URL}/api/users/${testUserId}/history`);
    console.log(`   ✅ Success! History endpoint is working`);
    console.log(`   📊 Found ${response.data.length} history items`);
  } catch (error) {
    console.log(`   ⚠️  Expected (user may not exist): ${error.response?.status} - ${error.response?.data?.detail || error.message}`);
  }
  console.log();

  // Test 5: POST Return (with real SKU from catalog)
  console.log('5️⃣ Testing POST /api/returns');
  try {
    // First get a real SKU from catalog
    const catalogResponse = await axios.get(`${API_BASE_URL}/api/catalog`);
    if (catalogResponse.data.length > 0) {
      const testItemSku = catalogResponse.data[0].item_sku;
      const testUserId = `TEST_USER_${Date.now()}`;
      
      const response = await axios.post(`${API_BASE_URL}/api/returns`, {
        user_id_string: testUserId,
        item_sku: testItemSku
      });
      
      console.log(`   ✅ Success! Return registered`);
      console.log(`   📦 Item: ${testItemSku}`);
      console.log(`   📨 Status: ${response.data.status}`);
      console.log(`   💬 Message: ${response.data.message}`);
    } else {
      console.log(`   ⚠️  No catalog items found to test with`);
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`);
    allTestsPassed = false;
  }
  console.log();

  // Summary
  console.log('═══════════════════════════════════════════════════');
  if (allTestsPassed) {
    console.log('✅ All critical tests passed!');
    console.log('🎉 Your API is ready to use!');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
  console.log('═══════════════════════════════════════════════════');
}

// Run the tests
testAPI().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});

