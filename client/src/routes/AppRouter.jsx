

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Unauthorized from "../pages/public/Unauthorized";

import Home from "../pages/Home";
import Login from "../pages/public/Login";
import About from "../pages/About";
import AccountantRegistration from "../pages/admin/AccountantRegistration";


const AdmissionForm = lazy(() =>
  import("../pages/admission/admissionForm")
);

const Admission_Enquiry = lazy(() =>
  import("../pages/admin/Admission_Enquiry")
);

const AcademicManagement = lazy(() =>
  import("../pages/admin/AcademicManagement")
);
const TeacherAssignment = lazy(() => import("../pages/admin/AdminTeacherAssin"))

const Acountant = lazy(() =>
  import("../pages/admin/AdminAccontentDashboard")
);

const Admissions = lazy(() =>
  import("../pages/admission/admissionForm")
);

const Students = lazy(() =>
  import("../pages/admin/Students")
);
const Teachers = lazy(() =>
  import("../pages/admin/Teachers")
);
const Timetable = lazy(() =>
  import("../pages/admin/Timetable")
);
const Exams = lazy(() =>
  import("../pages/admin/Exams")
);
const Notifications = lazy(() =>
  import("../pages/admin/Notifications")
);
const AdminDashboard = lazy(() =>
  import("../pages/admin/AdminDashboard")
);
const AdminLayout = lazy(() =>
  import("../components/layout/AdminLayout")
);


const TeacherDashboard = lazy(() =>
  import("../pages/teacher/TeacherDashboard")
);

const TeacherLayout = lazy(() =>
  import("../components/layout/TeacherLayout")
);

const TeacherProfile = lazy(() =>
  import("../pages/teacher/TeachreProfile")
);

const TeacherRegister = lazy(() =>
  import("../pages/teacher/TeacherRegistation")
);



const TeacherMyCourses = lazy(() =>
  import("../pages/teacher/TeacherClasses")
);

const Attendance = lazy(() =>
  import("../pages/teacher/Attendance")
);

const ExamMarks = lazy(() =>
  import("../pages/teacher/ExamMarks")
);
const Assignments = lazy(() =>
  import("../pages/teacher/Assignments")
);
const TimeTable = lazy(() =>
  import("../pages/teacher/Timetable")
);

const StudentLayout = lazy(() =>
  import("../components/layout/StudentLayout")
);

const StudentDashboard = lazy(() =>
  import("../pages/student/StudentDashboard")
);

const StudentProfile = lazy(() =>
  import("../pages/student/StudentProfile")
);
const StudentAttendance = lazy(() =>
  import("../pages/student/StudentAttendance")
);

const StudentTimetable = lazy(() =>
  import("../pages/student/StudentTimetable")
);

const StudentHomework = lazy(() =>
  import("../pages/student/StudentHomework")
);

const StudentResults = lazy(() =>
  import("../pages/student/StudentResults")
);

const StudentFees = lazy(() =>
  import("../pages/student/StudentFees")
);

const StudentMySubjects = lazy(() =>
  import("../pages/student/StudentSubject")
);

// Accountent


const AccountantLayout = lazy(() => import("../components/layout/AccountantLayout"));

const AccountantTotalCollection = lazy(
  () => import("../pages/accountant/AccountantCollectTotalFeesByStudent")
);
const AccountantStudentFeePayment = lazy(
  () => import("../pages/accountant/AccountantStudentFeesPayment")
);


const AccountantDashboard = lazy(
  () => import("../pages/accountant/AccountantDashboard")
);

const Employees = lazy(
  () => import("../pages/accountant/Employees")
);

const SalaryStructure = lazy(
  () => import("../pages/accountant/SalaryStructures")
);

const SalarySlip = lazy(
  () => import("../pages/accountant/SalarySlips")
);

const FeesInvoice = lazy(
  () => import("../pages/accountant/FeesInvoices")
);


const AdminFeesStructure = lazy(
  () => import("../pages/admin/AdminFeesStructure")

);

const AdminFeesCollection = lazy(
  () => import("../pages/admin/AdminFeesCollection")
);


import ChangePassword from "../pages/public/ChangePass";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { ROLES } from "../utils/roles";

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "35px",
          height: "35px",
          border: "4px solid #e5e7eb",
          borderTop: "4px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />

      <p>Loading page...</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/register" element={<TeacherRegister />} />
        <Route path="/about" element={<About />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/admission/apply" element={<AdmissionForm />}


        />

        {/* ================= PROTECTED ROUTES ================= */}

        <Route element={<ProtectedRoute />}>

          {/* ---------- ADMIN ---------- */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[ROLES.SCHOOL_ADMIN]}
              />
            }
          >
            <Route
              path="/admin"
              element={<AdminLayout />}
            >


              {/* {Admission_Enquiry} */}

              {/* Dashboard */}
              <Route
                path="dashboard"
                element={<AdminDashboard />}
              />
              {/*  AcademicManagement Dashboard */}
              <Route
                path="/admin/academics"
                element={<AcademicManagement />}
              />

              <Route
                path="/admin/teacherAssigment"
                element={<TeacherAssignment />}
              />
              {/* Accountant Registration */}
              <Route
                path="/admin/accountants/register"
                element={<AccountantRegistration />}
              />

              {/* Students */}
              <Route
                path="admissions/new"
                element={<Admissions />}
              />
              {/* {Admission_Enquiry} */}
              <Route
                path="admission_enquiry"
                element={<Admission_Enquiry />}
              />

              <Route
                path="students"
                element={<Students />}
              />

              {/* New Admission */}
              <Route
                path="admissions/new"
                element={<Admissions />}
              />

              {/* Fees */}
              <Route
                path="fees/structure"
                element={<AdminFeesStructure />}
              />

              <Route
                path="fees/collection"
                element={<AdminFeesCollection />}
              />

              <Route
                path="fees/quick-collect"
                element={<div>Quick Fee Collect Coming Soon</div>}
              />



              <Route
                path="exams"
                element={<Exams />}
              />

              {/* People */}
              <Route
                path="teachers"
                element={<Teachers />}
              />

              {/* People */}
              <Route
                path="accountant"
                element={<Acountant />}
              />






              <Route
                path="timetable"
                element={<Timetable />}
              />

              {/* System */}
              <Route
                path="notifications"
                element={<Notifications />}
              />



            </Route>
          </Route>



          {/* Teacher Protected & Role-based Routes */}
          <Route
            element={
              <RoleRoute
                allowedRoles={[ROLES.TEACHER]}
              />
            }
          >
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route
                path="dashboard"
                element={<TeacherDashboard />}
              />
              <Route
                path="profile"
                element={<TeacherProfile />}
              />
              <Route
                path="My-Courses"
                element={<TeacherMyCourses />}
              />

            
              <Route
                path="attendance"
                element={<Attendance />}
              />
              <Route
                path="marks"
                element={<ExamMarks />}
              />
              <Route
                path="assignments"
                element={<Assignments />}
              />

              <Route
                path="timetable"
                element={<TimeTable />}
              />



            </Route>
          </Route>



          {/* ACCONTENT  */}


          <Route allowedRoles={[ROLES.ACCOUNTANT]}
            path="/accountant" element={<AccountantLayout />}>
            <Route path="dashboard" element={<AccountantDashboard />} />
            <Route
              path="employees"
              element={<Employees />}
            />
            <Route
              path="salary-structure"
              element={<SalaryStructure />}
            />

            <Route
              path="salary-slips"
              element={<SalarySlip />}
            />

            <Route
              path="fees-invoice"
              element={<FeesInvoice />}
            />
            <Route 
            path="fees"
            element={<AccountantTotalCollection />}
            />
            <Route
              path="student-fees-payment"
              element={<AccountantStudentFeePayment />}
            />

          </Route>

        </Route>

        {/* ---------- STUDENT ---------- */}

        <Route
          element={
            <RoleRoute
              allowedRoles={[ROLES.STUDENT]}
            />
          }
        >
          <Route
            path="/student"
            element={<StudentLayout />}
          >
            <Route
              path="dashboard"
              element={<StudentDashboard />}
            />
            <Route
              path="profile"
              element={<StudentProfile />}
            />
            <Route
              path="My-Attendance"
              element={<StudentAttendance />}
            />

            <Route
              path="timetable"
              element={<StudentTimetable />}
            />

            {/* Homework */}
            <Route
              path="homework"
              element={<StudentHomework />}
            />

            {/* Results */}
            <Route
              path="results"
              element={<StudentResults />}
            />

            {/* Fees */}
            <Route
              path="fees"
              element={<StudentFees />}
            />

            <Route
              path="MySubjects"
              element={<StudentMySubjects />}
            />
          </Route>
        </Route>



      </Routes>
    </Suspense>
  );
}

export default AppRoutes;