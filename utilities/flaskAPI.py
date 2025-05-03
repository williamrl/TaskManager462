from flask import Flask, request, jsonify
import sys
import os
sys.path.append('/Users/avikbhuiyan/Desktop/projects/TaskManagerRepo/TaskManager462')
from tree_graph.taskClass import Task, save_tasks_to_file, load_tasks_from_file

app = Flask(__name__)
from flask_cors import CORS
CORS(app)  # Add this line after creating the Flask app

# File to store tasks
TASKS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../tasks.json")

@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        tasks = load_tasks_from_file(TASKS_FILE)  # Always load fresh data
    except FileNotFoundError:
        tasks = []
    return jsonify([task.to_dict() for task in tasks])

@app.route('/add_task', methods=['POST'])
def add_task():
    try:
        tasks = load_tasks_from_file(TASKS_FILE)  # Load fresh data
    except FileNotFoundError:
        tasks = []

    data = request.json
    new_task = Task(data['task_name'], data['date'], data.get('parent'))

    def find_task_recursively(task_list, parent_id):
        for task in task_list:
            if task.id == parent_id:
                return task
            found = find_task_recursively(task.children, parent_id)
            if found:
                return found
        return None

    if new_task.parent:
        parent_task = find_task_recursively(tasks, new_task.parent)
        if parent_task:
            parent_task.add_subtask(new_task)
        else:
            return jsonify({"error": "Parent task not found"}), 404
    else:
        tasks.append(new_task)

    save_tasks_to_file(tasks, TASKS_FILE)  # Save updated tasks to file
    return jsonify(new_task.to_dict()), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        tasks = load_tasks_from_file(TASKS_FILE)  # Load fresh data
    except FileNotFoundError:
        return jsonify({"error": "No tasks found"}), 404

    data = request.json
    for task in tasks:
        if task.find_by_id(task_id):
            task.update_task(task_id, data.get('task_name'), data.get('date'))
            save_tasks_to_file(tasks, TASKS_FILE)  # Save updated tasks to file
            return jsonify(task.to_dict())
    return jsonify({"error": "Task not found"}), 404

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        tasks = load_tasks_from_file(TASKS_FILE)  # Load fresh data
    except FileNotFoundError:
        return jsonify({"error": "No tasks found"}), 404

    for task in tasks:
        if task.find_by_id(task_id):
            task.delete_task(task_id)
            tasks = [task for task in tasks if task.id != task_id]
            save_tasks_to_file(tasks, TASKS_FILE)  # Save updated tasks to file
            return jsonify({"message": "Task deleted"})
    return jsonify({"error": "Task not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)