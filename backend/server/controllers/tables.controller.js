import { pool } from "../database/postgres.db.js";
import {
    createPatientsTableQuery,
    speechDevelopmentHistoryQuery,
    nonVerbalCommunicationQuery,
    articulationPhoneticLevelQuery,
    voiceQuery,
    suprasegmentalAspectsQuery,
    speechImitationSkillsQuery,
    readingWritingSkillsQuery,
    preTherapyEvaluationQuery
} from "../models/postgres/patient.model.js";

export const createTables = async () => {
    try {
        console.log("Starting to create schemas...");

        await pool.query(createPatientsTableQuery);
        console.log("Created Patients Table");

        await pool.query(speechDevelopmentHistoryQuery);
        console.log("Created Speech Development History Table");

        await pool.query(nonVerbalCommunicationQuery);
        console.log("Created Non Verbal Communication Table");

        await pool.query(articulationPhoneticLevelQuery);
        console.log("Created Articulation Phonetic Level Table");

        await pool.query(voiceQuery);
        console.log("Created Voices Table");

        await pool.query(suprasegmentalAspectsQuery);
        console.log("Created Suprasegmental Aspect Table");

        await pool.query(speechImitationSkillsQuery);
        console.log("Created Speech Imitation Skills Table");

        await pool.query(readingWritingSkillsQuery);
        console.log("Created Reading Writing Skills Table");

        await pool.query(preTherapyEvaluationQuery);
        console.log("Created Pre Therapy Evaluation Table");
    } catch (error) {
        console.error("Error creating tables: ", error);
    } finally {
        await pool.end();
    }
}