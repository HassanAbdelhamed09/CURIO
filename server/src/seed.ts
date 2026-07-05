import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './modules/users/user.model.js';
import { Category } from './modules/products/category.model.js';
import { Product } from './modules/products/product.model.js';
import { PromoCode } from './modules/cart/promo.model.js';
import { Banner } from './modules/banners/banner.model.js';
import { hashPassword } from './utils/hashPassword.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seeder] Database connected successfully.');

    // Clear existing data
    console.log('[Seeder] Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await PromoCode.deleteMany({});
    await Banner.deleteMany({});

    // 1. Seed Users (Real Emails for Testing)
    console.log('[Seeder] Seeding real user accounts...');
    const defaultPassword = 'Password123!';
    const passwordHash = await hashPassword(defaultPassword);

    const users = await User.insertMany([
      {
        fullName: 'Hassan Admin',
        email: 'hassanabdelhamed09@gmail.com',
        emailVerified: true,
        phone: '+201000000000',
        phoneVerified: true,
        passwordHash,
        role: 'admin',
        provider: 'local',
        status: 'active',
      },
      {
        fullName: 'Aura Design Seller',
        email: 'habdelhamed729@gmail.com',
        emailVerified: true,
        phone: '+201000000001',
        phoneVerified: true,
        passwordHash,
        role: 'seller',
        provider: 'local',
        status: 'active',
        storeName: 'Aura Design Atelier',
        storeDescription: 'Handcrafted luxury interior objects, custom-designed stoneware, and ambient lighting solutions tailored for modern spaces.',
        storePhone: '+201000000001',
        storeAddress: {
          street: '9 El-Gezira Street',
          city: 'Cairo',
          state: 'Zamalek',
          country: 'Egypt',
          postalCode: '11211',
        },
        storeLogoUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=200',
      },
      {
        fullName: 'Hassan Customer',
        email: 'hassan09.fifa21@gmail.com',
        emailVerified: true,
        phone: '+201000000002',
        phoneVerified: true,
        passwordHash,
        role: 'customer',
        provider: 'local',
        status: 'active',
      },
    ]);

    const sellerId = users.find((u) => u.role === 'seller')?._id;

    // 2. Seed Categories
    console.log('[Seeder] Seeding premium categories...');
    const categories = await Category.insertMany([
      {
        name: 'Ceramics & Stoneware',
        slug: 'ceramics-stoneware',
        description: 'Handcrafted wabi-sabi clay vessels, artisanal plates, and elegant stoneware.',
      },
      {
        name: 'Office & Desk Atelier',
        slug: 'office-desk-atelier',
        description: 'High-end organizer trays, monitors stands, and walnut desk accessories.',
      },
      {
        name: 'Modern Lighting',
        slug: 'modern-lighting',
        description: 'Sculptural lamps and ambient lighting designed to elevate workspaces and living areas.',
      },
      {
        name: 'Textiles & Linens',
        slug: 'textiles-linens',
        description: 'Organic linen blankets, cushions, and tactile throw throws.',
      },
    ]);

    // 3. Seed Products
    console.log('[Seeder] Seeding premium curations...');
    await Product.insertMany([
      {
        name: 'Artisanal Terracotta Vase',
        slug: 'artisanal-terracotta-vase',
        description: 'Hand-shaped terracotta vase with an organic, sand-textured finish. Perfect as a singular statement object or styled with dried botanicals.',
        price: 85.00,
        stock: 12,
        categoryId: categories[0]._id,
        seller: sellerId,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=600',
          'https://images.unsplash.com/photo-1614705827065-65c82ee11157?q=80&w=600',
        ],
      },
      {
        name: 'Fluted Ceramic Cereal Bowl',
        slug: 'fluted-ceramic-cereal-bowl',
        description: 'A fluted ceramic bowl in warm speckled clay, finished with a milky white food-safe glaze. Individually crafted to bring texture to daily rituals.',
        price: 35.00,
        stock: 24,
        categoryId: categories[0]._id,
        seller: sellerId,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600',
        ],
      },
      {
        name: 'Solid Walnut Monitor Stand',
        slug: 'solid-walnut-monitor-stand',
        description: 'CNC-routed and hand-finished premium American walnut monitor stand. Designed to elevate your display and store office keyboards underneath.',
        price: 135.00,
        stock: 8,
        categoryId: categories[1]._id,
        seller: sellerId,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?q=80&w=600',
        ],
      },
      {
        name: 'Handstitched Leather Desk Mat',
        slug: 'handstitched-leather-desk-mat',
        description: 'Premium full-grain vegetable-tanned leather mat, handstitched with waxed linen thread. Develops a beautiful unique character and patina over time.',
        price: 95.00,
        stock: 15,
        categoryId: categories[1]._id,
        seller: sellerId,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600',
        ],
      },
      {
        name: 'Minimalist Brass Dome Lamp',
        slug: 'minimalist-brass-dome-lamp',
        description: 'Industrial sculptural table lamp featuring a solid brushed brass dome shade and a heavy walnut wood cylindrical base. Creates a warm, atmospheric glow.',
        price: 260.00,
        stock: 5,
        categoryId: categories[2]._id,
        seller: sellerId,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600',
        ],
      },
      {
        name: 'Frosted Glass Orb Light',
        slug: 'frosted-glass-orb-light',
        description: 'Spherical blown-glass orb light with an integrated dimmable LED. Floods any dark corner with a soft, uniform diffused highlight.',
        price: 175.00,
        stock: 10,
        categoryId: categories[2]._id,
        seller: sellerId,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?q=80&w=600',
        ],
      },
      {
        name: 'Organic Cotton Waffle Blanket',
        slug: 'organic-cotton-waffle-blanket',
        description: 'Woven from 100% GOTS-certified organic cotton, this waffle throw blanket offers rich breathable texture and cozy warmth for beds or sofas.',
        price: 115.00,
        stock: 20,
        categoryId: categories[3]._id,
        seller: sellerId,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=600',
        ],
      },
      {
        name: 'Artisan Linen Cushion Cover',
        slug: 'artisan-linen-cushion-cover',
        description: '100% Belgian flax linen cushion cover, pre-washed for ultimate softness and textured look. Finished with an invisible zipper closure.',
        price: 45.00,
        stock: 40,
        categoryId: categories[3]._id,
        seller: sellerId,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?q=80&w=600',
        ],
      },
    ]);

    // 4. Seed Promos
    console.log('[Seeder] Seeding discount codes...');
    await PromoCode.insertMany([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        isActive: true,
        expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
      {
        code: 'CURIO25',
        discountType: 'percentage',
        discountValue: 25,
        isActive: true,
        expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'VIP50',
        discountType: 'percentage',
        discountValue: 50,
        isActive: true,
        expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    ]);

    // 5. Seed Banners
    console.log('[Seeder] Seeding premium homepage banners...');
    await Banner.insertMany([
      {
        title: 'Modernist Stoneware',
        subtitle: 'Handcrafted vases and accessories built for modernist interiors.',
        imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1200',
        linkUrl: '/',
        status: 'active',
      },
      {
        title: 'The Minimalist Workspace',
        subtitle: 'Explore high-end designer pieces tailored for quiet, focus-driven desk setups.',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200',
        linkUrl: '/',
        status: 'active',
      },
    ]);

    console.log('[Seeder] Database seeded successfully.');
  } catch (error) {
    console.error('[Seeder] Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('[Seeder] Database connection closed.');
  }
};

seedDatabase();
