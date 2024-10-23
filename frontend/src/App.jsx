import { useEffect, useState } from 'react';
import './index.css';
import { Button, Layout, theme } from 'antd';
import Logo from './components/Logo.jsx';
import MenuList from './components/MenuList.jsx';
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import TogleThemeButton from './components/ToggleThemeButton.jsx';
import Login from './components/Login.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ContentViews from './components/ContentViews.jsx';

const { Header, Sider,Content } = Layout;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticate(true);
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const {
    token: { colorBgContainer,borderRadiusLG  },
  } = theme.useToken();

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticate(true);
  };

  return (
 
      <BrowserRouter>
        {!isAuthenticate ? (
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
          </Routes>
        ) : (
          <Layout>
              <Header  style={{ padding: 0,background:darkMode?'#001529':'#ffffff' }}>
              <Button
                onClick={() => setCollapsed(!collapsed)}
                type="text"
                style={{color:darkMode?'#ffffff':"#001529"}}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              />
            </Header>
            <Content>

              <Layout>
                <Sider
                className="sidebar"
                theme={darkMode ? "dark" : "light"}
                collapsed={collapsed}
                collapsible
                trigger={null}
              >
                <Logo />
                <MenuList darkMode={darkMode} />
                <TogleThemeButton darkMode={darkMode} toggleTheme={toggleTheme} />
              </Sider>
              <Content style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
                <ContentViews/>
              </Content>
              </Layout>
            </Content>
           
          </Layout>
        )}
      </BrowserRouter>

  );
}

export default App;
