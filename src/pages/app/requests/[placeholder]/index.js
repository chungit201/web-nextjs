import RequestInterface from "../index";
import RequestList from "../../../../common/components/request-components/request-list";

const PlaceHolder = (props) => {
  return (
    <RequestInterface>
      <RequestList requests={props.requests} pageInfo={props.pageInfo}/>
    </RequestInterface>
  )
}

export const getServerSideProps = async (context) => {
  const res = context;
  const auth = require("server/utils/auth");
  const {requestService} = require("server/services");
  const {placeholder} = context.query;
  let requests = {};

  try {
    const {user} = await auth(context, []);
    if (placeholder) {
      switch (placeholder) {
        case 'inbox':
           requests = await requestService.getIncomingRequests({receiver: user._id}, {limit: 8, page: 1, sortBy: '-createdAt'});
          break;
        case 'sent':
          requests = await requestService.getSentRequests({sender: user._id}, {limit: 8, page: 1, sortBy: '-createdAt'});
          break;
        case 'archived':
           // requests = { "results":[],"page":"0","limit":"8", "totalPages": "2","totalResults": "0"};
        default:
          throw ({
            status: 404
          })
      }
    }
    return {
      props: {
        requests: JSON.parse(JSON.stringify(requests.results)),
        pageInfo: {
          totalResults: requests.totalResults,
          hasNextPage: requests.page < requests.totalPages
        }
      }
    }
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }
}

export default PlaceHolder