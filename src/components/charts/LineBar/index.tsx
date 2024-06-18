import { BarChart, LineChart } from 'echarts/charts';
import {
  DataZoomComponent,
  DataZoomSliderComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { EChartsType, getInstanceByDom, init, use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import './index.less';
import getOption from './option';

use([
  DataZoomComponent,
  DataZoomSliderComponent,
  LegendComponent,
  BarChart,
  LineChart,
  TooltipComponent,
  GridComponent,
  SVGRenderer,
]);

export type LineBarConfigType = {
  // 柱状图和折线图的名称
  name: {
    line: string;
    bar: string;
  };
  // 柱子的最大宽度
  barMaxWidth?: number;
  // x轴标签数据
  xAxis: { type: string; data: any };
  // y轴标签数据
  yAxis: { type: string; data: any };
  // 折线是否是平滑的
  isSmooth?: boolean;
  // 是否要显示dataZoom
  showDataZoom?: boolean;
  // 对原始数据进行格式化函数
  dataFormatter?: (data: any) => any;
  // 是否要显示柱状图的图例
  showLegend?: boolean;
  // 柱状图的tooltip格式化函数
  tooltipFormatter: (params: any) => any;
  // 柱状图及折线图的label数据
  itemLabel?: {
    bar?: { unit: string };
    line?: { unit: string };
  };
  // tooltip是否要挂载到body上
  appendToBody?: boolean;
};

interface IProps {
  id: string;
  data: any[] | any;
  clickEvent?: (params: any) => void;
  config: LineBarConfigType;
}

const LineBar = React.forwardRef((props: IProps, ref) => {
  const { id, data, clickEvent, config } = props;

  const lineBarChart = useRef<EChartsType>();
  let observer: any = null;

  const lineBarDomRef = useRef<HTMLDivElement>(null);

  // 更改鼠标为pointer
  const changeCursor = (params: any) => {
    const pointInPixel = [params.offsetX, params.offsetY];
    if (lineBarChart.current?.containPixel('grid', pointInPixel)) {
      lineBarChart.current.getZr().setCursorStyle('pointer');
    }
  };

  const clickOnGraph = (params: any) => {
    const pointInPixel = [params.offsetX, params.offsetY];
    const [xIndex] = lineBarChart.current?.convertFromPixel(
      { seriesIndex: 0 },
      pointInPixel,
    ) as number[];

    const newData = data.barData;

    const thisData = newData[xIndex];

    if (lineBarChart.current?.containPixel('grid', pointInPixel)) {
      clickEvent && clickEvent(thisData);
    }
  };

  useImperativeHandle(ref, () => ({
    getInstance: () => {
      return lineBarChart.current;
    },
  }));

  useEffect(() => {
    if (lineBarDomRef.current) {
      lineBarChart.current = getInstanceByDom(lineBarDomRef.current);
      if (!lineBarChart.current) {
        lineBarChart.current = init(lineBarDomRef.current);
      }

      lineBarChart?.current?.setOption(
        getOption({
          data,
          config,
        }),
        true,
      );

      lineBarChart.current.getZr().on('mousemove', changeCursor);

      if (clickEvent) {
        lineBarChart.current.getZr().on('click', clickOnGraph);
      }

      observer = new ResizeObserver(() => {
        setTimeout(() => {
          lineBarChart?.current?.resize();
        }, 0);
      });
      observer.observe(lineBarDomRef.current);
    }
    return () => {
      lineBarChart.current?.getZr().off('mousemove', changeCursor);
      lineBarChart.current?.getZr().off('click', clickOnGraph);
    };
  }, [data, config]);

  return <div id={id} ref={lineBarDomRef} className="body"></div>;
});

export default LineBar;
