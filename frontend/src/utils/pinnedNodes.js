// utils/pinnedNodes.js

// 獲取所有小組的釘選節點
export const getPinnedNodes = () => {
    const pinnedNodes = localStorage.getItem('pinnedNodes');
    return pinnedNodes ? JSON.parse(pinnedNodes) : {};
};

// 獲取特定小組的釘選節點
export const getPinnedNodeForGroup = (groupId) => {
    const pinnedNodes = getPinnedNodes();
    return pinnedNodes[groupId] || null;
};

// 設置特定小組的釘選節點
export const setPinnedNode = (groupId, nodeId) => {
    const pinnedNodes = getPinnedNodes();
    pinnedNodes[groupId] = nodeId;
    localStorage.setItem('pinnedNodes', JSON.stringify(pinnedNodes));
};

// 移除特定小組的釘選節點
export const removePinnedNode = (groupId) => {
    const pinnedNodes = getPinnedNodes();
    delete pinnedNodes[groupId];
    localStorage.setItem('pinnedNodes', JSON.stringify(pinnedNodes));
};
