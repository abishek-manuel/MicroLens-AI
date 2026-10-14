# 🔬 MICRO LENS AI

> **An intelligent computer vision platform for automated microplastic detection, classification, and environmental pollution monitoring.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![YOLO](https://img.shields.io/badge/YOLO-v12-FF6B35?logo=ultralytics&logoColor=white)](https://docs.ultralytics.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Cloud-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://python.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Made in India](https://img.shields.io/badge/Made%20in-India%20🇮🇳-FF9933)](https://en.wikipedia.org/wiki/India)

---

## 📖 About This Project

Namaste! 🙏 Welcome to **MICRO LENS AI** — a final year college project built with full passion and lots of chai ☕.

**MICRO LENS AI** is a full-stack web application that uses deep learning to automate the detection and classification of microplastic particles from microscopic imagery. Microplastic pollution is a growing environmental crisis in India and across the world — our rivers like the Ganga and Yamuna, coastal areas, and soil are increasingly contaminated. What traditionally takes hours of manual laboratory work is now reduced to sub-second AI inference.

The system uses a **fine-tuned YOLOv12 object detection model** to identify and classify microplastic particles into four morphological categories: **fibers, films, fragments, and pellets**. Each analysis produces annotated imagery, a quantitative pollution severity score (0–100), and detailed breakdowns stored persistently in the cloud.

> 💡 This project was built to contribute towards **environmental awareness and digital India's push for AI-driven solutions** in the field of environmental science.

---

## ✨ Features

### 🤖 AI-Powered Detection
- Fine-tuned **YOLOv12** model for high-accuracy microplastic particle identification
- Classifies particles into **4 morphology classes**: Fibers, Films, Fragments, and Pellets
- Real-time bounding box annotation overlaid on the original sample image
- Per-detection **confidence scoring** for each identified particle

### 📊 Pollution Severity Scoring
- Custom logarithmic severity algorithm (0–100 scale)
- Combines particle density and weighted average detection confidence
- Severity levels: **Low (0–25) → Moderate (26–50) → High (51–75) → Critical (76–100)**

### 🖼️ Sample Management
- **Drag-and-drop** image upload with live preview
- Attach metadata: sample **location**, **collection date**, and **sample type** (water, soil, etc.)
- Both original and AI-annotated images stored in **Firebase Cloud Storage**

### 📈 Analytics Dashboard
- Real-time stats: total samples, particles detected, average severity, monthly uploads
- **Pollution trend line chart** — severity scores over time
- **Particle breakdown bar chart** — distribution across morphology types
- Recent activity feed with severity badges

### 🗂️ Sample History
- Full browsable history of all past sample analyses
- Filter, sort, and review previous detections
- Per-sample detail view with annotated image comparison

### 📄 Automated PDF Reports
- One-click generation of audit-ready PDF laboratory reports
- Includes pollution trend charts, particle breakdowns, and severity summaries
- Built using **jsPDF** + **html2canvas**

### 🛡️ Secure Admin Panel
- Role-based admin dashboard for platform management
- User management: view profiles, activity history, associated reports
- Ability to remove users and all their associated data

### 🔐 Authentication & Authorization
- **Firebase Authentication** with email/password login
- Protected routes — all dashboard pages require valid authentication
- JWT token management with automatic session handling

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (User)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────▼───────────────┐
           │     React 19 Frontend (Vite)   │
           │  Tailwind CSS + Framer Motion  │
           │  React Router + Recharts       │
           └───┬───────────────────────┬───┘
               │                       │
   ┌───────────▼──────────┐  ┌────────▼────────────────┐
   │  FastAPI Backend     │  │  Firebase Cloud Services  │
   │  (Python + Uvicorn)  │  │  - Authentication         │
   │                      │  │  - Firestore (NoSQL DB)   │
   │  ┌────────────────┐  │  │  - Cloud Storage          │
   │  │  YOLOv12 Model │  │  └──────────────────────────┘
   │  │  (best.pt)     │  │
   │  └────────────────┘  │
   │  OpenCV + NumPy      │
   │  Pillow + Base64     │
   └──────────────────────┘
```

### Data Flow (Step by Step)

1. User uploads a microscopic sample image with metadata (location, date, type)
2. Image is POSTed to the **FastAPI backend** `/predict` endpoint
3. Backend preprocesses the image (RGB→BGR via OpenCV) and runs **YOLO inference**
4. Results include bounding boxes, class labels, confidence scores, and the annotated image
5. A **severity score** is computed from particle count and confidence weighting
6. Both original and annotated images are uploaded to **Firebase Storage**
7. Analysis metadata + detections are saved to **Cloud Firestore**
8. The React frontend renders the full analysis result with charts and annotations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion | Animations & page transitions |
| React Router v7 | Client-side routing |
| Recharts | Data visualization (charts) |
| Lucide React | Icon library |
| Axios | HTTP client |
| jsPDF + html2canvas | PDF report generation |
| react-hot-toast | Notification toasts |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.9+ | Main programming language |
| FastAPI | Async REST API framework |
| Uvicorn | ASGI server |
| Ultralytics (YOLO) | Object detection model inference |
| OpenCV (headless) | Image preprocessing & color conversion |
| NumPy | Numerical array operations |
| Pillow | Image I/O and format handling |

### Cloud & Infrastructure
| Technology | Purpose |
|---|---|
| Firebase Authentication | User login & session management |
| Cloud Firestore | NoSQL database for sample & report metadata |
| Firebase Cloud Storage | Image storage (original + annotated) |

---

## 📁 Project Structure

```
micro-lens-ai/
├── backend/
│   ├── main.py               # FastAPI app: /predict, /health endpoints
│   ├── requirements.txt      # Python dependencies
│   └── weights/
│       └── best.pt           # YOLOv12 trained weights — add this file manually!
│
├── src/
│   ├── pages/
│   │   ├── Landing.jsx       # Public landing/marketing page
│   │   ├── Login.jsx         # Firebase authentication page
│   │   ├── About.jsx         # Project mission & tech overview
│   │   ├── Dashboard.jsx     # Analytics overview dashboard
│   │   ├── Upload.jsx        # Sample upload & submission form
│   │   ├── AnalysisResult.jsx# Detailed per-sample result viewer
│   │   ├── History.jsx       # Sample history browser
│   │   ├── Reports.jsx       # PDF report generation & trends
│   │   └── Admin.jsx         # Admin user management panel
│   │
│   ├── components/
│   │   ├── layout/           # Navbar, Sidebar, Footer, ProtectedRoute
│   │   ├── charts/           # PollutionLineChart, DetectionBarChart, ParticlePieChart
│   │   └── ui/               # StatCard, Badge, Skeleton, Particles (WebGL)
│   │
│   ├── services/
│   │   ├── firebase.js       # Firebase app initialization
│   │   ├── authService.js    # Login, logout, user management
│   │   ├── sampleService.js  # Upload, predict, fetch, delete samples
│   │   ├── dashboardService.js # Stats, trends, activity aggregation
│   │   ├── reportService.js  # Generate & fetch PDF reports
│   │   └── adminService.js   # Admin: user listing, deletion
│   │
│   ├── context/
│   │   └── AuthContext.jsx   # Global auth state (React Context)
│   │
│   ├── hooks/                # Custom React hooks
│   ├── App.jsx               # Root router configuration
│   └── main.jsx              # Application entry point
│
├── public/                   # Static assets
├── .env.example              # Environment variables template — copy this to .env
├── vite.config.js            # Vite + API proxy config
├── tailwind.config.js        # Tailwind design tokens & custom theme
├── run.bat                   # Windows one-click startup script
└── README.md                 # You are here! 😄
```

---

## 🚀 How to Run This Project Locally

> **Note:** Please make sure you have Node.js, Python, and a Firebase project ready before starting. If you get any errors, feel free to raise an issue — I will try to help!

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.9+ (I used Python 3.11 — recommend same)
- A **Firebase project** with Firestore, Storage, and Authentication enabled
- Your trained **YOLOv12 model weights** file (`best.pt`)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/micro-lens-ai.git
cd micro-lens-ai
```

### Step 2 — Setup Environment Variables

Copy the `.env.example` file and add your own Firebase config values:

```bash
cp .env.example .env
```

Open `.env` and fill in the details:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> You can get all these values from your **Firebase Console → Project Settings → General**.

### Step 3 — Add the YOLO Model Weights

Place your `best.pt` model file inside the backend/weights/ folder:

```
backend/weights/best.pt
```

> ⚠️ Without this file, the backend will start but `/predict` will throw a 500 error. Don't forget this step!

### Step 4 — Install Frontend Dependencies

```bash
npm install
```

### Step 5 — Install Backend (Python) Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

> 💡 **Tip:** Use a virtual environment to avoid dependency conflicts:
> ```bash
> python -m venv venv
> venv\Scripts\activate   # Windows
> pip install -r requirements.txt
> ```

### Step 6 — Start the Application

#### Option A: Windows — Just Double-Click or Run:
```bash
run.bat
```
This will automatically open both the frontend and backend in separate terminal windows. Very convenient!

#### Option B: Manual (Two Separate Terminals)

**Terminal 1 — React Frontend:**
```bash
npm run dev
```

**Terminal 2 — FastAPI Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

Once both are running, open your browser and go to:
- 🌐 **Frontend App**: http://localhost:5174
- ⚙️ **Backend API**: http://localhost:8000
- 📚 **Swagger API Docs**: http://localhost:8000/docs *(auto-generated by FastAPI — very useful!)*

---

## 🔌 API Reference

### `GET /`
Returns a confirmation message that the backend is live.

### `GET /health`
Checks if backend is running and whether model is loaded. Response:
```json
{
  "status": "ok",
  "model_loaded": true,
  "model_path": "backend/weights/best.pt"
}
```

### `POST /predict`
Main inference endpoint. Upload an image and get detection results.

**Request:** `multipart/form-data` — field name: `file` (image file)

**Response:**
```json
{
  "success": true,
  "total_particles": 12,
  "particle_counts": {
    "fiber": 4,
    "film": 3,
    "fragment": 4,
    "pallet": 1
  },
  "severity": 67,
  "detections": [
    {
      "class": "fiber",
      "confidence": 0.912,
      "bbox": [0.45, 0.32, 0.08, 0.14]
    }
  ],
  "annotated_image_base64": "data:image/jpeg;base64,..."
}
```

---

## 🧠 Model Details

- **Architecture**: YOLOv12 (via Ultralytics library)
- **Task**: Object detection + multi-class classification
- **Classes**: `fiber`, `film`, `fragment`, `pallet`
- **Input**: Any resolution image (RGB); preprocessed with OpenCV to BGR
- **Output**: Normalized bounding boxes (`xywh`), class labels, confidence scores, annotated image

### Severity Score Formula

A custom severity index is calculated for every prediction:

```
particle_factor = log(N + 1) / log(101)   # Logarithmic scale: 0..100 particles → 0..1
severity        = particle_factor × avg_confidence × 100
severity        = clamp(severity, 1, 100)  # Always at least 1 if particles are found
```

This ensures a logarithmic scale — a small number of high-confidence detections scores proportionally lower than dense contamination, making the metric more realistic and meaningful.

---

## 📸 All Pages at a Glance

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Public marketing & feature overview |
| `/login` | Login | Firebase email/password authentication |
| `/about` | About | Mission, tech stack, project values |
| `/dashboard` | Dashboard | Stats, charts, recent activity feed |
| `/upload` | Upload | Drag-and-drop sample image submission |
| `/analysis/:id` | Analysis Result | Per-sample detection results with annotated image |
| `/history` | History | Browse all previous sample analyses |
| `/reports` | Reports | Generate & download PDF lab reports |
| `/admin` | Admin Panel | User management (admin role only) |

---

## 🐛 Known Issues / To-Do

- [ ] Mobile responsiveness can be improved on some pages
- [ ] Currently no email verification after signup
- [ ] The model works best with high-resolution microscope images
- [ ] Admin role assignment is currently manual via Firebase console

---

## 🤝 Contributing

This is a college project but contributions and suggestions are always welcome! If you find a bug or have a good idea:

1. Fork this repository
2. Create your branch: `git checkout -b feature/cool-feature`
3. Commit your changes: `git commit -m 'Added some cool feature'`
4. Push to your branch: `git push origin feature/cool-feature`
5. Open a Pull Request and I will review it ASAP

---

## 📜 License

This project is open-source under the **MIT License** — feel free to use, modify and learn from it!

---

## 👨‍💻 Author

**Made with ❤️ and lots of ☕ chai in India 🇮🇳**

Built as a Final Year Project (FYP) focused on applying Computer Vision and Deep Learning to real-world environmental problems in India.

> *"Microplastics are invisible to the naked eye — but not to AI."* 🔬

---

## 🙏 Acknowledgements

- [Ultralytics](https://ultralytics.com/) for the amazing YOLO framework
- [FastAPI](https://fastapi.tiangolo.com/) for making Python APIs super easy
- [Firebase](https://firebase.google.com/) for free cloud infrastructure (student-friendly!)
- All the open-source contributors whose libraries made this possible
- My college faculty and friends for their support and feedback 🙌

---

⭐ **If you find this project useful or interesting, please give it a star! It means a lot!** ⭐
