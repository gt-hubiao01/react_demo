export default function getOption(props?: any) {
  const { data: originData, config, domInstance } = props;

  const isHorizontal = config.orientation === 'horizontal';

  const {
    needSplitLine,
    showBarLegend,
    itemColor = [],
    tooltipFormatter,
    name,
    xAxis,
    xAxisLabelWidth,
    yAxis,
    yAxisLabelWidth,
    hasBarItemLabel,
    dataFormatter,
    barMaxWidth,
    alwaysShowLabel,
    showDataZoom,
    xAxisLabelFormatter,
    yAxisLabelFormatter,
    appendToBody,
  } = config;

  const data = dataFormatter ? dataFormatter(originData) : originData;

  const isMultipleBar = Array.isArray(data[0]);

  const dataLength = Array.isArray(data[0]) ? data[0].length : data.length;

  const needDataZoom = () => {
    const defaultLength = document.fullscreenElement ? 18 : 6;
    return dataLength > defaultLength;
  };

  const endPercent = () => {
    const defaultLength = document.fullscreenElement ? 18 : 6;
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

    const item = isHorizontal
      ? { start: 100 - endPercent(), end: 100, yAxisIndex: [0] }
      : { start: 0, end: endPercent(), xAxisIndex: [0] };

    if (isHorizontal) {
      sliderDataZoomItem = {
        ...sliderDataZoomItem,
        ...item,
        right: '1%',
        width: 5,
      };

      insideDataZoom = {
        ...insideDataZoom,
        ...item,
      };
    } else {
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
    }

    dataZoom.push(sliderDataZoomItem);
    dataZoom.push(insideDataZoom);
  }

  let splitData: Array<any> = [];
  if (needSplitLine) {
    splitData.push(
      data.map((item: any) => ({
        ...item,
        value:
          item?.value > needSplitLine?.value
            ? needSplitLine?.value
            : item?.value,
      })),
    );
    splitData.push(
      data.map((item: any) => ({
        ...item,
        value:
          item?.value > needSplitLine?.value
            ? item?.value - needSplitLine?.value
            : 0,
      })),
    );
  }

  const series = [];
  series.push({
    name: Array.isArray(data[0]) ? name[0] : name,
    type: 'bar',
    barMaxWidth: barMaxWidth || 50,
    label: {
      show: hasBarItemLabel || false,
      position: isHorizontal ? 'right' : 'top',
      color: 'inherit',
      formatter: hasBarItemLabel.unit ? `{c}hasBarItemLabel.unit}` : null,
    },
    stack: needSplitLine ? 'total' : undefined,
    markLine: needSplitLine
      ? {
          // 设置平均线
          data: [
            {
              xAxis: isHorizontal ? needSplitLine?.value : undefined,
              yAxis: !isHorizontal ? needSplitLine?.value : undefined,
            },
          ],
          animation: false,
          lineStyle: {
            color: '#F2605E',
          },
          silent: true,
          symbol: 'none',
          emphasis: {
            lineStyle: {
              width: 1, // 设置和默认状态下一样的宽度
            },
          },

          label: {
            formatter: `${needSplitLine.text}${needSplitLine?.value}${needSplitLine.unit}`,
            backgroundColor: '#fff',
            borderColor: '#D7D7D7',
            borderWidth: 1,
            borderRadius: 4,
            padding: 4,
            color: '#F2605E',
            fontSize: 12,
            lineHeight: 16,
            position: 'end',
          },
        }
      : null,
    itemStyle: {
      color:
        isMultipleBar || needSplitLine ? itemColor[0] : itemColor || '#5B8FF9',
      borderRadius: needSplitLine
        ? [0]
        : isHorizontal
        ? [0, 8, 8, 0]
        : [8, 8, 0, 0],
      opacity: 0.9,
    },
    barGap: '0%',
    data: isMultipleBar
      ? data[0].map((item: any) => {
          return {
            ...item,
            itemStyle: {
              borderRadius:
                item?.value < 0
                  ? isHorizontal
                    ? [8, 0, 0, 8]
                    : [0, 0, 8, 8]
                  : undefined,
            },
          };
        })
      : needSplitLine
      ? splitData[0].map((item: any, index: number) => {
          return splitData[1][index]?.value > 0
            ? { ...item, itemStyle: { borderRadius: 0 } }
            : {
                ...item,
                itemStyle: {
                  borderRadius: isHorizontal ? [0, 8, 8, 0] : [8, 8, 0, 0],
                },
              };
        })
      : data,
  });

  if (needSplitLine) {
    series.push({
      name: name,
      type: 'bar',
      barMaxWidth: barMaxWidth || 50,
      stack: 'total',
      data: splitData[1],
      itemStyle: {
        color: itemColor[1] || '#F2605E',
        borderRadius: isHorizontal ? [0, 8, 8, 0] : [8, 8, 0, 0],
        opacity: 0.9,
      },
    });
  }

  if (isMultipleBar && data.length > 1) {
    for (let i = 1; i < data.length; i++) {
      series.push({
        name: name[i],
        type: 'bar',
        barMaxWidth: barMaxWidth || 50,
        barGap: '0%',
        data: data[i].map((item: any) => {
          return {
            ...item,
            itemStyle: {
              borderRadius:
                item?.value < 0
                  ? isHorizontal
                    ? [8, 0, 0, 8]
                    : [0, 0, 8, 8]
                  : undefined,
            },
          };
        }),
        itemStyle: {
          color: itemColor[i] || '#5B8FF9',
          borderRadius: isHorizontal ? [0, 8, 8, 0] : [8, 8, 0, 0],
          opacity: 0.9,
        },
      });
    }
  }

  const domHeight = domInstance.offsetHeight;

  const topGrid = showBarLegend
    ? domHeight * 0.03 + 20
    : needSplitLine
    ? domHeight * 0.03 + 30
    : domHeight * 0.03;

  const rightGrid =
    needDataZoom() && showDataZoom && isHorizontal ? '8%' : '4%';

  const bottomGrid =
    needDataZoom() && showDataZoom && !isHorizontal ? '6%' : '3%';

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
        // 如果是水平
        if (isHorizontal) {
          return [point[0] + 10, point[1] - dom.offsetHeight];
        } else {
          // 如果是垂直
          return [
            point[0] - dom.offsetWidth / 2,
            point[1] - dom.offsetHeight - 10,
          ];
        }
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
    legend: showBarLegend
      ? {
          padding: 0,
          icon: 'rect',
          itemGap: 20,
          itemWidth: 15,
          textStyle: {
            color: '#2C3542A6',
            fontSize: 12,
            fontWeight: 400,
          },
          type: 'scroll',
          orient: 'horizontal',
          right: 0,
          top: 0,
        }
      : undefined,
    grid: {
      top: topGrid,
      left: '3%',
      right: rightGrid,
      bottom: bottomGrid,
      containLabel: true,
    },
    xAxis: {
      axisLabel: {
        interval: alwaysShowLabel ? 0 : 'auto',
        rotate: isHorizontal ? 20 : undefined,
        width: xAxisLabelWidth,
        overflow: 'truncate',
        ellipsis: '...',
        formatter: xAxisLabelFormatter,
      },
      // triggerEvent: true,
      ...xAxis,
    },
    yAxis: {
      axisLabel: {
        interval: alwaysShowLabel ? 0 : 'auto',
        width: yAxisLabelWidth,
        overflow: 'truncate',
        ellipsis: '...',
        formatter: yAxisLabelFormatter,
      },
      triggerEvent: !!yAxisLabelWidth ? true : undefined,
      ...yAxis,
    },
    dataZoom: showDataZoom ? dataZoom : undefined,
    series: series,
  };
}
