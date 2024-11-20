import { Sidebar } from "../models/mongo/sidebar_config.model.js";

export const getSidebarData = async (req, res, next) => {
    const { userType, userId } = req.query;
    console.log(userType, userId)

    try {
        if (!userId || !userType)
            return res.status(400).json({ message: "not-a-user" });

        const data = await Sidebar.find({ sidebarUser: userType }).select("sidebarData");

        console.log(data)

        return res.status(200).json({ sidebarData: data[0].sidebarData });
    } catch (error) {
        console.error("Error in getSidebarData: ", error);
        return res.status(400).json({ message: "Error fetching Sidebar Data" });
    }
};