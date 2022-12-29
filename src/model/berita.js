import mongoose from "mongoose";

const beritaSchema = new mongoose.Schema({
    judul_berita: String,
    tanggal_berita: Date,
    isi_berita: String,
    penulis_berita: String,
    header_berita: String,
    gambar_berita: String,
    link_berita: String
});

const Berita = mongoose.model("Berita", beritaSchema);

export default Berita
