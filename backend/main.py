import os
import io
import base64
import numpy as np
from PIL import Image
import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI(title="Micro Lens AI - YOLOv12 Backend")

# Enable CORS so the React frontend can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, allow all. In production, change to frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model once at startup for performance
MODEL_PATH = os.path.join(os.path.dirname(__file__), "weights", "best.pt")

try:
    if os.path.exists(MODEL_PATH):
        model = YOLO(MODEL_PATH)
        print(f"Successfully loaded model from {MODEL_PATH}")
    else:
        model = None
        print(f"WARNING: Model file not found at {MODEL_PATH}. Prediction will fail until added.")
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

@app.get("/")
def read_root():
    return {"message": "Micro Lens AI YOLO Backend is running. Send POST requests to /predict"}

@app.get("/health")
def health_check():
    """Used by the frontend to verify the backend is live before upload."""
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=500, detail="Model is not loaded. Please ensure best.pt is in the weights directory.")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        # Read the image file into a NumPy array for OpenCV/YOLO
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        img_array = np.array(image)
        
        # YOLO typically expects BGR for OpenCV processing
        img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

        # Run inference
        results = model(img_bgr)
        
        # Parse the results
        result = results[0]
        
        # Generate the annotated image (with bounding boxes)
        annotated_img_bgr = result.plot()
        annotated_img_rgb = cv2.cvtColor(annotated_img_bgr, cv2.COLOR_BGR2RGB)
        
        # Convert annotated image to Base64
        annotated_pil = Image.fromarray(annotated_img_rgb)
        buffered = io.BytesIO()
        annotated_pil.save(buffered, format="JPEG")
        annotated_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

        # Extract detection details and particle counts
        detections = []
        particle_counts = {
            "fiber": 0,
            "film": 0,
            "fragment": 0,
            "pallet": 0
        }
        
        total_particles = len(result.boxes)
        
        for box in result.boxes:
            class_id = int(box.cls[0].item())
            class_name = model.names[class_id].lower()
            confidence = float(box.conf[0].item())
            
            # [x_center, y_center, width, height]
            xywh = box.xywhn[0].tolist() 
            
            detections.append({
                "class": class_name,
                "confidence": confidence,
                "bbox": xywh
            })
            
            # Update counts (fuzzy match for class names just in case)
            if "fiber" in class_name:
                particle_counts["fiber"] += 1
            elif "film" in class_name:
                particle_counts["film"] += 1
            elif "fragment" in class_name:
                particle_counts["fragment"] += 1
            elif "pallet" in class_name:
                particle_counts["pallet"] += 1

        # Calculate a more meaningful severity score (0-100).
        # Uses weighted average confidence + particle count penalty.
        # 0 particles = 0 severity. Scales logarithmically up to 100.
        if total_particles == 0:
            severity = 0
        else:
            avg_confidence = sum(d["confidence"] for d in detections) / total_particles
            # Scale: ln(particles+1)/ln(101) gives 0..1 for 0..100 particles
            import math
            particle_factor = math.log(total_particles + 1) / math.log(101)
            severity = int(round(particle_factor * avg_confidence * 100))
            severity = min(100, max(1, severity))

        return {
            "success": True,
            "total_particles": total_particles,
            "particle_counts": particle_counts,
            "severity": severity,
            "detections": detections,
            "annotated_image_base64": f"data:image/jpeg;base64,{annotated_b64}"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
