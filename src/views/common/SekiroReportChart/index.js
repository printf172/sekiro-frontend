import ReactEcharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import { Button, Card, Grid, MenuItem, Select } from "@material-ui/core";
import apis from "apis";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import * as XLSX from "xlsx";


const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    padding: theme.spacing(1)
  },
  actions: {
    justifyContent: "center",
    margin: "2px"
  },
  inputItem: {
    width: "50%"
  },
  export: {
    marginTop: "5px"
  }
}));
const getOption = (title, legends, x, series) => {
  return {
    title: {
      left: "center",
      text: title
    },
    tooltip: {
      trigger: "axis"
    },
    legend: {
      orient: "vertical",
      left: "right",
      bottom: "middle",
      data: legends
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: x
    },
    yAxis: {
      type: "value"
    },
    series: series
  };
};

const countLegends = ["总量", "成功", "失败", "系统错误", "流量(KB)", "成功率"];

const SekiroReportChart = (props) => {
  const { title, reportType, metricName } = props;
  const [reportData, setReportData] = useState([]);
  const [accuracy, setAccuracy] = useState("hours");
  const [optChart, setOptChart] = useState(getOption(title, countLegends, [], []));
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    apis.fetchReporter({
      accuracy: accuracy,
      reportType: reportType,
      metricName: metricName
    }).then((res) => {
      if (res.status !== 0) {
        enqueueSnackbar(res.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
        return;
      }
      setReportData(res.data);
      let xAxisData = [];
      let series = countLegends.map(item => {
        return {
          name: item,
          type: "line",
          data: []
        };
      });
      res.data.forEach((item) => {
        xAxisData.push(item.reportTimeStr);
        series[0].data.push(item.totalCount);
        series[1].data.push(item.successCount);
        series[2].data.push(item.failedCount);
        series[3].data.push(item.errorCount);
        series[4].data.push(item.flow / 1024);
        series[5].data.push(item.successCount * 100 / item.totalCount);
      });

      setOptChart(getOption(title, countLegends, xAxisData, series));
    });
  }, [accuracy, reportType, metricName, enqueueSnackbar, title]);


  const exportToExcel = () => {
    XLSX.writeFile({
      SheetNames: ["sheet1"],
      Sheets: {
        sheet1: XLSX.utils.json_to_sheet(reportData)
      }
    }, "sekiro-report-" + accuracy + "-" + reportType + "-" + metricName + ".xlsx");
  };

  return (
    <Card className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          <ReactEcharts
            option={optChart}
            style={{ width: "100%", height: "300px" }}/>
        </Grid>
        <Grid item xs={2}>
          <div>
            <Button
              className={classes.actions}
              size={"large"}>指标精确度</Button>
            <Select
              className={classes.inputItem}
              variant="outlined"
              value={accuracy}
              onChange={(e) =>
                setAccuracy(e.target.value)
              }
            >
              {["hours", "days"].map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </div>

          <Button className={classes.export} fullWidth variant="contained" color="primary" onClick={exportToExcel}>
            导出
          </Button>
        </Grid>
      </Grid>

    </Card>
  );
};

SekiroReportChart.propTypes = {
  title: PropTypes.string.isRequired,
  reportType: PropTypes.string.isRequired,
  metricName: PropTypes.string.isRequired
};


export default SekiroReportChart;