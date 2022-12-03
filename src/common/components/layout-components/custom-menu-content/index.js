import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {Menu, Grid} from "antd";
import navigationConfig from "common/configs/NavigationConfig";
import {connect} from "react-redux";
import IntlMessage from "../../util-components/IntlMessage";

const {SubMenu} = Menu;

const setLocale = (isLocaleOn, localeKey) =>
  isLocaleOn ? <IntlMessage id={localeKey}/> : localeKey.toString();


const CustomMenuContent = (props) => {
  const {localization} = props;

  return (
    <Menu mode="horizontal" className="custom-top-nav">
      {navigationConfig.map((menu) =>
        menu.submenu.length > 0 ? (
          <SubMenu
            key={menu.key}
            popupClassName="top-nav-menu"
            selectedKeys={[menu.key]}
            title={
              <span>
                <span>{setLocale(localization, menu.title)}</span>
              </span>
            }
          >
            {menu.submenu.map((subMenuFirst) =>
              subMenuFirst.submenu.length > 0 ? (
                <SubMenu
                  key={subMenuFirst.key}
                  title={setLocale(localization, subMenuFirst.title)}
                >
                  {subMenuFirst.submenu.map((subMenuSecond) => (
                    <Menu.Item key={subMenuSecond.key}>
                      <a href={subMenuSecond.path}>
                        <span>
                          {setLocale(localization, subMenuSecond.title)}
                        </span>
                      </a>
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={subMenuFirst.key}>
                  <a href={subMenuFirst.path}>
                    <span>{setLocale(localization, subMenuFirst.title)}</span>
                  </a>
                </Menu.Item>
              )
            )}
          </SubMenu>
        ) : (
          <Menu.Item key={menu.key} style={{padding: "0 0.2rem"}}>
            <a href={menu.path ? menu.path : ""} className="py-3 px-4">
              <span style={{textTransform: "capitalize", fontSize: 16}}>{setLocale(localization, menu?.title)}</span>
            </a>
          </Menu.Item>
        )
      )}
    </Menu>
  );
}


const mapStateToProps = ({theme}) => {
  const {sideNavTheme, topNavColor} = theme;
  return {sideNavTheme, topNavColor};
};

export default connect(mapStateToProps)(CustomMenuContent);