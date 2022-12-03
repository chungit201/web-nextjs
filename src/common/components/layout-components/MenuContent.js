import React from "react";
import Link from "next/link";
import {Menu, Grid} from "antd";
import IntlMessage from "../util-components/IntlMessage";
import Icon from "../util-components/Icon";
import navigationConfig from "common/configs/NavigationConfig";
import {connect} from "react-redux";
import {SIDE_NAV_LIGHT, NAV_TYPE_SIDE} from "common/constants/ThemeConstant";
import utils from 'common/utils'
import {onMobileNavToggle} from "common/redux/actions/Theme";
import {useRouter} from "next/router";

const {SubMenu} = Menu;
const {useBreakpoint} = Grid;

const setLocale = (isLocaleOn, localeKey) =>
  isLocaleOn ? <IntlMessage id={localeKey}/> : localeKey.toString();

const setDefaultOpen = (key) => {
  let keyList = [];
  let keyString = "";
  if (key) {
    const arr = key.split("-");
    for (let index = 0; index < arr.length; index++) {
      const elm = arr[index];
      index === 0 ? (keyString = elm) : (keyString = `${keyString}-${elm}`);
      keyList.push(keyString);
    }
  }
  return keyList;
};

const SideNavContent = (props) => {
  const router = useRouter();
  const {sideNavTheme, routeInfo, hideGroupTitle, localization, onMobileNavToggle} = props;
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg')
  const closeMobileNav = () => {
    if (isMobile) {
      onMobileNavToggle(false)
    }
  }
  return (
    <Menu
      theme={sideNavTheme === SIDE_NAV_LIGHT ? "light" : "dark"}
      mode="inline"
      style={{height: "100%", borderRight: 0}}
      defaultSelectedKeys={[routeInfo?.key]}
      defaultOpenKeys={setDefaultOpen(routeInfo?.key)}
      className={hideGroupTitle ? "hide-group-title" : ""}
    >
      {navigationConfig.map((menu) =>
        menu.submenu.length > 0 ? (
          <Menu.SubMenu
            key={menu.key}
            title={setLocale(localization, menu.title)}
            icon={
              menu.icon ? (
                <Icon type={menu?.icon}/>
              ) : null
            }
          >
            {menu.submenu.map((subMenuFirst) =>
              subMenuFirst.submenu.length > 0 ? (
                <Menu.Item
                  icon={
                    subMenuFirst.icon ? (
                      <Icon type={subMenuFirst?.icon}/>
                    ) : null
                  }
                  key={subMenuFirst.key}
                  title={setLocale(localization, subMenuFirst.title)}
                >
                  {subMenuFirst.submenu.map((subMenuSecond) => (
                    <Menu.Item key={subMenuSecond.key}>
                      <a onClick={(e) => {
                        e.preventDefault();
                        router.push(subMenuSecond.path, undefined, {shallow: true});
                      }}>
                        <>
                          {subMenuSecond.icon ? (
                            <Icon type={subMenuSecond?.icon}/>
                          ) : null}
                          <span>
                            {setLocale(localization, subMenuSecond.title)}
                          </span>
                        </>
                      </a>
                    </Menu.Item>
                  ))}
                </Menu.Item>
              ) : (
                <Menu.Item key={subMenuFirst.key}>
                  <a onClick={(e) => {
                    closeMobileNav();
                    e.preventDefault();
                    router.push(subMenuFirst.path, undefined, {shallow: true});
                  }}>
                    {subMenuFirst.icon ? <Icon type={subMenuFirst.icon}/> : null}
                    <span>{setLocale(localization, subMenuFirst.title)}</span>
                  </a>
                </Menu.Item>
              )
            )}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={menu.key} onClick={(e) => {
            router.push(menu.path, undefined, {shallow: true});
          }}>
            <a>
              {menu.icon ? <Icon type={menu?.icon}/> : null}
              <span>{setLocale(localization, menu?.title)}</span>
            </a>
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

const TopNavContent = (props) => {
  const {topNavColor, localization} = props;
  return (
    <Menu mode="horizontal" style={{backgroundColor: topNavColor}}>
      {navigationConfig.map((menu) =>
        menu.submenu.length > 0 ? (
          <SubMenu
            key={menu.key}
            popupClassName="top-nav-menu"
            title={
              <span>
                {menu.icon ? <Icon type={menu?.icon}/> : null}
                <span>{setLocale(localization, menu.title)}</span>
              </span>
            }
          >
            {menu.submenu.map((subMenuFirst) =>
              subMenuFirst.submenu.length > 0 ? (
                <SubMenu
                  key={subMenuFirst.key}
                  icon={
                    subMenuFirst.icon ? (
                      <Icon type={subMenuFirst?.icon}/>
                    ) : null
                  }
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
                    {subMenuFirst.icon ? (
                      <Icon type={subMenuFirst?.icon}/>
                    ) : null}
                    <span>{setLocale(localization, subMenuFirst.title)}</span>
                  </a>
                </Menu.Item>
              )
            )}
          </SubMenu>
        ) : (
          <Menu.Item key={menu.key}>
            {menu.path ? (
              <>
                {menu.icon ? <Icon type={menu?.icon}/> : null}
                <span>{setLocale(localization, menu?.title)}</span>
              </>
            ) : (
              <a href={menu.path}>
                {menu.icon ? <Icon type={menu?.icon}/> : null}
                <span>{setLocale(localization, menu?.title)}</span>
              </a>
            )}
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

const MenuContent = (props) => {
  return props.type === NAV_TYPE_SIDE ? (
    <SideNavContent {...props} />
  ) : (
    <TopNavContent {...props} />
  );
};

const mapStateToProps = ({theme}) => {
  const {sideNavTheme, topNavColor} = theme;
  return {sideNavTheme, topNavColor};
};

export default connect(mapStateToProps, {onMobileNavToggle})(MenuContent);
