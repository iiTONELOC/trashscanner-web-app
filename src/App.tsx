import { NavLinkProvider, RouterProvider } from './providers';
import { Layout, Footer, Navigation, ViewRenderer } from './components';


function App() {

  return (
    <Layout>
      <NavLinkProvider>
        <RouterProvider>
          <Navigation />
          <ViewRenderer />
        </RouterProvider>
      </NavLinkProvider>
      <Footer />
    </Layout>
  );
}

export default App;
