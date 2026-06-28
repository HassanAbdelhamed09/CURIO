import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { PromoCode } from './modules/cart/promo.model.js';
import { Product } from './modules/products/product.model.js';
import { Category } from './modules/products/category.model.js';
import { User } from './modules/users/user.model.js';

const seedPromoCodes = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing existing promo codes...');
    await PromoCode.deleteMany({});

    console.log('[Seeder] Seeding promo codes...');
    const promos = [
      {
        code: 'SAVE10',
        discountType: 'percentage',
        discountValue: 10,
        isActive: true,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        code: 'FLAT20',
        discountType: 'fixed',
        discountValue: 20,
        isActive: true,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        code: 'EXPIRED50',
        discountType: 'percentage',
        discountValue: 50,
        isActive: true,
        expirationDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired 1 day ago
      },
      {
        code: 'INACTIVE',
        discountType: 'fixed',
        discountValue: 100,
        isActive: false,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    ];

    await PromoCode.insertMany(promos);
    console.log('[Seeder] Promo codes seeded successfully.');

    // Let's also check if there are any products in the database
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Seeder] No products found in the database. Seeding a few mock products...');
      // We will look for categories to link them
      // If we don't have categories, let's create a default category first
      let category = await Category.findOne({});
      if (!category) {
        category = await Category.create({
          name: 'Atelier Accessories',
          slug: 'atelier-accessories',
          description: 'Finely crafted and designed everyday accessories.',
        });
      }

      // We need a mock user as seller
      let seller = await User.findOne({ role: 'seller' });
      if (!seller) {
        seller = await User.findOne({}); // Any user
      }
      
      if (!seller) {
        seller = await User.create({
          fullName: 'Atelier Artisan',
          email: 'artisan@curio.com',
          emailVerified: true,
          phone: '+15550199',
          phoneVerified: true,
          role: 'seller',
          provider: 'local',
          status: 'active',
        });
      }

      const products = [
        {
          name: 'Brass Desk Tray',
          slug: 'brass-desk-tray',
          description: 'A solid brass workspace tray, sandcast and polished by hand in our local atelier.',
          price: 85,
          stock: 12,
          categoryId: category._id,
          images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600'],
          seller: seller._id,
          status: 'active',
        },
        {
          name: 'Ceramic Pour-Over Dripper',
          slug: 'ceramic-pour-over-dripper',
          description: 'Hand-thrown stoneware dripper with a matte cobalt glaze.',
          price: 45,
          stock: 8,
          categoryId: category._id,
          images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600'],
          seller: seller._id,
          status: 'active',
        },
        {
          name: 'Linen Journal (A5)',
          slug: 'linen-journal-a5',
          description: 'Thread-bound notebook featuring heavy archival-grade paper and a raw Belgian linen cover.',
          price: 32,
          stock: 25,
          categoryId: category._id,
          images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600'],
          seller: seller._id,
          status: 'active',
        },
      ];

      await Product.insertMany(products);
      console.log('[Seeder] Mock products seeded successfully.');
    } else {
      console.log(`[Seeder] Found ${productCount} existing products in database.`);
    }

  } catch (error) {
    console.error('[Seeder] Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('[Seeder] Database connection closed.');
  }
};

seedPromoCodes();
