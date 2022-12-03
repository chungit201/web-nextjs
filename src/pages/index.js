import {
  Avatar,
  Button,
  Calendar,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  List,
  Modal,
  notification,
  Row, Skeleton, Spin,
  Timeline
} from "antd";
import {UserOutlined, LoadingOutlined} from "@ant-design/icons";
import {AppLayout} from "common/layouts/app-layout";
import FeedPost from "../common/components/feed-components/feedPost";
import {createRef, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Editor from "../common/components/util-components/DynamicImport/dynamic-editor";
import '@toast-ui/editor/dist/toastui-editor.css';
import ApiService from "../common/services/ApiService";
import axios from "axios";
import QuickPersonalTasks from "common/components/feed-components/quick-personal-tasks";
import WeatherWidget from "common/components/feed-components/weather-widget";
import InfiniteScroll from "react-infinite-scroll-component";

const ref = createRef();
const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>

const Home = (props) => {
  const quote = props.quote;
  const [visible, setVisible] = useState(false);
  const [posts, setPosts] = useState(props.posts || {});
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [form] = Form.useForm();
  let limit = 10
  const user = useSelector(state => state.user);


  const handleSubmit = async (values) => {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    const content = ref.current.getInstance().getMarkdown()
    try {
      const res = await ApiService.addPosts({
        ...values,
        content,
        thumbnail: "https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/02/26/19/img-1.jpg?width=982&height=726&auto=webp&quality=75"
      })
      if (res.status === 200) {
        setPosts(state => [res.data.posts, ...state]);
        notification.success({
          message: res.data.message
        })
        setVisible(false);
        await ApiService.sendToAll({
          title: "Internal-web",
          body: `${user.fullName} added a new post`,
          click_action: `${publicUrl.origin}/`,
          icon: "https://northstudio.vn/wp-content/uploads/2021/10/logo-colored-01.png"
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleRemove = async (postId) => {
    try {
      const {data} = await ApiService.deletePosts(postId);
      const newBlogs = [...posts].filter(posts => posts._id !== postId)
      setPosts(newBlogs)
      notification.success({
        message: data.message
      });

    } catch (err) {

    }
  }

  const handleUpdate = (post) => {
    if (ref.current) {
      setContent(post.content);
    }
  }

  const fetchMoreData = async () => {
    if (posts.length >= props.pageInfo.totalResults) {
      setHasMore(false)
      return;
    }
    try {
      setLoading(true)
      await setPage(page + 1);
      const {data} = await ApiService.getPosts({page: page, limit: limit,sortBy: "-createdAt"});
      setPosts(posts.concat(data.results));
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }
  // console.log(page)

  return (
    <div>
      <Row justify="center" gutter={16}>
        <Col sm={24} xs={24} lg={16} xl={12}>
          <Card>
            <div className="d-flex">
              <div>
                <Avatar src={user.avatar}
                        icon={<UserOutlined/>} className="mr-3"/>
              </div>
              <Input placeholder="Update your status..." onClick={() => {
                setVisible(true)
              }}/>
            </div>
          </Card>
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
          >
            {posts.map(item => {
              return (
                <FeedPost key={item._id} postList={posts} onUpdate={handleUpdate} onRemove={handleRemove}
                          post={item}/>
              )
            })}
          </InfiniteScroll>
        </Col>
        <Col sm={24} xs={24} md={24} lg={6} xl={6}>
          <WeatherWidget/>
          <Card style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}>
            <p>Thứ hai / tháng 1 / 2022</p>
            <h1>03</h1>
            <p style={{fontStyle: "italic"}}>
              {`"${quote.q}" - ${quote.a}`}
            </p>
          </Card>
          <QuickPersonalTasks/>
        </Col>
      </Row>
      <Modal
        title="Add status"
        visible={visible}
        width="70vw"
        onCancel={() => {
          setVisible(false)
        }}
        footer={null}
      >
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item name='content'>
            <Editor
              initialValue={content}
              previewStyle="vertical"
              height="400px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              ref={ref}
            />
          </Form.Item>
          <div style={{
            textAlign: "end",
            marginTop: '20px'
          }}>
            <Button className="mr-2" type="default" danger onClick={() => {
              form.resetFields();
              setVisible(false)
            }}>Cancel</Button>
            <Button type="primary" ghost htmlType="submit">Submit</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

Home.getLayout = (page) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  );
};

export const getServerSideProps = async (ctx) => {
  const {res} = ctx;
  const auth = require("server/utils/auth");
  const {PostService} = require("server/services");
  let posts = [];
  let quote = {};
  try {
    posts = await PostService.queryPost({}, {page: 1, limit: 10, sortBy: "-createdAt"});
    const {data} = await axios.get("https://zenquotes.io/api/today?option1=value&option2=value");
    quote = data[0];
    const {results, totalResults, totalPages, page} = posts;
    return {
      props: {
        posts: JSON.parse(JSON.stringify(results)),
        quote,
        pageInfo: {
          totalResults,
          hasNextPage: page < totalPages
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
    // res.statusCode = 302;
    // return res.end();
  }
}


export default Home;
