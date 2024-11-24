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

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.WEB_URL,
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

app.use("/sidebar", sidebarRouter);
app.use("/patient", patientRouter);
app.use("/auth", userRouter);
app.use("/student-therapist", studentRouter);

const PORT = process.env.PORT || 4224;

app.listen(PORT, () => {
  console.log(`Server listening to PORT ${PORT}`);
});

connectToDatabase();
