import { Col, Row } from 'antd';
import classNames from 'classnames';
import React from 'react';
import './index.less';

type ListItemProps = {
  isTitle?: boolean;
  data: string[];
  columnCnt: number[];
  rankOrder?: number;
  isActive?: boolean;
};

export function ListItem(props: ListItemProps) {
  const { isTitle, data, columnCnt, rankOrder, isActive } = props;

  return (
    <div className="list-item">
      <div className="rank-icon">
        {!isTitle && (
          <div
            className={classNames({
              'order-icon': true,
              'is-active': isActive,
            })}
          >
            {rankOrder}
          </div>
        )}
      </div>
      <div className="item-content">
        <Row>
          {columnCnt.map((item, index) => (
            <Col span={item} key={data[index]}>
              <div
                className={classNames({
                  content: true,
                  title: isTitle,
                  'is-active': isActive,
                })}
              >
                {data[index]}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
