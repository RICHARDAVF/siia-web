// Layout.js
import React from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header'; // Asegúrate de crear un componente Header
import { Outlet } from 'react-router-dom'; // Para renderizar las rutas hijas

const Layout = () => {
    return (
        <Box display="flex">
            <Sidebar />
            <Box flex="1" ml="240px"> {/* Ajusta el margen según el ancho del Sidebar */}
                <Header />
                <Box p={4}>
                    <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
