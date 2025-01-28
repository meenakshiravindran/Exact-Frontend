import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/home";
import { Logout } from "./components/Auth/logout";
import FacultyForm from "./components/Faculty/addFaculty";
import StudentForm from "./components/Student/addStudent";
import ProgrammeForm from "./components/Programme/addProgramme";
import CourseForm from "./components/Course/addCourse";
import BatchForm from "./components//Batch/addBatch";
import ManageFaculties from "./components/Faculty/manageFaculty";
import EditFaculty from "./components/Faculty/editFaculty";
import RegisterForm from "./components/Auth/register";
import ProtectedRoute from "./ProtectedRoutes";
import ExactLayout from "./components/Layout";
import ManageCourses from './components/Course/manageCourse';
import EditCourse from './components/Course/editCourse';
import EditBatch from './components/Batch/editBatch';
import ManageBatches from './components/Batch/manageBatch';
import EditProgramme from './components/Programme/editProgramme';
import ManageProgrammes from './components/Programme/manageProgramme';
import { Login } from "./components/Auth/login";
import LoginPage from "./components/Auth/loginPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes that don't require ExactLayout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/logout" element={<Logout />} />

        {/* Routes that require ExactLayout */}
        <Route element={<ExactLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/add-student" element={ <ProtectedRoute element={<StudentForm />} allowedRoles={["admin", "teacher"]}/>}/>
          <Route path="/add-programme" element={<ProtectedRoute element={<ProgrammeForm />} allowedRoles={["admin", "teacher"]}/>} />
          <Route path="/add-course" element={ <ProtectedRoute element={<CourseForm />} allowedRoles={["admin", "teacher"]} />}/>
          <Route path="/add-batch"  element={<ProtectedRoute element={<BatchForm />} allowedRoles={["admin", "teacher"]}/>}/>
          <Route path="/manage-faculties" element={ <ProtectedRoute element={<ManageFaculties />} allowedRoles={["admin"]}/>}/>
          <Route path="/edit-faculty/:facultyId" element={<ProtectedRoute element={<EditFaculty />} allowedRoles={["admin"]} />} />
          <Route path="/add-faculty" element={ <ProtectedRoute element={<FacultyForm />} allowedRoles={["admin"]}/>}/>
          <Route path="/edit-course/:courseId" element={<ProtectedRoute element={<EditCourse />} allowedRoles={['admin','teacher']} />} />
          <Route path="/manage-courses" element={<ProtectedRoute element={<ManageCourses />} allowedRoles={['admin','teacher']} />} />
          <Route path="/edit-batch/:batchId" element={<ProtectedRoute element={<EditBatch />} allowedRoles={['admin']} />} />
          <Route path="/manage-batches" element={<ProtectedRoute element={<ManageBatches />} allowedRoles={['admin']} />} />
          <Route path="/edit-programme/:programmeId" element={<ProtectedRoute element={<EditProgramme />} allowedRoles={['admin']} />} />
          <Route path="/manage-programmes" element={<ProtectedRoute element={<ManageProgrammes />} allowedRoles={['admin']} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
