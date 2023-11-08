import mongoose from "mongoose";

const uri = "mongodb://127.0.0.1:27017/";
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(uri + "studentsDB", { useNewUrlParser: true });
}

const khoaSchema = new mongoose.Schema({
  name: String,
});
const studentSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  age: Number,
  class: String,
  khoa: khoaSchema,
});

const Student = mongoose.model("Student", studentSchema);
const Khoa = mongoose.model("khoa", khoaSchema);
const khoa = new Khoa({
  name: "CNTT",
});

khoa.save();
Student.updateOne({ name: "VanVuong" }, { khoa: khoa })
  .then((results) => {
    console.log("Student update successfully", results);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });
