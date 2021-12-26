import { FC } from 'react';
import jMoment from 'moment-jalaali';
import JalaliUtils from '@date-io/jalaali';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
  ThemeProvider,
  StylesProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { themeConfigs, rtlConfigs, Configs } from '@configs/index';
import Tree from '@components/tree';

jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

const App: FC = () => {
  return (
    <ThemeProvider theme={createMuiTheme(themeConfigs)}>
      <CssBaseline />
      <StylesProvider jss={rtlConfigs}>
        <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
          <Configs>
            <Tree />
          </Configs>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </ThemeProvider>
  );
};

export default App;
