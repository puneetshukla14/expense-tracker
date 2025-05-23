from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def ocr():
    # Just a placeholder example: you can get the uploaded file like this:
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    
    # For now, just respond with dummy data
    return jsonify({
        'description': 'Dummy Description',
        'amount': '100.00',
        'date': '2025-05-20'
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
