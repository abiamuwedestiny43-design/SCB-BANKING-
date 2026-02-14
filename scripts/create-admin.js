// Script to create a super-admin user
// Run with: node scripts/create-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = "mongodb+srv://friststatebank:no3uPyK3p49GU95G@friststatebank.8jmcorz.mongodb.net/bank?appName=friststatebankappName=santbank";

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pin: { type: String, required: true },
    firstName: String,
    lastName: String,
    roles: [String],
    isVerified: Boolean,
    bankAccount: {
        accountNumber: String,
        accountType: String,
        balance: Number,
        currency: String,
        status: String,
        isVerified: Boolean,
        verificationMeta: {
            isVerified: Boolean,
            verifiedAt: Date,
            verifiedBy: String
        }
    },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdminUser() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Admin user details
        const adminEmail = 'admin@firststatebank.com';
        const adminPassword = 'Admin@123456'; // Change this to a secure password
        const adminPin = '1234'; // Change this to a secure PIN

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Email:', adminEmail);
            console.log('You can login with the existing credentials.');
            await mongoose.connection.close();
            return;
        }

        // Hash password and PIN
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const hashedPin = await bcrypt.hash(adminPin, 10);

        // Generate account number
        const accountNumber = 'FSB' + Math.floor(1000000000 + Math.random() * 9000000000);

        // Create admin user
        const adminUser = new User({
            email: adminEmail,
            password: hashedPassword,
            pin: hashedPin,
            firstName: 'Super',
            lastName: 'Admin',
            roles: ['super-admin', 'administrator', 'user'],
            isVerified: true,
            bankAccount: {
                accountNumber: accountNumber,
                accountType: 'premium',
                balance: 1000000, // $1,000,000 starting balance
                currency: 'USD',
                status: 'active',
                isVerified: true,
                verificationMeta: {
                    isVerified: true,
                    verifiedAt: new Date(),
                    verifiedBy: 'system'
                }
            }
        });

        await adminUser.save();

        console.log('\n✅ Super Admin user created successfully!');
        console.log('═══════════════════════════════════════');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Password:', adminPassword);
        console.log('📌 PIN:', adminPin);
        console.log('💳 Account Number:', accountNumber);
        console.log('💰 Starting Balance: $1,000,000');
        console.log('═══════════════════════════════════════');
        console.log('\n⚠️  IMPORTANT: Change the password and PIN after first login!');
        console.log('\n🚀 You can now login at: http://localhost:3000/login');

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

createAdminUser();
