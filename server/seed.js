// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/grocery_homework';

const seedProducts = [
  { 
    name: 'Red Apple', 
    price: 40, 
    imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', 
    category: 'Fruits', 
    stock: 50, 
    description: 'Fresh red apples from Kashmir' 
  },
  { 
    name: 'Banana Bunch', 
    price: 30, 
    imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400', 
    category: 'Fruits', 
    stock: 100,
    description: 'Ripe yellow bananas'
  },
  { 
    name: 'Spinach Pack', 
    price: 20, 
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', 
    category: 'Vegetables', 
    stock: 70,
    description: 'Fresh organic spinach leaves'
  },
  { 
    name: 'Milk 1L', 
    price: 50, 
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', 
    category: 'Dairy', 
    stock: 200,
    description: 'Fresh full cream milk'
  },
  { 
    name: 'Paneer 200g', 
    price: 120, 
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', 
    category: 'Dairy', 
    stock: 40,
    description: 'Fresh cottage cheese'
  },
  { 
    name: 'Carrot 1kg', 
    price: 35, 
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', 
    category: 'Vegetables', 
    stock: 80,
    description: 'Fresh orange carrots'
  },
  { 
    name: 'Tomatoes 1kg', 
    price: 49, 
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', 
    category: 'Vegetables', 
    stock: 90,
    description: 'Fresh red tomatoes'
  },
  { 
    name: 'Orange 1kg', 
    price: 60, 
    imageUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400', 
    category: 'Fruits', 
    stock: 60,
    description: 'Juicy sweet oranges'
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB — seeding...');
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    await Product.insertMany(seedProducts);
    console.log(`✅ Successfully seeded ${seedProducts.length} products`);
    console.log('📦 Products:');
    seedProducts.forEach(p => console.log(`   - ${p.name} (₹${p.price})`));
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
