import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    judul_event: String,
    tanggal_event: Date,
    tanggal_akhir_event: Date,
    status_event: {
        type: String,
        enum: ['ongoing', 'done'],
        default: 'ongoing'
    },
    isi_event: String,
    penulis_event: String,
    header_event: String,
    gambar_event: String,
    id_divisi: mongoose.Schema.Types.ObjectId
});

const Event = mongoose.model("Event", eventSchema);

export default Event
