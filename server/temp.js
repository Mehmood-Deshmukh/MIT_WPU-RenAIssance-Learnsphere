// Import required modules
const mongoose = require("mongoose");
const User = require("./models/User"); // Assuming User model is in the models directory
const Course = require("./models/Course"); // Assuming Course model is in the models directory

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/courseDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function populateDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});

    // Create sample users
    const teacher1 = new User({ name: "John Doe", email: "john@example.com", role: "teacher" });
    const teacher2 = new User({ name: "Jane Smith", email: "jane@example.com", role: "teacher" });
    const student1 = new User({ name: "Alice Brown", email: "alice@example.com", role: "student" });
    const student2 = new User({ name: "Bob White", email: "bob@example.com", role: "student" });

    await teacher1.save();
    await teacher2.save();
    await student1.save();
    await student2.save();

    console.log("Users created successfully");

    // Create sample courses
    const course1 = new Course({
      title: "Introduction to Programming",
      description: "Learn the basics of programming with Python.",
      createdBy: teacher1._id,
      instructors: [teacher1._id],
      students: [student1._id, student2._id],
    });

    const course2 = new Course({
      title: "Advanced JavaScript",
      description: "Deep dive into JavaScript and modern frameworks.",
      createdBy: teacher2._id,
      instructors: [teacher2._id],
      students: [student2._id],
    });

    await course1.save();
    await course2.save();

    console.log("Courses created successfully");
  } catch (err) {
    console.error("Error populating database:", err);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
populateDatabase();
