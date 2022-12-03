import {Button, Card, Checkbox, List} from "antd";
import {EllipsisOutlined, PlusOutlined} from "@ant-design/icons";
import QuickPersonalTaskItem from "./quick-personal-task-item";

const QuickPersonalTasks = () => {
  return (
    <Card
      title={"Personal tasks"}
      extra={[
        <Button icon={<PlusOutlined />} size={"small"}>
          New
        </Button>
      ]}
    >
      <List
        split={false}
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={[1, 2, 3]}
        renderItem={item => (
          <QuickPersonalTaskItem item={item}/>
        )}
      />
    </Card>
  );
};

export default QuickPersonalTasks;
