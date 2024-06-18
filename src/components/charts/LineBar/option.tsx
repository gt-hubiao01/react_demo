export default function getOption(props?: any) {
  const { data: originData, config } = props;

  const {
    tooltipFormatter,
    name,
    xAxis,
    yAxis,
    itemLabel,
    isSmooth,
    dataFormatter,
    showLegend = true,
    barMaxWidth,
    showDataZoom,
    appendToBody,
  } = config;

  const series = [];

  const data = dataFormatter ? dataFormatter(originData) : originData;

  const dataLength = data.barData.length;

  const needDataZoom = () => {
    const defaultLength = document.fullscreenElement ? 24 : 6;
    return dataLength > defaultLength;
  };

  const endPercent = () => {
    const defaultLength = document.fullscreenElement ? 24 : 6;
    return Math.floor((defaultLength / dataLength) * 100);
  };

  const dataZoom: any[] = [];

  if (needDataZoom()) {
    let sliderDataZoomItem: Record<string, any> = {
      type: 'slider',
      show: true,
      brushSelect: false,
      showDetail: false,
      fillerColor: '#a1a1a1', // 滚动条颜色
      borderColor: '#ebebeb80',
      backgroundColor: '#f1f1f1', //两边未选中的滑动条区域的颜色
    };

    let insideDataZoom = {
      type: 'inside',
      zoomOnMouseWheel: false, // 关闭滚轮缩放
      moveOnMouseMove: false, // 关闭鼠标移动触发数据窗口平移
      moveOnMouseWheel: true, // 开启滚轮平移
    };

    const item = { start: 0, end: endPercent(), xAxisIndex: [0] };

    sliderDataZoomItem = {
      ...sliderDataZoomItem,
      ...item,
      bottom: '1%',
      height: 5,
    };

    insideDataZoom = {
      ...insideDataZoom,
      ...item,
    };

    dataZoom.push(sliderDataZoomItem);
    dataZoom.push(insideDataZoom);
  }

  const bottomGrid = needDataZoom() && showDataZoom ? '6%' : '3%';

  if (data.barData.length > 0) {
    series.push({
      name: name?.bar,
      type: 'bar',
      barMaxWidth: barMaxWidth || 50,
      label: {
        show: itemLabel?.bar || false,
        position: 'top',
        color: 'inherit',
        formatter: itemLabel?.bar?.unit ? `{c}${itemLabel?.bar.unit}` : null,
      },
      itemStyle: {
        color: '#5B8FF9',
        borderRadius: [8, 8, 0, 0],
        opacity: 0.9,
      },
      barGap: '0%',
      yAxisIndex: 0,
      data: data.barData.map((item: any) => {
        return {
          ...item,
          itemStyle: {
            borderRadius: item?.value < 0 ? [0, 0, 8, 8] : undefined,
          },
        };
      }),
    });
  }

  if (data.lineData.length > 0) {
    series.push({
      name: name?.line,
      type: 'line',
      smooth: isSmooth || false,
      label: {
        show: itemLabel?.line || false,
        position: 'top',
        color: 'inherit',
        formatter: itemLabel?.line?.unit ? `{c}${itemLabel?.line?.unit}` : null,
        offset: [-10, 0],
      },
      itemStyle: {
        color: '#F6BD16',
        borderWidth: 1,
        borderColor: '#F6BD16',
      },
      symbol: 'emptyCircle',
      yAxisIndex: 1,
      data: data.lineData,
    });
  }

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      borderWidth: 0,
      padding: 0,
      enterable: true,
      confine: true,
      appendToBody: appendToBody,
      position: (point: number[], _p: any, dom: any) => {
        return [
          point[0] - dom.offsetWidth / 2,
          point[1] - dom.offsetHeight - 10,
        ];
      },
      formatter: tooltipFormatter
        ? (params: any) => {
            return tooltipFormatter({
              params,
              marker: params[0].marker,
            });
          }
        : null,
    },
    legend: showLegend
      ? {
          padding: 0,
          itemGap: 20,
          textStyle: {
            color: '#2C3542A6',
            fontSize: 12,
            fontWeight: 400,
          },
          type: 'scroll',
          orient: 'horizontal',
          right: 0,
          top: 0,
          data: [name?.bar, name?.line],
        }
      : undefined,
    grid: {
      top: '12%',
      left: '3%',
      right: '4%',
      bottom: bottomGrid,
      containLabel: true,
    },
    xAxis: {
      axisLabel: {
        overflow: 'truncate',
        ellipsis: '...',
      },
      // triggerEvent: true,
      ...xAxis,
    },
    yAxis: Array.isArray(yAxis)
      ? yAxis.map((item) => ({
          axisLabel: {
            overflow: 'truncate',
            ellipsis: '...',
          },
          ...item,
        }))
      : {
          axisLabel: {
            overflow: 'truncate',
            ellipsis: '...',
          },
          // triggerEvent: true,
          ...yAxis,
        },
    dataZoom: showDataZoom ? dataZoom : undefined,
    series: series,
  };
}
