// import { getTextPixelWidth } from '../../utils/getTextPixelWitdh'
import { colors } from './ColorMap';

export const getOption = (props?: any) => {
  const { data: originData, config } = props;

  const {
    label,
    isRing,
    centerValue,
    tooltipFormatter,
    dataFormatter,
    appendToBody,
  } = config;

  const data = dataFormatter ? dataFormatter(originData) : originData;

  const options = {
    tooltip: {
      trigger: 'item',
      borderWidth: 0,
      padding: 0,
      enterable: true,
      confine: true,
      appendToBody: appendToBody,
      position: (point: number[], _p: any, dom: any, _r: any, size: any) => {
        // 判断鼠标是否在容器的上半部分
        if (point[1] < size.viewSize[1] / 2) {
          // 鼠标在左上角的1/4部分，鼠标在右下角
          if (point[0] < size.viewSize[0] / 2) {
            return [
              point[0] - dom.offsetWidth - 3,
              point[1] - dom.offsetHeight - 3,
            ];
          } else {
            // 鼠标在右上角的1/4部分，鼠标在左下角
            return [point[0] + 3, point[1] - dom.offsetHeight - 3];
          }
        } else {
          // 鼠标在左下角1/4部分，鼠标在右上角
          if (point[0] < size.viewSize[0] / 2) {
            return [point[0] - dom.offsetWidth - 3, point[1] + 3];
          } else {
            // 鼠标在右下角1/4部分，鼠标在左上角
            return [point[0] + 3, point[1] + 3];
          }
        }
      },
      textStyle: {
        fontSize: 12,
        fontWeight: 400,
      },
      formatter: tooltipFormatter
        ? (params: any) =>
            tooltipFormatter({
              marker: params.marker,
              params,
            })
        : '{b}: {c} ({d}%)',
    },
    legend: {
      data: data
        .map(({ value, name }: { value: number; name: string }) =>
          value > 0 ? name : undefined,
        )
        .filter(Boolean),
      padding: 0,
      left: 'center',
      icon: 'circle',
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
      bottom: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    series: [
      {
        type: 'pie',
        radius: isRing ? ['33%', '55%'] : ['0', '55%'],
        percentPrecision: 1,
        data: data.filter(({ value }: { value: number }) => value > 0),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          color: 'inherit',
          fontWeight: 400,
          fontSize: 12,
          formatter: (params: any) => {
            const labelFormatter =
              label?.formatter(params) ||
              `{dot|●} {main|${params.name} ${params?.value}}`;

            return labelFormatter;
          },
          // 用于将label文字设置到第二段引导线上方，现在使用默认的不需要
          // padding: [0, 0, label?.needWrap ? 35 : 20, 0],
          rich: {
            dot: {
              fontSize: 8,
            },
            main: {
              color: '#2C3542',
              fontSize: 12,
              lineHeight: 13,
              opacity: 0.65,
            },
            sub: {
              padding: [3, 0, 0, 12],
              color: '#2C3542',
              fontSize: 13,
              fontWeight: 500,
              lineHeight: 13,
            },
          },
        },
        // labelLine: {
        //   length: label?.needWrap ? 35 : 20, // 第一段线长
        //   length2: 0, // 第二段线长
        //   lineStyle: {
        //     width: 0.5,
        //     color: 'rgba(65, 97, 128, 0.45)',
        //   },
        // },
        // labelLayout: (params: any) => {
        //   // 左侧引导线、标签文字左对齐，右侧引导线、标签文字右对齐
        //   const isLeft = params.labelRect.x < chartInstance?.getWidth() / 2;
        //   const points = params.labelLinePoints;
        //   const mainMatch = params.text.match(/\{main\|([^}]*)\}/);
        //   const mainText = mainMatch ? mainMatch[1] : '';
        //   const labelWidth =
        //     getTextPixelWidth(mainText, 12) + getTextPixelWidth('● ', 8);
        //   // 更新第二段引导线的终止点
        //   if (points) {
        //     points[2][0] = isLeft
        //       ? points[2][0] - labelWidth - 10
        //       : points[2][0] + labelWidth + 10;
        //   }
        //   return {
        //     // 更新引导线点
        //     labelLinePoints: points,
        //   };
        // },
        center: ['50%', '45%'],
        top: 0,
        bottom: 0,
        // minShowLabelAngle: 8,
      },
    ],
    color: colors,
  };

  // 添加第二个不可见的pie的label来设置为环形图中间的内容
  if (isRing) {
    const newSeries = {
      type: 'pie',
      radius: ['0', '0'],
      emphasis: {
        disabled: true,
      },
      label: {
        show: true,
        position: 'center',
        formatter: () => {
          return isRing
            ? `{a|${isRing?.title}}\n{b|${
                isRing.getValue ? isRing?.getValue(data) : centerValue
              }${isRing?.unit}}`
            : '';
        },
        rich: {
          a: {
            color: '#2C3542',
            fontSize: 11,
            lineHeight: 13,
            opacity: 0.65,
          },
          b: {
            color: 'rgba(44, 53, 66, 0.85)',
            padding: [3, 0, 0, 0],
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 22,
          },
        },
      },
      center: ['50%', '45%'],
      top: 0,
      bottom: 0,
      tooltip: {
        showContent: false,
      },
      // 用于占位的假数据，无实际意义
      data: [{ value: 1, name: '平均值' }],
    };

    options.series.push(newSeries as any);
  }

  return options;
};
