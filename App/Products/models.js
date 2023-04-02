import mongoose from "mongoose";
import monoogsePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        thumbnail: {
            type: String,
        },
        price: {
            type: Number,
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categories",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        created_at: {
            type: Number,
        },
        updated_at: {
            type: Number,
        },
    }
);

Schema.plugin(monoogsePaginate);

export default mongoose.model("Products", Schema);
