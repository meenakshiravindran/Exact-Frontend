import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/Auth/login";
import { Home } from "./components/home";
import { Logout } from "./components/Auth/logout";
import FacultyForm from "./components/Faculty/addFaculty";
import StudentForm from "./components/addStudent";
import ProgrammeForm from "./components/addProgramme";
import CourseForm from "./components/addCourse";
import BatchForm from "./components/addBatch";
import ManageFaculties from "./components/Faculty/manageFaculty";
import EditFaculty from "./components/Faculty/editfaculty";
import RegisterForm from "./components/Auth/register";
import ProtectedRoute from "./ProtectedRoutes";
import ExactLayout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes that don't require ExactLayout */}
        <Route path="/login" element={<Login />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
