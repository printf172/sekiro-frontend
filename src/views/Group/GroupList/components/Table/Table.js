import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/styles";
import { Table } from "views/common";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useHistory } from "react-router-dom";
import { Button, Card, CardActions, CardContent, TextField, Typography } from "@material-ui/core";
import { OpeDialog } from "components";
import apis from "apis";
import { SettingsApplications, Visibility } from "@material-ui/icons";

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
  }
}));

const DataTable = props => {
  const { className, data, total, rowsPerPage, pageState, setRefresh, ...rest } = props;
  const [page, setPage] = pageState;

  const classes = useStyles();
  const history = useHistory();

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const [editGroup, setEditGroup] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <Table
          data={data}
          columns={[{
            label: "分组",
            key: "groupName"
          }, {
            label: "所属用户",
            key: "userName"
          }, {
            label: "QPS限制",
            key: "quotaQpsGroup"
          }, {
            label: "设备qps限制",
            key: "quotaQpsPerDevice"
          }, {
            label: "创建时间",
            key: "createDate"
          }, {
            label: "操作",
            render: (item) =>
              <>
                <Button
                  startIcon={<Visibility style={{ fontSize: 16 }}/>}
                  size="small"
                  color="primary"
                  className={classes.tableButton}
                  onClick={() => {
                    history.push("/groupDetail/" + item["groupName"]);
                  }}
                  variant="contained">监控</Button>
                <Button
                  startIcon={<SettingsApplications style={{ fontSize: 16 }}/>}
                  size="small"
                  color="primary"
                  className={classes.tableButton}
                  onClick={() => {
                    setEditGroup({
                      ...item
                    });
                    setOpenDialog(true);
                  }}
                  variant="contained">设置</Button>
              </>
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
              Group GPS限制
            </Typography>
            <TextField
              className={classes.dialogInput}
              size="small"
              variant="outlined"
              type="number"
              placeholder="请输入Group GPS限制"
              value={editGroup.quotaQpsGroup}
              onChange={(e) => {
                setEditGroup({
                  ...editGroup,
                  quotaQpsGroup: e.target.value
                });
              }}/>
            <Typography variant="h6" style={{ marginTop: 10 }}>
              设备QPS限制
            </Typography>
            <TextField
              className={classes.dialogInput}
              size="small"
              variant="outlined"
              type="number"
              placeholder="请输入设备QPS限制"
              value={editGroup.quotaQpsPerDevice}
              onChange={(e) => {
                setEditGroup({
                  ...editGroup,
                  quotaQpsPerDevice: e.target.value
                });
              }}/>
          </>
        )}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return apis.setupQuota({
            group: editGroup.groupName,
            qpsQuota: editGroup.quotaQpsGroup,
            deviceQpsQuota: editGroup.quotaQpsPerDevice
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
