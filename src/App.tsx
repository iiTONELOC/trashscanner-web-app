import { Layout, Footer, Navigation, ViewRenderer, Toaster } from './components';
import { GlobalStoreProvider, NavLinkProvider, RouterProvider } from './providers';

function App(): JSX.Element { //  NOSONAR
  return (
    <Layout>
      <NavLinkProvider>
        <RouterProvider>
          <Navigation />
          <GlobalStoreProvider>
            <ViewRenderer />
            <Toaster />
          </GlobalStoreProvider>
        </RouterProvider>
      </NavLinkProvider>
      <Footer />
    </Layout>
  );
}

export default App;
