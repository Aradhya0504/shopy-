const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/category.js');
const Product = require('../models/product.js');
const User = require('../models/user.js');

dotenv.config();

const categories = [
  { name: 'Electronics',         description: 'Electronic devices and gadgets' },
  { name: 'Mobile Phones',       description: 'Smartphones and accessories' },
  { name: 'Laptops',             description: 'Laptops and computers' },
  { name: 'Clothing',            description: 'Men and women clothing' },
  { name: 'Shoes',               description: 'Footwear for all' },
  { name: 'Books',               description: 'Books and literature' },
  { name: 'Sports',              description: 'Sports and fitness equipment' },
  { name: 'Home & Kitchen',      description: 'Home appliances and kitchen tools' },
  { name: 'Beauty',              description: 'Beauty and personal care' },
  { name: 'Toys',                description: 'Toys and games for kids' },
  { name: 'Furniture',           description: 'Home and office furniture' },
  { name: 'Grocery',             description: 'Daily grocery items' },
  { name: 'Automotive',          description: 'Car and bike accessories' },
  { name: 'Jewellery',           description: 'Gold, silver and diamond jewellery' },
  { name: 'Watches',             description: 'Analog and digital watches' },
  { name: 'Bags',                description: 'Handbags, backpacks and luggage' },
  { name: 'Sunglasses',          description: 'Eyewear and sunglasses' },
  { name: 'Gaming',              description: 'Gaming consoles and accessories' },
  { name: 'Cameras',             description: 'DSLR and digital cameras' },
  { name: 'Headphones',          description: 'Earphones and headphones' },
  { name: 'Tablets',             description: 'Tablets and e-readers' },
  { name: 'Printers',            description: 'Printers and scanners' },
  { name: 'Networking',          description: 'Routers and networking devices' },
  { name: 'Health',              description: 'Health and wellness products' },
  { name: 'Baby Products',       description: 'Products for babies and toddlers' },
  { name: 'Pet Supplies',        description: 'Food and accessories for pets' },
  { name: 'Stationery',          description: 'Office and school stationery' },
  { name: 'Musical Instruments', description: 'Guitars, keyboards and more' },
  { name: 'Art & Craft',         description: 'Art supplies and craft materials' },
  { name: 'Garden',              description: 'Gardening tools and plants' },
];

const getProducts = (categoryMap) => [
  // ── Electronics (4) ──────────────────────────────
  {
    name: 'Samsung 4K Smart TV',
    description: '55 inch 4K UHD Smart TV',
    price: 799, discountPrice: 699, stock: 20,
    category: categoryMap['Electronics'],
    images: ['https://m.media-amazon.com/images/I/8170FdFwkML._AC_SX466_.jpg'],
  },
  {
    name: 'Sony PlayStation 5',
    description: 'Latest gaming console by Sony',
    price: 499, discountPrice: 479, stock: 15,
    category: categoryMap['Electronics'],
    images: ['https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500&q=80'],
  },
  {
    name: 'Apple AirPods Pro',
    description: 'Wireless noise cancelling earbuds',
    price: 249, discountPrice: 229, stock: 50,
    category: categoryMap['Electronics'],
    images: ['https://images.unsplash.com/photo-1588423771073-b8903fead85c?w=500&q=80'],
  },
  {
    name: 'Amazon Echo Dot',
    description: 'Smart speaker with Alexa',
    price: 49, discountPrice: 39, stock: 80,
    category: categoryMap['Electronics'],
    images: ['https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80'],
  },

  // ── Mobile Phones (4) ────────────────────────────
  {
    name: 'iPhone 15 Pro',
    description: 'Latest Apple flagship phone',
    price: 1199, discountPrice: 1099, stock: 30,
    category: categoryMap['Mobile Phones'],
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80'],
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Samsung flagship smartphone',
    price: 999, discountPrice: 899, stock: 25,
    category: categoryMap['Mobile Phones'],
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80'],
  },
  {
    name: 'OnePlus 12',
    description: 'Fast and smooth Android phone',
    price: 699, discountPrice: 649, stock: 40,
    category: categoryMap['Mobile Phones'],
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'],
  },
  {
    name: 'Google Pixel 8',
    description: 'Pure Android experience',
    price: 799, discountPrice: 749, stock: 35,
    category: categoryMap['Mobile Phones'],
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80'],
  },

  // ── Laptops (4) ──────────────────────────────────
  {
    name: 'MacBook Pro M3',
    description: 'Apple MacBook Pro with M3 chip',
    price: 1999, discountPrice: 1899, stock: 15,
    category: categoryMap['Laptops'],
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80'],
  },
  {
    name: 'Dell XPS 15',
    description: 'Premium Windows laptop',
    price: 1499, discountPrice: 1399, stock: 20,
    category: categoryMap['Laptops'],
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80'],
  },
  {
    name: 'HP Pavilion 15',
    description: 'Affordable everyday laptop',
    price: 699, discountPrice: 649, stock: 30,
    category: categoryMap['Laptops'],
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80'],
  },
  {
    name: 'Lenovo ThinkPad X1',
    description: 'Business grade laptop',
    price: 1299, discountPrice: 1199, stock: 25,
    category: categoryMap['Laptops'],
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'],
  },

  // ── Clothing (4) ─────────────────────────────────
  {
    name: 'Nike Dri-FIT T-Shirt',
    description: 'Moisture wicking sports t-shirt',
    price: 35, discountPrice: 29, stock: 100,
    category: categoryMap['Clothing'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'],
  },
  {
    name: "Levi's 501 Jeans",
    description: 'Classic straight fit jeans',
    price: 69, discountPrice: 59, stock: 80,
    category: categoryMap['Clothing'],
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80'],
  },
  {
    name: 'Zara Casual Shirt',
    description: 'Slim fit casual shirt',
    price: 45, discountPrice: 39, stock: 90,
    category: categoryMap['Clothing'],
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80'],
  },
  {
    name: 'H&M Hoodie',
    description: 'Comfortable cotton hoodie',
    price: 39, discountPrice: 34, stock: 75,
    category: categoryMap['Clothing'],
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80'],
  },

  // ── Shoes (3) ────────────────────────────────────
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes',
    price: 149, discountPrice: 129, stock: 60,
    category: categoryMap['Shoes'],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'],
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'High performance running shoes',
    price: 179, discountPrice: 159, stock: 50,
    category: categoryMap['Shoes'],
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80'],
  },
  {
    name: 'Puma RS-X Sneakers',
    description: 'Retro style sneakers',
    price: 99, discountPrice: 89, stock: 70,
    category: categoryMap['Shoes'],
    images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80'],
  },

  // ── Books (3) ────────────────────────────────────
  {
    name: 'Atomic Habits',
    description: 'Build good habits by James Clear',
    price: 15, discountPrice: 12, stock: 200,
    category: categoryMap['Books'],
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80'],
  },
  {
    name: 'The Alchemist',
    description: 'A novel by Paulo Coelho',
    price: 12, discountPrice: 10, stock: 150,
    category: categoryMap['Books'],
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80'],
  },
  {
  name: 'Rich Dad Poor Dad',
  description: 'Personal finance by R. Kiyosaki',
  price: 14, discountPrice: 11, stock: 180,
  category: categoryMap['Books'],
  images: ['https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg'],
},

  // ── Sports (3) ───────────────────────────────────
  {
    name: 'Yoga Mat',
    description: 'Non slip exercise yoga mat',
    price: 29, discountPrice: 24, stock: 100,
    category: categoryMap['Sports'],
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80'],
  },
  {
    name: 'Dumbbells Set 20kg',
    description: 'Adjustable dumbbells set',
    price: 79, discountPrice: 69, stock: 45,
    category: categoryMap['Sports'],
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80'],
  },
  {
    name: 'Cycling Helmet',
    description: 'Safety helmet for cycling',
    price: 49, discountPrice: 44, stock: 60,
    category: categoryMap['Sports'],
    images: ['https://images.unsplash.com/photo-1557803175-f9f2f4af75e1?w=500&q=80'],
  },

  // ── Home & Kitchen (3) ───────────────────────────
  {
    name: 'Instant Pot',
    description: 'Multi use pressure cooker',
    price: 99, discountPrice: 89, stock: 40,
    category: categoryMap['Home & Kitchen'],
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80'],
  },
  {
    name: 'Dyson V11 Vacuum',
    description: 'Cordless vacuum cleaner',
    price: 599, discountPrice: 549, stock: 20,
    category: categoryMap['Home & Kitchen'],
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'],
  },
  {
    name: 'Nespresso Coffee Maker',
    description: 'Automatic espresso machine',
    price: 149, discountPrice: 129, stock: 35,
    category: categoryMap['Home & Kitchen'],
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80'],
  },

  // ── Beauty (3) ───────────────────────────────────
  {
    name: 'Maybelline Foundation',
    description: 'Long lasting liquid foundation',
    price: 19, discountPrice: 15, stock: 120,
    category: categoryMap['Beauty'],
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80'],
  },
  {
    name: 'Gillette Fusion Razor',
    description: 'Smooth shaving razor',
    price: 14, discountPrice: 12, stock: 150,
    category: categoryMap['Beauty'],
    images: ['https://images.unsplash.com/photo-1621607512022-6aecc4fed814?w=500&q=80'],
  },
  {
    name: 'Dove Body Lotion',
    description: 'Moisturizing body lotion 400ml',
    price: 9, discountPrice: 7, stock: 200,
    category: categoryMap['Beauty'],
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80'],
  },

  // ── Toys (3) ─────────────────────────────────────
  {
    name: 'LEGO City Set',
    description: 'Build your own city with LEGO',
    price: 59, discountPrice: 49, stock: 55,
    category: categoryMap['Toys'],
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&q=80'],
  },
  {
    name: 'Barbie Dreamhouse',
    description: 'Classic Barbie dollhouse',
    price: 89, discountPrice: 79, stock: 40,
    category: categoryMap['Toys'],
    images: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&q=80'],
  },
  {
    name: 'Hot Wheels Track Set',
    description: 'Race car track for kids',
    price: 39, discountPrice: 34, stock: 65,
    category: categoryMap['Toys'],
    images: ['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&q=80'],
  },

  // ── Furniture (3) ────────────────────────────────
  {
    name: 'Ergonomic Office Chair',
    description: 'Lumbar support office chair',
    price: 299, discountPrice: 269, stock: 25,
    category: categoryMap['Furniture'],
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80'],
  },
  {
    name: 'Wooden Bookshelf',
    description: '5 tier wooden bookshelf',
    price: 149, discountPrice: 129, stock: 30,
    category: categoryMap['Furniture'],
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&q=80'],
  },
  {
    name: 'Standing Desk',
    description: 'Height adjustable standing desk',
    price: 399, discountPrice: 349, stock: 20,
    category: categoryMap['Furniture'],
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80'],
  },

  // ── Grocery (2) ──────────────────────────────────
  {
    name: 'Organic Green Tea',
    description: '100 bags of organic green tea',
    price: 12, discountPrice: 10, stock: 300,
    category: categoryMap['Grocery'],
    images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80'],
  },
  {
    name: 'Almonds 1kg',
    description: 'Premium California almonds',
    price: 19, discountPrice: 16, stock: 250,
    category: categoryMap['Grocery'],
    images: ['https://images.unsplash.com/photo-1574570173583-e0a5859e9b9c?w=500&q=80'],
  },

  // ── Automotive (2) ───────────────────────────────
  {
    name: 'Car Dash Cam',
    description: 'Full HD car dashboard camera',
    price: 79, discountPrice: 69, stock: 45,
    category: categoryMap['Automotive'],
    images: ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80'],
  },
  {
    name: 'Tyre Inflator',
    description: 'Portable electric tyre inflator',
    price: 39, discountPrice: 34, stock: 60,
    category: categoryMap['Automotive'],
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80'],
  },

  // ── Jewellery (2) ────────────────────────────────
  {
    name: 'Gold Stud Earrings',
    description: '18k gold stud earrings',
    price: 199, discountPrice: 179, stock: 30,
    category: categoryMap['Jewellery'],
    images: ['https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=500&q=80'],
  },
  {
    name: 'Silver Bracelet',
    description: '925 sterling silver bracelet',
    price: 49, discountPrice: 44, stock: 50,
    category: categoryMap['Jewellery'],
    images: ['https://images.unsplash.com/photo-1573408301185-9519f94f1b5a?w=500&q=80'],
  },

  // ── Watches (2) ──────────────────────────────────
  {
    name: 'Casio G-Shock',
    description: 'Tough solar powered watch',
    price: 129, discountPrice: 109, stock: 40,
    category: categoryMap['Watches'],
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'],
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Latest Apple smartwatch',
    price: 399, discountPrice: 369, stock: 25,
    category: categoryMap['Watches'],
    images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80'],
  },

  // ── Bags (2) ─────────────────────────────────────
  {
    name: 'Samsonite Trolley Bag',
    description: 'Lightweight travel trolley bag',
    price: 149, discountPrice: 129, stock: 35,
    category: categoryMap['Bags'],
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80'],
  },
  {
    name: 'Nike Backpack',
    description: 'Spacious sports backpack',
    price: 59, discountPrice: 49, stock: 70,
    category: categoryMap['Bags'],
    images: ['https://images.unsplash.com/photo-1622560481024-4b8dd0b74014?w=500&q=80'],
  },

  // ── Sunglasses (2) ───────────────────────────────
  {
    name: 'Ray-Ban Aviator',
    description: 'Classic aviator sunglasses',
    price: 179, discountPrice: 159, stock: 45,
    category: categoryMap['Sunglasses'],
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80'],
  },
  {
    name: 'Oakley Holbrook',
    description: 'Sports performance sunglasses',
    price: 149, discountPrice: 129, stock: 40,
    category: categoryMap['Sunglasses'],
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80'],
  },

  // ── Gaming (3) ───────────────────────────────────
  {
    name: 'Xbox Controller',
    description: 'Wireless Xbox Series X controller',
    price: 59, discountPrice: 54, stock: 60,
    category: categoryMap['Gaming'],
    images: ['https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=500&q=80'],
  },
  {
    name: 'Gaming Mouse',
    description: 'RGB optical gaming mouse',
    price: 49, discountPrice: 44, stock: 75,
    category: categoryMap['Gaming'],
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80'],
  },
  {
    name: 'Gaming Headset',
    description: '7.1 surround sound headset',
    price: 79, discountPrice: 69, stock: 55,
    category: categoryMap['Gaming'],
    images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=500&q=80'],
  },

  // ── Cameras (2) ──────────────────────────────────
  {
    name: 'Canon EOS R50',
    description: 'Mirrorless digital camera',
    price: 899, discountPrice: 849, stock: 15,
    category: categoryMap['Cameras'],
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80'],
  },
  {
    name: 'GoPro Hero 12',
    description: 'Action camera 5.3K video',
    price: 399, discountPrice: 369, stock: 25,
    category: categoryMap['Cameras'],
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80'],
  },

  // ── Headphones (2) ───────────────────────────────
  {
    name: 'Sony WH-1000XM5',
    description: 'Best noise cancelling headphones',
    price: 349, discountPrice: 299, stock: 30,
    category: categoryMap['Headphones'],
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
  },
  {
    name: 'Bose QuietComfort 45',
    description: 'Premium wireless headphones',
    price: 329, discountPrice: 279, stock: 25,
    category: categoryMap['Headphones'],
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80'],
  },

  // ── Tablets (2) ──────────────────────────────────
  {
    name: 'iPad Air M2',
    description: 'Apple iPad Air with M2 chip',
    price: 599, discountPrice: 549, stock: 20,
    category: categoryMap['Tablets'],
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80'],
  },
  {
    name: 'Samsung Galaxy Tab S9',
    description: 'Android tablet with S Pen',
    price: 799, discountPrice: 749, stock: 15,
    category: categoryMap['Tablets'],
    images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80'],
  },

  // ── Printers (2) ─────────────────────────────────
  {
    name: 'HP LaserJet Pro',
    description: 'Fast laser printer for office',
    price: 249, discountPrice: 229, stock: 20,
    category: categoryMap['Printers'],
    images: ['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&q=80'],
  },
  {
    name: 'Epson EcoTank',
    description: 'Ink tank printer low cost prints',
    price: 199, discountPrice: 179, stock: 25,
    category: categoryMap['Printers'],
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80'],
  },

  // ── Networking (2) ───────────────────────────────
  {
    name: 'TP-Link WiFi Router',
    description: 'Dual band AC1750 WiFi router',
    price: 79, discountPrice: 69, stock: 50,
    category: categoryMap['Networking'],
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80'],
  },
  {
    name: 'Netgear Nighthawk',
    description: 'High performance WiFi 6 router',
    price: 199, discountPrice: 179, stock: 30,
    category: categoryMap['Networking'],
    images: ['https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&q=80'],
  },

  // ── Health (2) ───────────────────────────────────
  {
    name: 'Omron Blood Pressure',
    description: 'Digital blood pressure monitor',
    price: 49, discountPrice: 44, stock: 60,
    category: categoryMap['Health'],
    images: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80'],
  },
  {
    name: 'Fitbit Charge 6',
    description: 'Advanced fitness tracker',
    price: 159, discountPrice: 139, stock: 40,
    category: categoryMap['Health'],
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80'],
  },

  // ── Baby Products (2) ────────────────────────────
  {
    name: 'Pampers Diapers',
    description: 'Soft and dry baby diapers',
    price: 29, discountPrice: 24, stock: 200,
    category: categoryMap['Baby Products'],
    images: ['https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80'],
  },
  {
    name: 'Baby Monitor',
    description: 'Video baby monitor with night vision',
    price: 99, discountPrice: 89, stock: 35,
    category: categoryMap['Baby Products'],
    images: ['https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=500&q=80'],
  },

  // ── Pet Supplies (2) ─────────────────────────────
  {
    name: 'Royal Canin Dog Food',
    description: 'Premium dry dog food 5kg',
    price: 49, discountPrice: 44, stock: 80,
    category: categoryMap['Pet Supplies'],
    images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&q=80'],
  },
  {
    name: 'Cat Scratching Post',
    description: 'Tall cat scratching tree',
    price: 39, discountPrice: 34, stock: 55,
    category: categoryMap['Pet Supplies'],
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80'],
  },

  // ── Stationery (2) ───────────────────────────────
  {
    name: 'Parker Pen Set',
    description: 'Premium ballpoint pen gift set',
    price: 29, discountPrice: 24, stock: 100,
    category: categoryMap['Stationery'],
    images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&q=80'],
  },
  {
    name: 'Moleskine Notebook',
    description: 'Classic hardcover notebook',
    price: 19, discountPrice: 16, stock: 150,
    category: categoryMap['Stationery'],
    images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80'],
  },

  // ── Musical Instruments (2) ──────────────────────
  {
    name: 'Yamaha Acoustic Guitar',
    description: 'Beginner acoustic guitar',
    price: 199, discountPrice: 179, stock: 20,
    category: categoryMap['Musical Instruments'],
    images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80'],
  },
  {
    name: 'Casio Digital Piano',
    description: '88 key digital piano',
    price: 499, discountPrice: 449, stock: 15,
    category: categoryMap['Musical Instruments'],
    images: ['https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&q=80'],
  },

  // ── Art & Craft (2) ──────────────────────────────
  {
    name: 'Watercolor Paint Set',
    description: '48 color professional watercolors',
    price: 29, discountPrice: 24, stock: 80,
    category: categoryMap['Art & Craft'],
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80'],
  },
  {
    name: 'Sketch Pencil Set',
    description: 'Professional drawing pencil set',
    price: 19, discountPrice: 16, stock: 100,
    category: categoryMap['Art & Craft'],
    images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500&q=80'],
  },

  // ── Garden (2) ───────────────────────────────────
  {
    name: 'Garden Tool Set',
    description: '5 piece garden tool kit',
    price: 39, discountPrice: 34, stock: 55,
    category: categoryMap['Garden'],
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80'],
  },
  {
    name: 'Watering Can',
    description: 'Stainless steel watering can 5L',
    price: 24, discountPrice: 19, stock: 70,
    category: categoryMap['Garden'],
    images: ['https://images.unsplash.com/photo-1416464958040-ee498c30c7db?w=500&q=80'],
  },
]

// ── Seed Function ─────────────────────────────────────
const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    await Category.deleteMany();
    await Product.deleteMany();
    console.log('🗑️  Cleared existing data');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin user found!');
      process.exit(1);
    }

    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ ${insertedCategories.length} Categories inserted`);

    const categoryMap = {};
    insertedCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    const products = getProducts(categoryMap);
    const insertedProducts = await Product.insertMany(
      products.map((p) => ({ ...p, seller: admin._id }))
    );
    console.log(`✅ ${insertedProducts.length} Products inserted`);

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log(`📦 ${insertedCategories.length} Categories`);
    console.log(`🛍️  ${insertedProducts.length} Products`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error.message);
    process.exit(1);
  }
};

seedData();