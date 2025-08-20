// clearDatabase.js
import prisma from "./lib/prisma.js"; // Adjust the path if needed

const clearDatabase = async () => {
  try {
    // Delete in correct order to avoid foreign key constraint issues
    await prisma.buyRequest.deleteMany();     // Must come BEFORE post
    await prisma.savedPost.deleteMany();
    await prisma.postDetail.deleteMany();
    await prisma.post.deleteMany();           // Now safe
    await prisma.chat.deleteMany();
    await prisma.user.deleteMany();// delete child records first
    console.log("✅ All data cleared from the database.");
  }
  catch (err){
    console.error("❌ Error clearing database:", err);
  }
  finally{
    await prisma.$disconnect();
  }
};

clearDatabase();
