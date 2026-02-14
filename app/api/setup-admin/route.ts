import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import bcrypt from "bcryptjs"

// This endpoint creates a super admin user
// For security, you should delete this file after creating your admin user
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@firststatebank.com" })

        if (existingAdmin) {
            return NextResponse.json(
                {
                    message: "Admin user already exists! You can login now.",
                    email: "admin@firststatebank.com"
                },
                { status: 200 }
            )
        }

        // Hash password and PIN
        const hashedPassword = await bcrypt.hash("Admin@123456", 10)
        const hashedPin = await bcrypt.hash("1234", 10)

        // Generate account number
        const accountNumber = "FSB" + Math.floor(1000000000 + Math.random() * 9000000000)

        // Create admin user
        const adminUser = new User({
            email: "admin@firststatebank.com",
            password: hashedPassword,
            pin: hashedPin,
            firstName: "Super",
            lastName: "Admin",
            roles: ["super-admin", "administrator", "user"],
            isVerified: true,
            bankAccount: {
                accountNumber: accountNumber,
                accountType: "premium",
                balance: 1000000, // $1,000,000
                currency: "USD",
                status: "active",
                isVerified: true,
                verificationMeta: {
                    isVerified: true,
                    verifiedAt: new Date(),
                    verifiedBy: "system"
                }
            },
            bankInfo: {
                bio: {
                    firstname: "Super",
                    lastname: "Admin",
                    middlename: "",
                    dateOfBirth: "1990-01-01",
                    gender: "Other",
                    maritalStatus: "Single",
                    nationality: "United States",
                    occupation: "Administrator"
                },
                contact: {
                    email: "admin@firststatebank.com",
                    phone: "+1234567890",
                    address: "123 Admin Street",
                    city: "New York",
                    state: "NY",
                    zipCode: "10001",
                    country: "United States"
                }
            }
        })

        await adminUser.save()

        return NextResponse.json(
            {
                success: true,
                message: "Super Admin user created successfully!",
                credentials: {
                    email: "admin@firststatebank.com",
                    password: "Admin@123456",
                    pin: "1234",
                    accountNumber: accountNumber
                },
                warning: "⚠️ IMPORTANT: Change these credentials after first login and DELETE this API endpoint!"
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Error creating admin user:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create admin user",
                error: error.message
            },
            { status: 500 }
        )
    }
}
