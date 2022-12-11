import mongoose from "mongoose";

const visiSchema = new mongoose.Schema({
    visi: String,
    misi: String,
    gambar: String,
    angkatan: String
});

const Visi = mongoose.model("Visi", visiSchema);

export default Visi
