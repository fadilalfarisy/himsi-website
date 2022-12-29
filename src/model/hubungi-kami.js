import mongoose from "mongoose";

const hubungiSchema = new mongoose.Schema({
    whatsapp: String,
    email: String,
});

const Hubungi = mongoose.model("Hubungi", hubungiSchema);

export default Hubungi
