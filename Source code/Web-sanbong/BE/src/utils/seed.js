const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const { getDb, connectToDatabase } = require("../config/database");
const constants = require("../config/constants");
const { getDefaultTimeSlots } = require("./timeSlot.util");
const logger = require("./logger");

/**
 * Seed database with initial data
 */
async function seedDatabase() {
  try {
    console.log("Connecting to database...");
    // Kết nối trực tiếp đến database
    await connectToDatabase();
    console.log("Connected to database successfully!");
    
    const db = getDb();
    console.log("Starting database seeding...");

    // Seed users
    await seedUsers(db);
    
    // Seed fields
    await seedFields(db);

    console.log("Database seeding completed successfully!");
    process.exit(0); // Thoát chương trình với mã thành công
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // Thoát chương trình với mã lỗi
  }
}

/**
 * Seed users collection
 */
async function seedUsers(db) {
  try {
    console.log("Starting to seed users...");
    const usersCollection = db.collection(constants.collections.USERS);
    
    // Check if users already exist
    const existingUsers = await usersCollection.countDocuments();
    console.log(`Found ${existingUsers} existing users`);
    
    if (existingUsers > 0) {
      console.log("Users collection already has data, skipping user seeding");
      return;
    }

    // Hash passwords
    console.log("Hashing passwords...");
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const userPassword = await bcrypt.hash("user123", salt);

    // Create users
    const users = [
      {
        _id: new ObjectId(),
        name: "Admin",
        email: "admin@gmail.com",
        phone: "0123456789",
        password: adminPassword,
        role: "admin",
        status: "active",
        registeredAt: new Date(),
        avatar: "/uploads/users/user-default-user.jpg"
      },
      {
        _id: new ObjectId(),
        name: "User",
        email: "user@gmail.com",
        phone: "0987654321",
        password: userPassword,
        role: "user",
        status: "active",
        registeredAt: new Date(),
        avatar: "/uploads/users/user-default-user.jpg"
      }
    ];

    console.log("Inserting users into database...");
    const result = await usersCollection.insertMany(users);
    console.log(`Seeded ${result.insertedCount} users successfully`);
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

/**
 * Seed fields collection
 */
async function seedFields(db) {
  try {
    console.log("Starting to seed fields...");
    const fieldsCollection = db.collection(constants.collections.FIELDS);
    
    // Check if fields already exist
    const existingFields = await fieldsCollection.countDocuments();
    console.log(`Found ${existingFields} existing fields`);
    
    if (existingFields > 0) {
      console.log("Fields collection already has data, skipping field seeding");
      return;
    }

    // Create fields
    const fields = [
      {
        _id: new ObjectId(),
        name: "Sân 1",
        location: "Hà Nội",
        manager: "0123721873",
        description: "Sân bóng đá cỏ nhân tạo chất lượng cao",
        type: "7v7",
        src: "/uploads/fields/field-1748792207486-80422622.png",
        alt: "Sân 1 image",
        title: "Sân bóng số 1",
        time: "8:00-23:00",
        price: 300000,
        defaultTimeSlots: getDefaultTimeSlots(),
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: "Sân 2",
        location: "Hà Nội",
        manager: "0123721874",
        description: "Sân bóng đá mini với hệ thống cỏ nhân tạo mới",
        type: "5v5",
        src: "/uploads/fields/field-1748792224213-487702471.png",
        alt: "Sân 2 image",
        title: "Sân bóng số 2",
        time: "8:00-23:00",
        price: 250000,
        defaultTimeSlots: getDefaultTimeSlots(),
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: "Sân 3",
        location: "Hà Nội",
        manager: "0123721875",
        description: "Sân bóng đá tiêu chuẩn với đầy đủ tiện nghi",
        type: "7v7",
        src: "/uploads/fields/field-1748792236009-402847297.png",
        alt: "Sân 3 image",
        title: "Sân bóng số 3",
        time: "8:00-23:00",
        price: 300000,
        defaultTimeSlots: getDefaultTimeSlots(),
        createdAt: new Date()
      }
    ];

    console.log("Inserting fields into database...");
    const result = await fieldsCollection.insertMany(fields);
    console.log(`Seeded ${result.insertedCount} fields successfully`);
  } catch (error) {
    console.error("Error seeding fields:", error);
    throw error;
  }
}

// Gọi hàm seedDatabase ngay lập tức
seedDatabase();

module.exports = {
  seedDatabase
};

