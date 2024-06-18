import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import highTipIcon from '../../assets/highTipIcon.svg';
import higherIcon from '../../assets/higherIcon.svg';
import lowTipIcon from '../../assets/lowTipIcon.svg';
import lowerIcon from '../../assets/lowerIcon.svg';
import { ListItem } from './components';
import './index.less';

interface IProps {
  data: any[] | any;
  config: any;
}

function CustomRank(props: IProps) {
  const { data, config } = props;

  if (!config) {
    return null;
  }

  const {
    columnCnt,
    title,
    list,
    id,
    sortKey,
    averageText,
    activeId,
    higherText,
    lowerText,
  } = config;

  const [splitIndex, setSplitIndex] = useState<number>(-1);
  const [higherData, setHigherData] = useState<any[]>([]);
  const [lowerData, setLowerData] = useState<any[]>([]);
  const [currentData, setCurrentData] = useState<any>(null);
  const [currentRank, setCurrentRank] = useState<number>(-1);
  const [highMaxHeight, setHighMaxHeight] = useState<number>(66);
  const [lowMaxHeight, setLowMaxHeight] = useState<number>(66);
  const [top, setTop] = useState<boolean>(false);
  const [bottom, setBottom] = useState<boolean>(false);

  const [highTip, setHighTip] = useState<string>(highTipIcon);
  const [lowTip, setLowTip] = useState<string>(lowTipIcon);

  const [hoverHigher, setHoverHigher] = useState<boolean>(false);
  const [hoverLower, setHoverLower] = useState<boolean>(false);

  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  const listRef = useRef<HTMLDivElement>(null);
  const highItemsRef = useRef<HTMLDivElement>(null);
  const lowItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 延迟获取，否则内部元素还没有渲染完，导致高度为0
    setTimeout(() => {
      if (highItemsRef.current) {
        setHighMaxHeight(highItemsRef.current.offsetHeight);
      }
      if (lowItemsRef.current) {
        setLowMaxHeight(lowItemsRef.current.offsetHeight);
      }
    }, 10);
  }, [data]);

  useEffect(() => {
    let flag = false;
    let high = [];
    let low = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i][id] === activeId) {
        setCurrentData(data[i]);
        setCurrentRank(i + 1);
      }
      if (data[i][sortKey]) {
        high.push(data[i]);
      } else {
        low.push(data[i]);
      }

      if (data[i][sortKey] && i < data.length - 1 && !data[i + 1][sortKey]) {
        setSplitIndex(i);
        flag = true;
      }
      if (i === data.length - 1 && !flag && data[i][sortKey]) {
        setSplitIndex(i);
      }
    }

    if (high.length <= 1) {
      setHighTip(higherIcon);
    } else {
      setHighTip(highTipIcon);
    }
    if (low.length <= 1) {
      setLowTip(lowerIcon);
    } else {
      setLowTip(lowTipIcon);
    }

    setHigherData(high);
    setLowerData(low);
  }, [data, sortKey, id, activeId]);

  useEffect(() => {
    const handleScroll = () => {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        if (scrollTop === 0) {
          setTop(false);
        } else {
          setTop(true);
        }

        if (scrollTop < Math.abs(scrollHeight - clientHeight)) {
          setBottom(true);
        } else {
          setBottom(false);
        }
      }
    };

    setTimeout(() => {
      handleScroll();
    }, 10);

    if (listRef.current) {
      const { scrollHeight, clientHeight } = listRef.current;
      setTimeout(() => {
        setIsScrollable(scrollHeight > clientHeight);
      }, 10);
    }

    if (listRef.current) {
      listRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (listRef.current) {
        listRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="custom-rank-container">
      <div className="tips">
        <div className="tips-item">
          <div
            style={{
              opacity: `${hoverHigher || hoverLower ? '1' : '0'}`,
              transition: 'all 0.2s',
            }}
          >
            <img
              className="icon"
              src={hoverHigher ? higherIcon : hoverLower ? lowerIcon : ''}
            />
            <span className="text">
              {hoverHigher
                ? higherText || '高于平均线'
                : hoverLower
                ? lowerText || '低于平均线'
                : ''}
            </span>
          </div>
        </div>
      </div>

      {title && (
        <div className="list-title">
          <ListItem isTitle data={title} columnCnt={columnCnt} />
        </div>
      )}
      <div
        className={classNames({
          list: true,
          'top-shadow': top,
          'bottom-shadow': bottom,
          'both-shadow': top && bottom,
        })}
        ref={listRef}
      >
        <div
          className="list-items"
          ref={highItemsRef}
          onMouseOver={() => {
            setHoverHigher(true);
          }}
          onMouseLeave={() => {
            setHoverHigher(false);
          }}
        >
          {higherData.map((item: any, index: number) => (
            <ListItem
              key={item[id]}
              data={list.map((key: string) => item[key])}
              columnCnt={columnCnt}
              rankOrder={index + 1}
              isActive={item[id] === activeId}
            />
          ))}
        </div>
        <div
          className="average-container"
          style={
            {
              '--high-max-height': `${highMaxHeight - 5}px`,
              '--low-max-height': `${lowMaxHeight - 5}px`,
            } as React.CSSProperties
          }
        >
          <div className="average-line"></div>
          <div
            className={classNames({
              'line-text': true,
              'average-text': true,
            })}
          >
            {averageText}
          </div>
          <img
            style={{
              opacity: `${hoverHigher ? '1' : '0'}`,
              transition: 'all 0.2s',
            }}
            src={highTip}
            className="high-tip"
            onMouseOver={() => {
              setHoverHigher(true);
            }}
          />
          <img
            style={{
              opacity: `${hoverLower ? '1' : '0'}`,
              transition: 'all 0.2s',
            }}
            src={lowTip}
            className="low-tip"
            onMouseOver={() => {
              setHoverLower(true);
            }}
          />
        </div>
        <div
          className="list-items"
          ref={lowItemsRef}
          onMouseOver={() => {
            setHoverLower(true);
          }}
          onMouseLeave={() => {
            setHoverLower(false);
          }}
        >
          {lowerData.map((item: any, index: number) => (
            <ListItem
              key={item[id]}
              data={list.map((key: string) => item[key])}
              columnCnt={columnCnt}
              rankOrder={splitIndex + index + 2}
              isActive={item[id] === activeId}
            />
          ))}
        </div>
      </div>
      <div
        className={classNames({
          'current-rank-item': true,
          'current-item-padding': isScrollable,
        })}
      >
        {currentData && (
          <ListItem
            data={list.map((key: string) => currentData[key])}
            columnCnt={columnCnt}
            rankOrder={currentRank}
            isActive
          />
        )}
      </div>
    </div>
  );
}

export default CustomRank;
