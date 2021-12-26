import { ThemeOptions } from '@material-ui/core';
import { indigo, pink } from '@material-ui/core/colors';

import Lotus from '../static/fonts/Lotus.woff';

const lotus = {
  fontFamily: 'B Lotus',
  fontStyle: 'normal',
  fontDisplay: 'swap' as const,
  fontWeight: 400,
  src: `
    local('B Lotus'),
    url(${Lotus as string}) format('woff')
  `,
};

const theme: ThemeOptions = {
  direction: 'rtl',
  typography: {
    fontFamily: '"B Lotus", Roboto, sans-serif',
  },
  palette: {
    primary: indigo,
    secondary: pink,
    type: 'light',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [lotus],
      },
    },
    MuiTab: {
      wrapper: {
        flexDirection: 'row',
      },
    },
  },
};

export default theme;
