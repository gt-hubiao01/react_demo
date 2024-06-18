import { LineChart } from 'echarts/charts';
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
  LineChart,
  TooltipComponent,
  GridComponent,
  SVGRenderer,
]);

export type LineConfigType = {
  // 柱状图和折线图的名称
  name: string[];
  // x轴标签数据
  xAxis: { type: string; data: any };
  // y轴标签数据
  yAxis: { type: string; data: any };
  // 对原始数据进行格式化函数
  dataFormatter?: (data: any) => any;
  // 折线图的tooltip格式化函数
  tooltipFormatter: (params: any) => any;
  // 折线图的areaStyle配置
  areaStyle: any;
  // tooltip是否要挂载到body上
  appendToBody?: boolean;
};

interface IProps {
  id: string;
  data: any[] | any;
  clickEvent?: (params: any) => void;
  config: LineConfigType;
}

const Line = React.forwardRef((props: IProps, ref) => {
  const { id, data, config } = props;

  const lineChart = useRef<EChartsType>();
  let observer: any = null;

  const lineDomRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getInstance: () => {
      return lineChart.current;
    },
  }));

  const setCursorDefault = (params: any) => {
    const pointInPixel = [params.offsetX, params.offsetY];
    const containPixel = lineChart.current?.containPixel('grid', pointInPixel);

    if (containPixel || params.componentType === 'series') {
      lineChart.current?.getZr().setCursorStyle('default');
    }
  };

  useEffect(() => {
    if (lineDomRef.current) {
      lineChart.current = getInstanceByDom(lineDomRef.current);
      if (!lineChart.current) {
        lineChart.current = init(lineDomRef.current);
      }

      lineChart?.current?.setOption(
        getOption({
          data,
          config,
        }),
        true,
      );

      lineChart.current.getZr().on('mousemove', setCursorDefault);

      observer = new ResizeObserver(() => {
        setTimeout(() => {
          lineChart?.current?.resize();
        }, 0);
      });
      observer.observe(lineDomRef.current);
    }

    return () => {
      // 会导致多次绑定同一事件，因此需要进行事件解绑
      lineChart.current?.getZr().off('mousemove', setCursorDefault);

      if (observer) {
        observer.disconnect();
      }
    };
  }, [data, config]);

  return <div id={id} ref={lineDomRef} className="body"></div>;
});

export default Line;
