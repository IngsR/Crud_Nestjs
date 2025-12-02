import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const categoryRepository = app.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    const productRepository = app.get<Repository<Product>>(
      getRepositoryToken(Product),
    );

    console.log('🌱 Seeding database...');

    // Clear existing data
    await productRepository.delete({});
    await categoryRepository.delete({});

    // Create categories
    const categories = [
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
      },
      {
        name: 'Clothing',
        description: 'Apparel and fashion items',
      },
      {
        name: 'Books',
        description: 'Physical and digital books',
      },
      {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
      },
      {
        name: 'Sports',
        description: 'Sports equipment and accessories',
      },
    ];

    const createdCategories = await categoryRepository.save(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create products
    const products = [
      // Electronics
      {
        name: 'Laptop Pro 15"',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        price: 1299.99,
        stock: 25,
        categoryId: createdCategories[0].id,
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 29.99,
        stock: 100,
        categoryId: createdCategories[0].id,
      },
      {
        name: 'USB-C Hub',
        description: '7-in-1 USB-C hub with HDMI and SD card reader',
        price: 49.99,
        stock: 50,
        categoryId: createdCategories[0].id,
      },
      // Clothing
      {
        name: 'Cotton T-Shirt',
        description: '100% organic cotton comfortable t-shirt',
        price: 19.99,
        stock: 200,
        categoryId: createdCategories[1].id,
      },
      {
        name: 'Denim Jeans',
        description: 'Classic fit denim jeans',
        price: 59.99,
        stock: 80,
        categoryId: createdCategories[1].id,
      },
      {
        name: 'Winter Jacket',
        description: 'Warm winter jacket with waterproof exterior',
        price: 129.99,
        stock: 40,
        categoryId: createdCategories[1].id,
      },
      // Books
      {
        name: 'The Art of Programming',
        description: 'Comprehensive guide to software development',
        price: 45.99,
        stock: 60,
        categoryId: createdCategories[2].id,
      },
      {
        name: 'Cooking Masterclass',
        description: 'Learn professional cooking techniques',
        price: 34.99,
        stock: 35,
        categoryId: createdCategories[2].id,
      },
      // Home & Garden
      {
        name: 'Garden Tool Set',
        description: '10-piece essential garden tool kit',
        price: 79.99,
        stock: 30,
        categoryId: createdCategories[3].id,
      },
      {
        name: 'LED Desk Lamp',
        description: 'Adjustable LED lamp with touch controls',
        price: 39.99,
        stock: 75,
        categoryId: createdCategories[3].id,
      },
      // Sports
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat with carrying strap',
        price: 24.99,
        stock: 120,
        categoryId: createdCategories[4].id,
      },
      {
        name: 'Adjustable Dumbbells',
        description: 'Set of adjustable dumbbells up to 50lbs',
        price: 149.99,
        stock: 20,
        categoryId: createdCategories[4].id,
      },
    ];

    const createdProducts = await productRepository.save(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed();
