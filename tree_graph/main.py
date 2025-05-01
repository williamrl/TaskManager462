from flask import Flask, request, jsonify
from flask_cors import CORS
from task_tree import TaskNode
from task_graph import TaskGraph
from task_tree import build_task_tree

app = Flask(__name__)
CORS(app)  # Allow React frontend to talk to backend

# -----------------------------
# Sample in-memory task data
# -----------------------------
root = TaskNode("Project Alpha", 1)
design = TaskNode("Design Phase", 2)
development = TaskNode("Development Phase", 3)
testing = TaskNode("Testing Phase", 4)

root.add_subtask(design)
root.add_subtask(development)
root.add_subtask(testing)

design.add_subtask(TaskNode("UI Mockups", 1))
design.add_subtask(TaskNode("UX Research", 2))
development.add_subtask(TaskNode("Backend API", 1))
development.add_subtask(TaskNode("Frontend UI", 2))

graph = TaskGraph()
graph.add_dependency("Design Phase", "Development Phase")
graph.add_dependency("Development Phase", "Testing Phase")
graph.add_dependency("UI Mockups", "Frontend UI")
graph.add_dependency("UX Research", "Frontend UI")
graph.add_dependency("Backend API", "Testing Phase")
graph.add_dependency("Frontend UI", "Testing Phase")

# -----------------------------
# Helper to serialize tree
# -----------------------------
def serialize_node(node):
    return {
        "title": node.name,
        "priority": node.priority,
        "children": [serialize_node(child) for child in node.children]
    }

# -----------------------------
# Routes
# -----------------------------

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify(serialize_node(root))

@app.route("/api/tasks/toposort", methods=["GET"])
def get_topological_order():
    order = graph.topological_sort()
    return jsonify(order)

@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.json
    title = data.get("title")
    priority = data.get("priority", 1)
    parent = data.get("parent", "Project Alpha")

    # Find parent node and insert
    def find_and_add(node):
        if node.name == parent:
            node.add_subtask(TaskNode(title, priority))
            return True
        for child in node.children:
            if find_and_add(child):
                return True
        return False

    success = find_and_add(root)
    if success:
        return jsonify({"message": "Task added"}), 201
    else:
        return jsonify({"error": "Parent not found"}), 404

# -----------------------------
# Run server
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)
