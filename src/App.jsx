import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation';
import { Login } from './components/login';
import { Home } from './components/home';
import { Logout } from './components/logout';
import FacultyForm from './components/Faculty/addFaculty';
import StudentForm from './components/addStudent';
import ProgrammeForm from './components/addProgramme';
import CourseForm from './components/addCourse';
import BatchForm from './components/addBatch';
import ManageFaculties from './components/Faculty/manageFaculty';
import EditFaculty from './components/Faculty/editfaculty';

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
        <Route path="/manage-faculties" element={<ManageFaculties />} />
        <Route path="/edit-faculty/:facultyId" element={<EditFaculty />} />
      </Routes>
    </BrowserRouter>);

}
export default App;
