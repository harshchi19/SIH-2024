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
// import visualizationRouter from "./routes/visualizations.route.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: true, //"http://10.0.2.2:4224", // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

// Add headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// Routes
app.use("/sidebar", sidebarRouter);
app.use("/patient", patientRouter);
app.use("/auth", userRouter);
app.use("/student-therapist", studentRouter);
app.use("/pre_therapy", preTherapyRouter);
app.use("/supervisor", supervisorRouter);
app.use("/contacts", contactRoutes);
app.use("/calendar", calendarRouter);
// app.use("/visualization", visualizationRouter); 

const PORT = process.env.PORT || 4224;

const server = app.listen(PORT, () => {
  console.log(`Server listening to PORT ${PORT}`);
  setupSocket(server);
});

connectToDatabase();