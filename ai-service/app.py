from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/embed", methods=["POST"])
def embed():
    data = request.json
    text = data.get("text")


     #Dummy embedding (temporary)
    embedding = [0.1, 0.2, 0.3]

    return jsonify({"embedding": embedding})

if __name__ == "__main__":
    app.run(port=5001)