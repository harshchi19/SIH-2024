import { Patient } from "../models/mongo/patient.model.js";
import { generateEncryptedUniqueId, generateKeyAndIV, encryptSection, generateUniqueCaseNo, generateHashedData } from "../helper/security.helper.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { unwrapKey } from "./keys.controller.js";

export const onboardPatient = async (req, res, next) => {
    const {
        basicDetails,
        addressDetails,
        medicalDetails,
        speechDevelopmentHistory,
        nonVerbalCommunication,
        articulationPhoneticLevel,
        voiceDetails,
        suprasegmentalAspects,
        readingWritingSkills
    } = req.body;

    try {
        const hashedEmail = generateHashedData(basicDetails.email);
        const hashedPhone = generateHashedData(basicDetails.phone_no);

        let findDuplicateEntries = await Patient.findOne({
            $or: [
                { email_hash: hashedEmail },
                { phone_hash: hashedPhone }
            ]
        }).select("_id").lean();

        if (findDuplicateEntries) {
            return res.status(400).json({ message: "user-alr-ext" });
        }

        const findEncryptionKey = await EncryptionKey.findOne({ collectionName: "patients" });
        const key = unwrapKey(findEncryptionKey.encryptedKey, findEncryptionKey.encryptedIV, findEncryptionKey.encryptedAuthTag);

        const iv = generateKeyAndIV();

        const newPatientId = generateEncryptedUniqueId("pat");
        basicDetails["patient_id"] = newPatientId;

        const newCaseNo = generateUniqueCaseNo();
        basicDetails["case_no"] = newCaseNo;

        const hashedCaseNo = generateHashedData(newCaseNo);
        const hashedPatientId = generateHashedData(newPatientId);

        const encryptedBasicDetails = encryptSection(basicDetails, key, iv);
        const encryptedAddressDetails = encryptSection(addressDetails, key, iv);
        const encryptedMedicalDetails = encryptSection(medicalDetails, key, iv);
        const encryptedSpeechDevelopmentHistory = encryptSection(speechDevelopmentHistory, key, iv);
        const encryptedNonVerbalCommunication = encryptSection(nonVerbalCommunication, key, iv);
        const encryptedArticulationPhoneticLevel = encryptSection(articulationPhoneticLevel, key, iv);
        const encryptedVoiceDetails = encryptSection(voiceDetails, key, iv);
        const encryptedSuprasegmentalAspects = encryptSection(suprasegmentalAspects, key, iv);
        const encryptedReadingWritingSkills = encryptSection(readingWritingSkills, key, iv);

        const newPatient = new Patient({
            patient_id: encryptedBasicDetails.patient_id,
            name: encryptedBasicDetails.name,
            password: encryptedBasicDetails.password,
            phone_no: encryptedBasicDetails.phone_no,
            email: encryptedBasicDetails.email,
            date_of_birth: encryptedBasicDetails.date_of_birth,
            sex: encryptedBasicDetails.sex,
            preferred_language: encryptedBasicDetails.preferred_language,
            user_image: encryptedBasicDetails.user_image,
            case_no: encryptedBasicDetails.case_no,
            patient_id_hash: hashedPatientId,
            phone_hash: hashedPhone,
            email_hash: hashedEmail,
            case_no_hash: hashedCaseNo,
            address: encryptedAddressDetails,
            medical_details: encryptedMedicalDetails,
            speech_development_history: encryptedSpeechDevelopmentHistory,
            non_verbal_communication: encryptedNonVerbalCommunication,
            articulation_at_phonetic_level: encryptedArticulationPhoneticLevel,
            voice_details: encryptedVoiceDetails,
            suprasegmental_aspects: encryptedSuprasegmentalAspects,
            reading_writing_skills: encryptedReadingWritingSkills
        });

        await newPatient.save();

        return res.status(200).json({ message: "pat-onb-suc" });
    } catch (error) {
        console.error("Error in onboardPatient: ", error);
        return res.status(400).json({ message: "int-ser-err" });
    }
}