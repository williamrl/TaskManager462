import sys
import os

# Add the project root to PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, request, jsonify
from utilities.db import SessionLocal, Task
from flask_cors import CORS
from tree_graph.task_tree import build_task_tree

app = Flask(__name__)
CORS(app)

# Get all tasks, grouped by date
@app.route("/tasks", methods=["GET"])
def get_tasks():
    session = SessionLocal()
    tasks = session.query(Task).all()
    session.close()

    grouped = {}
    for task in tasks:
        date_str = task.date.strftime("%Y-%m-%d")  # format date
        grouped.setdefault(date_str, []).append({
            "id": task.id,
            "task_name": task.task_name,
            "parent_task_id": task.parent_task_id
        })

    return jsonify(grouped)

# Route to add a new task
@app.route("/add_task", methods=["POST"])
def add_task():
    data = request.json
    session = SessionLocal()
    new_task = Task(
        task_name=data["task_name"],
        date=data["date"],
        parent_task_id=data.get("parent_task_id")  # optional for subtasks
    )
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
        task.task_name = data["task_name"]
        task.date = data["date"]
        task.parent_task_id = data.get("parent_task_id")  # Optional update
        session.commit()
        message = "Task updated!"
    else:
        message = "Task not found!"
    session.close()
    return jsonify({"message": message})

if __name__ == "__main__":
    app.run(debug=True)
