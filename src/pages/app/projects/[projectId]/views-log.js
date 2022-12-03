import {AppLayout} from "../../../../common/layouts/app-layout";
import Flex from "../../../../common/components/shared-components/Flex";
import {Avatar, Button, Card, Col, Menu, Row, Tabs, Tooltip} from "antd";
import {CheckCircleOutlined, EditOutlined, VerticalAlignBottomOutlined} from "@ant-design/icons";
import {PageHeaderAlt} from "../../../../common/components/layout-components/PageHeaderAlt";
import React from "react";

const {SubMenu} = Menu;
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
const ViewsLog = ({project}) => {
  const [openKeys, setOpenKeys] = React.useState(['sub1']);

  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  return (
    <AppLayout>
      <PageHeaderAlt className="border-bottom" overlap>
        <div className="container">
          <div className="py-2 mb-4">
            <Flex mobileFlex={false} justifyContent="between" alignItems="center">
              <h2>{project.name}</h2>
              <div>
                <Tooltip title="Export JSON file">
                  <Button
                    className="mr-2"
                    type="default"
                    icon={<VerticalAlignBottomOutlined/>}
                  />
                </Tooltip>
                <Tooltip title="Edit project">
                  <Button
                    type="primary"
                    icon={<EditOutlined/>}
                    onClick={() => router.push(`/app/projects/${id}/edit`)}
                  />
                </Tooltip>
              </div>
            </Flex>
            <span>{project.code}</span>
          </div>
        </div>
      </PageHeaderAlt>
      <div className="container" style={{marginTop: 30}}>
        <Tabs>
          <Tabs.TabPane key={1} tab="Deployments status">
            <Row gutter={16}>
              <Col span={24}>
                <Menu style={{border:"1px solid rgb(236 236 236)",borderRadius:"5px"}} mode="inline" openKeys={openKeys} onOpenChange={onOpenChange}>
                  <SubMenu key="sub1" title="Building" style={{borderBottom:"1px solid rgb(236 236 236)"}}>
                    <p style={{padding:"20px"}}>
                      Line 67:27:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images                                  jsx-a11y/alt-text
                      Line 70:27:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images                                  jsx-a11y/alt-text
                      Line 73:27:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images                                  jsx-a11y/alt-text
                      src/app-views/products/ProductPage.js
                      Line 2:15:  Row is defined but never used  no-unused-vars
                      src/app-views/products/ProductsTime.js
                      Line 2:15:  Row is defined but never used              no-unused-vars
                      Line 2:24:  Pagination is defined but never used       no-unused-vars
                      Line 5:5:   active is assigned a value but never used  no-unused-vars
                      Line 6:5:   items is assigned a value but never used   no-unused-vars
                      src/app-views/profile/accuont/Account-info.js
                      Line 1:27:  DatePicker is defined but never used  no-unused-vars
                      src/app-views/profile/accuont/Security.js
                      Line 1:9:  Card is defined but never used  no-unused-vars
                      src/app-views/sale-slide/SliderSale.js
                      Line 33:23:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
                      Line 34:23:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
                      src/app-views/shops/order.js
                      Line 135:15:  The href attribute is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid
                      Line 146:15:  The href attribute is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid
                      src/app-views/shops/products.js
                      Line 7:5:     Tabs is defined but never used                                                                                                                                                                                                                                                                                                                                          no-unused-vars
                      Line 8:5:     DatePicker is defined but never used                                                                                                                                                                                                                                                                                                                                    no-unused-vars
                      Line 9:5:     Space is defined but never used                                                                                                                                                                                                                                                                                                                                         no-unused-vars
                      Line 10:5:    Input is defined but never used                                                                                                                                                                                                                                                                                                                                         no-unused-vars
                      Line 11:5:    Button is defined but never used                                                                                                                                                                                                                                                                                                                                        no-unused-vars
                      Line 99:15:   The href attribute is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid
                      Line 110:15:  The href attribute is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid
                    </p>
                  </SubMenu>
                  <SubMenu key="sub2" title="Running check" style={{borderBottom:"1px solid rgb(236 236 236)"}}>

                  </SubMenu>
                  <SubMenu key="sub4" title="Error log" style={{borderBottom:"1px solid rgb(236 236 236)"}}>

                  </SubMenu>
                </Menu>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </AppLayout>
  )
}

export const getServerSideProps = async (ctx) => {
  const auth = require("server/utils/auth");
  const {projectService} = require("server/services");
  const {projectId} = ctx.query;
  let project = {};
  try {
    const {user} = await auth(ctx, []);
    project = await projectService.getProject({project: projectId});
  } catch (err) {
    const {status} = err;
    return {
      props: {
        err: true,
        message: err.message
      }
    }
  }

  return {
    props: {
      project: JSON.parse(JSON.stringify(project)),
    }
  }
}

export default ViewsLog