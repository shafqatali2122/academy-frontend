import '@/styles/globals.css';
import { AuthProvider } from '@/utils/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

console.log('✅ _app.js loaded from src/pages/_app.js');

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  console.log('✅ App component rendering...');
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {console.log('✅ AuthProvider wrapping components')}
        <Component {...pageProps} />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
