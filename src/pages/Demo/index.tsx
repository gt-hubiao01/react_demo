import React from 'react';
import { Card, Typography, Divider, Row, Col, Dropdown, Menu } from 'antd';

const { Title, Text } = Typography;

const menu = (
  <Menu>
    <Menu.Item key="1">Option 1</Menu.Item>
    <Menu.Item key="2">Option 2</Menu.Item>
    <Menu.Item key="3">Option 3</Menu.Item>
  </Menu>
);

const data = [
  {
    department: '产品设计运营部',
    rate: '13.00%',
    change: '环比 ↑ 2.8pp',
    count: '累计离职人数：130人',
  },
  // Add more data if needed
];

const App: React.FC = () => (
  <div style={{ padding: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Dropdown overlay={menu}>
        <Text>高途</Text>
      </Dropdown>
      <Text>正式员工</Text>
      <Dropdown overlay={menu}>
        <Text>更多筛选</Text>
      </Dropdown>
    </div>
    <Card style={{ marginTop: '16px' }}>
      <Typography>
        <Title level={4}>累计离职率</Title>
        <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>11.3%</Text>
        <Text style={{ color: 'green' }}>  同比 ↓ 20人</Text>
        <Text style={{ color: 'red', marginLeft: '8px' }}>环比 ↑ 2.8pp</Text>
        <Divider />
        <Text>累计离职人数：313人</Text>
      </Typography>
    </Card>
    <Text style={{ marginTop: '16px', display: 'block' }}>更多详细数据分析，请通过PC端管理员工作台-人才分析查看</Text>
    <Divider />
    <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>下级部门/人员</Text>
    {data.map((item, index) => (
      <Card key={index} style={{ marginTop: '16px' }}>
        <Row>
          <Col flex="40px">
            <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#1890ff', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>产</div>
          </Col>
          <Col flex="auto" style={{ paddingLeft: '16px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.department}</Text>
            <Text style={{ display: 'block', color: 'red' }}>{item.change}</Text>
            <Text>{item.count}</Text>
          </Col>
        </Row>
      </Card>
    ))}
  </div>
);

export default App;