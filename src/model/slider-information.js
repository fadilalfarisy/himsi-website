import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
    gambar_slider: String,
    judul: String,
    link: String,
});

const Slider = mongoose.model("Slider", sliderSchema);

export default Slider