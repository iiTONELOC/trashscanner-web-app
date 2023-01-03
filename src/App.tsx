import { Home } from './pages';
import { Layout, Footer, Navigation } from './components';



function App(): JSX.Element {
  return (
    <Layout>
      <Navigation />
      <Home />
      <Footer />
    </Layout>
  );
}

export default App;
