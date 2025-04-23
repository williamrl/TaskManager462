from utilities.db import SessionLocal, Task

class TaskNode:
    def __init__(self, id, name, priority):
        self.id = id
        self.name = name
        self.priority = priority
        self.children = []

    def add_subtask(self, subtask):
        self.children.append(subtask)

def build_task_tree():
    session = SessionLocal()
    tasks = session.query(Task).all()
    session.close()

    task_dict = {task.id: TaskNode(task.id, task.name, 0) for task in tasks}
    root = TaskNode(0, "Root", 0)

    for task in tasks:
        if task.parent_id:
            task_dict[task.parent_id].add_subtask(task_dict[task.id])
        else:
            root.add_subtask(task_dict[task.id])

    return root