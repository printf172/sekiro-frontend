export default {
  login: "/sekiro-api/user-info/login post query", // 登录
  register: "/sekiro-api/user-info/register post query", // 注册
  refreshToken: "/sekiro-api/user-info/refreshToken get", // 刷新 token
  regenerateAPIToken: "/sekiro-api/user-info/regenerateAPIToken get", // 刷新 api token
  updatePassword: "/sekiro-api/user-info/resetPassword post query", // 修改密码
  getUser: "/sekiro-api/user-info/userInfo get", // 获取用户信息
  notice: "/sekiro-api/user-info/notice get", // 系统通知
  userAdd: "/sekiro-api/user-info/createUser get", // 创建用户
  grantAdmin: "/sekiro-api/user-info/grantAdmin get", // 模拟登录
  setupUserQPSQuota:"/sekiro-api/user-info/setupUserQPSQuota",
  userList: "/sekiro-api/user-info/listUser get", // 用户列表
  setConfig: "/sekiro-api/system/setConfig post", // config 单条
  setConfigs: "/sekiro-api/system/setConfigs post", // config all
  allConfig: "/sekiro-api/system/allConfig get", // 所有 config


  groupCreate: "/sekiro-api/frontend/create get", // group 创建
  groupList: "/sekiro-api/frontend/listGroup get", // group 列出
  listAction: "/sekiro-api/frontend/listAction get", // action 列出
  fetchReporter: "/sekiro-api/frontend/fetchReporter", // 查询监控数据
  setupQuota: "/sekiro-api/frontend/setupQuota",// 设置group下的quota


  // 授权信息
  getIntPushMsg: "/yint-stub/certificate/getIntPushMsg get", // 授权信息
  getNowCertificate: "/yint-stub/certificate/getNowCertificate get" // 授权证书
};
