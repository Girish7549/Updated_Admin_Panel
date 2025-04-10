import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'remixicon/fonts/remixicon.css';
import './index.css';
import App from './App';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

// Create root using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
        <Toaster position='top-right' />
      </Router>
    </QueryClientProvider>
  </Provider>
);
