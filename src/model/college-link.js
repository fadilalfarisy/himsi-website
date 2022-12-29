import mongoose, { Schema } from "mongoose";

const collegeLinkSchema = new mongoose.Schema({
    name: String,
    url: String,
    category: String
});

// change the id and __v structure
collegeLinkSchema.method("toJSON", function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

const CollegeLink = mongoose.model("collegeLink", collegeLinkSchema);

export default CollegeLink;