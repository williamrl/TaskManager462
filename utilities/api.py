from flask import Flask, jsonify
from utilities.db import SessionLocal, Task
import sys
import os

# Add the project root to PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from tree_graph.task_tree import build_task_tree

app = Flask(__name__)

@app.route("/tasks", methods=["GET"])
def get_tasks():
    session = SessionLocal()
    tasks = session.query(Task).all()
    session.close()

    task_list = [{"id": task.id, "name": task.name, "date": task.date, "parent_id": task.parent_id} for task in tasks]
    return jsonify(task_list)

@app.route("/task_tree", methods=["GET"])
def get_task_tree():
    root = build_task_tree()

    def serialize(node):
        return {
            "id": node.id,
            "name": node.name,
            "priority": node.priority,
            "children": [serialize(child) for child in node.children]
        }

    return jsonify(serialize(root))

if __name__ == "__main__":
    app.run(debug=True)