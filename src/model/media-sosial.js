import mongoose from "mongoose";

const medsosSchema = new mongoose.Schema({
    instagram: String,
    facebook: String,
    twitter: String,
    discord: String,
    tiktok: String,
    youtube: String,
    linkedin: String
});

const Medsos = mongoose.model("Medsos", medsosSchema);

export default Medsos
