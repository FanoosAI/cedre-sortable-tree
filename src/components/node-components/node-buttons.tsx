import { FC } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';

import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

interface NodeTitleProps {
  node: SedrahNodeData;
  path: Array<string | number>;
  selectedNodes: Array<SedrahNodeData>;
  onSetSelectedNodes: ReactSetState<Array<SedrahNodeData>>;
  onSetSelectedNode: ReactSetState<SedrahNodeData | null>;
  onSetSelectedNodePath: ReactSetState<Array<string | number> | null>;
  onSetIsEditFormVisible: ReactSetState<boolean>;
  onSetIsRemoveAlertVisible: ReactSetState<boolean>;
  onAddNode: (path: string | number) => void;
}

const NodeButtons: FC<NodeTitleProps> = (props) => {
  const {
    node,
    path,
    selectedNodes,
    onSetSelectedNodes,
    onSetSelectedNode,
    onSetSelectedNodePath,
    onSetIsEditFormVisible,
    onSetIsRemoveAlertVisible,
    onAddNode,
  } = props;

  const handleSelectNode = () => {
    onSetSelectedNodes((prevState) => {
      const newState = [...prevState];

      const wasSelectedNodeIndex = prevState.findIndex(
        (prevNode) => prevNode.id === node.id,
      );

      if (wasSelectedNodeIndex > -1) {
        newState.splice(wasSelectedNodeIndex, 1);
        return newState;
      } else {
        return [...prevState, { ...node }];
      }
    });
  };

  return (
    <>
      <Checkbox
        key="select checkbox"
        size="small"
        checked={selectedNodes.some(
          (selectedNode) => selectedNode.id === node.id,
        )}
        onChange={handleSelectNode}
        onClick={(e) => e.stopPropagation()}
      />
      <IconButton
        key="update"
        onClick={() => {
          onSetSelectedNode(node);
          onSetSelectedNodePath(path);
          onSetIsEditFormVisible(true);
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        key="add"
        onClick={() => {
          onAddNode(path[path.length - 1]);
        }}
      >
        <AddIcon />
      </IconButton>
      <IconButton
        key="remove"
        onClick={() => {
          onSetSelectedNodes((prevState) => {
            const newState = [...prevState];

            const wasSelectedNodeIndex = prevState.findIndex(
              (prevNode) => prevNode.id === node.id,
            );

            if (wasSelectedNodeIndex > -1) {
              newState.splice(wasSelectedNodeIndex, 1);
              return newState;
            }
            return prevState;
          });
          onSetSelectedNodePath(path);
          onSetIsRemoveAlertVisible(true);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </>
  );
};

export default NodeButtons;
