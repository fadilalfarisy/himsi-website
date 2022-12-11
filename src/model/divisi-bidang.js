import mongoose from "mongoose";

const divisiSchema = new mongoose.Schema({
    bidang: String,
    singkatan_bidang: String,
    deskripsi: String,
    divisi: Array
});

const Divisi = mongoose.model("Divisi", divisiSchema);

export default Divisi
