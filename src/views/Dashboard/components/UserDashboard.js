import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Popover,
  Typography
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { AppContext } from "adapter";
import { useSnackbar } from "notistack";
import { CopyToClipboard } from "react-copy-to-clipboard";
import clsx from "clsx";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CachedIcon from "@material-ui/icons/Cached";
import moment from "moment";
import apis from "apis";
import SetLoginPassword from "./SetLoginPassword";
import { Battery60, Eco, NetworkCheck, OfflinePin } from "@material-ui/icons";
import SekiroReportChart from "../../common/SekiroReportChart";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%"
  },
  content: {
    alignItems: "center",
    display: "flex"
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.success.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  mt: {
    marginTop: theme.spacing(4)
  },
  mr: {
    marginRight: theme.spacing(6)
  },
  pd: {
    width: theme.spacing(18),
    paddingLeft: theme.spacing(1),
    textAlign: "center"
  },
  url: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    lineHeight: "1.2em",
    wordBreak: "break-all",
    cursor: "pointer"
  },
  padding: {
    padding: theme.spacing(2)
  },
  formControl: {
    width: theme.spacing(20),
    margin: theme.spacing(2)
  },
  pop: {
    padding: theme.spacing(2)
  },
  popBtns: {
    marginTop: theme.spacing(2),
    textAlign: "center"
  }
}));
const Items = props => {
  const classes = useStyles();
  return (
    <Grid
      item
      sm={6}
      xs={12}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <Avatar className={classes.avatar}>
          {props.icon}
        </Avatar>
      </Grid>
      <Grid item className={classes.pd}>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
          variant="body2"
        >
          {props.title}
        </Typography>
        <Typography variant="h3" align="center">{props.data}</Typography>
      </Grid>
    </Grid>
  );
};

const Budget = props => {
  const { className, ...rest } = props;
  const { user, setUser } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const [accuracy, setAccuracy] = useState("hours");
  const apiUrl = user.apiToken;

  const classes = useStyles();


  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const doRefreshApiToken = () => {
    apis.regenerateAPIToken().then(res => {
      if (res.status === 0) {
        let user = apis.getStore();
        user.apiToken = res.data.apiToken;
        apis.setStore(user);
        setUser({
          ...user,
          time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        });
      }
    });
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          spacing={4}
        >

          <Items
            icon={(<Eco className={classes.icon}/>)}
            title="总调用次数"
            data={user.invokeCount || 0}
          />
          <Items
            icon={(<NetworkCheck className={classes.icon}/>)}
            title="最大并发"
            data={`${user.quotaQps}次/s`}
          />

        </Grid>
      </CardContent>
      <CardHeader title="API TOKEN"/>
      <Divider/>
      <CardContent>
        <Grid
          container
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography
              className={classes.url}
              color="textSecondary"
              variant="caption"
            >
              {apiUrl}
              <CopyToClipboard text={apiUrl}
                               onCopy={() => enqueueSnackbar("复制成功", {
                                 variant: "success",
                                 anchorOrigin: {
                                   vertical: "top",
                                   horizontal: "center"
                                 }
                               }, 2)}>
                <IconButton style={{ marginLeft: 15 }} color="primary" aria-label="upload picture" component="span">
                  <FileCopyIcon/>
                </IconButton>
              </CopyToClipboard>
              <IconButton
                onClick={handleClick}
                style={{ marginLeft: 15 }}
                color="primary"
                aria-label="upload picture"
                component="span">
                <CachedIcon/>
              </IconButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center"
                }}
              >
                <div className={classes.pop}>
                  <Alert severity="warning">
                    <AlertTitle>APIToken 刷新后，通过 API 访问 sekiro 后台的请求将会被阻断</AlertTitle>
                    如果 APIToken 没有泄漏，不建议重制 Token
                  </Alert>
                  <div className={classes.popBtns}>
                    <Button
                      onClick={handleClose}
                      color="primary"
                      aria-label="upload picture"
                      component="span">
                      取消
                    </Button>
                    <Button
                      onClick={() => {
                        doRefreshApiToken();
                        handleClose();
                      }}
                      style={{ marginLeft: 15 }}
                      color="primary"
                      aria-label="upload picture"
                      component="span">
                      确定
                    </Button>
                  </div>
                </div>
              </Popover>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider/>
      <SetLoginPassword/>
      <Divider/>
      {
        !!user.userName ? <SekiroReportChart
          title={"用量监控"}
          accuracy={accuracy}
          reportType={"user"}
          metricName={user.userName}
        /> : <></>
      }
    </Card>
  );
};

export default Budget;
