# VaaniVikas - Speech Therapy Management System

<div align="center">

![VaaniVikas](https://img.shields.io/badge/VaaniVikas-Speech%20Therapy-blue?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![SIH 2024](https://img.shields.io/badge/SIH-2024-orange?style=for-the-badge)](https://www.sih.gov.in/)

**A comprehensive digital platform for speech therapy management developed for Ali Javar Yung Institute**

[Features](#-key-features) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

VaaniVikas is an innovative speech therapy management system built for Smart India Hackathon 2024. The platform digitizes and streamlines the entire speech therapy workflow, from patient onboarding to treatment planning and progress tracking.

### 🎯 Problem Statement

Traditional speech therapy centers face challenges with:
- Manual patient-therapist allocation
- Physical case file management
- Time-consuming documentation processes
- Difficulty in tracking patient progress
- Limited accessibility for remote consultations

### 💡 Our Solution

VaaniVikas addresses these challenges by providing:
- **Smart AI-powered patient-therapist matching** based on expertise and availability
- **Digital case file management** with OCR capabilities for converting physical files
- **Automated report generation** for therapy sessions
- **Interactive AI assistant (Vani.AI)** for therapy guidance and support
- **Multi-platform accessibility** (Web, Mobile, and Desktop)
- **Real-time communication** between patients, therapists, and supervisors

---

## ✨ Key Features

### 👥 For Patients
- 📱 **Mobile & Web App Access** - Easy onboarding and profile management
- 📅 **Appointment Scheduling** - View and manage therapy sessions
- 📊 **Progress Tracking** - Visual representation of therapy progress
- 💬 **AI Chatbot Support** - 24/7 assistance with Vani.AI
- 🎤 **Speech-to-Text Integration** - Practice exercises with real-time feedback
- 📄 **Digital Case Files** - Access medical history and treatment plans

### 👨‍⚕️ For Therapists
- 🔍 **Smart Patient Allocation** - AI-based matching with patient needs
- 📝 **Session Report Generation** - Automated documentation tools
- 📈 **Analytics Dashboard** - Track patient outcomes and progress
- 🗓️ **Calendar Management** - Organize appointments and schedules
- 🎯 **Custom Treatment Plans** - Create personalized therapy programs
- 📚 **Resource Library** - Access to educational materials and exercises

### 👔 For Supervisors
- ✅ **Report Approval System** - Review and approve therapy reports
- 📊 **Institution Analytics** - Monitor overall performance metrics
- 👥 **Staff Management** - Oversee therapist assignments and workload
- 📋 **Quality Assurance** - Ensure treatment standards and compliance

### 🤖 AI-Powered Features
- **Vani.AI Chatbot** - Intelligent speech therapy assistant
- **OCR Document Processing** - Convert physical files to digital format
- **Matchmaking Algorithm** - Optimal patient-therapist pairing using cosine similarity
- **Text-to-Speech** - Generate audio for therapy exercises
- **Content Recommendations** - Relevant YouTube videos and articles for therapy topics

---

## 🏗️ Technology Stack

### Frontend
| Component | Technologies |
|-----------|-------------|
| **Web Application** | Next.js 15, React 19, TailwindCSS, Radix UI, Socket.io Client |
| **Mobile Application** | Flutter 3.4+, GetX, Socket.io Client, Flutter TTS |
| **3D Visualization** | Three.js, React Three Fiber |
| **UI Libraries** | Syncfusion Charts, Recharts, Lucide Icons |

### Backend
| Component | Technologies |
|-----------|-------------|
| **API Server** | Node.js, Express.js, Socket.io |
| **ML/AI Server** | Python, FastAPI, Uvicorn |
| **Database** | MongoDB (NoSQL), PostgreSQL (SQL) |
| **Authentication** | JWT, Cookie-based sessions |
| **File Storage** | Azure Blob Storage, Multer |

### AI/ML Services
| Service | Technologies |
|---------|-------------|
| **LLM Integration** | Groq API, OpenAI API |
| **OCR** | PyMuPDF, Computer Vision |
| **Speech Processing** | Edge-TTS, Speech Recognition, Google TTS |
| **Matchmaking** | Scikit-learn, Cosine Similarity |
| **Data Processing** | Pandas, NumPy, NLP Libraries |

### DevOps & Tools
- **Version Control**: Git, GitHub
- **Deployment**: Vercel (Frontend), Cloud Hosting (Backend)
- **API Testing**: REST APIs
- **Package Managers**: npm/yarn (Node.js), pip (Python), pub (Flutter)

---

## 📁 Project Structure

```
SIH-2024/
├── frontend/
│   ├── client/              # Next.js Web Application
│   │   ├── app/             # Next.js 15 App Router
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries
│   │   └── utils/           # Helper functions
│   │
│   └── flutter/             # Flutter Mobile Application
│       ├── lib/             # Dart source code
│       ├── assets/          # Images, animations, icons
│       ├── android/         # Android platform files
│       └── ios/             # iOS platform files
│
├── backend/
│   ├── server/              # Node.js Express API Server
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middlewares/     # Authentication, validation
│   │   ├── database/        # Database configuration
│   │   └── socket.js        # WebSocket implementation
│   │
│   └── models-server/       # Python FastAPI ML Server
│       ├── services/        # AI/ML services
│       │   ├── ocr.py      # Document processing
│       │   ├── vaniai.py   # AI chatbot
│       │   ├── matchmaking.py # Patient-therapist matching
│       │   └── blogs_yt.py # Content recommendations
│       ├── knowledge_base/  # AI training data
│       └── main.py         # FastAPI application
│
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher) & npm/yarn
- **Python** (v3.9 or higher) & pip
- **Flutter** (v3.4 or higher) & Dart SDK
- **MongoDB** (local or cloud instance)
- **PostgreSQL** (v12 or higher)
- **Git**

### Environment Variables

#### Backend Server (.env)
```env
# Node.js Server
PORT=5000
MONGODB_URI=your_mongodb_connection_string
POSTGRES_URI=your_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string
AZURE_STORAGE_CONTAINER_NAME=your_container_name
```

#### ML Server (.env)
```env
# Python FastAPI Server
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string
```

#### Frontend (.env.local)
```env
# Next.js Client
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 💻 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/harshchi19/SIH-2024.git
cd SIH-2024
```

### 2️⃣ Backend Setup

#### Node.js API Server
```bash
cd backend/server
npm install
# or
yarn install

# Create .env file with required variables
# Start the development server
npm run server
# Server runs on http://localhost:5000
```

#### Python ML Server
```bash
cd backend/models-server
pip install -r requirements.txt

# Create .env file with required API keys
# Start the FastAPI server
uvicorn main:app --reload --port 8000
# Server runs on http://localhost:8000
```

### 3️⃣ Frontend Setup

#### Next.js Web Application
```bash
cd frontend/client
npm install
# or
yarn install

# Create .env.local file with required variables
# Start the development server
npm run dev
# Application runs on http://localhost:3000
```

#### Flutter Mobile Application
```bash
cd frontend/flutter
flutter pub get

# Run on Android
flutter run

# Run on iOS
flutter run

# Build for production
flutter build apk        # Android
flutter build ios        # iOS
```

---

## 🎮 Usage

### For Patients

1. **Sign Up**: Download the mobile app or visit the web portal
2. **Profile Setup**: Complete your medical history and speech concerns
3. **Get Matched**: AI assigns you to the best-suited therapist
4. **Book Session**: Schedule your therapy appointments
5. **Attend Therapy**: Join virtual or in-person sessions
6. **Track Progress**: Monitor your improvement through dashboards

### For Therapists

1. **Login**: Access the therapist portal
2. **View Patients**: See assigned patients and their profiles
3. **Schedule Sessions**: Manage your calendar
4. **Conduct Therapy**: Use integrated tools during sessions
5. **Generate Reports**: Auto-create session documentation
6. **Monitor Progress**: Track patient outcomes

### For Supervisors

1. **Dashboard Access**: View institution-wide analytics
2. **Approve Reports**: Review and approve therapy session reports
3. **Manage Staff**: Oversee therapist assignments and performance
4. **Quality Control**: Ensure treatment standards

---

## 📚 API Documentation

### Node.js Backend APIs

#### Authentication
```
POST /api/auth/register       # Register new user
POST /api/auth/login          # User login
POST /api/auth/logout         # User logout
GET  /api/auth/verify         # Verify JWT token
```

#### Patients
```
GET    /api/patients          # Get all patients
GET    /api/patients/:id      # Get patient by ID
POST   /api/patients          # Create new patient
PUT    /api/patients/:id      # Update patient
DELETE /api/patients/:id      # Delete patient
```

#### Therapists
```
GET    /api/therapists        # Get all therapists
GET    /api/therapists/:id    # Get therapist by ID
POST   /api/therapists        # Create new therapist
PUT    /api/therapists/:id    # Update therapist
```

#### Sessions
```
GET    /api/sessions          # Get all sessions
POST   /api/sessions          # Create new session
PUT    /api/sessions/:id      # Update session
GET    /api/sessions/patient/:id  # Get patient sessions
```

### Python ML Server APIs

#### OCR & Document Processing
```
POST /pre-therapy-report      # Extract data from medical reports
```

#### AI Chatbot
```
POST /vani-ai/chat           # Chat with Vani.AI assistant
POST /vani-ai/speech-to-text # Convert speech to text
POST /vani-ai/text-to-speech # Convert text to speech
```

#### Matchmaking
```
POST /matchmaking            # Match patient with therapist
```

#### Content Recommendations
```
GET /recommendations/videos  # Get YouTube therapy videos
GET /recommendations/articles # Get therapy articles
```

---

## 🧪 Testing

### Backend Tests
```bash
# Node.js Server
cd backend/server
npm test

# Python ML Server
cd backend/models-server
pytest
```

### Frontend Tests
```bash
# Next.js
cd frontend/client
npm run test

# Flutter
cd frontend/flutter
flutter test
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ Secure file upload handling
- ✅ Environment variable management
- ✅ Azure Blob Storage for secure file storage
- ✅ Role-based access control (RBAC)

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend/client
vercel deploy --prod
```

### Backend (Cloud Service)
- Configure your cloud provider (AWS, GCP, Azure, DigitalOcean)
- Set up environment variables
- Deploy using Docker or PM2
- Configure reverse proxy (Nginx)

### Mobile App
- **Android**: Build APK and upload to Google Play Store
- **iOS**: Build IPA and upload to Apple App Store

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Code Style Guidelines
- **JavaScript/React**: Follow ESLint configuration
- **Python**: Follow PEP 8 style guide
- **Flutter/Dart**: Follow official Dart style guide
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Developed with ❤️ for Smart India Hackathon 2024

### Contributors
- **Project Lead**: [Add Name]
- **Full Stack Developers**: [Add Names]
- **Mobile Developers**: [Add Names]
- **AI/ML Engineers**: [Add Names]
- **UI/UX Designers**: [Add Names]

---

## 🙏 Acknowledgements

- **Ali Javar Yung Institute** for the problem statement and guidance
- **Smart India Hackathon 2024** for the opportunity
- **Open Source Community** for amazing tools and libraries
- **Mentors and Advisors** for their valuable feedback

---

## 📞 Contact & Support

- **Repository**: [GitHub](https://github.com/harshchi19/SIH-2024)
- **Issues**: [Report Bug](https://github.com/harshchi19/SIH-2024/issues)
- **Discussions**: [Feature Requests](https://github.com/harshchi19/SIH-2024/discussions)

---

## 🗺️ Roadmap

### Phase 1 (Completed) ✅
- [x] Core platform development
- [x] AI chatbot integration
- [x] Patient-therapist matchmaking
- [x] Digital case file management
- [x] Mobile and web applications

### Phase 2 (In Progress) 🚧
- [ ] Advanced analytics dashboard
- [ ] Video consultation integration
- [ ] Mobile app enhancements
- [ ] Performance optimization

### Phase 3 (Planned) 📋
- [ ] Multi-language support
- [ ] Offline mode for mobile app
- [ ] Advanced AI therapy exercises
- [ ] Integration with medical devices
- [ ] Telemedicine platform expansion

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with 💙 for improving speech therapy accessibility

</div>
