import {AppLayout} from "../../../common/layouts/app-layout";
import { Tabs } from 'antd';
import TimeSheets from "./TimeSheets";

const { TabPane } = Tabs;

function callback(key) {
}

const Timekeeping = () => {
  return (
    <AppLayout>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Timesheets" key="1">
          <TimeSheets/>
        </TabPane>
        <TabPane tab="overtime timesheet" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Detailed sheet" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </AppLayout>
  )
}

export default Timekeeping