import { generateHashedData } from "../helper/security.helper.js";
import { Patient } from "../models/mongo/patient.model.js";
import { StudentTherapist } from "../models/mongo/student_therapist.model.js";
import { Supervisor } from "../models/mongo/supervisor.model.js";
import { Calendar } from "../models/mongo/calendar.model.js";

export const getCalendarData = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const userType = userId.split("-")[0];
        const hashedId = generateHashedData(userId);

        let currentUser;
        if (userType === "PAT")
            currentUser = await Patient.findOne({ patient_id_hash: hashedId }).select("_id");
        else if (userType === "STT")
            currentUser = await StudentTherapist.findOne({ student_therapist_id_hash: hashedId }).select("_id");
        else if (userType === "SUP")
            currentUser = await Supervisor.findOne({ supervisor_id_hash: hashedId }).select("_id");

        if (!currentUser)
            return res.status(400).json({ message: "usr-not-fnd" })

        let selectedDates;
        if (userType === "PAT") {
            selectedDates = await Calendar.find({
                $or: [
                    { userId: currentUser._id },
                    { patient_id: currentUser._id },
                ],
            })
                .select("selected_date color -_id")
                .exec();
        } else if (userType === "SUP") {
            selectedDates = await Calendar.find({
                $or: [
                    { userId: currentUser._id },
                    { supervisor_id: currentUser._id }
                ],
            }).select("selected_date color -_id").exec();
        } else if (userType === "STT") {
            selectedDates = await Calendar.find({ userId: currentUser._id }).select("selected_date color -_id").exec();
        }

        return res.status(200).json({ message: "success", dates: selectedDates });
    } catch (error) {
        console.error("Error in getCalendarData:", error);
        return res.status(500).json({ message: "Logout Failed" });
    }
}