import dotenv from "dotenv";
import TestQuestion from "./models/TestQuestion.js";
import connectDB from "./config/db.js";

dotenv.config();

const questions = [
  { text: "I enjoy working with tools or machines.", category: "R" },
  { text: "I like fixing or building things.", category: "R" },
  { text: "I enjoy researching how things work.", category: "I" },
  { text: "I like solving complex problems.", category: "I" },
  { text: "I enjoy expressing myself creatively.", category: "A" },
  { text: "I like designing or creating art.", category: "A" },
  { text: "I enjoy helping people solve problems.", category: "S" },
  { text: "I like working with groups or teams.", category: "S" },
  { text: "I enjoy leading projects or teams.", category: "E" },
  { text: "I like persuading or selling ideas.", category: "E" },
  { text: "I enjoy organizing information carefully.", category: "C" },
  { text: "I like working with numbers or details.", category: "C" },
];

const seedQuestions = async () => {
  try {
    await connectDB();
    await TestQuestion.deleteMany();
    await TestQuestion.insertMany(questions);
    console.log("Test questions seeded");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedQuestions();
