import { FC, useEffect, useState } from 'react';
import { TreeItem } from 'react-sortable-tree';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import SearchIcon from '@material-ui/icons/Search';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import MenuIcon from '@material-ui/icons/Menu';

import ImportInitialTree from '@components/import-tree';
import AlertDialog from '@components/dialog-box';
import LoginForm, { LoginFormFields } from '@components/login-form';
import { useStyles } from '@components/styles';
import { useConfigs } from '@configs/main-configs';
import { useLocalStorage } from '@helpers/hooks-helper';

import '../../public/matrix-js-sdk.js';
import { get_rooms_list } from '../../public/widget_func.js';

interface TopBarProps {
  treeData: Array<TreeItem>;
  selectedNodes: Array<SedrahNodeData>;
  searchFocusIndex: number;
  searchFoundCount: number;
  searchString: string;
  treeZoom: number;
  summaryMode: boolean;
  isWithHandle: boolean;
  prevTreeData: Array<Array<TreeItem>>;
  undoRedoIndex: number;
  onUpdateTree: (newTreeData: Array<TreeItem>) => void;
  onSetTreeData: ReactSetState<Array<TreeItem>>;
  onSetSearchFocusIndex: ReactSetState<number>;
  onSetSearchString: ReactSetState<string>;
  onSetTreeZoom: ReactSetState<number>;
  onSetSummaryMode: ReactSetState<boolean>;
  onSetIsWithHandle: ReactSetState<boolean>;
  onSetUndoRedoIndex: ReactSetState<number>;
}

const TopBar: FC<TopBarProps> = (props) => {
  const {
    treeData,
    selectedNodes,
    searchFocusIndex,
    searchFoundCount,
    searchString,
    treeZoom,
    summaryMode,
    isWithHandle,
    prevTreeData,
    undoRedoIndex,
    onUpdateTree,
    onSetTreeData,
    onSetSearchFocusIndex,
    onSetSearchString,
    onSetTreeZoom,
    onSetSummaryMode,
    onSetIsWithHandle,
    onSetUndoRedoIndex,
  } = props;
  const classes = useStyles();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);

  const { appTitle } = useConfigs();
  const [token, setToken] = useLocalStorage('token', '');

  useEffect(() => {
    document.title = appTitle;
  }, [appTitle]);

  const handleUndo = () => {
    onSetUndoRedoIndex((prevIndex) => {
      onSetTreeData(prevTreeData[prevIndex - 1]);

      return prevIndex - 1;
    });
  };

  const handleRedo = () => {
    onSetUndoRedoIndex((prevIndex) => {
      onSetTreeData(prevTreeData[prevIndex + 1]);

      return prevIndex + 1;
    });
  };

  const selectPrevMatch = () =>
    onSetSearchFocusIndex((prevSearchFocusIndex) =>
      prevSearchFocusIndex !== null
        ? (searchFoundCount + prevSearchFocusIndex - 1) % searchFoundCount
        : searchFoundCount - 1,
    );

  const selectNextMatch = () =>
    onSetSearchFocusIndex((prevSearchFocusIndex) =>
      prevSearchFocusIndex !== null
        ? (prevSearchFocusIndex + 1) % searchFoundCount
        : 0,
    );

  const handleZoomButtons = (zoomType: 'in' | 'out') => {
    onSetTreeZoom((prevState) => {
      const bottomLimit = 0.25;
      const topLimit = 3;

      if (zoomType === 'in') {
        if (prevState === topLimit) {
          return prevState;
        }
        return prevState + 0.25;
      }
      if (zoomType === 'out') {
        if (prevState === bottomLimit) {
          return prevState;
        }
        return prevState - 0.25;
      }

      return 1;
    });
  };

  const handleExportToFile = () => {
    const link = document.createElement('a');
    const treeString =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(treeData));
    link.setAttribute('href', treeString);
    link.setAttribute('download', 'tree.json');
    document.body.appendChild(link);
    link.click();
  };

  const toggleDetailsMode = () => {
    onSetSummaryMode((prevState) => !prevState);
  };

  const toggleIsWithHandle = () => {
    onSetIsWithHandle((prevState) => !prevState);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  const toggleLoginFormAlert = () => {
    setIsLoginFormVisible((prevState) => !prevState);
  };

  const handleLogin = async (credentials: LoginFormFields) => {
    const tree = await get_rooms_list(
      credentials.username,
      credentials.password,
    );

    onUpdateTree(tree);
    setIsLoginFormVisible(false);
    setToken('');
    console.log(token);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">{appTitle}</Typography>
        <div className={classes.searchBar}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              placeholder="جستجو..."
              value={searchString}
              onChange={(e) => onSetSearchString(e.target.value)}
            />
          </div>
          <IconButton color="inherit" onClick={selectNextMatch}>
            <NavigateNextIcon />
          </IconButton>
          <IconButton color="inherit" onClick={selectPrevMatch}>
            <NavigateBeforeIcon />
          </IconButton>
          <span>
            &nbsp;
            {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
            &nbsp;/&nbsp;
            {searchFoundCount || 0}
          </span>
        </div>
        <Button
          variant="contained"
          color="secondary"
          // disabled={Boolean(token)}
          onClick={toggleLoginFormAlert}
        >
          اتصال
        </Button>
        <Divider variant="middle" orientation="vertical" flexItem />
        <Button
          variant="contained"
          color="secondary"
          disabled={treeZoom === 1}
          onClick={() => onSetTreeZoom(1)}
        >
          ریست
        </Button>
        <IconButton color="inherit" onClick={() => handleZoomButtons('in')}>
          <ZoomInIcon />
        </IconButton>
        <IconButton color="inherit" onClick={() => handleZoomButtons('out')}>
          <ZoomOutIcon />
        </IconButton>
        <Divider variant="middle" orientation="vertical" flexItem />
        <IconButton
          disabled={prevTreeData.length - 1 <= undoRedoIndex}
          color="inherit"
          onClick={handleRedo}
        >
          <RedoIcon />
        </IconButton>
        <IconButton
          disabled={prevTreeData.length <= 1 || undoRedoIndex === 0}
          color="inherit"
          onClick={handleUndo}
        >
          <UndoIcon />
        </IconButton>
        <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem>
              <Button
                variant="contained"
                color="secondary"
                disabled={selectedNodes.length === 0}
                onClick={() => alert(JSON.stringify(selectedNodes))}
              >
                نمایش منتخب
              </Button>
            </ListItem>
            <ListItem>
              <ImportInitialTree onImport={onUpdateTree} />
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleExportToFile}
                disabled={treeData === null ? true : treeData.length === 0}
                startIcon={<OpenInNewIcon />}
              >
                خروجی نهایی
              </Button>
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Switch checked={!summaryMode} onChange={toggleDetailsMode} />
                }
                label="نمایش با جزئیات"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={isWithHandle}
                    onChange={toggleIsWithHandle}
                  />
                }
                label="قابل جابجایی"
              />
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
      <AlertDialog
        open={isLoginFormVisible}
        title="ورود"
        content={<LoginForm onSubmit={handleLogin} />}
        cancelText="انصراف"
        onCancel={toggleLoginFormAlert}
      />
    </AppBar>
  );
};

export default TopBar;
