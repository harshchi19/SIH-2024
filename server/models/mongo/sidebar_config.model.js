import mongoose from "mongoose";
const { Schema } = mongoose;

const sidebarSchema = new Schema({
    sidebarUser: {
        type: String,
        required: true,
        enum: ['PAT', 'STT', 'SUP'],
    },
    sidebarData: [
        {
            icon: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            route: {
                type: String,
                required: true,
            },
            children: [
                {
                    icon: {
                        type: String,
                    },
                    name: {
                        type: String,
                        required: true,
                    },
                    route: {
                        type: String,
                        required: true,
                    },
                },
            ],
        },
    ],
});

export const Sidebar = mongoose.model('Sidebar', sidebarSchema);
