import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux';
import React from 'react';
import { store, persistor } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

import { ThemeProvider } from "./components/theme-provider"

createRoot(document.getElementById("root")!).render(<React.StrictMode>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <App />
            </ThemeProvider>
        </PersistGate>
    </Provider>
</React.StrictMode>,);
