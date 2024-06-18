import { colors } from './ColorMap';

export default function getOption(props?: any) {
  const { data: originData, config } = props;

  const {
    tooltipFormatter,
    name,
    xAxis,
    yAxis,
    dataFormatter,
    areaStyle,
    showLegend = true,
    appendToBody,
  } = config;

  const series = [];

  const data = dataFormatter ? dataFormatter(originData) : originData;

  let isMultipleLine = false;

  if (Array.isArray(data[0])) {
    isMultipleLine = true;
  }

  series.push({
    name: name?.[0],
    type: 'line',
    lineStyle: {
      width: 2,
    },
    symbol: 'emptyCircle',
    showSymbol: true,
    areaStyle: areaStyle,
    emphasis: {
      focus: 'none',
    },
    data: isMultipleLine ? data[0] : data,
  });

  if (isMultipleLine && data.length > 1) {
    for (let i = 1; i < data.length; i++) {
      series.push({
        name: name[i],
        type: 'line',
        areaStyle: areaStyle,
        emphasis: {
          focus: 'none',
        },
        data: data[i],
        lineStyle: {
          width: 2,
        },
        symbol: 'emptyCircle',
        showSymbol: true,
      });
    }
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
          data: name,
        }
      : undefined,
    grid: {
      top: '12%',
      left: '3%',
      right: '4%',
      bottom: '3%',
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
    series: series,
    color: colors,
  };
}
