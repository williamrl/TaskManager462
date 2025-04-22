from flask import Flask, request, jsonify
from flask_cors import CORS
from db import SessionLocal, Task

app = Flask(__name__)
CORS(app)

# Route to get all tasks grouped by day
@app.route("/tasks", methods=["GET"])
def get_tasks():
    session = SessionLocal()
    tasks = session.query(Task).all()
    session.close()

    grouped = {}
    for task in tasks:
        # Convert date to a string like '2025-04-19'
        date_str = task.date.strftime("%Y-%m-%d")
        grouped.setdefault(date_str, []).append(task.name)

    return jsonify(grouped)

# Route to add a new task
@app.route("/add_task", methods=["POST"])
def add_task():
    data = request.json
    session = SessionLocal()
    new_task = Task(name=data["name"], date=data["date"])
    session.add(new_task)
    session.commit()
    session.close()
    return jsonify({"message": "Task added!"})


# Route to delete a task
@app.route("/delete_task", methods=["DELETE"])
def delete_task():
    data = request.json
    session = SessionLocal()
    task = session.query(Task).filter(Task.id == data["id"]).first()
    if task:
        session.delete(task)
        session.commit()
        message = "Task deleted!"
    else:
        message = "Task not found!"
    session.close()
    return jsonify({"message": message})

# Route to update a task
@app.route("/update_task", methods=["PUT"])
def update_task():
    data = request.json
    session = SessionLocal()
    task = session.query(Task).filter(Task.id == data["id"]).first()
    if task:
        task.name = data["name"]
        task.date = data["date"]
        session.commit()
        message = "Task updated!"
    else:
        message = "Task not found!"
    session.close()
    return jsonify({"message": message})

if __name__ == "__main__":
    app.run(debug=True)
