import { FC } from 'react';
import {
  addNodeUnderParent,
  changeNodeAtPath,
  TreeItem,
} from 'react-sortable-tree';
import InputBase from '@material-ui/core/InputBase';

import { useConfigs } from '@configs/main-configs';
import { getNodeKey } from '@components/tree';
import { useStyles } from '@components/styles';

interface NodeTitleProps {
  node: SedrahNodeData;
  path: Array<string | number>;
  treeData: Array<TreeItem>;
  latestNodeID: string;
  onUpdateTree: (treeData: Array<TreeItem>) => void;
  onSetLatestNodeID: ReactSetState<string>;
}

const NodeTitle: FC<NodeTitleProps> = (props) => {
  const {
    node,
    path,
    treeData,
    latestNodeID,
    onUpdateTree,
    onSetLatestNodeID,
  } = props;
  const classes = useStyles();
  const { primaryField, generateNewNode } = useConfigs();

  return (
    <InputBase
      autoFocus={latestNodeID === node.id}
      classes={{ root: classes.nodeTitle, focused: classes.nodeTitleFocused }}
      value={node[primaryField]}
      style={{
        width: `${node?.[primaryField]?.toString()?.length || 0}ch`,
      }}
      onChange={(event) => {
        const newTitle = event.target.value;

        onUpdateTree(
          changeNodeAtPath({
            treeData,
            path,
            getNodeKey,
            newNode: { ...node, [primaryField]: newTitle },
          }),
        );
      }}
      onKeyUp={(e) => {
        if (e.code === 'Enter') {
          const newNode = generateNewNode('simple');

          onUpdateTree(
            addNodeUnderParent({
              treeData,
              parentKey: path[path.length - 2],
              expandParent: true,
              getNodeKey,
              newNode: newNode,
            }).treeData,
          );
          onSetLatestNodeID(newNode.id);
        }
        if (e.code === 'Insert') {
          const newNode = generateNewNode('simple');

          onUpdateTree(
            addNodeUnderParent({
              treeData,
              parentKey: path[path.length - 1],
              expandParent: true,
              getNodeKey,
              newNode: newNode,
            }).treeData,
          );
          onSetLatestNodeID(newNode.id);
        }
      }}
    />
  );
};

export default NodeTitle;
