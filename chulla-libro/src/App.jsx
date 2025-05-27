import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Books from './pages/Books';
import Profile from './pages/Profile';
import './App.css';
import Loans from './pages/Loans';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/loans" element={<Loans />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
