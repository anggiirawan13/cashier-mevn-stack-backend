import mongoose from "mongoose";

const Schema = mongoose.Schema(
    {
        user_id: {
            type: String,
        },
        menu_name: {
            type: String,
        },
        activity_name: {
            type: String,
        },
        created_at: {
            type: Number,
        },
        updated_at: {
            type: Number,
        },
    },
    {
        timestamps: { currentTime: () => new Date().getTime() },
    }
);

export default mongoose.model("Log_Activities", Schema);
