import { BarChart } from 'echarts/charts';
import {
  DataZoomComponent,
  DataZoomSliderComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components';
import { EChartsType, getInstanceByDom, init, use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import './index.less';
import getOption from './option';

use([
  LegendComponent,
  BarChart,
  TooltipComponent,
  MarkLineComponent,
  DataZoomComponent,
  DataZoomSliderComponent,
  GridComponent,
  SVGRenderer,
]);

export type BarConfigType = {
  // 每个series数据柱状图的名字，如果是多柱状图，传入数组
  name: string | string[];
  // 柱状图的颜色，如多柱状图不同系列的颜色
  itemColor: string | string[];
  // 柱状图是水平还是垂直
  orientation: 'horizontal' | 'vertical' | '';
  // 柱子的最大宽度
  barMaxWidth?: number;
  // 是否始终显示坐标轴标签
  alwaysShowLabel?: boolean;
  // 是否要显示dataZoom
  showDataZoom?: boolean;
  // x轴标签数据
  xAxis: { type: string; data: any };
  // x轴标签格式化函数
  xAxisLabelFormatter?: (value: string | number, index?: number) => string;
  // x轴标签最大宽度
  xAxisLabelWidth?: number;
  // y轴标签数据
  yAxis: { type: string; data: any };
  // y轴标签格式化函数
  yAxisLabelFormatter?: (value: string | number, index?: number) => string;
  // y轴标签最大宽度
  yAxisLabelWidth?: number;
  // 是否需要对柱状图进行分割
  needSplitLine?:
    | boolean
    | {
        text: string;
        value: number | string;
        unit: string;
      };
  // 是否可以点击x轴标签
  canClickXLabel?: boolean;
  // 是否可以点击y轴标签
  canClickYLabel?: boolean;
  // 点击坐标轴标签的事件
  clickLabelEvent: (params: any) => void;
  // 对原始数据进行格式化函数
  dataFormatter?: (data: any) => any;
  // 是否要显示柱状图的图例
  showBarLegend?: boolean;
  // 柱状图的tooltip格式化函数
  tooltipFormatter: (params: any) => any;
  // 是否有柱状图的label
  hasBarItemLabel?:
    | boolean
    | {
        name: string;
        unit: string;
      };
  // tooltip是否要挂载到body上
  appendToBody?: boolean;
};

interface IProps {
  id: string;
  data: any[] | any;
  clickEvent?: (params: any) => void;
  config: BarConfigType;
}

let isAnimating = false;

const Bar = React.forwardRef((props: IProps, ref) => {
  const { id, data, clickEvent, config } = props;
  const {
    canClickXLabel,
    canClickYLabel,
    clickLabelEvent,
    xAxis,
    yAxis,
    yAxisLabelWidth,
    showDataZoom,
  } = config;

  const isHorizontal = config.orientation === 'horizontal';

  const barChart = useRef<EChartsType>();
  let observer: any = null;

  const yAxisLabelTipRef = useRef<HTMLDivElement>(null);

  const barDomRef = useRef<HTMLDivElement>(null);

  let seriesIndex = 0;

  const setInAnimating = () => {
    isAnimating = true;
  };

  const setFinishAnimating = () => {
    isAnimating = false;
  };

  // 如果鼠标处于dataZoom区域内需要取消自定义的鼠标事件
  const judgeInDataZoom = (pixel: number[]) => {
    const chartWidth: any = barChart.current?.getWidth();
    const chartHeight: any = barChart.current?.getHeight();

    const rightMargin = chartWidth * 0.92;
    const bottomMargin = chartHeight * 0.92;

    return pixel[0] >= rightMargin || pixel[1] >= bottomMargin;
  };

  const recoverOption = () => {
    const dataZoom = barChart.current?.getOption().dataZoom;

    barChart?.current?.setOption({
      ...getOption({
        data,
        config,
        domInstance: barDomRef.current,
      }),
      dataZoom: dataZoom,
    });
  };

  const getHoverSeriesIndex = (params: any) => {
    if (params.seriesIndex !== undefined) {
      seriesIndex = params.seriesIndex;
    }
  };

  const originTextColor = canClickXLabel
    ? xAxis.data[0].textStyle.color
    : canClickYLabel
    ? yAxis.data[0].textStyle.color
    : [];

  const showyAxisLabelTip = (params: any) => {
    const pointInPixel = [params.offsetX, params.offsetY];

    const xPixelOfZero = (
      barChart.current?.convertToPixel({ seriesIndex: 0 }, [0, 0]) as number[]
    )[0];

    const yAxisData = yAxis.data;

    const yIndex = (
      barChart.current?.convertFromPixel(
        { seriesIndex: 0 },
        pointInPixel,
      ) as number[]
    )[1];

    const offsetLength = params.offsetX;

    if (
      yIndex !== undefined &&
      yIndex >= 0 &&
      yIndex < yAxisData.length &&
      xPixelOfZero &&
      offsetLength < xPixelOfZero
    ) {
      yAxisLabelTipRef.current!.style.visibility = 'visible';
      yAxisLabelTipRef.current!.style.opacity = '1';
      yAxisLabelTipRef.current!.style.top = params.offsetY - 36 + 'px';
      yAxisLabelTipRef.current!.innerHTML = yAxisData[yIndex]?.value;
    }
  };

  const hideyAxisLabelTip = () => {
    yAxisLabelTipRef.current!.style.visibility = 'hidden';
    yAxisLabelTipRef.current!.style.opacity = '0';
  };

  const changeCursorAndColor = (params: any) => {
    const pointInPixel = [params.offsetX, params.offsetY];

    if (judgeInDataZoom(pointInPixel) && showDataZoom) {
      return;
    }

    const [xIndex, yIndex] = barChart.current?.convertFromPixel(
      { seriesIndex: 0 },
      pointInPixel,
    ) as number[];

    const axisIndex = canClickXLabel ? xIndex : canClickYLabel ? yIndex : 0;

    const newOption: any = barChart.current?.getOption();
    const xAxisData = newOption.xAxis[0].data;
    const yAxisData = newOption.yAxis[0].data;

    const axisData = canClickXLabel
      ? xAxisData
      : canClickYLabel
      ? yAxisData
      : [];

    const containPixel = barChart.current?.containPixel('grid', pointInPixel);
    const pixelInX =
      xIndex !== undefined && xIndex >= 0 && xIndex < xAxisData.length;
    const pixelInY =
      yIndex !== undefined && yIndex >= 0 && yIndex < yAxisData.length;

    const changeItem = () => {
      if (containPixel) {
        barChart.current?.getZr().setCursorStyle('pointer');
      }

      if (!canClickXLabel && !canClickYLabel) return;

      if (canClickXLabel && pixelInX) {
        barChart.current?.getZr().setCursorStyle('pointer');
      }

      if (canClickYLabel && pixelInY) {
        barChart.current?.getZr().setCursorStyle('pointer');
      }

      const newAxisData = axisData.map((item: any, index: number) => {
        return {
          value: item?.value || undefined,
          textStyle: {
            color: index === axisIndex ? '#5b8ff9' : originTextColor,
          },
        };
      });

      if (canClickXLabel) {
        newOption.xAxis[0].data = newAxisData;
      }
      if (canClickYLabel) {
        newOption.yAxis[0].data = newAxisData;
      }
    };

    const recoverItem = () => {
      if (!canClickXLabel && !canClickYLabel) return;

      const newAxisData = axisData.map((item: any) => {
        return {
          value: item?.value || undefined,
          textStyle: {
            color: originTextColor,
          },
        };
      });

      if (canClickXLabel) {
        newOption.xAxis[0].data = newAxisData;
      }
      if (canClickYLabel) {
        newOption.yAxis[0].data = newAxisData;
      }
    };

    if (containPixel || pixelInX || pixelInY) {
      changeItem();
    } else {
      recoverItem();
    }

    if ((canClickXLabel || canClickYLabel) && !isAnimating) {
      barChart.current?.setOption(newOption as any, false, true);
    }
  };

  const clickOnGraph = (params: any) => {
    const pointInPixel = [params.offsetX, params.offsetY];

    if (judgeInDataZoom(pointInPixel) && showDataZoom) {
      return;
    }

    const [xIndex, yIndex] = barChart.current?.convertFromPixel(
      { seriesIndex: seriesIndex },
      pointInPixel,
    ) as number[];

    const index = isHorizontal ? yIndex : xIndex;

    const newData = Array.isArray(data[0]) ? data[seriesIndex] : data;

    const thisData = newData[index];

    if (barChart.current?.containPixel('grid', pointInPixel)) {
      clickEvent && clickEvent(thisData);
    }
  };

  const clickOnAxis = (params: any) => {
    const pointInPixel = [params.offsetX, params.offsetY];

    if (judgeInDataZoom(pointInPixel) && showDataZoom) {
      return;
    }

    const [xPixelOfZero, yPixelOfZero] = barChart.current?.convertToPixel(
      { seriesIndex: 0 },
      [0, 0],
    ) as number[];

    const pixelOfZero = canClickXLabel
      ? yPixelOfZero
      : canClickYLabel
      ? xPixelOfZero
      : 0;

    const [xIndex, yIndex] = barChart.current?.convertFromPixel(
      { seriesIndex: 0 },
      pointInPixel,
    ) as number[];

    const axisIndex = canClickXLabel ? xIndex : canClickYLabel ? yIndex : 0;

    const xAxisData = xAxis.data;
    const yAxisData = yAxis.data;

    const axisData = canClickXLabel
      ? xAxisData
      : canClickYLabel
      ? yAxisData
      : [];

    const offsetLength = canClickXLabel
      ? params.offsetY
      : canClickYLabel
      ? params.offsetX
      : 0;

    if (
      axisIndex !== undefined &&
      axisIndex >= 0 &&
      axisIndex < axisData.length &&
      pixelOfZero &&
      offsetLength < pixelOfZero
    ) {
      clickLabelEvent(axisData[axisIndex]);
    }
  };

  useImperativeHandle(ref, () => ({
    getInstance: () => {
      return barChart.current;
    },
    recoverOption: recoverOption,
  }));

  useEffect(() => {
    if (barDomRef.current) {
      barChart.current = getInstanceByDom(barDomRef.current);
      if (!barChart.current) {
        barChart.current = init(barDomRef.current);
      }

      barChart?.current?.setOption(
        getOption({
          data,
          config,
          domInstance: barDomRef.current,
        }),
        true,
      );

      barChart.current.getZr().on('mousemove', changeCursorAndColor);
      barChart.current.getZr().on('mouseout', recoverOption);

      barChart.current.on('dataZoom', setInAnimating);
      barChart.current.on('finished', setFinishAnimating);

      barChart.current.on('mouseover', getHoverSeriesIndex);

      if (!!yAxisLabelWidth) {
        barChart.current.getZr().on('mouseover', showyAxisLabelTip);
        barChart.current.getZr().on('mouseout', hideyAxisLabelTip);
      }

      if (clickEvent) {
        barChart.current.getZr().on('click', clickOnGraph);
      }

      if (canClickXLabel || canClickYLabel) {
        barChart.current.getZr().on('click', clickOnAxis);
      }

      observer = new ResizeObserver(() => {
        setTimeout(() => {
          barChart?.current?.resize();
        }, 0);
      });
      observer.observe(barDomRef.current);
    }
    return () => {
      // 会导致多次绑定同一事件，因此需要进行事件解绑
      barChart.current?.getZr().off('mousemove', changeCursorAndColor);
      barChart.current?.getZr().off('click', clickOnGraph);
      barChart.current?.getZr().off('click', clickOnAxis);
      barChart.current?.getZr().off('mouseout', recoverOption);
      barChart.current?.off('dataZoom', setInAnimating);
      barChart.current?.off('finished', setFinishAnimating);
      barChart.current?.off('mouseover', getHoverSeriesIndex);
      barChart.current?.getZr().off('mouseover', showyAxisLabelTip);
      barChart.current?.getZr().off('mouseout', hideyAxisLabelTip);

      if (observer) {
        observer.disconnect();
      }
    };
  }, [data, config]);

  return (
    <div className="bar-container">
      <div ref={yAxisLabelTipRef} className="y-axis-label-tip"></div>
      <div id={id} ref={barDomRef} className="body"></div>
    </div>
  );
});

export default Bar;
