import mongoose from "mongoose";
import dotenv from "dotenv";
import Profession from "./models/Profession.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const professions = [
    {
      name: "Web Developer",
      category: "IT",
      description: "Вэб аппликейшн хөгжүүлэх, код бичих ажил хийнэ.",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      riasecTypes: ["R", "I", "C"],
    },
    {
      name: "UX Designer",
      category: "Design",
      description: "Хэрэглэгчийн туршлага сайжруулах дизайн гаргадаг.",
      skills: ["Figma", "Creativity", "User Research"],
      riasecTypes: ["A", "S", "I"],
    },
    {
      name: "Teacher",
      category: "Education",
      description: "Суралцагчдад мэдлэг олгох, харилцааны чадвартай ажил.",
      skills: ["Communication", "Patience", "Mentoring"],
      riasecTypes: ["S", "E"],
    },
    {
      name: "Entrepreneur",
      category: "Business",
      description: "Бизнес санаа хөгжүүлэх, удирдан манлайлах.",
      skills: ["Leadership", "Innovation", "Sales"],
      riasecTypes: ["E", "A"],
    },
    {
      name: "Accountant",
      category: "Finance",
      description: "Санхүүгийн бүртгэл, тооцоолол хариуцна.",
      skills: ["Excel", "Attention to detail", "Organization"],
      riasecTypes: ["C", "R"],
    },
  ];
  

const importData = async () => {
  try {
    await Profession.deleteMany();
    await Profession.insertMany(professions);
    console.log("✅ Мэргэжлийн мэдээлэл амжилттай нэмэгдлээ!");
    process.exit();
  } catch (error) {
    console.error("❌ Алдаа:", error);
    process.exit(1);
  }
};

importData();
