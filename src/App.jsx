import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation';
import { Login } from './components/login';
import { Home } from './components/home';
import { Logout } from './components/logout';
import FacultyForm from './components/addFaculty';
function App() {
  return (
    <BrowserRouter>
      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/add-faculty" element={<FacultyForm />} />
      </Routes>
    </BrowserRouter>);

}
export default App;
