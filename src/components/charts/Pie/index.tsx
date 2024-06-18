import { PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { EChartsType, getInstanceByDom, init, use } from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import './index.less';
import { getOption } from './option';

use([
  LegendComponent,
  PieChart,
  TooltipComponent,
  GridComponent,
  SVGRenderer,
  LabelLayout,
]);

type PieConfigType = {
  // 对饼图的label进行设置
  label: {
    // label文字是否需要换行
    needWrap: boolean;
    // label文字的具体formatter函数
    formatter: (params: any) => string;
  };
  // 对原始数据进行格式化的函数
  dataformatter?: (data: any) => any;
  // 饼图的tooltip格式化函数
  tooltipFormatter: (params: any) => any;
  // 是否是环形图，及环形图的配置
  isRing: {
    // 环形图中间label的标题
    title: string;
    // 环形图中间label值的单位
    unit: string;
    // 环形图中间label值，当可以前端计算时使用
    getValue: (data: any) => number | string;
  };
  // 环形图中间的值，例如请求后端接口获取到的值
  centerValue?: number | string;
  // tooltip是否要挂载到body上
  appendToBody?: boolean;
};

interface IProps {
  id: string;
  data: any[] | any;
  config: PieConfigType;
  clickEvent?: (params: any) => void;
}

const Pie = React.forwardRef((props: IProps, ref): React.ReactElement => {
  const { id, data, config, clickEvent } = props;

  const pieChart = useRef<EChartsType>();
  let observer: any = null;

  const pieDomRef = useRef<HTMLDivElement>(null);

  const setCursorDefault = (params: any) => {
    if (params.seriesIndex === 1) {
      pieChart.current && pieChart.current.getZr().setCursorStyle('default');
    }
  };

  const clickPie = (params: any) => {
    if (params.componentIndex !== 0) return;
    const { data } = params;

    if (pieChart.current) {
      pieChart.current.dispatchAction({
        type: 'hideTip',
      });
    }
    clickEvent && clickEvent(data);
  };

  useImperativeHandle(ref, () => ({
    getInstance: () => {
      return pieChart.current;
    },
  }));

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0 && pieDomRef.current) {
      pieChart.current = getInstanceByDom(pieDomRef.current);
      if (!pieChart.current) {
        pieChart.current = init(pieDomRef.current, undefined, {
          renderer: 'svg',
          useDirtyRect: false,
        });
      }

      pieChart?.current?.setOption(
        getOption({
          data,
          config,
          chartInstance: pieChart.current,
        }),
        true,
      );

      // 环形图时，需要设置鼠标悬浮到中间的label上时为默认样式
      if (pieChart.current && config.isRing) {
        pieChart.current.on('mousemove', setCursorDefault);
      }

      if (clickEvent) {
        pieChart.current.on('click', clickPie);
      }

      observer = new ResizeObserver(() => {
        pieChart?.current?.resize();
      });
      observer.observe(pieDomRef.current);
    }
    return () => {
      pieChart.current?.off('mousemove', setCursorDefault);
      pieChart.current?.off('click', clickPie);

      if (observer) {
        observer.disconnect();
      }
    };
  }, [data, config]);

  return <div id={id} ref={pieDomRef} className="body" />;
});

export default Pie;
