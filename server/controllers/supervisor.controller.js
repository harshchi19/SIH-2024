import { Supervisor } from "../models/mongo/supervisor.model.js";
import { generateEncryptedUniqueId, generateKeyAndIV, encryptSection, generateUniqueCaseNo, generateHashedData } from "../helper/security.helper.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { unwrapKey } from "./keys.controller.js";
import { generatePdf } from "../helper/pdf.helper.js";

export const onboardSupervisor = async (req, res, next) => {
    const { name, password, phone_no, email, date_of_birth, sex, preferred_language1, preferred_language2, preferred_language3 } = req.body;

    try {
        const dataForPdf = {
            basicDetails: {
                name, password, phone_no, email, date_of_birth, sex, preferred_language1, preferred_language2, preferred_language3
            }
        };

        const hashedEmail = generateHashedData(email);
        const hashedPhone = generateHashedData(phone_no);

        let findDuplicateEntries = await Supervisor.findOne({
            $or: [
                { email_hash: hashedEmail },
                { phone_hash: hashedPhone }
            ]
        }).select("_id").lean();

        if (findDuplicateEntries) {
            return res.status(400).json({ message: "user-alr-ext" });
        }

        const findEncryptionKey = await EncryptionKey.findOne({ collectionName: "supervisors" });
        const key = unwrapKey(findEncryptionKey.encryptedKey, findEncryptionKey.encryptedIV, findEncryptionKey.encryptedAuthTag);

        const iv = generateKeyAndIV();

        const newSupervisorId = generateEncryptedUniqueId("sup");
        const hashedSupervisorId = generateHashedData(newSupervisorId);

        const pdfFileName = `${newSupervisorId}_supervisor_details.pdf`;
        await generatePdf(dataForPdf, pdfFileName);

        const dob = new Date(date_of_birth);

        let age;
        if (!isNaN(dob.getTime())) {
            const now = new Date();
            age = now.getFullYear() - dob.getFullYear();

            const isBirthdayPassed =
                now.getMonth() > dob.getMonth() ||
                (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());

            if (!isBirthdayPassed) {
                age--;
            }
            age = `${age}`;
        } else {
            console.error("Date of Birth is not valid");
            return res.status(400).json({ message: "inv-date" });
        }

        const basicDetails = {
            supervisor_id: newSupervisorId,
            name: name,
            password: password,
            phone_no: phone_no,
            email: email,
            date_of_birth: date_of_birth,
            age: age,
            sex: sex,
            preferred_language1: preferred_language1,
            preferred_language2: preferred_language2,
            preferred_language3: preferred_language3,
        }

        const encryptedBasicDetails = encryptSection(basicDetails, key, iv);

        const newSupervisor = new Supervisor({
            supervisor_id: encryptedBasicDetails.supervisor_id,
            name: encryptedBasicDetails.name,
            password: encryptedBasicDetails.password,
            phone_no: encryptedBasicDetails.phone_no,
            email: encryptedBasicDetails.email,
            date_of_birth: encryptedBasicDetails.date_of_birth,
            age: encryptedBasicDetails.age,
            sex: encryptedBasicDetails.sex,
            preferred_language1: encryptedBasicDetails.preferred_language1,
            preferred_language2: encryptedBasicDetails.preferred_language2,
            preferred_language3: encryptedBasicDetails.preferred_language3,
            email_hash: hashedEmail,
            phone_hash: hashedPhone,
            supervisor_id_hash: hashedSupervisorId,
            authenticated: false
        });

        await newSupervisor.save();

        return res.status(200).json({ message: "sup_onb_suc" });
    } catch (error) {
        console.error("Error in onboardPatient: ", error);
        return res.status(400).json({ message: "int-ser-err" });
    }
} 