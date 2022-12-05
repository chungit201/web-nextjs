import React, {useEffect, useState} from 'react'
import {Row, Col, Card, Avatar, Button, List, Divider, Spin} from 'antd';
import {Icon} from '../../../common/components/util-components/Icon'
import {
  MailOutlined,
  HomeOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import PageHeaderAlt from '../../../common/components/layout-components/PageHeaderAlt'
import Flex from '../../../common/components/shared-components/Flex'
import {AppLayout} from "../../../common/layouts/app-layout";


// TODO: Load Project List
const projectList = [];

const ProfileInfo = (props) => {
  return (
    <Card>
      <Row justify="center">
        <Col sm={24} md={23}>
          <div className="d-md-flex">
            <div className="rounded p-2 bg-white shadow-sm mx-auto"
                 style={{'marginTop': '-3.5rem', 'maxWidth': `${props.avatarSize + 16}px`}}>
              <Avatar shape="square" size={props.avatarSize} src={props.user.avatar}/>
            </div>
            <div className="ml-md-4 w-100">
              <Flex alignItems="center" mobileFlex={false} className="mb-3 text-md-left text-center">
                <h2 className="mb-0 mt-md-0 mt-2">{props.user.fullName}</h2>
                <div className="ml-md-3 mt-3 mt-md-0" style={{display: "flex", justifyContent: "flex-end"}}>
                  <Button size="small" type="primary">Add Friend</Button>
                  <Button size="small" className="ml-2">Message</Button>
                </div>
              </Flex>
              <Row gutter="16">

                <Col xs={24} sm={24} md={12}>
                  <Row className="mb-2">
                    <Col xs={12} sm={12} md={9}>
                      <Icon type={MailOutlined} className="text-primary font-size-md"/>
                      <span className="text-muted ml-2">Email:</span>
                    </Col>
                    <Col xs={12} sm={12} md={15}>
                      <span className="font-weight-semibold">{props.user.email}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={12} md={9}>
                      <Icon type={PhoneOutlined} className="text-primary font-size-md"/>
                      <span className="text-muted ml-2">Phone:</span>
                    </Col>
                    <Col xs={12} sm={12} md={15}>
                      <span className="font-weight-semibold">{props.user.phoneNumber}</span>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Row className="mb-2 mt-2 mt-md-0 ">
                    <Col xs={12} sm={12} md={9}>
                      <Icon type={HomeOutlined} className="text-primary font-size-md"/>
                      <span className="text-muted ml-2">Address:</span>
                    </Col>
                    <Col xs={12} sm={12} md={15}>
                      <span className="font-weight-semibold">{props.user.address}</span>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={12} sm={12} md={9}>
                      <Icon type={MailOutlined} className="text-primary font-size-md"/>
                      <span className="text-muted ml-2">Internal Email:</span>
                    </Col>
                    <Col xs={12} sm={12} md={15}>
                      <span className="font-weight-semibold">{props.user.internalEmail}</span>
                    </Col>
                  </Row>
                </Col>

              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  )
}

// const SelfFeed = (props) => {
//
// }

// const Projects = (props) => {
//
//   return (
//     <Card title="Projects">
//       <Divider style={{margin: 'auto'}}/>
//       <List
//         itemLayout="horizontal"
//         dataSource={projectList}
//         renderItem={item => {
//           return (<List.Item>
//             <List.Item.Meta
//               avatar={<Avatar src={item.avatar}/>}
//               title={item.name}
//               description={item.gitUrl}
//             />
//           </List.Item>)
//         }
//
//         }
//       />
//       <Button style={{display: 'block'}}
//               icon={<DownOutlined/>}
//               type="link"
//       >
//         Show More
//       </Button>
//     </Card>
//   )
// }

const Profile = (props) => {
  const avatarSize = 150;
  return (
    <AppLayout>
      <PageHeaderAlt background="/img/others/img-12.jpg" cssClass="bg-primary" overlap>
        <div className="container text-center">
          <div className="py-5 my-md-5">
          </div>
        </div>
      </PageHeaderAlt>
      <div className="container my-4">
        <ProfileInfo avatarSize={avatarSize} user={props.user}/>
        <Row gutter="16">
          <Col xs={24} sm={24} md={24} lg={8}>
            {/*<Projects/>*/}
          </Col>
          <Col xs={24} sm={24} md={24} lg={16}>
            {/*<SelfFeed />*/}
          </Col>
        </Row>
      </div>
    </AppLayout>
  )
}

export const getServerSideProps = async (context) => {
  const res = context;
  const auth = require("../../../server/utils/auth");
  const {userService} = require("server/services");
  let user = {};
  const {userId} = context.query
  try {
    await auth(context, [])
    user = await userService.getUserByFilter({_id: userId});
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }
  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    }
  }
}

export default Profile
