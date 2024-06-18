import {
  SyncOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import D3Tree from '@modify/react-d3-tree';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { minusPath, plusPath } from './icons';
import './index.less';
import { getAllInitialKeys } from './utils';

interface IProps {
  title?: React.ReactNode; // 左上角的标题
  dataKey?: string; // 用于标识树的唯一key
  data: any; // 渲染数据
  resetBtn?: boolean; // 是否要显示重置按钮
  nodeSize?: { x: number; y: number }; // 节点大小
  rootNodeSize?: { x: number; y: number }; // 节点大小
  shouldCollapseNeighborNodes?: boolean; // 展开节点时是否折叠相邻节点
  expandDepth?: number; // 展开深度
  idKey: string; // 确定唯一节点的key
  scaleExtent?: { max: number; min: number }; // 缩放范围
  zoomableBtn?: boolean; // 是否要显示缩放按钮
  zoomable?: boolean; // 是否可以缩放
  zoomStep?: number; // 缩放步长
  nodeContainer?: (children: any) => React.JSX.Element; // 自定义节点的容器
  rooteNode?: (params: any) => React.ReactNode; // 自定义根节点
  customNode?: (params: any) => React.ReactNode; // 完全自定义节点元素
  expandBtnColor?: string; // 设置展开收起按钮颜色
  expandBtnSize?: number; // 设置展开收起按钮大小
  nodeColor?: string | ((params: any) => string); // 设置节点颜色
  lineStyle?: string; // 设置连接线样式
  clickNode?: (params: any) => void; // 点击节点事件
  checkIsLeaf?: (params: any) => boolean; // 检查是否是叶子节点
  data1?: (params: any) => string | React.ReactNode; // 设置第一排内容
  data2?: (params: any) => string | React.ReactNode; // 设置第二排内容
  data3?: (params: any) => string | React.ReactNode; // 设置第三排内容
  data4?: (params: any) => string | React.ReactNode; // 设置第四排内容
  asyncLoadData?: (params: any) => any; // 异步加载数据,若不传则默认为无需异步加载
  collapseChildren?: boolean;
  forbidWheel?: boolean; // 是否禁用默认滚轮事件
  extraBtn?: React.ReactNode; // 额外的按钮,在右上角
}

function Tree(props: IProps) {
  const {
    title,
    dataKey = 'my-react-d3-tree',
    data,
    resetBtn,
    nodeSize = { x: 54, y: 167 },
    rootNodeSize = { x: 144, y: 122 },
    shouldCollapseNeighborNodes = true,
    expandDepth = 1,
    idKey,
    scaleExtent = { max: 1.2, min: 0.3 },
    zoomableBtn = true,
    zoomable = false,
    zoomStep = 0.1,
    nodeContainer,
    rooteNode,
    customNode,
    expandBtnColor,
    expandBtnSize,
    nodeColor,
    lineStyle,
    clickNode,
    checkIsLeaf,
    data1,
    data2,
    data3,
    data4,
    asyncLoadData,
    collapseChildren,
    forbidWheel = true,
    extraBtn,
  } = props;

  const [translate, setTransLate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(1);

  const scale = useMemo(() => Math.floor(zoom * 100) + '%', [zoom]);

  // 存储toggleNode方法
  const toggleNodeRef = useRef<any>(null);

  // 已经加载过的数据key集合
  const loadedDataSet = useRef(new Set());
  // 控制异步请求时的loading
  const loadingBtnId = useRef(new Set());

  const treeRef = useRef<any>(null);

  useEffect(() => {
    const keys = getAllInitialKeys(data, idKey);
    keys.forEach((key) => {
      loadedDataSet.current.add(key);
    });
  }, [data, idKey]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const isFullScreen = document.fullscreenElement !== null;

        const { width, height } = containerRef.current?.getBoundingClientRect();
        const nodeSizeY = nodeSize.y;
        setTransLate({
          x: width / 2,
          y: isFullScreen ? height / 4 : nodeSizeY + 28,
        });
        setDimensions({
          width,
          height: isFullScreen ? height : (nodeSizeY + 28) * 2,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 在组件卸载时取消监听
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const resetTree = () => {
    if (treeRef.current) {
      treeRef.current.resetToOrigin();
      treeRef.current.resetToFirstLevel();
      // resetToFirstLevel这个方法会重置缩放比例为1，为防止缩放比例状态不一致，在这里也需要将其重置为1
      setZoom(1);
    }
  };

  const setTreeZoom = (zoomLevel: number) => {
    if (treeRef.current) {
      treeRef.current.setZoom(zoomLevel);
    }
  };

  const handleZoomIn = () => {
    setTreeZoom(zoom + zoomStep);
    setZoom((pre) => pre + zoomStep);
  };

  const handleZoomOut = () => {
    setTreeZoom(zoom - zoomStep);
    setZoom((pre) => pre - zoomStep);
  };

  const customPathFunc = (linkDatum: any) => {
    const { source, target } = linkDatum;
    const leafSubLength = target.height === 0 ? 16 : 0;
    const btnMoveLength = 30; // 展开收起按钮上移高度

    // 检查源节点和目标节点的位置
    // 绘制连接线
    return `M${source.x},${source.y}V${source.y + btnMoveLength}H${target.x}V${
      target.y - leafSubLength
    }`;
  };

  const renderCustomNodeElement = (rd3tProps: any) => {
    const { nodeDatum, toggleNode, addChildren } = rd3tProps;

    if (!toggleNodeRef.current) {
      toggleNodeRef.current = toggleNode;
    }

    const isRootNode = nodeDatum.__rd3t.depth === 0;

    const newNodeSize = isRootNode ? rootNodeSize : nodeSize;

    const isLeaf = checkIsLeaf
      ? checkIsLeaf(nodeDatum)
      : !(nodeDatum.children && nodeDatum.children.length > 0);

    const clickToggleBtn = async () => {
      toggleNode();

      if (
        !loadedDataSet.current.has(nodeDatum[idKey]) &&
        asyncLoadData &&
        nodeDatum.__rd3t.collapsed
      ) {
        loadingBtnId.current.add(nodeDatum.__rd3t.id);
        loadedDataSet.current.add(nodeDatum[idKey]);
        try {
          const data = await asyncLoadData(nodeDatum);
          addChildren(data);
        } catch (error) {
          console.error(error);
          loadedDataSet.current.delete(nodeDatum[idKey]);
        } finally {
          loadingBtnId.current.delete(nodeDatum.__rd3t.id);
        }
      }
    };

    const newNodeColor =
      typeof nodeColor === 'function' ? nodeColor(nodeDatum) : nodeColor;

    const nodeContent = isRootNode ? (
      rooteNode ? (
        rooteNode(nodeDatum)
      ) : (
        <div
          className="root-tree-node-box"
          style={
            {
              '--node-color': newNodeColor || '#FF6F6F',
            } as React.CSSProperties
          }
          onClick={() => {
            clickNode && clickNode(nodeDatum);
          }}
        >
          <div className="root-above-content">
            <div className="root-above-content-above">
              {data1 ? data1(nodeDatum) : nodeDatum?.department || ''}
            </div>
            <div className="root-above-content-below">
              {data2
                ? data2(nodeDatum)
                : `${nodeDatum?.leaveMount || ''}(${
                    nodeDatum?.leaveRate || ''
                  })`}
            </div>
          </div>
          <div className="root-below-content">
            <div className="root-below-content-above">
              {data3 ? data3(nodeDatum) : nodeDatum?.name || ''}
            </div>
            <div className="root-below-content-below">
              {data4 ? data4(nodeDatum) : nodeDatum?.level || ''}
            </div>
          </div>
        </div>
      )
    ) : customNode ? (
      customNode(nodeDatum)
    ) : (
      <div
        className="tree-node-box"
        style={
          {
            '--node-color': newNodeColor || '#FF6F6F',
          } as React.CSSProperties
        }
        onClick={() => {
          clickNode && clickNode(nodeDatum);
        }}
      >
        <div className="above-content">
          <div className="above-content-above">
            {data1 ? data1(nodeDatum) : nodeDatum?.department || ''}
          </div>
          <div className="above-content-below">
            {data2
              ? data2(nodeDatum)
              : `${nodeDatum?.leaveMount || ''}(${nodeDatum?.leaveRate || ''})`}
          </div>
        </div>
        <div className="below-content">
          <div className="below-content-above">
            {data3 ? data3(nodeDatum) : nodeDatum?.name || ''}
          </div>
          <div className="below-content-below">
            {data4 ? data4(nodeDatum) : nodeDatum?.level || ''}
          </div>
        </div>
      </div>
    );

    const finalNode = nodeContainer ? nodeContainer(nodeContent) : nodeContent;

    return (
      <g>
        <foreignObject
          transform={`translate(-${newNodeSize.x / 2}, -${newNodeSize.y + 16})`}
          width={`${newNodeSize.x + 8 + 'px'}`}
          height={`${newNodeSize.y + 8 + 'px'}`}
        >
          {finalNode}
        </foreignObject>
        {!isLeaf &&
          (loadingBtnId.current.has(nodeDatum.__rd3t.id) ? (
            <g className="spinner">
              <circle
                className="path"
                r={expandBtnSize || 9}
                fill="none"
                stroke={expandBtnColor || '#F26060'}
                strokeWidth="2"
              />
            </g>
          ) : (
            <g onClick={clickToggleBtn}>
              <circle
                r={expandBtnSize || 9}
                fill="white"
                stroke={expandBtnColor || '#F26060'}
                strokeWidth={1.5}
              />
              <path
                d={
                  nodeDatum.__rd3t.collapsed
                    ? plusPath(expandBtnSize || 9)
                    : minusPath(expandBtnSize || 9)
                }
                stroke={expandBtnColor || '#F26060'}
                strokeWidth={1.5}
              />
            </g>
          ))}
      </g>
    );
  };

  const disabelZoomInBtn = useMemo(() => zoom >= scaleExtent.max, [zoom]);
  const disabelZoomOutBtn = useMemo(
    () => zoom <= scaleExtent.min + 0.1,
    [zoom],
  );

  return (
    <div className="tree-container" ref={containerRef}>
      <div className="top-header-line">
        <div className="top-header-line-left">{title}</div>
        <div className="top-header-line-center">
          <div className="operate-btns">
            {zoomableBtn && (
              <span className="zoom-btns">
                <ZoomOutOutlined
                  onClick={disabelZoomOutBtn ? undefined : handleZoomOut}
                  className={`${disabelZoomOutBtn ? 'disabel-zoom-btn' : ''}`}
                />
                <span className="zoom-scale">{scale}</span>
                <ZoomInOutlined
                  onClick={disabelZoomInBtn ? undefined : handleZoomIn}
                  className={`${disabelZoomInBtn ? 'disabel-zoom-btn' : ''}`}
                />
              </span>
            )}
            {resetBtn && (
              <span className="reset-btn" onClick={resetTree}>
                <SyncOutlined /> <span className="reset-btn-text">重置</span>
              </span>
            )}
          </div>
        </div>
        <div className="top-header-line-right">{extraBtn}</div>
      </div>
      <div className="tree">
        <D3Tree
          nodeKey={idKey}
          ref={treeRef}
          dataKey={dataKey}
          data={data}
          dimensions={dimensions}
          collapseChildren={collapseChildren}
          orientation="vertical"
          initialDepth={expandDepth}
          translate={translate}
          pathFunc={customPathFunc}
          separation={{ siblings: 1.2, nonSiblings: 1.2 }}
          depthFactor={nodeSize.y + 72}
          nodeSize={nodeSize}
          enableLegacyTransitions={true}
          scaleExtent={scaleExtent}
          transitionDuration={500}
          pathClassFunc={() => lineStyle || 'default-line'}
          shouldCollapseNeighborNodes={shouldCollapseNeighborNodes}
          renderCustomNodeElement={renderCustomNodeElement}
          zoomable={zoomable}
          forbidWheel={forbidWheel}
        />
      </div>
    </div>
  );
}

export default Tree;
