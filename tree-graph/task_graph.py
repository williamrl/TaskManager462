from collections import defaultdict, deque

class TaskGraph:
    def __init__(self):
        self.graph = defaultdict(list)

    def add_dependency(self, task_from, task_to):
        self.graph[task_from].append(task_to)

    def display_dependencies(self):
        print("\nTask Dependencies:")
        for task, deps in self.graph.items():
            for dep in deps:
                print(f"{task} -> {dep}")

    def topological_sort(self):
        in_degree = defaultdict(int)
        for u in self.graph:
            for v in self.graph[u]:
                in_degree[v] += 1

        all_tasks = set(self.graph.keys()) | {v for deps in self.graph.values() for v in deps}
        queue = deque([task for task in all_tasks if in_degree[task] == 0])
        sorted_order = []

        while queue:
            current = queue.popleft()
            sorted_order.append(current)
            for neighbor in self.graph[current]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        if len(sorted_order) != len(all_tasks):
            print("Warning: Cycle detected! No valid topological order.")
            return []

        return sorted_order
