import { useContext, useEffect, useState } from 'react';
import './index.css';
import { Button, Layout, Row } from 'antd';
import Logo from './components/Logo.jsx';
import MenuList from './components/MenuList.jsx';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from "@ant-design/icons";
import TogleThemeButton from './components/ToggleThemeButton.jsx';
import Login from './components/Login.jsx';
import { BrowserRouter, Routes, Route, useNavigate, json } from 'react-router-dom'; 

import ContentViews from './components/ContentViews.jsx';
import { Context } from './components/GlobalContext.jsx';

const { Header, Sider, Content } = Layout;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [username,setUsername] = useState('')

  const {updateState,user} = useContext(Context)

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const document = localStorage.getItem('document')
    const user = localStorage.getItem('user')

    if (token) {
      setIsAuthenticate(true);
      const dataUser = JSON.parse(user)
      setUsername(dataUser.username)
      updateState({"token":token,"document":document,"user":dataUser})
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };


  const handleLogin = (res) => {
    localStorage.setItem("authToken", res.token);
    localStorage.setItem("document", res.document);
    localStorage.setItem("user", JSON.stringify(res));
    setIsAuthenticate(true);
  
  };

  return (
    <BrowserRouter>
      {!isAuthenticate ? (
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
        </Routes>
      ) : (
        <AuthenticatedLayout
          darkMode={darkMode}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          toggleTheme={toggleTheme}
          setIsAuthenticate={setIsAuthenticate}
          user={user}
        />
      )}
    </BrowserRouter>
  );
}

function AuthenticatedLayout({ darkMode, collapsed, setCollapsed, toggleTheme, setIsAuthenticate,user }) {
  const navigate = useNavigate(); 

  const onLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticate(false);
    navigate("/"); 
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, background: darkMode ? '#001529' : '#ffffff' }}>
      <Row style={{justifyContent:'space-between',width:'100%'}}>
          <Button
            onClick={() => setCollapsed(!collapsed)}
            type="text"
            style={{ color: darkMode ? '#ffffff' : '#001529' }}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
        
            <p style={{color:'white',fontWeight:'bold'}}>
              {user.razon_social}
            </p>

          <Row style={{justifyContent:'center',alignContent:'center',alignItems:'center'}} gutter={20}>
            <strong style={{color:'white'}}>{user.username}</strong>  
            <Button
              onClick={onLogout}
              danger
              style={{ marginRight: '16px',marginLeft:'16px' }}
              icon={<LogoutOutlined />}
            >
            </Button>
          </Row>
      </Row>
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
            // background: darkMode ? '#021529':'#ffffff' ,
            borderRadius: 10,
          }}>
            <ContentViews />
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default App;
