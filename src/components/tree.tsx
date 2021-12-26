import { FC, MouseEvent, useState } from 'react';
import SortableTree, {
  SearchData,
  TreeItem,
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { GetNodeKeyFunction } from 'react-sortable-tree/utils/tree-data-utils';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useConfigs } from '@configs/main-configs';
import NodeRendererComponent from '@components/node-components/node-renderer';
import AlertDialog from '@components/dialog-box';
import EditNodeForm from '@components/edit-node-form';
import NodeTitle from '@components/node-components/node-title';
import NodeButtons from '@components/node-components/node-buttons';
import { useStyles } from '@components/styles';
import TopBar from '@components/top-bar';
import MessageForm, { MessageFormFields } from '@components/message-form';
import { send_message} from '../../public/widget_func.js'

export const getNodeKey: GetNodeKeyFunction = ({ node }) => node.id as string;

export const generateID = (): string => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

const initialContextMenuPos = {
  mouseX: null,
  mouseY: null,
};

const Tree: FC = () => {
  const classes = useStyles();
  const {
    initialTree,
    treeNodes,
    mainFunctions,
    generateNewNode,
  } = useConfigs();

  const [treeData, setTreeData] = useState<Array<TreeItem>>(initialTree);
  const [prevTreeData, setPrevTreeData] = useState<Array<Array<TreeItem>>>([
    initialTree,
  ]);
  const [undoRedoIndex, setUndoRedoIndex] = useState(0);
  const [summaryMode, setSummaryMode] = useState(false);
  const [isWithHandle, setIsWithHandle] = useState(true);
  const [treeZoom, setTreeZoom] = useState(1);
  const [selectedNodes, setSelectedNodes] = useState<Array<SedrahNodeData>>([]);
  const [isRemoveAlertVisible, setIsRemoveAlertVisible] = useState(false);
  const [selectedNodePath, setSelectedNodePath] = useState<Array<
    number | string
  > | null>(null);
  const [selectedNode, setSelectedNode] = useState<SedrahNodeData | null>(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(0);
  const [expandedNodeId, setExpandedNodeId] = useState(-1);
  const [latestNodeID, setLatestNodeID] = useState('');

  const [contextMenuPos, setContextMenuPos] = useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialContextMenuPos);

  const [isMessageFormVisible, setIsMessageFormVisible] = useState(false);

  const toggleMessageFormAlert = () => {
    setIsMessageFormVisible((prevState) => !prevState);
  };

  const handlesMessage = (message: MessageFormFields) => {
    send_message(selectedNodes, message.message_content);
    toggleMessageFormAlert();
  };

  const customSearchMethod = (data: SearchData): boolean => {
    const searchQuery = data.searchQuery as string;
    const searchNode = data.node as SedrahNodeData;

    if (searchQuery) {
      return treeNodes[searchNode.nodeType].fields.reduce<boolean>(
        (res, field) => {
          if (field.isSearchable) {
            return (
              res ||
              (searchNode[field.name] || '')
                .toString()
                .toLowerCase()
                .indexOf(searchQuery.toLowerCase()) > -1
            );
          }
          return res;
        },
        false,
      );
    }
    return false;
  };

  const toggleRemoveAlert = () => {
    setIsRemoveAlertVisible((prevState) => !prevState);
  };

  const toggleEditForm = () => {
    setIsEditFormVisible((prevState) => !prevState);
  };

  const updateTree = (newTreeData: Array<TreeItem>) => {
    setTreeData(() => {
      setPrevTreeData((prevState) => {
        const newState = [...prevState].slice(0, undoRedoIndex + 1);
        newState.push(newTreeData);
        setUndoRedoIndex(newState.length - 1);
        return newState;
      });

      return newTreeData;
    });
  };

  const handleRemoveNode = () => {
    if (selectedNodePath) {
      updateTree(
        removeNodeAtPath({
          treeData,
          path: selectedNodePath,
          getNodeKey,
        }),
      );
      toggleRemoveAlert();
      setSelectedNode(null);
      setSelectedNodePath(null);
    }
  };

  const handleAddNode = (parentPath?: string | number) => {
    const newNode = generateNewNode('simple');

    updateTree(
      addNodeUnderParent({
        treeData,
        parentKey: parentPath,
        expandParent: true,
        addAsFirstChild: parentPath === undefined,
        getNodeKey,
        newNode: newNode,
      }).treeData,
    );

    setLatestNodeID(newNode.id);
  };

  const handleUpdateNode = (newNodeData: SedrahNodeData) => {
    if (selectedNodePath) {
      updateTree(
        changeNodeAtPath({
          treeData,
          path: selectedNodePath,
          getNodeKey,
          newNode: {
            ...selectedNode,
            ...newNodeData,
          },
        }),
      );
    }
    toggleEditForm();
    setSelectedNode(null);
    setSelectedNodePath(null);

    const callback = treeNodes[newNodeData.nodeType].onUpdateNode;
    callback && callback(newNodeData);
  };

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenuPos({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenuPos(initialContextMenuPos);
  };

  return (
    <>
      <TopBar
        treeData={treeData}
        selectedNodes={selectedNodes}
        searchFocusIndex={searchFocusIndex}
        searchFoundCount={searchFoundCount}
        searchString={searchString}
        treeZoom={treeZoom}
        summaryMode={summaryMode}
        isWithHandle={isWithHandle}
        prevTreeData={prevTreeData}
        undoRedoIndex={undoRedoIndex}
        onUpdateTree={updateTree}
        onSetTreeData={setTreeData}
        onSetSearchFocusIndex={setSearchFocusIndex}
        onSetSearchString={setSearchString}
        onSetTreeZoom={setTreeZoom}
        onSetSummaryMode={setSummaryMode}
        onSetIsWithHandle={setIsWithHandle}
        onSetUndoRedoIndex={setUndoRedoIndex}
      />
      <Paper className={classes.contentWrapper} elevation={10}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Paper
              className={classes.mainContent}
              elevation={10}
              variant="outlined"
              square
              onClick={() => setExpandedNodeId(-1)}
              onContextMenu={handleContextMenu}
            >
              <SortableTree
                rowDirection="rtl"
                isVirtualized={false}
                style={{
                  transform: `scale(${treeZoom})`,
                  transformOrigin: 'top right',
                }}
                onlyExpandSearchedNodes
                rowHeight={summaryMode ? 60 : 172}
                treeData={treeData}
                getNodeKey={getNodeKey}
                searchMethod={customSearchMethod}
                searchQuery={searchString}
                searchFocusOffset={searchFocusIndex}
                searchFinishCallback={(matches) => {
                  setSearchFoundCount(matches.length);
                  setSearchFocusIndex(
                    matches.length > 0 ? searchFocusIndex % matches.length : 0,
                  );
                }}
                nodeContentRenderer={NodeRendererComponent}
                placeholderRenderer={() => (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      handleAddNode();
                    }}
                  >
                    افزودن گره
                  </Button>
                )}
                generateNodeProps={({ node, path }) => ({
                  summaryMode,
                  isWithHandle,
                  expandedNodeId,
                  setExpandedNodeId,
                  buttons: (
                    <NodeButtons
                      node={node as SedrahNodeData}
                      path={path}
                      selectedNodes={selectedNodes}
                      onSetSelectedNodes={setSelectedNodes}
                      onSetSelectedNode={setSelectedNode}
                      onSetSelectedNodePath={setSelectedNodePath}
                      onSetIsEditFormVisible={setIsEditFormVisible}
                      onSetIsRemoveAlertVisible={setIsRemoveAlertVisible}
                      onAddNode={handleAddNode}
                    />
                  ),
                  title: (
                    <NodeTitle
                      node={node as SedrahNodeData}
                      latestNodeID={latestNodeID}
                      path={path}
                      treeData={treeData}
                      onUpdateTree={updateTree}
                      onSetLatestNodeID={setLatestNodeID}
                    />
                  ),
                })}
                onChange={(treeData) => setTreeData(treeData)}
              />
              <Menu
                keepMounted
                open={contextMenuPos.mouseY !== null}
                onClose={handleCloseContextMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                  contextMenuPos.mouseY !== null &&
                  contextMenuPos.mouseX !== null
                    ? {
                        top: contextMenuPos.mouseY,
                        left: contextMenuPos.mouseX,
                      }
                    : undefined
                }
              >
                {Object.keys(mainFunctions).map((func) => (
                  <MenuItem
                    key={func}
                    onClick={() => {
                      mainFunctions[func].cb(selectedNodes, {
                        toggleMessageFormAlert,
                      });
                      handleCloseContextMenu();
                    }}
                  >
                    {mainFunctions[func].label}
                  </MenuItem>
                ))}
              </Menu>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <AlertDialog
        open={isMessageFormVisible}
        title="ارسال پیام"
        content={<MessageForm onSubmit={handlesMessage} />}
        cancelText="انصراف"
        onCancel={toggleMessageFormAlert}
      />
      <AlertDialog
        open={isRemoveAlertVisible}
        title="حذف گره"
        content="آیا از حذف این گره مطمئن هستید؟"
        okText="بله"
        cancelText="خیر"
        onOK={handleRemoveNode}
        onCancel={toggleRemoveAlert}
      />
      {isEditFormVisible && selectedNode && (
        <AlertDialog
          open={isEditFormVisible}
          title="ویرایش گره"
          content={
            <EditNodeForm
              initialValues={selectedNode}
              fields={treeNodes[selectedNode.nodeType].fields}
              onUpdateNode={handleUpdateNode}
            />
          }
          cancelText="انصراف"
          onCancel={toggleEditForm}
        />
      )}
    </>
  );
};

export default Tree;
