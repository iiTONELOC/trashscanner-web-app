import { useState, useEffect } from 'react';
import { Layout, Footer, Navigation, ViewRenderer, Toaster } from './components';
import { GlobalStoreProvider, UserProvider, ToastProvider, NavLinkProvider, RouterProvider }
  from './providers';

function App(): JSX.Element { //  NOSONAR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);


  return isMounted ? (
    <ToastProvider>
      <UserProvider>
        <NavLinkProvider>
          <RouterProvider>
            <Layout>
              <Navigation />
              <GlobalStoreProvider>
                <ViewRenderer />
              </GlobalStoreProvider>
              <Toaster />
              <Footer />
            </Layout>
          </RouterProvider>
        </NavLinkProvider>
      </UserProvider>
    </ToastProvider>
  ) : <></>;
}

export default App;
