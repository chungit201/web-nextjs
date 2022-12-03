import React from 'react';
import {useSelector} from 'react-redux';
import {ThemeSwitcherProvider} from "react-css-theme-switcher";
import {THEME_CONFIG} from '../../configs/AppConfig';
import AppLocale from "../../lang";
import {IntlProvider} from "react-intl";
import {ConfigProvider} from 'antd';
import useBodyClass from '../../hooks/useBodyClass';

const themes = {
  dark: `/css/dark-theme.css`,
  light: `/css/light-theme.css`,
};

const ConfigApp = props => {
  const {locale, direction} = useSelector(state => state.theme);
  const currentAppLocale = AppLocale[locale];
  useBodyClass(`dir-${direction}`);
  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}>
      <ConfigProvider locale={currentAppLocale.antd} direction={direction}>
        {props.children}
      </ConfigProvider>
    </IntlProvider>
  );
};

const GlobalLayout = props => {
  return (
    <div className="App">
      <ThemeSwitcherProvider
        themeMap={themes}
        defaultTheme={THEME_CONFIG.currentTheme}
        insertionPoint="styles-insertion-point"
      >
        <ConfigApp>
          {props.children}
        </ConfigApp>
      </ThemeSwitcherProvider>
    </div>
  );
};

export default GlobalLayout;
