class TaskNode:
    def __init__(self, name, priority):
        self.name = name
        self.priority = priority
        self.children = []

    def add_subtask(self, subtask):
        self.children.append(subtask)

    def display(self, level=0):
        indent = "    " * level
        print(f"{indent}- {self.name} (Priority {self.priority})")
        for child in sorted(self.children, key=lambda x: x.priority):
            child.display(level + 1)