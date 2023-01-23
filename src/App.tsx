import { useState, useEffect, Suspense } from 'react';
import { Home, SignUp, Login, List, Lists } from './pages';
import { HashRouter, Route, Routes } from 'react-router-dom';
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
      <HashRouter>
        <UserProvider>
          {/* TODO: Refactor the NavLink Provider to a hook */}
          <NavLinkProvider>
            <Layout>
              <Navigation />
              <GlobalStoreProvider>
                {/* TODO: Clean this up*/}
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

                  <Route path="*" element={<Home />} />
                </Routes>
              </GlobalStoreProvider>
              <Toaster />
              <Footer />
            </Layout>
          </NavLinkProvider>
        </UserProvider>
      </HashRouter>
    </ToastProvider >
  ) : <></>;
}

export default App;
