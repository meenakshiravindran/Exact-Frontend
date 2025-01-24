import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation';
import { Login } from './components/login';
import { Home } from './components/home';
import { Logout } from './components/logout';
import FacultyForm from './components/addFaculty';
import StudentForm from './components/addStudent';
import ProgrammeForm from './components/addProgramme';
import CourseForm from './components/addCourse';
import BatchForm from './components/addBatch';

function App() {
  return (
    <BrowserRouter>
      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/add-faculty" element={<FacultyForm />} />
        <Route path="/add-student" element={<StudentForm />} />
        <Route path="/add-programme" element={<ProgrammeForm />} />
        <Route path="/add-course" element={<CourseForm />} />
        <Route path="/add-batch" element={<BatchForm />} />
      </Routes>
    </BrowserRouter>);

}
export default App;
