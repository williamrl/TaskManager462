// src/utils/taskUtils.js

// A basic sample hierarchy
export const sampleTaskTree = [
    {
      id: 1,
      title: "Project Alpha",
      priority: 1,
      children: [
        {
          id: 2,
          title: "Design Phase",
          priority: 2,
          children: [
            { id: 5, title: "UI Mockups", priority: 1, children: [] },
            { id: 6, title: "UX Research", priority: 2, children: [] },
          ],
        },
        {
          id: 3,
          title: "Development Phase",
          priority: 3,
          children: [
            { id: 7, title: "Backend API", priority: 1, children: [] },
            { id: 8, title: "Frontend UI", priority: 2, children: [] },
          ],
        },
        { id: 4, title: "Testing Phase", priority: 4, children: [] },
      ],
    },
  ];
  
  // Flattens tree into an array
  export function flattenTree(nodes) {
    let result = [];
  
    function traverse(nodeList) {
      nodeList.forEach((node) => {
        result.push({ ...node, children: undefined });
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    }
  
    traverse(nodes);
    return result;
  }
  