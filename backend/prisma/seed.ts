import { PrismaClient, Role, OrderStatus, DiscountType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Seeding database...');

  // ── Users ────────────────────────────────────────────────────────────────────
  const adminPassword = await hashPassword('Admin123!');
  const customerPassword = await hashPassword('Test123!');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@qashop.com' },
    update: {},
    create: {
      email: 'admin@qashop.com',
      passwordHash: adminPassword,
      firstName: 'Alice',
      lastName: 'Admin',
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'superadmin@qashop.com' },
    update: {},
    create: {
      email: 'superadmin@qashop.com',
      passwordHash: adminPassword,
      firstName: 'Bob',
      lastName: 'Boss',
      role: Role.ADMIN,
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@test.com' },
    update: {},
    create: {
      email: 'customer1@test.com',
      passwordHash: customerPassword,
      firstName: 'Carlos',
      lastName: 'Rivera',
      phoneNumber: '+1-555-0101',
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@test.com' },
    update: {},
    create: {
      email: 'customer2@test.com',
      passwordHash: customerPassword,
      firstName: 'Diana',
      lastName: 'Moore',
      phoneNumber: '+1-555-0102',
    },
  });

  const customer3 = await prisma.user.upsert({
    where: { email: 'customer3@test.com' },
    update: {},
    create: {
      email: 'customer3@test.com',
      passwordHash: customerPassword,
      firstName: 'Edward',
      lastName: 'Chen',
    },
  });

  await prisma.user.upsert({
    where: { email: 'customer4@test.com' },
    update: {},
    create: {
      email: 'customer4@test.com',
      passwordHash: customerPassword,
      firstName: 'Fiona',
      lastName: 'Davis',
    },
  });

  const customer5 = await prisma.user.upsert({
    where: { email: 'customer5@test.com' },
    update: {},
    create: {
      email: 'customer5@test.com',
      passwordHash: customerPassword,
      firstName: 'George',
      lastName: 'Evans',
    },
  });

  console.log('✅ Users created');

  // ── Categories ───────────────────────────────────────────────────────────────
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Gadgets, devices, and all things tech',
      imageUrl:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion for every style and occasion',
      imageUrl:
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    },
  });

  const homeGarden = await prisma.category.upsert({
    where: { slug: 'home-garden' },
    update: {},
    create: {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Everything for your home and outdoor spaces',
      imageUrl:
        'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
    },
  });

  const books = await prisma.category.upsert({
    where: { slug: 'books' },
    update: {},
    create: {
      name: 'Books',
      slug: 'books',
      description: 'Bestsellers, classics, and everything in between',
      imageUrl:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    },
  });

  const sports = await prisma.category.upsert({
    where: { slug: 'sports-outdoors' },
    update: {},
    create: {
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      description: 'Gear for athletes and adventurers',
      imageUrl:
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
    },
  });

  const laptops = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Notebooks for work, gaming, and creativity',
      imageUrl:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      parentId: electronics.id,
    },
  });

  const smartphones = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'The latest phones from top brands',
      imageUrl:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      parentId: electronics.id,
    },
  });

  const mensClothing = await prisma.category.upsert({
    where: { slug: 'mens-clothing' },
    update: {},
    create: {
      name: "Men's",
      slug: 'mens-clothing',
      description: "Men's fashion and apparel",
      imageUrl:
        'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400',
      parentId: clothing.id,
    },
  });

  const womensClothing = await prisma.category.upsert({
    where: { slug: 'womens-clothing' },
    update: {},
    create: {
      name: "Women's",
      slug: 'womens-clothing',
      description: "Women's fashion and apparel",
      imageUrl:
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
      parentId: clothing.id,
    },
  });

  console.log('✅ Categories created');

  // ── Products ─────────────────────────────────────────────────────────────────
  const productsData = [
    // Laptops
    {
      name: 'Pro Laptop 15',
      slug: 'pro-laptop-15',
      description:
        'High-performance laptop with Intel Core i7, 16GB RAM, 512GB SSD, and a stunning 15.6" 4K display. Perfect for professionals and creative workflows.',
      price: 1299.99,
      comparePrice: 1499.99,
      stock: 50,
      sku: 'ELC-LAP-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
      ],
      isFeatured: true,
      categoryId: laptops.id,
    },
    {
      name: 'Budget Laptop 14',
      slug: 'budget-laptop-14',
      description:
        'Reliable everyday laptop with AMD Ryzen 5, 8GB RAM, 256GB SSD. Great for students and light work.',
      price: 499.99,
      comparePrice: null,
      stock: 3,
      sku: 'ELC-LAP-002',
      imageUrls: [
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600',
      ],
      isFeatured: false,
      categoryId: laptops.id,
    },
    {
      name: 'Gaming Powerhouse X',
      slug: 'gaming-powerhouse-x',
      description:
        'Ultimate gaming laptop with RTX 4070, Intel i9, 32GB RAM, 1TB NVMe SSD. Dominate any game.',
      price: 2199.99,
      comparePrice: 2499.99,
      stock: 15,
      sku: 'ELC-LAP-003',
      imageUrls: [
        'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
      ],
      isFeatured: true,
      categoryId: laptops.id,
    },
    {
      name: 'Ultrabook Air',
      slug: 'ultrabook-air',
      description:
        'Feather-light 13" ultrabook, just 1.1kg. All-day battery, stunning OLED display.',
      price: 899.99,
      comparePrice: 999.99,
      stock: 0,
      sku: 'ELC-LAP-004',
      imageUrls: [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      ],
      isFeatured: false,
      categoryId: laptops.id,
    },
    {
      name: 'Developer Workstation Pro',
      slug: 'developer-workstation-pro',
      description:
        '17" beast with 64GB RAM, dual 2TB NVMe drives. Built for developers who run everything locally.',
      price: 3499.99,
      comparePrice: null,
      stock: 8,
      sku: 'ELC-LAP-005',
      imageUrls: [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600',
      ],
      isFeatured: false,
      categoryId: laptops.id,
    },
    // Smartphones
    {
      name: 'UltraPhone X',
      slug: 'ultraphone-x',
      description:
        'Flagship smartphone with 6.7" AMOLED display, 200MP camera system, 5000mAh battery, and 120Hz refresh rate.',
      price: 899.99,
      comparePrice: 999.99,
      stock: 100,
      sku: 'ELC-PHN-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
      ],
      isFeatured: true,
      categoryId: smartphones.id,
    },
    {
      name: 'Budget Phone SE',
      slug: 'budget-phone-se',
      description:
        'Compact 5.4" phone with great camera and all-day battery. Everything you need, nothing you don\'t.',
      price: 199.99,
      comparePrice: null,
      stock: 0,
      sku: 'ELC-PHN-002',
      imageUrls: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
      ],
      isFeatured: false,
      categoryId: smartphones.id,
    },
    {
      name: 'MidRange Pro',
      slug: 'midrange-pro',
      description:
        '6.4" phone with 108MP camera, 8GB RAM, 128GB storage. The sweet spot between price and performance.',
      price: 449.99,
      comparePrice: 499.99,
      stock: 75,
      sku: 'ELC-PHN-003',
      imageUrls: [
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600',
      ],
      isFeatured: true,
      categoryId: smartphones.id,
    },
    {
      name: 'Flip Phone Ultra',
      slug: 'flip-phone-ultra',
      description:
        'Stylish foldable flip phone with 6.7" inner display. Turn heads everywhere you go.',
      price: 999.99,
      comparePrice: 1099.99,
      stock: 20,
      sku: 'ELC-PHN-004',
      imageUrls: [
        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600',
      ],
      isFeatured: false,
      categoryId: smartphones.id,
    },
    {
      name: 'Rugged Phone',
      slug: 'rugged-phone',
      description:
        'Military-grade IP68 phone. Drop it, submerge it, it keeps going. 6000mAh battery.',
      price: 349.99,
      comparePrice: null,
      stock: 4,
      sku: 'ELC-PHN-005',
      imageUrls: [
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600',
      ],
      isFeatured: false,
      categoryId: smartphones.id,
    },
    // Men's Clothing
    {
      name: 'Classic Denim Jacket',
      slug: 'classic-denim-jacket',
      description:
        'Timeless blue denim jacket, mid-weight, relaxed fit. A wardrobe staple that goes with everything.',
      price: 89.99,
      comparePrice: 120.0,
      stock: 25,
      sku: 'CLT-MEN-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=600',
      ],
      isFeatured: true,
      categoryId: mensClothing.id,
    },
    {
      name: 'Slim Chinos',
      slug: 'slim-chinos',
      description:
        'Versatile slim-fit chinos in stretch cotton. Available in khaki, navy, and olive.',
      price: 59.99,
      comparePrice: null,
      stock: 40,
      sku: 'CLT-MEN-002',
      imageUrls: [
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600',
      ],
      isFeatured: false,
      categoryId: mensClothing.id,
    },
    {
      name: 'Oxford Button-Down Shirt',
      slug: 'oxford-button-down-shirt',
      description:
        'Classic Oxford weave shirt, slim fit, wrinkle-resistant. Perfect for office or casual Friday.',
      price: 49.99,
      comparePrice: 65.0,
      stock: 0,
      sku: 'CLT-MEN-003',
      imageUrls: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
      ],
      isFeatured: false,
      categoryId: mensClothing.id,
    },
    {
      name: 'Premium Hoodie',
      slug: 'premium-hoodie',
      description:
        "Ultra-soft 100% cotton hoodie, heavyweight French terry. The last hoodie you'll ever need.",
      price: 79.99,
      comparePrice: null,
      stock: 60,
      sku: 'CLT-MEN-004',
      imageUrls: [
        'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600',
      ],
      isFeatured: true,
      categoryId: mensClothing.id,
    },
    // Women's Clothing
    {
      name: 'Floral Summer Dress',
      slug: 'floral-summer-dress',
      description:
        'Lightweight floral midi dress with adjustable straps. Perfect for warm days and garden parties.',
      price: 69.99,
      comparePrice: 89.99,
      stock: 30,
      sku: 'CLT-WMN-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600',
      ],
      isFeatured: true,
      categoryId: womensClothing.id,
    },
    {
      name: 'Classic Blazer',
      slug: 'womens-classic-blazer',
      description:
        'Structured single-button blazer in a relaxed fit. Elevates any outfit instantly.',
      price: 129.99,
      comparePrice: 159.99,
      stock: 2,
      sku: 'CLT-WMN-002',
      imageUrls: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
      ],
      isFeatured: false,
      categoryId: womensClothing.id,
    },
    {
      name: 'High-Rise Jeans',
      slug: 'womens-high-rise-jeans',
      description:
        'Flattering high-rise straight-leg jeans in premium stretch denim. Sustainable production.',
      price: 89.99,
      comparePrice: null,
      stock: 45,
      sku: 'CLT-WMN-003',
      imageUrls: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
      ],
      isFeatured: true,
      categoryId: womensClothing.id,
    },
    // Home & Garden
    {
      name: 'Ceramic Plant Pots Set',
      slug: 'ceramic-plant-pots-set',
      description:
        'Set of 3 minimalist ceramic pots in matte white. Drainage holes included. Sizes: S, M, L.',
      price: 34.99,
      comparePrice: 44.99,
      stock: 80,
      sku: 'HMG-POT-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
      ],
      isFeatured: true,
      categoryId: homeGarden.id,
    },
    {
      name: 'Bamboo Cutting Board',
      slug: 'bamboo-cutting-board',
      description:
        'Extra-large bamboo cutting board with juice groove and built-in knife sharpener.',
      price: 29.99,
      comparePrice: null,
      stock: 0,
      sku: 'HMG-KIT-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600',
      ],
      isFeatured: false,
      categoryId: homeGarden.id,
    },
    {
      name: 'Scented Soy Candle Collection',
      slug: 'scented-soy-candle-collection',
      description:
        'Set of 4 hand-poured soy wax candles. Scents: Lavender, Cedar, Vanilla, and Sea Breeze.',
      price: 44.99,
      comparePrice: 59.99,
      stock: 55,
      sku: 'HMG-CND-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1608181831718-e6b3e7a8d31c?w=600',
      ],
      isFeatured: true,
      categoryId: homeGarden.id,
    },
    {
      name: 'Smart LED Desk Lamp',
      slug: 'smart-led-desk-lamp',
      description:
        'Touch-dimming LED desk lamp with wireless charging base, USB-A port, and 5 color temperatures.',
      price: 59.99,
      comparePrice: 79.99,
      stock: 35,
      sku: 'HMG-LGT-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
      ],
      isFeatured: false,
      categoryId: homeGarden.id,
    },
    // Books
    {
      name: 'Clean Code',
      slug: 'clean-code',
      description:
        'A handbook of agile software craftsmanship by Robert C. Martin. Required reading for every developer.',
      price: 34.99,
      comparePrice: null,
      stock: 200,
      sku: 'BKS-DEV-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
      ],
      isFeatured: true,
      categoryId: books.id,
    },
    {
      name: 'The Pragmatic Programmer',
      slug: 'the-pragmatic-programmer',
      description:
        '20th Anniversary Edition. Your journey to mastery by David Thomas and Andrew Hunt.',
      price: 39.99,
      comparePrice: 49.99,
      stock: 150,
      sku: 'BKS-DEV-002',
      imageUrls: [
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
      ],
      isFeatured: true,
      categoryId: books.id,
    },
    {
      name: 'Design Patterns',
      slug: 'design-patterns',
      description:
        'Elements of Reusable Object-Oriented Software by the "Gang of Four". A timeless classic.',
      price: 44.99,
      comparePrice: null,
      stock: 80,
      sku: 'BKS-DEV-003',
      imageUrls: [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
      ],
      isFeatured: false,
      categoryId: books.id,
    },
    {
      name: 'Introduction to Algorithms',
      slug: 'introduction-to-algorithms',
      description:
        'CLRS — the definitive reference for algorithms and data structures. 4th Edition.',
      price: 89.99,
      comparePrice: null,
      stock: 0,
      sku: 'BKS-DEV-004',
      imageUrls: [
        'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
      ],
      isFeatured: false,
      categoryId: books.id,
    },
    // Sports
    {
      name: 'Running Shoes Pro',
      slug: 'running-shoes-pro',
      description:
        'Lightweight responsive running shoes with carbon fiber plate. Race-ready from day one.',
      price: 149.99,
      comparePrice: 179.99,
      stock: 5,
      sku: 'SPT-SHO-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      ],
      isFeatured: true,
      categoryId: sports.id,
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description:
        '6mm natural rubber yoga mat with alignment lines, non-slip texture, and carry strap.',
      price: 79.99,
      comparePrice: 99.99,
      stock: 40,
      sku: 'SPT-YGA-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1601925228010-f2f42b5a3e76?w=600',
      ],
      isFeatured: true,
      categoryId: sports.id,
    },
    {
      name: 'Adjustable Dumbbell Set',
      slug: 'adjustable-dumbbell-set',
      description:
        'Space-saving adjustable dumbbells from 5 to 52.5 lbs. Replaces 15 sets of weights.',
      price: 329.99,
      comparePrice: 399.99,
      stock: 12,
      sku: 'SPT-GYM-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=600',
      ],
      isFeatured: false,
      categoryId: sports.id,
    },
    {
      name: 'Hiking Backpack 40L',
      slug: 'hiking-backpack-40l',
      description:
        'Multi-day hiking pack with integrated rain cover, hydration sleeve, and load-lifter straps.',
      price: 119.99,
      comparePrice: 149.99,
      stock: 22,
      sku: 'SPT-HKG-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600',
      ],
      isFeatured: false,
      categoryId: sports.id,
    },
    {
      name: 'Smart Fitness Watch',
      slug: 'smart-fitness-watch',
      description:
        'Track heart rate, sleep, GPS routes, and 100+ workout modes. 7-day battery life.',
      price: 199.99,
      comparePrice: 249.99,
      stock: 0,
      sku: 'SPT-WCH-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600',
      ],
      isFeatured: false,
      categoryId: sports.id,
    },
    {
      name: 'Resistance Bands Set',
      slug: 'resistance-bands-set',
      description:
        'Set of 5 resistance bands from 10 to 50 lbs. Loop and tube styles included with handles and ankle straps.',
      price: 39.99,
      comparePrice: null,
      stock: 90,
      sku: 'SPT-RES-001',
      imageUrls: [
        'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600',
      ],
      isFeatured: false,
      categoryId: sports.id,
    },
  ];

  const products: Record<string, string> = {};

  for (const product of productsData) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice ?? null,
        stock: product.stock,
        sku: product.sku,
        imageUrls: product.imageUrls,
        isFeatured: product.isFeatured,
        categoryId: product.categoryId,
      },
    });
    products[product.slug] = created.id;
  }

  console.log('✅ Products created');

  // ── Addresses ─────────────────────────────────────────────────────────────────
  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      firstName: 'Carlos',
      lastName: 'Rivera',
      street: '123 Main Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'US',
      isDefault: true,
    },
  });

  // customer5 has 3 addresses
  await prisma.address.create({
    data: {
      userId: customer5.id,
      firstName: 'George',
      lastName: 'Evans',
      street: '100 Home Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      isDefault: true,
    },
  });
  await prisma.address.create({
    data: {
      userId: customer5.id,
      firstName: 'George',
      lastName: 'Evans',
      street: '200 Office Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'US',
    },
  });
  await prisma.address.create({
    data: {
      userId: customer5.id,
      firstName: 'George',
      lastName: 'Evans',
      street: '300 Warehouse Rd',
      city: 'Newark',
      state: 'NJ',
      zipCode: '07101',
      country: 'US',
    },
  });

  const address2 = await prisma.address.create({
    data: {
      userId: customer2.id,
      firstName: 'Diana',
      lastName: 'Moore',
      street: '456 Oak Lane',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'US',
      isDefault: true,
    },
  });

  console.log('✅ Addresses created');

  // ── Orders (pre-seeded for customer1) ────────────────────────────────────────
  const laptopProductId = products['pro-laptop-15'];
  const phoneProductId = products['ultraphone-x'];
  const laptopPrice = 1299.99;
  const phonePrice = 899.99;
  const taxRate = 0.08;

  await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-0001',
      userId: customer1.id,
      addressId: address1.id,
      status: OrderStatus.DELIVERED,
      subtotal: laptopPrice,
      discountAmount: 0,
      shippingCost: 0,
      tax: +(laptopPrice * taxRate).toFixed(2),
      total: +(laptopPrice + laptopPrice * taxRate).toFixed(2),
      items: {
        create: {
          productId: laptopProductId,
          quantity: 1,
          priceAtTime: laptopPrice,
        },
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-0002',
      userId: customer1.id,
      addressId: address1.id,
      status: OrderStatus.CANCELLED,
      subtotal: phonePrice,
      discountAmount: 0,
      shippingCost: 0,
      tax: +(phonePrice * taxRate).toFixed(2),
      total: +(phonePrice + phonePrice * taxRate).toFixed(2),
      items: {
        create: {
          productId: phoneProductId,
          quantity: 1,
          priceAtTime: phonePrice,
        },
      },
    },
  });

  // customer2 has 1 pending order
  await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-0003',
      userId: customer2.id,
      addressId: address2.id,
      status: OrderStatus.PENDING,
      subtotal: 499.99,
      discountAmount: 0,
      shippingCost: 9.99,
      tax: +(499.99 * taxRate).toFixed(2),
      total: +(499.99 + 9.99 + 499.99 * taxRate).toFixed(2),
      items: {
        create: {
          productId: products['budget-laptop-14'],
          quantity: 1,
          priceAtTime: 499.99,
        },
      },
    },
  });

  console.log('✅ Orders created');

  // ── Pre-seeded Review ─────────────────────────────────────────────────────────
  await prisma.review.upsert({
    where: {
      userId_productId: {
        userId: customer1.id,
        productId: laptopProductId,
      },
    },
    update: {},
    create: {
      userId: customer1.id,
      productId: laptopProductId,
      rating: 5,
      title: 'Excellent machine',
      body: 'Fast, reliable, great display. Worth every penny. Running demanding dev workloads flawlessly.',
    },
  });

  // Update product avgRating and reviewCount
  await prisma.product.update({
    where: { id: laptopProductId },
    data: { avgRating: 5.0, reviewCount: 1 },
  });

  console.log('✅ Reviews created');

  // ── Pre-seeded Cart (customer3) ───────────────────────────────────────────────
  const cart3 = await prisma.cart.create({
    data: { userId: customer3.id },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart3.id,
      productId: products['budget-laptop-14'],
      quantity: 1,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart3.id,
      productId: products['classic-denim-jacket'],
      quantity: 2,
    },
  });

  console.log('✅ Carts created');

  // ── Coupons ──────────────────────────────────────────────────────────────────
  const now = new Date();
  const sixMonthsLater = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const coupons = [
    {
      code: 'SAVE10',
      description: '10% off on all orders',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minimumAmount: null,
      maximumDiscount: null,
      usageLimit: null,
      usageCount: 0,
      isActive: true,
      expiresAt: sixMonthsLater,
    },
    {
      code: 'SAVE20',
      description: '20% off on orders over $100',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      minimumAmount: 100,
      maximumDiscount: null,
      usageLimit: null,
      usageCount: 0,
      isActive: true,
      expiresAt: sixMonthsLater,
    },
    {
      code: 'FLAT15',
      description: '$15 off on orders over $50',
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: 15,
      minimumAmount: 50,
      maximumDiscount: null,
      usageLimit: null,
      usageCount: 0,
      isActive: true,
      expiresAt: sixMonthsLater,
    },
    {
      code: 'BIGDEAL',
      description: '50% off on orders over $500',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 50,
      minimumAmount: 500,
      maximumDiscount: 300,
      usageLimit: null,
      usageCount: 0,
      isActive: true,
      expiresAt: sixMonthsLater,
    },
    {
      code: 'EXPIRED',
      description: '10% off — expired coupon (for testing)',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minimumAmount: null,
      maximumDiscount: null,
      usageLimit: null,
      usageCount: 0,
      isActive: true,
      expiresAt: yesterday,
    },
    {
      code: 'MAXUSED',
      description: '$5 off — usage limit reached (for testing)',
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: 5,
      minimumAmount: null,
      maximumDiscount: null,
      usageLimit: 1,
      usageCount: 1,
      isActive: true,
      expiresAt: sixMonthsLater,
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumAmount: coupon.minimumAmount,
        maximumDiscount: coupon.maximumDiscount,
        usageLimit: coupon.usageLimit,
        usageCount: coupon.usageCount,
        isActive: coupon.isActive,
        expiresAt: coupon.expiresAt,
      },
    });
  }

  console.log('✅ Coupons created');
  console.log('\n🎉 Seed complete!');
  console.log('\n👤 Test accounts:');
  console.log('   Admin:     admin@qashop.com      / Admin123!');
  console.log(
    '   Customer1: customer1@test.com    / Test123!  (2 orders, 1 review)',
  );
  console.log(
    '   Customer2: customer2@test.com    / Test123!  (1 pending order)',
  );
  console.log(
    '   Customer3: customer3@test.com    / Test123!  (cart with items)',
  );
  console.log(
    '   Customer4: customer4@test.com    / Test123!  (clean account)',
  );
  console.log('   Customer5: customer5@test.com    / Test123!  (3 addresses)');
  console.log(
    '\n🎟️  Test coupons: SAVE10, SAVE20, FLAT15, BIGDEAL, EXPIRED, MAXUSED',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
