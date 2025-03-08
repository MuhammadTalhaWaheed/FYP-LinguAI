from flask import Flask, request, jsonify
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import numpy as np
from firebase_admin import firestore,credentials, initialize_app
import firebase_admin
app = Flask(__name__)

# Initialize Firestore
cred = credentials.Certificate("C:/Users/texon/Downloads/firebase-credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load model and tokenizer
model = AutoModelForSequenceClassification.from_pretrained("Kevintu/Engessay_grading_ML")
tokenizer = AutoTokenizer.from_pretrained("KevSun/Engessay_grading_ML")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    transcription = data['transcription']
    user_id = data.get('user_id')
    question_number = data.get('question_number')
    fluency_score = data.get('fluency')  # Get the fluency score from the request

    # Tokenize and predict
    encoded_input = tokenizer(transcription, return_tensors='pt', padding=True, truncation=True, max_length=64)
    model.eval()
    with torch.no_grad():
        outputs = model(**encoded_input)
    predictions = outputs.logits.squeeze()
    predicted_scores = predictions.numpy()

    # Scale predictions to [1, 5] range
    scaled_scores = 1 + 4 * (predicted_scores - np.min(predicted_scores)) / (np.max(predicted_scores) - np.min(predicted_scores))
    rounded_scores = np.round(scaled_scores * 2) / 2

    # Add scores to result
    item_names = ["cohesion", "syntax", "vocabulary", "phraseology", "grammar", "conventions"]
    result = {item: round(float(score), 1) for item, score in zip(item_names, rounded_scores)}
    if fluency_score is not None:
        result["fluency"] = round(float(fluency_score), 2)  # Add fluency score with two decimal places

    # Save the result to Firestore with dynamic question number
    if user_id and question_number:
        db.collection('user_answers').document(user_id).set({
            f'answer{question_number}': {
                'transcription': transcription,
                'scores': result
            }
        }, merge=True)
        print(f"Scores for question {question_number} saved for user {user_id}")
    else:
        print("No user ID or question number provided")

    return jsonify(result)

@app.route('/calculate_average_scores', methods=['POST'])
def calculate_average_scores():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    try:
        # Fetching user data
        user_data = db.collection('user_answers').document(user_id).get().to_dict()

        if not user_data:
            return jsonify({"error": "User data not found"}), 404
        
        # Calculate averages from the scores
        total_scores = {"fluency": 0, "grammar": 0, "vocabulary": 0, "cohesion": 0}
        num_answers = 0

        for answer_key, answer in user_data.items():
            if 'scores' in answer:
                scores = answer['scores']
                total_scores["fluency"] += scores.get("fluency", 0)
                total_scores["grammar"] += scores.get("grammar", 0)
                total_scores["vocabulary"] += scores.get("vocabulary", 0)
                total_scores["cohesion"] += scores.get("cohesion", 0)
                num_answers += 1

        if num_answers == 0:
            return jsonify({"error": "No valid answers found for user"}), 404

        # Calculate averages
        averages = {
            "fluency": total_scores["fluency"] / 3,
            "grammar": total_scores["grammar"] / num_answers,
            "vocabulary": total_scores["vocabulary"] / num_answers,
            "cohesion": total_scores["cohesion"] / num_answers
        }

        # Send average scores to the frontend
        return jsonify({"averages": averages}), 200
    except Exception as e:
        return jsonify({"error": f"Error processing data: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='172.16.73.172', port=5000, debug=True)
