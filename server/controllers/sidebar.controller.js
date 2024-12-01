import { Sidebar } from "../models/mongo/sidebar_config.model.js";
import { Calendar } from "../models/mongo/calendar.model.js";
import { generateHashedData } from "../helper/security.helper.js";
import { Patient } from "../models/mongo/patient.model.js";
import { StudentTherapist } from "../models/mongo/student_therapist.model.js";
import { Supervisor } from "../models/mongo/supervisor.model.js";

export const getSidebarData = async (req, res, next) => {
    const { userType } = req.params;

    try {
        if (!userType)
            return res.status(400).json({ message: "not-a-user" });

        const data = await Sidebar.find({ sidebarUser: userType }).select("sidebarData");

        return res.status(200).json({ sidebarData: data[0].sidebarData });
    } catch (error) {
        console.error("Error in getSidebarData: ", error);
        return res.status(400).json({ message: "Error fetching Sidebar Data" });
    }
};

export const getUpcomingData = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const userType = userId.split('-')[0];

        if (userType !== "PAT" && userType !== "STT" && userType !== "SUP") {
            return res.status(400).json({ message: "invalid-user" });
        }

        const hashedUserId = generateHashedData(userId);
        let currentUser;

        if (userType === "PAT") {
            currentUser = await Patient.findOne({ patient_id_hash: hashedUserId }).select("_id");
        } else if (userType === "STT") {
            currentUser = await StudentTherapist.findOne({ student_therapist_id_hash: hashedUserId }).select("_id");
        } else if (userType === "SUP") {
            currentUser = await Supervisor.findOne({ supervisor_id_hash: hashedUserId }).select("_id");
        }

        if (!currentUser) {
            return res.status(404).json({ message: "usr-not-fnd" });
        }

        let upcomingEvent = await Calendar.find({ userId: currentUser })
            .where('selected_date').gte(new Date())
            .sort({ selected_date: 1, start_time: 1 })
            .limit(1)
            .exec();

        return res.status(200).json({ event: upcomingEvent[0] });
    } catch (error) {
        console.error("Error in getUpcomingData: ", error);
        return res.status(400).json({ message: "Error fetching Sidebar Data" });
    }
}