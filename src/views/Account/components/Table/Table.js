import React, { useContext, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import Pagination from "@material-ui/lab/Pagination";
import DirectionsRailwayIcon from "@material-ui/icons/DirectionsRailway";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { makeStyles } from "@material-ui/styles";
import { Table } from "views/common";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  Button, Typography, TextField
} from "@material-ui/core";
import { AppContext } from "adapter";
import moment from "moment";

import apis from "apis";
import { OpeDialog } from "../../../../components";
import { SettingsApplications } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  nameContainer: {
    display: "flex",
    alignItems: "center"
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    justifyContent: "center"
  },
  tableButton: {
    marginRight: theme.spacing(1)
  },
  dialogInput: {
    width: "100%"
  }
}));

const DataTable = props => {
  const { setUser } = useContext(AppContext);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { className, data, total, rowsPerPage, pageState, setRefresh, ...rest } = props;
  const [page, setPage] = pageState;
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState({});
  const classes = useStyles();

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const doLogin = (item) => {
    apis.login({
      userName: item.userName,
      password: item.password
    }).then(res => {
      if (res.status !== 0) {
        enqueueSnackbar(res.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      } else {
        apis.setStore({ ...res.data, mock: true }, "sekiro-USER-MOCK");
        setUser({
          ...res.data,
          mock: true,
          time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        });
        history.push("/");
      }
    });
  };

  const grantAdmin = (item) => {
    apis.grantAdmin({
      userName: item.userName,
      isAdmin: !item.isAdmin
    }).then(res => {
      if (res.status !== 0) {
        enqueueSnackbar(res.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      } else {
        setRefresh(+new Date());
      }
    });
  };


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <Table
          data={data}
          columns={[
            {
              label: "账号",
              key: "userName"
            }, {
              label: "密码",
              key: "password"
            }, {
              label: "quotaQps",
              key: "quotaQps"
            }, {
              label: "管理员",
              render: (item) => (
                item.isAdmin ? (<p>是</p>) : (<p>否</p>)
              )
            }, {
              label: "操作",
              render: (item) => (
                <>
                  <Button
                    startIcon={<DirectionsRailwayIcon style={{ fontSize: 16 }}/>}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => doLogin(item)}
                    variant="contained">登录</Button>
                  <Button
                    startIcon={<SupervisorAccountIcon style={{ fontSize: 16 }}/>}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => grantAdmin(item)}
                    variant="contained">{item.isAdmin ? "移除管理员" : "升级管理员"}</Button>
                  <Button
                    startIcon={<SettingsApplications style={{ fontSize: 16 }}/>}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => {
                      setEditUser({
                        ...item
                      });
                      setOpenDialog(true);
                    }}
                    variant="contained">设置</Button>
                </>
              )
            }
          ]}
        />
      </CardContent>
      <CardActions className={classes.actions}>
        <Pagination
          count={Math.ceil(total / rowsPerPage) || 1}
          page={page}
          onChange={handlePageChange}
          shape="rounded"/>
      </CardActions>
      <OpeDialog
        title="设置quota"
        opeContent={(
          <>
            <Typography variant="h6">
              GPS限制
            </Typography>
            <TextField
              className={classes.dialogInput}
              size="small"
              variant="outlined"
              type="number"
              placeholder="请输入GPS限制"
              value={editUser.quotaQps}
              onChange={(e) => {
                setEditUser({
                  ...editUser,
                  quotaQps: e.target.value
                });
              }}/>
          </>
        )}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return apis.setupUserQPSQuota({
            userName: editUser.userName,
            quota: editUser.quotaQps
          }).then(res => {
            if (res.status === 0) {
              setRefresh(+new Date());
              return "操作成功";
            }
            throw new Error(res.message);
          });
        }}
        okText="保存"
        okType="primary"/>
    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
