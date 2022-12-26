import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nama: String,
    role: {
        type: String,
        enum: ['super admin', 'admin']
    }
});

//hashing password before save to database
adminSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.log(error.message)
    }
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin
