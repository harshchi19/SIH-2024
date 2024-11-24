import { generateHashedData } from "../helper/security.helper.js";
import { Patient } from "../models/mongo/patient.model.js";

export const getPreTherapyUserById = async (req, res, next) => {
    const { patientId } = req.params;
    console.log(req.params);

    try {
        if (!patientId) {
            return res.status(400).json({ message: "User not found" });
        }

        const hashedPatientId = generateHashedData(patientId);
        const patientData = await Patient.findOne({ patient_id_hash: hashedPatientId }).select("name case_no age sex");

        console.log(patientData);
    } catch (error) {
        console.error("Error in getPreTherapyUserById: ", error);
        return res.status(400).json({ message: "int-ser-err" });
    }
}