import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useSnackbar } from "notistack";
import {
  Button,
  Select,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Typography,
  MenuItem,
  Divider,
  Grid,
  Switch,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import apis from "apis";
import { string } from "prop-types";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(4)
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    maxWidth: "300px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  desc: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  input: {
    display: "flex",
    alignItems: "center"
  },
  inputItem: {
    width: "100%"
  },
  inputBtn: {
    marginLeft: theme.spacing(2)
  },
  gutterTop: {
    marginTop: theme.spacing(2)
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  actions: {
    justifyContent: "center"
  },
  noMaxWidth: {
    maxWidth: "none"
  }
}));

function SingleInputItem({
                           placeholder = "",
                           initValue = "",
                           initKey = "",
                           type = "input",
                           options = [],
                           multiline = false,
                           reload = () => {
                           }
                         }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const doSave = () => {
    apis.setConfig({ key: initKey, value }).then(res => {
      if (res.status === 0) {
        enqueueSnackbar("修改成功", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      } else {
        enqueueSnackbar(res.errorMessage || res.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      }
      reload();
    }).catch(e => console.log(e));
  };

  return (
    <Grid item xs={12} className={classes.input}>
      {
        type === "input" ? (
          <TextField
            className={classes.inputItem}
            multiline={multiline}
            rows={multiline ? 4 : undefined}
            size="small"
            variant="outlined"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}/>
        ) : null
      }
      {
        type === "switch" ? (
          <Switch
            checked={value || false}
            onChange={(e) => setValue(e.target.checked)}
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        ) : null
      }
      {
        type === "select" ? (
          <Select
            className={classes.inputItem}
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            {options.map(item => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        ) : null
      }
      <Button className={classes.inputBtn} variant="contained" color="primary" onClick={doSave}>保存</Button>
    </Grid>
  );
}

const Form = () => {

  const classes = useStyles();
  const [configs, setConfigs] = useState({});

  const [refresh, setRefresh] = useState(+new Date());

  const CONFIGS = [
    {
      key: "sekiro.allowAnonymousAccess",
      name: "是否允许匿名访问",
      desc: "当开启允许后，则允许未注册group使用sekiro服务，这样和开源版本行为对齐，即不校验请求来源，但带来安全风险（sekiro demo网站默认开启）",
      component: (
        <SingleInputItem
          type={"switch"}
          placeholder="默认true"
          initKey="sekiro.allowAnonymousAccess"
          initValue={configs["sekiro.allowAnonymousAccess"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "sekiro.anonymousAccessRateLimit",
      name: "匿名访问时，对应group的qps限制",
      desc: "在开启允许匿名访问后，由于无法鉴权的未知调用，我们需要给他设置一个流量限制",
      component: (
        <SingleInputItem
          placeholder="数字"
          initKey="sekiro.anonymousAccessRateLimit"
          initValue={configs["sekiro.anonymousAccessRateLimit"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "sekiro.defaultRegisterQuotaUser",
      name: "用户注册时，设定的默认qps限制",
      desc: "sekiro允许任何用户注册，注册既可以获得quota，在没有管理员进行调整之前，此数字则为改用户级别的qps限制。",
      component: (
        <SingleInputItem
          placeholder="默认1"
          initKey="sekiro.defaultRegisterQuotaUser"
          initValue={configs["sekiro.defaultRegisterQuotaUser"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "sekiro.defaultRegisterQuotaGroup",
      name: "group创建时，设定的默认qps限制",
      desc: "用户创建一个group，在用户没有进行调整之前，使用本配置",
      component: (
        <SingleInputItem
          placeholder="默认1"
          initKey="sekiro.defaultRegisterQuotaGroup"
          initValue={configs["sekiro.defaultRegisterQuotaGroup"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "sekiro.outIpTestUrl",
      name: "出口ip探测URL",
      desc: "用户解析服务器节点的出口ip，需要该URL返回出口ip地址",
      component: (
        <SingleInputItem
          placeholder="出口ip探测URL"
          initKey="sekiro.outIpTestUrl"
          initValue={configs["sekiro.outIpTestUrl"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "sekiro.systemNotice",
      name: "系统通告信息",
      desc: "将会将文本推送到每个用户avatar",
      component: (
        <SingleInputItem
          placeholder="系统通告信息"
          initKey="sekiro.systemNotice"
          initValue={configs["sekiro.systemNotice"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "sekiro.docNotice",
      name: "文档首页通告信息",
      desc: "文档首页通告信息，在文档首页渲染的一个html片段，一般用于指定联系方式（支持二维码等）",
      component: (
        <SingleInputItem
          multiline
          placeholder="文档首页通告信息"
          initKey="sekiro.docNotice"
          initValue={configs["sekiro.docNotice"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "sekiro.useCustomSSLCertificate",
      name: "使用自定义的ssl证书",
      desc: "通过ssl（https、wss）访问网站时，需要设置ssl证书；开启本开关则证明需要使用用户配置的证书、关闭本开关则证明Sekiro将会模拟CA生成证书（请跟随文档安装根证书）",
      component: (
        <SingleInputItem
          type={"switch"}
          placeholder="使用自定义的ssl证书"
          initKey="sekiro.useCustomSSLCertificate"
          initValue={configs["sekiro.useCustomSSLCertificate"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "sekiro.autoGenSSLCertificateHostList",
      name: "自动ssl证书的host列表",
      desc: "当Sekior模拟CA生成证书时，寻找一个host列表，请在这里填写你部署网站的域名",
      component: (
        <SingleInputItem
          multiline
          placeholder="自动ssl证书的host列表"
          initKey="sekiro.autoGenSSLCertificateHostList"
          initValue={configs["sekiro.autoGenSSLCertificateHostList"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }
  ];

  useEffect(() => {
    apis.allConfig().then(res => {
      if (res.status === 0) {
        setConfigs(res.data);
      }
    }).catch(e => console.log(e));
  }, [refresh]);

  if (Object.keys(configs).length === 0) {
    return null;
  }

  return (
    <Card className={classes.root}>
      <CardHeader title="系统设置" action={(
        <CardActions className={classes.actions}>
          {/* <Button variant="contained" color="primary" onClick={doSave}>保存</Button> */}
        </CardActions>
      )}></CardHeader>
      <Divider/>
      <CardContent>
        {CONFIGS.map((item, index) => (
          <Accordion key={"panel" + index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography className={classes.heading}>{item.name}</Typography>
              <Typography className={classes.secondaryHeading}>{"" + configs[item.key]}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: "100%" }}>
                <Typography className={classes.desc}>填写说明：{item.desc}</Typography>
                <Divider className={classes.divider}/>
                <Grid container spacing={6} wrap="wrap">
                  {item.component}
                </Grid>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
};

export default Form;
