import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
    name: String,
    logo: String
});

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner
