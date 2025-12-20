import dotenv from "dotenv";
import mongoose from "mongoose";
import TestQuestion from "./models/TestQuestion.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const questions = [
    { text: "Гар багаж ашиглаж, зүйлс угсрах, засварлах сонирхолтой.", category: "R" },
    { text: "Шинжилгээ, туршилт хийх, асуудалд дүн шинжилгээ хийх дуртай.", category: "I" },
    { text: "Дуу, зураг, дизайн, уран бүтээл хийх сонирхолтой.", category: "A" },
    { text: "Бусдад туслах, заах, ойлгуулах дуртай.", category: "S" },
    { text: "Манлайлах, бусдыг чиглүүлэх, шинэ санаа гаргах сонирхолтой.", category: "E" },
    { text: "Хуваарь, тооцоо, бичиг баримт, системтэй ажил хийх дуртай.", category: "C" },
    { text: "Механик төхөөрөмж, техник хэрэгсэлтэй харьцах дуртай.", category: "R" },
    { text: "Ном, өгүүлэл унших, шинжлэх ухаанч байдлаар асуудлыг задлах дуртай.", category: "I" },
    { text: "Өөрийн үзэл бодлыг урлагийн хэлбэрээр илэрхийлэх дуртай.", category: "A" },
    { text: "Багийн дунд хамтран ажиллах, бусдад зөвлөгөө өгөх сонирхолтой.", category: "S" },
    { text: "Хүмүүсийн өмнө илтгэх, ятгах, борлуулалт хийх чадвартай.", category: "E" },
    { text: "Стандарт, дүрэм журмыг баримтлан ажиллах нь таатай санагддаг.", category: "C" },
    { text: "Гарын хөдөлмөр шаардсан, хөдөлгөөнт ажил илүүд үздэг.", category: "R" },
    { text: "Оньсого, таавар, логик бодлого бодох дуртай.", category: "I" },
    { text: "Зохион бүтээх, шинэ дизайн гаргах, төсөөллөө хэрэгжүүлэх дуртай.", category: "A" },
    { text: "Хүмүүст сэтгэл зүйн дэмжлэг үзүүлэх, тэднийг ойлгохыг хичээдэг.", category: "S" },
    { text: "Бизнес санаа хэрэгжүүлэх, хүмүүст нөлөөлөх оролдлого хийдэг.", category: "E" },
    { text: "Өгөгдөл ангилах, мэдээллийг системчлэх үйлдэлд дуртай.", category: "C" },
    { text: "Цэцэрлэгжүүлэлт, гадаа ажлыг гардан хийх сонирхолтой.", category: "R" },
    { text: "Үзэгдэл, үзэл баримтлалд үндэслэн дүгнэлт гаргах сонирхолтой.", category: "I" }
  ];
  
  

const seedQuestions = async () => {
  try {
    await TestQuestion.deleteMany();
    await TestQuestion.insertMany(questions);
    console.log("✅ Тестийн асуултууд нэмэгдлээ!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedQuestions();
