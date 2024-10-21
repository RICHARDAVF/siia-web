// index.js o App.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Cambia esta línea
import { ChakraProvider } from '@chakra-ui/react';
import App from './App'; // O el nombre de tu componente principal

// Crear un contenedor root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza tu aplicación
root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
