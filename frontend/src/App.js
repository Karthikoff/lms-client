import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client"; // ✅ Correct import
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import AdminDashboard from "./components/AdminDashboard";
import CreateCourse from "./components/CreateCourse";
import CourseDetails from "./components/CourseDetails";
import CreateInstructor from "./components/CreateInstructor";
import EditCourse from "./components/EditCourse";
import CourseList from "./components/CourseList";
import Transactions from "./components/Transaction";
import Cart from "./components/Cart";
import StdCourseDetails from "./components/Std-CourseDetails";
import EnrolledCourses from "./components/EnrolledCourses";
import StudentAttendance from "./components/StudentAttendance";
import InstructorMarkAttendance from "./components/InstructorMarkAttendance";
import StudentList from "./components/StudentList";
import InstructorMessage from "./components/InstructorMessage";
import StudentMessages from "./components/StudentMessages";
import CreateAssessment from "./pages/instructor/CreateAssessment";
import ViewAssessments from "./pages/instructor/ViewAssessment";
// import AssessmentResults from "./pages/instructor/AssessmentResults";
import InstructorResults from "./pages/instructor/AssessmentResults";
import TakeAssessment from "./pages/student/TakeAssessment";
import Sidebar from './components/Sidebar';
import Layout from "./components/Layout"; // Import Layout
import StudentViewAssessments from "./pages/student/StudentViewAssessments";
import ExamSuccess from "./pages/student/Exam";
import StudentAssessmentResults from "./pages/student/StudentAssessmentResults";
import CreateExam from "./pages/instructor/CreateExam";
import ViewExams from "./pages/instructor/ViewExams";
import ExamResults from "./pages/instructor/ExamResults";

import StudentViewExams from "./pages/student/StudentViewExams";
import TakeExam from "./pages/student/TakeExam";
import CoursesList from "./components/CourseList";
const App = () => {
  return (
    <Router>
      
      <div className="bg-gray-100 min-h-screen">
      <Routes element={<Layout> {/* Persistent Sidebar & Layout */} </Layout>}>          
          
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/inst-createcourse" element={<Layout><CreateCourse /></Layout>} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/manage-instructors" element={<CreateInstructor />} />
          <Route path="/edit-course/:id" element={<EditCourse />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/courseslist" element={<CoursesList />} />

          <Route path="/viewcourse/:id" element={<StdCourseDetails />} />
          {/* <Route path="/enrolled-courses" element={<EnrolledCourses />} /> */}
          <Route path="/enrolled-courses" element={<Layout><EnrolledCourses /></Layout>} />

          <Route path="/attendance" element={<StudentAttendance />} />
          <Route path="/mark-attendance" element={ <Layout><InstructorMarkAttendance /></Layout>} />
          <Route path="/student-management" element={<StudentList />} />
          <Route path="/message-post" element={<InstructorMessage />} />
          <Route path="/notification" element={<Layout><StudentMessages /></Layout>} />
          <Route path="/create-assessment" element={<CreateAssessment />} />
          <Route path="/view-assessment" element={<ViewAssessments />} />
          <Route path="/assessment-result" element={<InstructorResults/>} />
          
          <Route path="/std-viewassessment" element={<StudentViewAssessments />} />
          <Route path="/exam-success" element={<ExamSuccess />} />
          <Route path="/result-std-assessment" element={<StudentAssessmentResults />} />




          

          <Route path="/take-assessment/:assessmentId" element={<TakeAssessment />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/view-exam" element={<ViewExams />} />
          <Route path="/exam-result" element={<ExamResults />} />



          <Route path="/std-view-exam" element={<StudentViewExams />} />
          <Route path="/std-take-exam/:examId" element={<TakeExam />} />








        </Routes>
      </div>
    </Router>
  );
};

export default App;
