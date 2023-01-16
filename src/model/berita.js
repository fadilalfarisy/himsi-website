import mongoose from "mongoose";

const beritaSchema = new mongoose.Schema({
    judul_berita: String,
    penulis_berita: String,
    kategori_berita: Array,
    isi_berita: String,
    header_berita: {
        public_id: String,
        url: String
    },
    gambar_berita: {
        public_id: String,
        url: String
    },
    link_pdf: String,
    link_berita: String
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});

const Berita = mongoose.model("Berita", beritaSchema);

export default Berita