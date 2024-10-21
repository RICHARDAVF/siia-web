// Dashboard.js
import React from 'react';
import { Box, Flex, Heading, Button, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const { logout } = useAuth();

    const bgColor = useColorModeValue('gray.100', 'gray.800'); // Fondo claro u oscuro

    return (
        <Flex>

            <Box as="main" flex="1" bg={bgColor} p={4}>
                <Heading as="h4" size="lg" mb={4}>Welcome to the Dashboard</Heading>
                <Button colorScheme="teal" onClick={logout}>Logout</Button>
                {/* Aquí puedes agregar más contenido según tus necesidades */}
            </Box>
        </Flex>
    );
};

export default Dashboard;
