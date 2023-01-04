import { RouterProvider } from './providers';
import { Layout, Footer, Navigation, ViewRenderer } from './components';


function App() {

  return (
    <RouterProvider>
      <Layout>
        <Navigation />
        <ViewRenderer />
        <Footer />
      </Layout>
    </RouterProvider>
  );
}

export default App;
