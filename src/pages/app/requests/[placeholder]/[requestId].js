import RequestInterface from "../index";
import ViewRequest from "../../../../common/components/request-components/view-request";

const ViewRequestDetail = (props) => {
  return (
    <RequestInterface>
      <ViewRequest request={props.request} comments={props.comments} pageInfo={props.pageInfo}/>
    </RequestInterface>
  )
}

export const getServerSideProps = async (context) => {
  const res = context;
  const auth = require("server/utils/auth");
  const {requestService, CommentService} = require("server/services");
  const {requestId} = context.query
  let request={};
  let comments=[]
  try {
    const {user} = await auth(context, []);
    request = await requestService.getRequest({_id: requestId}, user);
    comments = await CommentService.queryComment({request: requestId}, {page: 1, limit: 6, sortBy: "-createdAt"});
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }

  return {
    props: {
      request: JSON.parse(JSON.stringify(request)),
      comments: JSON.parse(JSON.stringify(comments.results)),
      pageInfo: {
        totalResults: comments.totalResults,
        hasNextPage: comments.page < comments.totalPages
      }
    }
  }
}

export default ViewRequestDetail
