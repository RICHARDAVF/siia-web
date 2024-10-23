import { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { UserOutlined, LockOutlined,FileAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const onFinish = (values) => {
    setLoading(true);

    setTimeout(() => {
      const fakeToken = '12345abcde'; 
      localStorage.setItem('authToken', fakeToken);
      message.success('Login successful!');
      onLogin(fakeToken); 
      setLoading(false);
      navigate("/home")
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Title level={2} className="login-title">Iniciar Sesión</Title>
        <Form
          name="login_form"
          className="login-form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="document"
            rules={[{ required: true, message: 'Por favor ingrese su RUN ' }]}
          >
            <Input
              prefix={<FileAddOutlined className="site-form-item-icon" />}
              placeholder="RUC"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Por favor ingrese su usuario' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
              block
              size="large"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
