import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BooksTable from './BooksTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BooksTable />} />
      </Routes>
    </Router>
  );
}

export default App;
