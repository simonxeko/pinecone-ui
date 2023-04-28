import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query'
import { Typography, Row, Col,  Menu } from "antd";
import { DatabaseOutlined, DingtalkOutlined } from '@ant-design/icons';
import { Layout, theme } from 'antd';
import SearchComponent from "../components/Search";
import 'antd/dist/reset.css';

const { Title } = Typography;
const queryClient = new QueryClient();

const { Content, Footer, Sider } = Layout;

const IndexPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo" style={{lineHeight: '3em', fontSize: '1.5em', color: 'white', padding: '0 10px'}}>Pinecone-UI</div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['search']}
            items={[
              {
                key: 'database',
                label: 'Database',
                icon: <DatabaseOutlined />,
              },
              {
                key: 'test',
                label: 'Test',
                icon: <DingtalkOutlined />,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Content style={{ margin: '24px 16px 0' }}>    
            <Row gutter={[24, 24]}>
              <Col xs={24} md={24}>
                <Title level={4}>Database</Title>
                <SearchComponent />
              </Col>
            </Row>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    </QueryClientProvider>
  );
};

export default IndexPage;