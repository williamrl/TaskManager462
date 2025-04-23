from task_tree import TaskNode
from task_graph import TaskGraph
from task_tree import build_task_tree

# Create tree hierarchy
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

print("📂 Task Hierarchy:")
root.display()

# Create dependencies
graph = TaskGraph()
graph.add_dependency("Design Phase", "Development Phase")
graph.add_dependency("Development Phase", "Testing Phase")
graph.add_dependency("UI Mockups", "Frontend UI")
graph.add_dependency("UX Research", "Frontend UI")
graph.add_dependency("Backend API", "Testing Phase")
graph.add_dependency("Frontend UI", "Testing Phase")

graph.display_dependencies()

print("\n🗂️  Topological Task Execution Order:")
order = graph.topological_sort()
print(" → ".join(order) if order else "No valid order (cycle detected)")
