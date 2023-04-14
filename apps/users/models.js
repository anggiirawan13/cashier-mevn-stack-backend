import mongoose from "mongoose";
import monoogsePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema(
    {
        fullname: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "cashier", "employee"],
            default: "employee",
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

export default mongoose.model("Users", Schema);
