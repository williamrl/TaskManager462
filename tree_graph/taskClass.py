import json
import uuid  # Import the uuid module
from datetime import datetime
from typing import List, Optional

class Task:
    def __init__(self, task_name: str, date: str, parent: Optional[str] = None):
        self.id = str(uuid.uuid4())  # Generate a unique ID as a string
        self.task_name = task_name
        self.date = date  # Expecting ISO format string: 'YYYY-MM-DD'
        self.parent = parent  # Parent task ID or None
        self.children: List['Task'] = []

    def add_subtask(self, subtask: 'Task'):
        subtask.parent = self.id
        self.children.append(subtask)

    def find_by_id(self, task_id: str) -> Optional['Task']:
        if self.id == task_id:
            return self
        for child in self.children:
            result = child.find_by_id(task_id)
            if result:
                return result
        return None

    def update_task(self, task_id: str, new_name: Optional[str] = None, new_date: Optional[str] = None):
        task = self.find_by_id(task_id)
        if task:
            if new_name:
                task.task_name = new_name
            if new_date:
                task.date = new_date

    def delete_task(self, task_id: str):
        self.children = [child for child in self.children if child.id != task_id]
        for child in self.children:
            child.delete_task(task_id)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'task_name': self.task_name,
            'date': self.date,
            'parent': self.parent,
            'children': [child.to_dict() for child in self.children]
        }

    @staticmethod
    def from_dict(data: dict) -> 'Task':
        task = Task(data['task_name'], data['date'], data.get('parent'))
        task.id = data['id']  # Restore the ID from the dictionary
        task.children = [Task.from_dict(child) for child in data.get('children', [])]
        return task

    def __repr__(self):
        return f"Task(id={self.id}, name='{self.task_name}', date='{self.date}', parent={self.parent})"

# ----- Helper functions for persistence -----

def save_tasks_to_file(tasks: List[Task], filename: str):
    with open(filename, 'w') as f:
        json.dump([task.to_dict() for task in tasks], f, indent=2)

def load_tasks_from_file(filename: str) -> List[Task]:
    try:
        with open(filename, 'r') as f:
            data = json.load(f)
            return [Task.from_dict(task_data) for task_data in data]
    except (FileNotFoundError, json.JSONDecodeError):
        # Return an empty list if the file is missing or contains invalid JSON
        return []

# Example usage
if __name__ == "__main__":
    # First root task tree
    root1 = Task("Project A", "2025-05-01")
    subtask1a = Task("A - Planning", "2025-05-02")
    subtask1b = Task("A - Execution", "2025-05-03")
    root1.add_subtask(subtask1a)
    root1.add_subtask(subtask1b)

    # Second root task tree
    root2 = Task("Project B", "2025-06-01")
    subtask2a = Task("B - Research", "2025-06-02")
    root2.add_subtask(subtask2a)

    # Save both trees
    save_tasks_to_file([root1, root2], "tasks.json")

    # Load them back
    loaded = load_tasks_from_file("tasks.json")
    print(loaded)
