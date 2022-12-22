import mongoose from "mongoose";

const beritaSchema = new mongoose.Schema({
    judul: String,
    tanggal: Date,
    content: String,
    penulis: String,
    thumbnail: String,
    gambar_berita: String,
    link: String
});

const Berita = mongoose.model("Berita", beritaSchema);

export default Berita
