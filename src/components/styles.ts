import {
  fade,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentWrapper: {
      display: 'flex',
      flexGrow: 1,
      padding: theme.spacing(2),
      margin: theme.spacing(2),
    },
    mainContent: {
      padding: theme.spacing(2),
      height: `calc(100vh - ${128}px)`,
      overflow: 'scroll',
    },
    searchBar: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    nodeTitle: {
      padding: theme.spacing(0, 1),
      minHeight: 40,
      minWidth: 100,
      boxSizing: 'content-box',
    },
    nodeTitleFocused: {
      border: '1px solid rgba(0,0,0,0.23)',
      borderRadius: 3,
      minHeight: 38,
    },
  }),
);
