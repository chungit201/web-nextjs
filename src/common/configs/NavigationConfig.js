import {
  HomeOutlined,
  CalendarOutlined,
  BookOutlined,
  PieChartOutlined,
  ProjectOutlined,
  CodeOutlined,
  UserOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  MailOutlined,
  ContactsOutlined,
  ExclamationCircleOutlined,
  FormOutlined
} from '@ant-design/icons';
import {APP_PREFIX_PATH} from 'common/configs/AppConfig'

const dashBoardNavTree = [{
  key: 'home',
  path: `/`,
  title: 'Home',
  icon: HomeOutlined,
  breadcrumb: false,
  submenu: []
}, {
  key: 'calendar',
  path: `${APP_PREFIX_PATH}/calendar`,
  title: 'Calendar',
  icon: CalendarOutlined,
  breadcrumb: false,
  submenu: []
}, {
  key: 'manage-note',
  path: `${APP_PREFIX_PATH}/notes`,
  title: 'Notes',
  icon: BookOutlined,
  breadcrumb: false,
  submenu: []
}, {
  key: 'hrm-tools',
  path: `${APP_PREFIX_PATH}/hrm`,
  title: 'HRM',
  icon: UserOutlined,
  breadcrumb: false,
  submenu: [
    {
      key: 'timekeeping',
      path: `${APP_PREFIX_PATH}/timekeeping`,
      title: 'Timekeeping',
      icon: FormOutlined,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'salary',
      path: `${APP_PREFIX_PATH}/salary`,
      title: 'Salary',
      icon: PieChartOutlined,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'department',
      path: `${APP_PREFIX_PATH}/department`,
      title: 'Department',
      icon: ContactsOutlined,
      breadcrumb: false,
      submenu: []
    },
    {
    key: 'reports',
    path: `${APP_PREFIX_PATH}/reports`,
    title: 'Reports',
    icon: FileDoneOutlined,
    breadcrumb: false,
    submenu: []
  }, {
    key: 'emails',
    path: `${APP_PREFIX_PATH}/emails`,
    title: 'Emails',
    icon: MailOutlined,
    breadcrumb: false,
    submenu: []
  }, {
    key: 'requests',
    path: `${APP_PREFIX_PATH}/requests/inbox`,
    title: 'Requests',
    icon: ExclamationCircleOutlined,
    breadcrumb: false,
    submenu: []
  }]
}, {
  key: 'development-tools',
  path: `${APP_PREFIX_PATH}/dev`,
  title: 'Development',
  icon: CodeOutlined,
  breadcrumb: false,
  submenu: [{
    key: 'statistics',
    path: `${APP_PREFIX_PATH}/dev/stats`,
    title: 'Statistics',
    icon: BarChartOutlined,
    breadcrumb: false,
    submenu: []
  }]
}, {
  key: 'manage-project',
  path: `${APP_PREFIX_PATH}/projects`,
  title: 'Project',
  icon: ProjectOutlined,
  breadcrumb: false,
  submenu: []
},];

const navigationConfig = [
  ...dashBoardNavTree
]

export default navigationConfig;
