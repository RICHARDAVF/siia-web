<<<<<<< HEAD
import { StrictMode } from 'react'
=======

>>>>>>> 1cb272c945efe937f26e0e9ac473a96cbaf6a71f
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Provider from './components/GlobalContext.jsx'
createRoot(document.getElementById('root')).render(
  <Provider>
    <App />
  </Provider>,
)
