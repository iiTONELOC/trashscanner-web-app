import { useState, useEffect, Suspense } from 'react';
import { Home, SignUp, Login, List, Lists } from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout, Footer, Navigation, Toaster, WithAuth, Loading } from './components';
import { GlobalStoreProvider, UserProvider, ToastProvider, NavLinkProvider } from './providers';


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
          {/* <RouterProvider> */}
          <BrowserRouter>
            <Layout>
              <Navigation />
              <GlobalStoreProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />

                  <Route path="/lists" element={
                    <WithAuth>
                      <Suspense fallback={<Loading />}>
                        <Lists />
                      </Suspense>
                    </WithAuth>}
                  />

                  <Route path="/list/:id" element={
                    <WithAuth>
                      <Suspense fallback={<Loading />}>
                        <List />
                      </Suspense>
                    </WithAuth>}
                  />
                </Routes>

                {/* <ViewRenderer /> */}
              </GlobalStoreProvider>
              <Toaster />
              <Footer />
            </Layout>
          </BrowserRouter>

          {/* </RouterProvider> */}
        </NavLinkProvider>
      </UserProvider>
    </ToastProvider>
  ) : <></>;
}

export default App;
