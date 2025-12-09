// test-api.js - Quick script to test API endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Grocery API...\n');

  try {
    // Test 1: Get all products
    console.log('1️⃣ Testing GET /products');
    const response1 = await fetch(`${BASE_URL}/products`);
    const products = await response1.json();
    console.log(`✅ Success: Found ${products.length} products`);
    if (products.length > 0) {
      console.log(`   First product: ${products[0].name} - ₹${products[0].price}`);
    }
    console.log();

    // Test 2: Get products by category
    console.log('2️⃣ Testing GET /products?category=Fruits');
    const response2 = await fetch(`${BASE_URL}/products?category=Fruits`);
    const fruits = await response2.json();
    console.log(`✅ Success: Found ${fruits.length} fruits`);
    console.log();

    // Test 3: Search products
    console.log('3️⃣ Testing GET /products?q=milk');
    const response3 = await fetch(`${BASE_URL}/products?q=milk`);
    const searchResults = await response3.json();
    console.log(`✅ Success: Found ${searchResults.length} products matching "milk"`);
    console.log();

    // Test 4: Get single product
    if (products.length > 0) {
      const productId = products[0]._id;
      console.log('4️⃣ Testing GET /products/:id');
      const response4 = await fetch(`${BASE_URL}/products/${productId}`);
      const product = await response4.json();
      console.log(`✅ Success: ${product.name}`);
      console.log();
    }

    // Test 5: Create new product
    console.log('5️⃣ Testing POST /products');
    const newProduct = {
      name: 'Test Mango',
      price: 90,
      imageUrl: 'https://via.placeholder.com/150',
      category: 'Fruits',
      description: 'Test product',
      stock: 25
    };
    const response5 = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    const created = await response5.json();
    console.log(`✅ Success: Created "${created.name}" with ID: ${created._id}`);
    console.log();

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm start');
  }
}

testAPI();
