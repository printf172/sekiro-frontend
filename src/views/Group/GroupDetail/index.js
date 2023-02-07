import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useHistory, useParams } from "react-router-dom";

import SekiroReportChart from "views/common/SekiroReportChart";
import { Button, Card, CardHeader } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import apis from "apis";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }, actions: {
    justifyContent: "center",
    margin: "2px"
  }
}));

const GroupDetail = () => {
  const classes = useStyles();
  const params = useParams();
  const history = useHistory();
  const [actionList, setActionList] = useState([]);
  useEffect(() => {
    apis.listAction({ groupName: params.groupName })
      .then(res => {
        if (res.status === 0) {
          setActionList(res.data);
        }
      });
  }, [params.groupName]);

  return (
    <div className={classes.root}>
      <Card>
        <CardHeader title={params.groupName} action={
          <>
            <Button
              startIcon={<ArrowBack style={{ fontSize: 16 }}/>}
              size="small"
              color="primary"
              className={classes.actions}
              onClick={() => {
                history.go(-1);
              }}>返回</Button>
          </>
        }/>
        <SekiroReportChart
          title={"group监控"}
          reportType={"group"}
          metricName={params.groupName}
        />

        {
          actionList.map(action => {
            return (
              <SekiroReportChart
                title={"action监控:" + action}
                reportType={"action"}
                metricName={params.groupName + "##" + action}
              />
            );
          })
        }
      </Card>
    </div>
  );
};

export default GroupDetail;
