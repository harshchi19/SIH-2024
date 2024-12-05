import express from "express";
import connectToDatabase from "./database/mongo.db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import sidebarRouter from "./routes/sidebar.route.js";
import patientRouter from "./routes/patient.route.js";
import userRouter from "./routes/user.route.js";
import studentRouter from "./routes/student-therapist.route.js";
import preTherapyRouter from "./routes/pre_therapy.route.js";
import supervisorRouter from "./routes/supervisor.route.js";
import contactRoutes from "./routes/contacts.route.js";
import setupSocket from "./socket.js";
import calendarRouter from "./routes/calendar.route.js";
import visualizationRouter from "./routes/visualizations.route.js";
import sessionsRouter from "./routes/sessions.route.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use("/auth", userRouter);
app.use("/sidebar", sidebarRouter);

app.use("/supervisor", supervisorRouter);
app.use("/student-therapist", studentRouter);
app.use("/patient", patientRouter);

app.use("/contacts", contactRoutes);
app.use("/calendar", calendarRouter);
app.use("/visualization", visualizationRouter);

app.use("/pre_therapy", preTherapyRouter);
app.use("/sessions", sessionsRouter);

const PORT = process.env.PORT || 4224;

const server = app.listen(PORT, () => {
  console.log(`Server listening to PORT ${PORT}`);
  setupSocket(server);
});

connectToDatabase();
