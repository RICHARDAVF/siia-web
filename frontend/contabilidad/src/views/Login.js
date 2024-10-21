import React, { useState } from 'react';
import { Text, Button, Container, Box, IconButton, Input, Stack } from '@chakra-ui/react';
import { useAuth } from '../components/AuthContext';
import { MdDescription, MdEmail, MdLock } from 'react-icons/md'; // Ajusta las importaciones de iconos
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [documento, setDocumento] = useState('');
    const navigate = useNavigate(); // Inicializa useNavigate

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email); // Simula el inicio de sesión
        navigate('/dashboard'); // Redirige a /dashboard después de iniciar sesión
    };

    return (
        <Container 
            maxWidth="xs" 
            mt={4} 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            height="100vh"
        >
            <Box 
                bgcolor="#f7f7f7" 
                borderRadius="lg" 
                boxShadow="lg" 
                p={4}
                width="100%" 
            >
                <Text fontSize="2xl" textAlign="center" mb={4}>
                    Iniciar Sesión
                </Text>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        <Input
                            placeholder="Documento"
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                            required
                            variant="outline"
                            size="md"
                            leftdddon={
                                <IconButton variant="unstyled" icon={<MdDescription />} />
                            }
                        />
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            variant="outline"
                            size="md"
                            leftdddon={
                                <IconButton variant="unstyled" icon={<MdEmail />} />
                            }
                        />
                        <Input
                            placeholder="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            variant="outline"
                            size="md"
                            leftdddon={
                                <IconButton variant="unstyled" icon={<MdLock />} />
                            }
                        />
                        <Button 
                            colorScheme="blue" 
                            type="submit" 
                            width="100%"
                        >
                            Iniciar Sesión
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
