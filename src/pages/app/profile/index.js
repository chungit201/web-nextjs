import React, {useEffect, useState} from 'react'
import {Row, Col, Card, Avatar, Button, List, Divider, Spin,} from 'antd';
import {Icon} from '../../../common/components/util-components/Icon'
import {
  MailOutlined,
  HomeOutlined,
  PhoneOutlined, DownOutlined, MoreOutlined
} from '@ant-design/icons';
import PageHeaderAlt from '../../../common/components/layout-components/PageHeaderAlt'
import Flex from '../../../common/components/shared-components/Flex'
import {AppLayout} from "../../../common/layouts/app-layout";
import {useSelector} from "react-redux";
import FeedPost from "../../../common/components/feed-components/feedPost";
import ApiService from "../../../common/services/ApiService";
import InfiniteScroll from "react-infinite-scroll-component";

const ProfileInfo = (props) => {
  const user = useSelector(state => state.user);
  return (
    <div>
      <Card>
        <Row justify="center">
          <Col sm={24} md={23}>
            <div className="d-md-flex">
              <div className="rounded p-2 bg-white shadow-sm mx-auto"
                   style={{'marginTop': '-3.5rem', 'maxWidth': `${props.avatarSize + 16}px`}}>
                <Avatar shape="square" size={props.avatarSize} src={user.avatar}/>
              </div>
              <div className="ml-md-4 w-100">
                <Flex alignItems="center" mobileFlex={false} className="mb-3 text-md-left text-center">
                  <h2 className="mb-0 mt-md-0 mt-2">{user.fullName}</h2>
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
                        <span className="font-weight-semibold">{user.email}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12} md={9}>
                        <Icon type={PhoneOutlined} className="text-primary font-size-md"/>
                        <span className="text-muted ml-2">Phone:</span>
                      </Col>
                      <Col xs={12} sm={12} md={15}>
                        <span className="font-weight-semibold">{user.phoneNumber}</span>
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
                        <span className="font-weight-semibold">{user.address}</span>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col xs={12} sm={12} md={9}>
                        <Icon type={MailOutlined} className="text-primary font-size-md"/>
                        <span className="text-muted ml-2">Internal Email:</span>
                      </Col>
                      <Col xs={12} sm={12} md={15}>
                        <span className="font-weight-semibold">{user.internalEmail}</span>
                      </Col>
                    </Row>
                  </Col>

                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}


// const SelfFeed = (props) => {
//
// }

const Projects = ({projectList}) => {
  return (
    <Card title="Projects">
      <Divider style={{margin: 'auto'}}/>
      <List
        itemLayout="horizontal"
        dataSource={projectList}
        renderItem={item => {
          return (<List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.avatar}/>}
              title={item.name}
              description={item.autoDeploy.gitUrl}
            />
          </List.Item>)
        }

        }
      />
      <Button style={{display: 'block'}}
              icon={<DownOutlined/>}
              type="link"
      >
        Show More
      </Button>
    </Card>
  )
}

const Profile = (props) => {

  const [projects, setProjects] = useState(props.projects.results);
  const [posts, setPosts] = useState(props.posts || []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const user = useSelector(state=>state.user)
  const avatarSize = 150;
  let limit = 10

  const fetchMoreMyData = async () => {
    if (posts.length >= props.pageInfo.totalResults) {
      setHasMore(false)
      return;
    }
    try {
      setLoading(true)
      await setPage(page + 1);
      const {data} = await ApiService.getPosts({id: user._id, page: page, limit: limit,sortBy: "-createdAt"});
      setPosts(posts.concat(data.results));
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <AppLayout>
      <PageHeaderAlt background="/img/others/img-12.jpg" cssClass="bg-primary" overlap>
        <div className="container text-center">
          <div className="py-5 my-md-5">
          </div>
        </div>
      </PageHeaderAlt>
      <div className="container my-4">
        <ProfileInfo avatarSize={avatarSize}/>
        <Row gutter="16">
          <Col xs={24} sm={24} md={24} lg={8}>
            <Projects projectList={projects}/>
          </Col>
          <Col xs={24} sm={24} md={24} lg={16}>
            <div>
              <Card>
                <div className="d-flex">
                  <h4>My posts</h4>
                  <MoreOutlined style={{position: "absolute", right: "10px", fontSize: "20px"}}/>
                </div>
              </Card>
              <InfiniteScroll
                dataLength={posts.length}
                next={fetchMoreMyData}
                hasMore={hasMore}
                loader={<div className="d-flex justify-content-center">
                  <Spin spinning={loading}/>
                </div>}
                endMessage={props.pageInfo.totalResults > 10 ?
                  (<p style={{textAlign: "center"}}>
                    <b>Yay! You have seen it all</b>
                  </p>) : ""
                }
              >
                {posts.map(item => {
                  return (
                    <FeedPost key={item._id} post={item}/>
                  )
                })}
              </InfiniteScroll>
            </div>
          </Col>
        </Row>
      </div>
    </AppLayout>
  )
}

export const getServerSideProps = async (ctx) => {
  const {res} = ctx;
  const auth = require("server/utils/auth");
  const {PostService} = require("server/services");
  const {UserProject} = require("server/models")
  const {projectService} = require("server/services");
  let projects = {};
  let posts = [];
  try {
    const {user} = await auth(ctx, []);
    const projectList = (await UserProject.find({user})).map(data => data.project).map(data => data._id);
    posts = await PostService.queryPost({author: user._id}, {page: 1, limit: 10, sortBy: "-createdAt"},);
    projects = await projectService.queryProjects({_id: projectList}, {page: 1, limit: 10, sortBy: "-createdAt"});
    const {results, totalResults, totalPages, page} = posts
    return {
      props: {
        posts: JSON.parse(JSON.stringify(results)),
        projects: JSON.parse(JSON.stringify(projects)),
        pageInfo: {
          totalResults,
          hasNextPage: page < totalPages
        }
      }
    }
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
    // res.statusCode = 302;
    // return res.end();
  }
}

export default Profile
