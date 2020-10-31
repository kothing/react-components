import React from "react";
import { TreeTransfer } from "../../Components";
import treeData from "./tree.json";
import "antd/dist/antd.css";

const leftTree = treeData.leftTree;
const rightTree = treeData.rightTree;

const TreeTransferPage = () => {
  return (
    <div className="demoBox">
      <h3>穿梭组件</h3>
      <TreeTransfer
        showSearch={true}
        leftTreeData={leftTree}
        rightTreeData={rightTree}
        leftTitle={"左树"}
        rightTitle={"右树"}
        searchPlaceholder="搜索"
      />
    </div>
  );
};

export default TreeTransferPage;
