const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Admin = require('./models/Admin');
const Item = require('./models/Item');
const Claim = require('./models/Claim');

// Sample data with production admin
const sampleUsers = [
  {
    name: 'Arjun Kumar',
    email: 'arjun.kumar@bmsce.ac.in',
    usn: '1BM21CS001',
    phone: '9876543210',
    department: 'Computer Science Engineering',
    year: 3,
    password: 'student123'
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@bmsce.ac.in',
    usn: '1BM21IS002',
    phone: '9876543211',
    department: 'Information Science Engineering',
    year: 2,
    password: 'student123'
  },
  {
    name: 'Rahul Reddy',
    email: 'rahul.reddy@bmsce.ac.in',
    usn: '1BM21EC003',
    phone: '9876543212',
    department: 'Electronics & Communication',
    year: 4,
    password: 'student123'
  },
  {
    name: 'Sneha Patel',
    email: 'sneha.patel@bmsce.ac.in',
    usn: '1BM21ME004',
    phone: '9876543213',
    department: 'Mechanical Engineering',
    year: 1,
    password: 'student123'
  }
];

const sampleAdmins = [
  {
    name: 'MRS REKHA GS',
    email: 'admin@bmsce.ac.in',
    employeeId: 'BMSCE001',
    department: 'Administration',
    role: 'super_admin',
    password: 'admin123'
  },
  {
    name: 'Prof. Sunita Rao',
    email: 'sunita.rao@bmsce.ac.in',
    employeeId: 'BMSCE002',
    department: 'Student Affairs',
    role: 'admin',
    password: 'admin123'
  }
];

    // Create sample items with more realistic data
    const sampleItems = [
      {
        title: 'iPhone 14 Pro Max',
        description: 'Space Black iPhone 14 Pro Max 256GB. Has a clear case and screen protector. Lost near the library entrance.',
        category: 'Electronics',
        color: 'Black',
        type: 'lost',
        location: 'Main Library - Ground Floor',
        dateLostFound: new Date('2024-01-20'),
        image: '/demo-images/phone.jpg',
        imageFeatures: []
      },
      {
        title: 'Samsung Galaxy Buds Pro',
        description: 'White Samsung Galaxy Buds Pro in original charging case. Found on a bench in the cafeteria.',
        category: 'Electronics',
        color: 'White',
        type: 'found',
        location: 'Student Cafeteria - Near Window',
        dateLostFound: new Date('2024-01-21'),
        image: '/demo-images/headphones.jpg',
        imageFeatures: []
      },
      {
        title: 'Engineering Mathematics Textbook',
        description: 'Higher Engineering Mathematics by B.S. Grewal, 43rd Edition. Name "Priya S" written on first page.',
        category: 'Books',
        color: 'Blue',
        type: 'lost',
        location: 'Academic Block A - Room 205',
        dateLostFound: new Date('2024-01-19'),
        image: '/demo-images/notebook.jpg',
        imageFeatures: []
      },
      {
        title: 'Black Leather Wallet',
        description: 'Black leather wallet with college ID card visible. Contains some cash and cards.',
        category: 'Accessories',
        color: 'Black',
        type: 'found',
        location: 'Parking Area - Gate 2',
        dateLostFound: new Date('2024-01-22'),
        image: '/demo-images/wallet.jpg',
        imageFeatures: []
      },
      {
        title: 'Red Nike Water Bottle',
        description: 'Red stainless steel Nike water bottle with BMSCE sticker. Has some dents on the bottom.',
        category: 'Accessories',
        color: 'Red',
        type: 'lost',
        location: 'Sports Complex - Basketball Court',
        dateLostFound: new Date('2024-01-18'),
        image: '/demo-images/water-bottle.jpg',
        imageFeatures: []
      },
      {
        title: 'Blue Denim Jacket',
        description: 'Light blue denim jacket, size M. Has a small tear on the left sleeve. Brand: Levi\'s.',
        category: 'Clothing',
        color: 'Blue',
        type: 'found',
        location: 'Auditorium - Seat B-15',
        dateLostFound: new Date('2024-01-23'),
        image: '/demo-images/backpack.jpg',
        imageFeatures: []
      },
      {
        title: 'MacBook Air Charger',
        description: 'Original Apple MacBook Air charger (MagSafe 2, 45W). Cable is slightly frayed near the connector.',
        category: 'Electronics',
        color: 'White',
        type: 'lost',
        location: 'Computer Lab - Block C',
        dateLostFound: new Date('2024-01-17'),
        image: '/demo-images/student-id.jpg',
        imageFeatures: []
      },
      {
        title: 'Casio Scientific Calculator',
        description: 'Casio fx-991ES Plus scientific calculator. Has "R.Kumar" written on the back with permanent marker.',
        category: 'Accessories',
        color: 'Black',
        type: 'found',
        location: 'Examination Hall - Desk 45',
        dateLostFound: new Date('2024-01-24'),
        image: '/demo-images/keys.jpg',
        imageFeatures: []
      }
    ];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bmsce_lost_found');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Admin.deleteMany({}),
      Item.deleteMany({}),
      Claim.deleteMany({})
    ]);
    console.log('🗑️ Cleared existing data');

    // Create users
    const users = await User.create(sampleUsers);
    console.log(`👥 Created ${users.length} users`);

    // Create admins
    const admins = await Admin.create(sampleAdmins);
    console.log(`🛡️ Created ${admins.length} admins`);

    // Create items with random user assignments
    const itemsWithUsers = sampleItems.map((item, index) => ({
      ...item,
      reportedBy: users[index % users.length]._id
    }));
    
    const items = await Item.create(itemsWithUsers);
    console.log(`📱 Created ${items.length} items`);

    // Create sample claims with realistic scenarios
    const sampleClaims = [
      {
        item: items[1]._id, // Samsung Galaxy Buds (found item)
        claimedBy: users[0]._id,
        description: 'These are definitely my Galaxy Buds Pro. I lost them yesterday while studying in the cafeteria. The case has a small scratch on the top that I can identify.',
        contactInfo: '9876543210',
        similarityScore: 87,
        status: 'pending'
      },
      {
        item: items[3]._id, // Black Leather Wallet (found item)
        claimedBy: users[2]._id,
        description: 'This is my wallet! I can see my college ID card through the transparent window. I lost it yesterday after parking my bike.',
        contactInfo: '9876543212',
        similarityScore: 94,
        status: 'approved',
        reviewedBy: admins[0]._id,
        reviewedAt: new Date(),
        reviewNotes: 'Verified with student ID. Approved for collection from admin office.'
      },
      {
        item: items[5]._id, // Blue Denim Jacket (found item)
        claimedBy: users[1]._id,
        description: 'This looks like my denim jacket. I was sitting in the auditorium during the tech fest and forgot to take it with me.',
        contactInfo: '9876543211',
        similarityScore: 73,
        status: 'pending'
      }
    ];

    const claims = await Claim.create(sampleClaims);
    console.log(`📋 Created ${claims.length} claims`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('👤 Student Login:');
    console.log('   Email: arjun.kumar@bmsce.ac.in');
    console.log('   Password: student123');
    console.log('\n🛡️ Admin Login:');
    console.log('   Email: admin@bmsce.ac.in');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function
seedDatabase();