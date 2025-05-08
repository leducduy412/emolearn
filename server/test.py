import cv2
from datetime import datetime, timedelta
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Load model và cascade
model_best = load_model('face_model.h5')
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
class_names = ['Angry', 'Disgusted', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
emotion_counter = {emotion: 0 for emotion in class_names}
emotional_state = "neutral"

cap = cv2.VideoCapture(0)
start_time = datetime.now()
attention_time = timedelta(0)

def generate_frames():
    global attention_time, emotional_state

    print("🔴 generate_frames started")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Không đọc được frame từ camera")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        print(f"[INFO] Detected {len(faces)} face(s)")

        for (x, y, w, h) in faces:
            face_roi = frame[y:y + h, x:x + w]
            face_image = cv2.resize(face_roi, (48, 48))
            face_image = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
            face_image = image.img_to_array(face_image)
            face_image = np.expand_dims(face_image, axis=0)
            face_image = np.vstack([face_image])

            predictions = model_best.predict(face_image)
            emotion_label = class_names[np.argmax(predictions)]
            emotional_state = emotion_label
            emotion_counter[emotion_label] += 1

            print(f"[EMOTION] {emotion_label} - count: {emotion_counter[emotion_label]}")
            cv2.putText(frame, emotion_label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

        cv2.imshow("Test Emotion Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("🛑 Thoát khỏi generate_frames")
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    generate_frames()
