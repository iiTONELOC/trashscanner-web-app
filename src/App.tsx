import { GlobalStoreProvider, NavLinkProvider, RouterProvider } from './providers';
import { Layout, Footer, Navigation, ViewRenderer } from './components';


function App() {

  return (
    <Layout>
      <NavLinkProvider>
        <RouterProvider>
          <Navigation />
          <GlobalStoreProvider>
            <ViewRenderer />
          </GlobalStoreProvider>
        </RouterProvider>
      </NavLinkProvider>
      <Footer />
    </Layout>
  );
}

export default App;
