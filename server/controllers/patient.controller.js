import { Patient } from "../models/mongo/patient.model.js";
import {
  generateEncryptedUniqueId,
  generateKeyAndIV,
  encryptSection,
  generateUniqueCaseNo,
  generateHashedData,
  decryptSection,
} from "../helper/security.helper.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { unwrapKey } from "./keys.controller.js";
import { generatePdf } from "../helper/pdf.helper.js";

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
    readingWritingSkills,
  } = req.body;

  try {
    const { password, ...basicDetailsWithoutPassword } = basicDetails;

    const dataForPdf = {
      basic_details: basicDetailsWithoutPassword,
      address_details: addressDetails,
      medical_details: medicalDetails,
      speech_development_history: speechDevelopmentHistory,
      non_verbal_communication: nonVerbalCommunication,
      articulation_phonetic_level: articulationPhoneticLevel,
      voice_details: voiceDetails,
      suprasegmental_aspects: suprasegmentalAspects,
      reading_writing_skills: readingWritingSkills,
    };

    const hashedEmail = generateHashedData(basicDetails.email);
    const hashedPhone = generateHashedData(basicDetails.phone_no);

    let findDuplicateEntries = await Patient.findOne({
      $or: [{ email_hash: hashedEmail }, { phone_hash: hashedPhone }],
    })
      .select("_id")
      .lean();

    if (findDuplicateEntries) {
      return res.status(400).json({ message: "user-alr-ext" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "patients",
    });
    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const iv = generateKeyAndIV();

    const newpatient_id = generateEncryptedUniqueId("pat");
    basicDetails["patient_id"] = newpatient_id;

    const pdfFileName = `${newpatient_id}_patient_details.pdf`;
    await generatePdf(dataForPdf, pdfFileName);

    const newCaseNo = generateUniqueCaseNo();
    basicDetails["case_no"] = newCaseNo;

    const dob = new Date(basicDetails.date_of_birth);

    if (!isNaN(dob.getTime())) {
      const now = new Date();
      let age = now.getFullYear() - dob.getFullYear();

      const isBirthdayPassed =
        now.getMonth() > dob.getMonth() ||
        (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());

      if (!isBirthdayPassed) {
        age--;
      }

      basicDetails["age"] = age;
    } else {
      console.error("Date of Birth is not valid");
      return res.status(400).json({ message: "inv-date" });
    }

    const hashedCaseNo = generateHashedData(newCaseNo);
    const hashedPatientId = generateHashedData(newpatient_id);

    const encryptedBasicDetails = encryptSection(basicDetails, key, iv);
    const encryptedAddressDetails = encryptSection(addressDetails, key, iv);
    const encryptedMedicalDetails = encryptSection(medicalDetails, key, iv);
    const encryptedSpeechDevelopmentHistory = encryptSection(
      speechDevelopmentHistory,
      key,
      iv
    );
    const encryptedNonVerbalCommunication = encryptSection(
      nonVerbalCommunication,
      key,
      iv
    );
    const encryptedArticulationPhoneticLevel = encryptSection(
      articulationPhoneticLevel,
      key,
      iv
    );
    const encryptedVoiceDetails = encryptSection(voiceDetails, key, iv);
    const encryptedSuprasegmentalAspects = encryptSection(
      suprasegmentalAspects,
      key,
      iv
    );
    const encryptedReadingWritingSkills = encryptSection(
      readingWritingSkills,
      key,
      iv
    );

    const newPatient = new Patient({
      patient_id: encryptedBasicDetails.patient_id,
      name: encryptedBasicDetails.name,
      password: encryptedBasicDetails.password,
      phone_no: encryptedBasicDetails.phone_no,
      email: encryptedBasicDetails.email,
      date_of_birth: encryptedBasicDetails.date_of_birth,
      date_of_assignment: encryptedBasicDetails.date_of_assignment,
      age: encryptedBasicDetails.age,
      sex: encryptedBasicDetails.sex,
      preferred_language1: encryptedBasicDetails.preferred_language1,
      preferred_language2: encryptedBasicDetails.preferred_language2,
      preferred_language3: encryptedBasicDetails.preferred_language3,
      user_image: encryptedBasicDetails.user_image,
      case_no: encryptedBasicDetails.case_no,
      patient_id_hash: hashedPatientId,
      phone_hash: hashedPhone,
      email_hash: hashedEmail,
      case_no_hash: hashedCaseNo,
      patient_issue: encryptedBasicDetails.summary,
      address: encryptedAddressDetails,
      medical_details: encryptedMedicalDetails,
      speech_development_history: encryptedSpeechDevelopmentHistory,
      non_verbal_communication: encryptedNonVerbalCommunication,
      articulation_at_phonetic_level: encryptedArticulationPhoneticLevel,
      voice_details: encryptedVoiceDetails,
      suprasegmental_aspects: encryptedSuprasegmentalAspects,
      reading_writing_skills: encryptedReadingWritingSkills,
    });

    await newPatient.save();

    return res
      .status(200)
      .json({ patientId: newpatient_id, message: "pat-onb-suc" });
  } catch (error) {
    console.error("Error in onboardPatient: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};

export const getPatientById = async (req, res, next) => {
  const { patient_id } = req.params;

  try {
    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "patients",
    });
    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const patient_id_hash = generateHashedData(patient_id);

    const patient = await Patient.findOne({
      patient_id_hash: patient_id_hash,
    });

    if (!patient) {
      return res.status(404).json({ message: "pat-not-fnd" });
    }

    const decryptPatient = {
      _id: patient._id,
      patient_id: Object.fromEntries(patient.patient_id),
      name: Object.fromEntries(patient.name),
      phone_no: Object.fromEntries(patient.phone_no),
      email: Object.fromEntries(patient.email),
      date_of_birth: Object.fromEntries(patient.date_of_birth),
      date_of_assignment: Object.fromEntries(patient.date_of_assignment),
      age: Object.fromEntries(patient.age),
      sex: Object.fromEntries(patient.sex),
      preferred_language1: Object.fromEntries(patient.preferred_language1),
      preferred_language2: Object.fromEntries(patient.preferred_language2),
      preferred_language3: Object.fromEntries(patient.preferred_language3),
      user_image: Object.fromEntries(patient.user_image),
      // case_no: Object.fromEntries(patient.case_no),
      patient_issue: Object.fromEntries(patient.patient_id),
    };
    const decryptedPatient = decryptSection(decryptPatient, key);

    const decryptAddress = {
      address_line1: Object.fromEntries(patient.address.address_line1),
      address_line2: Object.fromEntries(patient.address.address_line2),
      city: Object.fromEntries(patient.address.city),
      state: Object.fromEntries(patient.address.state),
      country: Object.fromEntries(patient.address.country),
      postal_code: Object.fromEntries(patient.address.postal_code),
    };
    const decryptedAddressDetails = decryptSection(decryptAddress, key);

    const decrpytMedicalDetails = {
      multilingual_factors: Object.fromEntries(
        patient.medical_details.multilingual_factors
      ),
      details_to_pay_attention: Object.fromEntries(
        patient.medical_details.details_to_pay_attention
      ),
      language_evaluation: Object.fromEntries(
        patient.medical_details.language_evaluation
      ),
      auditory_skills: Object.fromEntries(
        patient.medical_details.auditory_skills
      ),
      formal_testing: Object.fromEntries(
        patient.medical_details.formal_testing
      ),
      diagnostic_formulation: Object.fromEntries(
        patient.medical_details.diagnostic_formulation
      ),
      clinical_impression: Object.fromEntries(
        patient.medical_details.clinical_impression
      ),
      recommendations: Object.fromEntries(
        patient.medical_details.recommendations
      ),
      // supervisor_id: Object.fromEntries(patient.medical_details.supervisor_id),
      // student_therapist_id: Object.fromEntries(
      //   patient.medical_details.student_therapist_id
      // ),
    };
    const decryptedMedicalDetails = decryptSection(decrpytMedicalDetails, key);

    const decryptSpeechDevelopmentHistory = {
      vocalization: Object.fromEntries(
        patient.speech_development_history.vocalization
      ),
      babbling: Object.fromEntries(patient.speech_development_history.babbling),
      first_word: Object.fromEntries(
        patient.speech_development_history.first_word
      ),
      first_sentence: Object.fromEntries(
        patient.speech_development_history.first_sentence
      ),
    };
    const decryptedSpeechDevelopmentHistory = decryptSection(
      decryptSpeechDevelopmentHistory,
      key
    );

    const decryptNonVerbalCommunication = {
      expression_level: Object.fromEntries(
        patient.non_verbal_communication.expression_level
      ),
      comprehension_level: Object.fromEntries(
        patient.non_verbal_communication.comprehension_level
      ),
    };
    const decryptedNonVerbalCommunication = decryptSection(
      decryptNonVerbalCommunication,
      key
    );

    const decryptArticulationPhoneticLevel = {
      vowels_stage: Object.fromEntries(
        patient.articulation_at_phonetic_level.vowels_stage
      ),
      consonants_stage: Object.fromEntries(
        patient.articulation_at_phonetic_level.consonants_stage
      ),
      blends_stage: Object.fromEntries(
        patient.articulation_at_phonetic_level.blends_stage
      ),
    };
    const decryptedArticulationPhoneticLevel = decryptSection(
      decryptArticulationPhoneticLevel,
      key
    );

    const decryptVoiceDetails = {
      pitch_quality: Object.fromEntries(patient.voice_details.pitch_quality),
      loudness: Object.fromEntries(patient.voice_details.loudness),
      voice_quality: Object.fromEntries(patient.voice_details.voice_quality),
      breath_control: Object.fromEntries(patient.voice_details.breath_control),
    };
    const decryptedVoiceDetails = decryptSection(decryptVoiceDetails, key);

    const decryptSuprasegmentalAspects = {
      emphasis_level: Object.fromEntries(
        patient.suprasegmental_aspects.emphasis_level
      ),
      intonation: Object.fromEntries(patient.suprasegmental_aspects.intonation),
      phrasing: Object.fromEntries(patient.suprasegmental_aspects.phrasing),
      speech_rate: Object.fromEntries(
        patient.suprasegmental_aspects.speech_rate
      ),
    };
    const decryptedSuprasegmentalAspects = decryptSection(
      decryptSuprasegmentalAspects,
      key
    );

    const decryptReadingWritingSkills = {
      letter_recognition: Object.fromEntries(
        patient.reading_writing_skills.letter_recognition
      ),
      word_recognition: Object.fromEntries(
        patient.reading_writing_skills.word_recognition
      ),
      reading_comprehension: Object.fromEntries(
        patient.reading_writing_skills.reading_comprehension
      ),
      copying: Object.fromEntries(patient.reading_writing_skills.copying),
      writing_to_dictation: Object.fromEntries(
        patient.reading_writing_skills.writing_to_dictation
      ),
      spontaneous_writing: Object.fromEntries(
        patient.reading_writing_skills.spontaneous_writing
      ),
    };
    const decryptedReadingWritingSkills = decryptSection(
      decryptReadingWritingSkills,
      key
    );

    decryptedPatient.address_details = decryptedAddressDetails;
    decryptedPatient.medical_details = decryptedMedicalDetails;
    decryptedPatient.speech_development_history =
      decryptedSpeechDevelopmentHistory;
    decryptedPatient.non_verbal_communication = decryptedNonVerbalCommunication;
    decryptedPatient.articulation_phonetic_level =
      decryptedArticulationPhoneticLevel;
    decryptedPatient.voice_details = decryptedVoiceDetails;
    decryptedPatient.suprasegmental_aspects = decryptedSuprasegmentalAspects;
    decryptedPatient.reading_writing_skills = decryptedReadingWritingSkills;
    // console.log("Hi", decryptedPatient.supervisor_therapist);
    return res.status(200).json(decryptedPatient);
  } catch (error) {
    console.error("Error in getPatientDetails: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};

export const getAllPatients = async (req, res, next) => {
  try {
    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "patients",
    });
    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const findPatients = await Patient.find().lean();

    if (!findPatients) {
      return res.status(404).json({ message: "pat-not-fnd" });
    }

    const decryptedPatients = findPatients.map((patient) => {
      const decryptedPatient = {
        _id: patient._id,
        patient_id: patient.patient_id,
        name: patient.name,
        phone_no: patient.phone_no,
        email: patient.email,
        date_of_birth: patient.date_of_birth,
        date_of_assignment: patient.date_of_assignment,
        age: patient.age,
        sex: patient.sex,
        preferred_language1: patient.preferred_language1,
        preferred_language2: patient.preferred_language2,
        preferred_language3: patient.preferred_language3,
        // user_image: patient.user_image,
        case_no: patient.case_no,
        patient_issue: patient.patient_issue,
      };

      const decryptedData = decryptSection(decryptedPatient, key);
      const decryptedAddressDetails = decryptSection(patient.address, key);
      const decryptedMedicalDetails = decryptSection(
        patient.medical_details,
        key
      );
      const decryptedSpeechDevelopmentHistory = decryptSection(
        patient.speech_development_history,
        key
      );
      const decryptedNonVerbalCommunication = decryptSection(
        patient.non_verbal_communication,
        key
      );
      const decryptedArticulationPhoneticLevel = decryptSection(
        patient.articulation_at_phonetic_level,
        key
      );
      const decryptedVoiceDetails = decryptSection(patient.voice_details, key);
      const decryptedSuprasegmentalAspects = decryptSection(
        patient.suprasegmental_aspects,
        key
      );
      const decryptedReadingWritingSkills = decryptSection(
        patient.reading_writing_skills,
        key
      );

      return {
        ...decryptedData,
        address_details: decryptedAddressDetails,
        medical_details: decryptedMedicalDetails,
        speech_development_history: decryptedSpeechDevelopmentHistory,
        non_verbal_communication: decryptedNonVerbalCommunication,
        articulation_phonetic_level: decryptedArticulationPhoneticLevel,
        voice_details: decryptedVoiceDetails,
        suprasegmental_aspects: decryptedSuprasegmentalAspects,
        reading_writing_skills: decryptedReadingWritingSkills,
        supervisor_id: patient.supervisor_id,
        student_therapist_id: patient.student_therapist_id,
      };
    });
    console.log("Sending Data:", decryptedPatients);
    return res.status(200).json(decryptedPatients);
  } catch (error) {
    console.error("Error in getPatients: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};

export const getPatientByObjectId = async (req, res, next) => {
  const { patient_id } = req.params;

  console.log(patient_id);
  try {
    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "patients",
    });
    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const patient = await Patient.findById(patient_id);

    if (!patient) {
      return res.status(404).json({ message: "pat-not-fnd" });
    }

    const decryptPatient = {
      _id: patient._id,
      patient_id: Object.fromEntries(patient.patient_id),
      name: Object.fromEntries(patient.name),
      phone_no: Object.fromEntries(patient.phone_no),
      email: Object.fromEntries(patient.email),
      date_of_birth: Object.fromEntries(patient.date_of_birth),
      date_of_assignment: Object.fromEntries(patient.date_of_assignment),
      age: Object.fromEntries(patient.age),
      sex: Object.fromEntries(patient.sex),
      preferred_language1: Object.fromEntries(patient.preferred_language1),
      preferred_language2: Object.fromEntries(patient.preferred_language2),
      preferred_language3: Object.fromEntries(patient.preferred_language3),
      user_image: Object.fromEntries(patient.user_image),
      case_no: Object.fromEntries(patient.case_no),
      patient_issue: Object.fromEntries(patient.patient_issue),
    };
    const decryptedPatient = decryptSection(decryptPatient, key);

    const decryptAddress = {
      address_line1: Object.fromEntries(patient.address.address_line1),
      address_line2: Object.fromEntries(patient.address.address_line2),
      city: Object.fromEntries(patient.address.city),
      state: Object.fromEntries(patient.address.state),
      country: Object.fromEntries(patient.address.country),
      postal_code: Object.fromEntries(patient.address.postal_code),
    };
    const decryptedAddressDetails = decryptSection(decryptAddress, key);

    const decrpytMedicalDetails = {
      multilingual_factors: Object.fromEntries(
        patient.medical_details.multilingual_factors
      ),
      details_to_pay_attention: Object.fromEntries(
        patient.medical_details.details_to_pay_attention
      ),
      language_evaluation: Object.fromEntries(
        patient.medical_details.language_evaluation
      ),
      auditory_skills: Object.fromEntries(
        patient.medical_details.auditory_skills
      ),
      formal_testing: Object.fromEntries(
        patient.medical_details.formal_testing
      ),
      diagnostic_formulation: Object.fromEntries(
        patient.medical_details.diagnostic_formulation
      ),
      clinical_impression: Object.fromEntries(
        patient.medical_details.clinical_impression
      ),
      recommendations: Object.fromEntries(
        patient.medical_details.recommendations
      ),
    };
    const decryptedMedicalDetails = decryptSection(decrpytMedicalDetails, key);

    const decryptSpeechDevelopmentHistory = {
      vocalization: Object.fromEntries(
        patient.speech_development_history.vocalization
      ),
      babbling: Object.fromEntries(patient.speech_development_history.babbling),
      first_word: Object.fromEntries(
        patient.speech_development_history.first_word
      ),
      first_sentence: Object.fromEntries(
        patient.speech_development_history.first_sentence
      ),
    };
    const decryptedSpeechDevelopmentHistory = decryptSection(
      decryptSpeechDevelopmentHistory,
      key
    );

    const decryptNonVerbalCommunication = {
      expression_level: Object.fromEntries(
        patient.non_verbal_communication.expression_level
      ),
      comprehension_level: Object.fromEntries(
        patient.non_verbal_communication.comprehension_level
      ),
    };
    const decryptedNonVerbalCommunication = decryptSection(
      decryptNonVerbalCommunication,
      key
    );

    const decryptArticulationPhoneticLevel = {
      vowels_stage: Object.fromEntries(
        patient.articulation_at_phonetic_level.vowels_stage
      ),
      consonants_stage: Object.fromEntries(
        patient.articulation_at_phonetic_level.consonants_stage
      ),
      blends_stage: Object.fromEntries(
        patient.articulation_at_phonetic_level.blends_stage
      ),
    };
    const decryptedArticulationPhoneticLevel = decryptSection(
      decryptArticulationPhoneticLevel,
      key
    );

    const decryptVoiceDetails = {
      pitch_quality: Object.fromEntries(patient.voice_details.pitch_quality),
      loudness: Object.fromEntries(patient.voice_details.loudness),
      voice_quality: Object.fromEntries(patient.voice_details.voice_quality),
      breath_control: Object.fromEntries(patient.voice_details.breath_control),
    };
    const decryptedVoiceDetails = decryptSection(decryptVoiceDetails, key);

    const decryptSuprasegmentalAspects = {
      emphasis_level: Object.fromEntries(
        patient.suprasegmental_aspects.emphasis_level
      ),
      intonation: Object.fromEntries(patient.suprasegmental_aspects.intonation),
      phrasing: Object.fromEntries(patient.suprasegmental_aspects.phrasing),
      speech_rate: Object.fromEntries(
        patient.suprasegmental_aspects.speech_rate
      ),
    };
    const decryptedSuprasegmentalAspects = decryptSection(
      decryptSuprasegmentalAspects,
      key
    );

    const decryptReadingWritingSkills = {
      letter_recognition: Object.fromEntries(
        patient.reading_writing_skills.letter_recognition
      ),
      word_recognition: Object.fromEntries(
        patient.reading_writing_skills.word_recognition
      ),
      reading_comprehension: Object.fromEntries(
        patient.reading_writing_skills.reading_comprehension
      ),
      copying: Object.fromEntries(patient.reading_writing_skills.copying),
      writing_to_dictation: Object.fromEntries(
        patient.reading_writing_skills.writing_to_dictation
      ),
      spontaneous_writing: Object.fromEntries(
        patient.reading_writing_skills.spontaneous_writing
      ),
    };
    const decryptedReadingWritingSkills = decryptSection(
      decryptReadingWritingSkills,
      key
    );

    decryptedPatient.address_details = decryptedAddressDetails;
    decryptedPatient.medical_details = decryptedMedicalDetails;
    decryptedPatient.medicalDetails.supervisor_id =
      patient.medical_details.supervisor_id;
    decryptedPatient.medicalDetails.student_therapist_id =
      patient.medical_details.student_therapist_id;
    decryptedPatient.speech_development_history =
      decryptedSpeechDevelopmentHistory;
    decryptedPatient.non_verbal_communication = decryptedNonVerbalCommunication;
    decryptedPatient.articulation_phonetic_level =
      decryptedArticulationPhoneticLevel;
    decryptedPatient.voice_details = decryptedVoiceDetails;
    decryptedPatient.suprasegmental_aspects = decryptedSuprasegmentalAspects;
    decryptedPatient.reading_writing_skills = decryptedReadingWritingSkills;

    console.log("ByeP:", decryptedPatient);
    return res.status(200).json(decryptedPatient);
  } catch (error) {
    console.error("Error in getPatientDetails: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};
