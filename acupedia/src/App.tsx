import { ScrollToTop } from 'components';
import RootRouter from 'navigation/RootRouter';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './styles/globals.css';
import './styles/layout.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
      <Router basename={process.env.PUBLIC_URL || '/'}>
      <ToastContainer position={toast.POSITION.TOP_CENTER} />
      {/* MetaTagProvider 비활성화: react-helmet-async 페이지별 Helmet으로 대체 */}
      <ScrollToTop />
      <RootRouter />
    </Router>
  );
}

export default App;
