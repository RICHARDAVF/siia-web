import { useContext, useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, FileAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { Context } from './GlobalContext';

const { Title } = Typography;

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { BASE_URL } = config;
  const { updateState } = useContext(Context);

  const onFinish = async (values) => {
    const url = `${BASE_URL}/api/v1/users/login/${values.document}/`;
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const res = await response.json();
        updateState({ "token": res.token, "document": values.document });

        setTimeout(() => {
          onLogin(res);
          message.success('Se inició sesión exitosamente');
          navigate('/home');
        }, 1000);
      } else {
        const res = await response.json();

        const errorMessage = res.error || 'Ocurrió un error al iniciar sesión';
        message.error(errorMessage);
      }
    } catch (error) {
     
      message.error(error.message || 'Error en la red o servidor');
    } finally {
      setLoading(false); 
    }
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
