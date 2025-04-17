// src/components/TaskTree.jsx
import React from "react";
import { TreeView, TreeItem } from "@mui/lab";
import { ExpandMore, ChevronRight } from "@mui/icons-material";

export default function TaskTree({ tasks }) {
  const renderTree = (node) => (
    <TreeItem
      key={node.id}
      nodeId={String(node.id)}
      label={`${node.title} (Priority ${node.priority})`}
    >
      {node.children?.map((child) => renderTree(child))}
    </TreeItem>
  );

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
    >
      {tasks.map((task) => renderTree(task))}
    </TreeView>
  );
}
