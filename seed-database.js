#!/usr/bin/env node

/**
 * Database Seeding Script
 * Adds test data to the ecobonus_db PostgreSQL database
 */

import pg from 'pg';
const { Client } = pg;

// Database connection configuration
const dbConfig = {
  host: '77.93.152.199',
  port: 5433,
  database: 'ecobonus_db',
  user: 'user',
  password: 'dffs32rs3fwf',
};

// Test data
const testCatalogItems = [
  {
    item_sku: 'PET_BOTTLE_500ML',
    name: 'PET Bottle 500ml',
    description: 'Plastic PET bottle 500ml - recyclable',
    points_awarded: 10
  },
  {
    item_sku: 'PET_BOTTLE_1L',
    name: 'PET Bottle 1L',
    description: 'Plastic PET bottle 1 liter - recyclable',
    points_awarded: 15
  },
  {
    item_sku: 'PET_BOTTLE_2L',
    name: 'PET Bottle 2L',
    description: 'Plastic PET bottle 2 liters - recyclable',
    points_awarded: 20
  },
  {
    item_sku: 'ALUMINUM_CAN_330ML',
    name: 'Aluminum Can 330ml',
    description: 'Aluminum beverage can 330ml - recyclable',
    points_awarded: 12
  },
  {
    item_sku: 'GLASS_BOTTLE_500ML',
    name: 'Glass Bottle 500ml',
    description: 'Glass bottle 500ml - recyclable',
    points_awarded: 18
  },
  {
    item_sku: 'CARDBOARD_BOX_SMALL',
    name: 'Small Cardboard Box',
    description: 'Small cardboard packaging box - recyclable',
    points_awarded: 8
  },
  {
    item_sku: 'CARDBOARD_BOX_LARGE',
    name: 'Large Cardboard Box',
    description: 'Large cardboard packaging box - recyclable',
    points_awarded: 25
  },
  {
    item_sku: 'PAPER_BAG',
    name: 'Paper Shopping Bag',
    description: 'Paper shopping bag - recyclable',
    points_awarded: 5
  },
  {
    item_sku: 'TETRA_PAK_1L',
    name: 'Tetra Pak 1L',
    description: 'Tetra Pak juice/milk carton 1 liter - recyclable',
    points_awarded: 15
  },
  {
    item_sku: 'PLASTIC_BAG',
    name: 'Plastic Shopping Bag',
    description: 'Plastic shopping bag - recyclable',
    points_awarded: 3
  }
];

const testLocations = [
  {
    name: 'Korzinka Chilanzar',
    address: 'Bunyodkor Avenue 7, Chilanzar District, Tashkent',
    latitude: 41.2858,
    longitude: 69.2034
  },
  {
    name: 'Korzinka Yunusabad',
    address: 'Amir Temur Street 129, Yunusabad District, Tashkent',
    latitude: 41.3370,
    longitude: 69.2890
  },
  {
    name: 'Korzinka Mirzo Ulugbek',
    address: 'Buyuk Ipak Yuli 129, Mirzo Ulugbek District, Tashkent',
    latitude: 41.3152,
    longitude: 69.3340
  },
  {
    name: 'Korzinka Sergeli',
    address: 'Fergana Street 45, Sergeli District, Tashkent',
    latitude: 41.2288,
    longitude: 69.2226
  },
  {
    name: 'Korzinka Yakkasaray',
    address: 'Shota Rustaveli Street 89, Yakkasaray District, Tashkent',
    latitude: 41.2989,
    longitude: 69.2745
  },
  {
    name: 'Korzinka Olmazor',
    address: 'Labzak Street 12, Olmazor District, Tashkent',
    latitude: 41.2836,
    longitude: 69.2108
  },
  {
    name: 'Korzinka Shaykhontohur',
    address: 'Navoi Avenue 45, Shaykhontohur District, Tashkent',
    latitude: 41.3250,
    longitude: 69.2486
  },
  {
    name: 'Eco Recycling Center - Tashkent City',
    address: 'Istiklol Street 5, Tashkent City Mall, Tashkent',
    latitude: 41.3111,
    longitude: 69.2797
  }
];

async function seedDatabase() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Check what tables exist
    console.log('📋 Checking database schema...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📊 Existing tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    console.log();

    // Insert catalog items
    console.log('📦 Inserting catalog items...');
    let itemsInserted = 0;
    let itemsSkipped = 0;
    
    for (const item of testCatalogItems) {
      try {
        await client.query(`
          INSERT INTO catalog_items (item_sku, name, description, points_awarded)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (item_sku) DO UPDATE
          SET name = EXCLUDED.name,
              description = EXCLUDED.description,
              points_awarded = EXCLUDED.points_awarded
        `, [item.item_sku, item.name, item.description, item.points_awarded]);
        
        console.log(`  ✓ ${item.name} (${item.item_sku}) - ${item.points_awarded} points`);
        itemsInserted++;
      } catch (err) {
        console.log(`  ⚠️ Skipped ${item.name}: ${err.message}`);
        itemsSkipped++;
      }
    }
    
    console.log(`\n📦 Catalog items: ${itemsInserted} inserted/updated, ${itemsSkipped} skipped\n`);

    // Insert locations
    console.log('📍 Inserting locations...');
    let locationsInserted = 0;
    let locationsSkipped = 0;
    
    for (const location of testLocations) {
      try {
        await client.query(`
          INSERT INTO locations (name, address, latitude, longitude)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (name) DO UPDATE
          SET address = EXCLUDED.address,
              latitude = EXCLUDED.latitude,
              longitude = EXCLUDED.longitude
        `, [location.name, location.address, location.latitude, location.longitude]);
        
        console.log(`  ✓ ${location.name}`);
        locationsInserted++;
      } catch (err) {
        console.log(`  ⚠️ Skipped ${location.name}: ${err.message}`);
        locationsSkipped++;
      }
    }
    
    console.log(`\n📍 Locations: ${locationsInserted} inserted/updated, ${locationsSkipped} skipped\n`);

    // Summary
    console.log('✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - Catalog items: ${itemsInserted} added`);
    console.log(`  - Locations: ${locationsInserted} added`);
    console.log('\n🎉 You can now test the API with real data!');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    if (error.detail) {
      console.error('   Details:', error.detail);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n👋 Database connection closed.');
  }
}

// Run the seeding script
console.log('🌱 Starting database seeding...\n');
seedDatabase();

