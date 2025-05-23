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

@app.route('/tasks/<string:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        tasks = load_tasks_from_file(TASKS_FILE)  # Load fresh data
    except FileNotFoundError:
        return jsonify({"error": "No tasks found"}), 404

    data = request.json

    def find_and_update_task(task_list, task_id, new_name, new_date):
        for task in task_list:
            if task.id == task_id:
                if new_name:
                    task.task_name = new_name
                if new_date:
                    task.date = new_date
                return task
            updated_task = find_and_update_task(task.children, task_id, new_name, new_date)
            if updated_task:
                return updated_task
        return None

    updated_task = find_and_update_task(tasks, task_id, data.get('task_name'), data.get('date'))
    if updated_task:
        save_tasks_to_file(tasks, TASKS_FILE)  # Save updated tasks to file
        return jsonify(updated_task.to_dict())
    return jsonify({"error": "Task not found"}), 404

@app.route('/tasks/<string:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        tasks = load_tasks_from_file(TASKS_FILE)  # Load fresh data
    except FileNotFoundError:
        return jsonify({"error": "No tasks found"}), 404

    def find_and_delete_task(task_list, task_id):
        for task in task_list:
            if task.id == task_id:
                task_list.remove(task)  # Remove only the selected task
                return True
            if find_and_delete_task(task.children, task_id):  # Recursively check children
                return True
        return False

    if find_and_delete_task(tasks, task_id):
        save_tasks_to_file(tasks, TASKS_FILE)  # Save updated tasks to file
        return jsonify({"message": "Task deleted"})
    return jsonify({"error": "Task not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)