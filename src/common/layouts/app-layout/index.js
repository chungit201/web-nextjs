import React from 'react';
import {useSelector} from 'react-redux';
import SideNav from '../../components/layout-components/SideNav';
import Loading from '../../components/shared-components/Loading';
import MobileNav from '../../components/layout-components/MobileNav'
import HeaderNav from '../../components/layout-components/HeaderNav';
import PageHeader from '../../components/layout-components/PageHeader';
import {
  Layout,
  Grid,
} from "antd";

import navigationConfig from "../../configs/NavigationConfig";
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_TYPE_SIDE,
  NAV_TYPE_TOP,
  DIR_RTL,
  DIR_LTR
} from '../../constants/ThemeConstant';
import utils from '../../utils';
import {useThemeSwitcher} from "react-css-theme-switcher";
import {useRouter} from "next/router";

const {Content} = Layout;
const {useBreakpoint} = Grid;

export const AppLayout = (props) => {
  const {navCollapsed, navType, locale, direction} = useSelector(state => state.theme);
  const router = useRouter();
  const currentRouteInfo = utils.getRouteInfo(navigationConfig, router.pathname)
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg')
  const isNavSide = navType === NAV_TYPE_SIDE
  const isNavTop = navType === NAV_TYPE_TOP
  const getLayoutGutter = () => {
    if (isNavTop || isMobile) {
      return 0
    }
    return navCollapsed ? SIDE_NAV_COLLAPSED_WIDTH : SIDE_NAV_WIDTH
  }

  // if (status === 'loading') {
  //   return <Loading cover="page"/>;
  // }

  const getLayoutDirectionGutter = () => {
    if (direction === DIR_LTR) {
      return {paddingLeft: getLayoutGutter()}
    }
    if (direction === DIR_RTL) {
      return {paddingRight: getLayoutGutter()}
    }
    return {paddingLeft: getLayoutGutter()}
  }

  return (
    <Layout>
      <HeaderNav isMobile={isMobile}/>
      {/*{(isNavTop && !isMobile) ? <TopNav routeInfo={currentRouteInfo}/> : null}*/}
      <Layout className="app-container">
        {(isNavSide && !isMobile) ? <SideNav routeInfo={currentRouteInfo}/> : null}
        <Layout className="app-layout" style={getLayoutDirectionGutter()}>
          <div className={`app-content ${isNavTop ? 'layout-top-nav' : ''}`}>
            <PageHeader display={currentRouteInfo?.breadcrumb} title={currentRouteInfo?.title}/>
            <Content>
              {props.children}
            </Content>
          </div>
          {/*<Footer/>*/}
        </Layout>
      </Layout>
      {isMobile && <MobileNav/>}
    </Layout>
  )
}

export default React.memo(AppLayout);
