import React, { Suspense, lazy, useEffect } from "react"

import "./App.css"
import { useDispatch, useSelector } from "react-redux"
import { Route, Routes, useNavigate } from "react-router-dom"

import { getUserDetails } from "./services/operations/profileAPI"
import { ACCOUNT_TYPE } from "./utils/constants"

const Navbar = lazy(() => import("./components/Common/Navbar"))
const OpenRoute = lazy(() => import("./components/core/Auth/OpenRoute"))
const PrivateRoute = lazy(() => import("./components/core/Auth/PrivateRoute"))
const AddCourse = lazy(() => import("./components/core/Dashboard/AddCourse"))
const Cart = lazy(() => import("./components/core/Dashboard/Cart"))
const EditCourse = lazy(() => import("./components/core/Dashboard/EditCourse"))
const EnrolledCourses = lazy(() =>
  import("./components/core/Dashboard/EnrolledCourses")
)
const Instructor = lazy(() => import("./components/core/Dashboard/Instructor"))
const MyCourses = lazy(() => import("./components/core/Dashboard/MyCourses"))
const MyProfile = lazy(() => import("./components/core/Dashboard/MyProfile"))
const Settings = lazy(() => import("./components/core/Dashboard/Settings"))
const VideoDetails = lazy(() =>
  import("./components/core/ViewCourse/VideoDetails")
)

const About = lazy(() => import("./pages/About"))
const Catalog = lazy(() => import("./pages/Catalog"))
const Contact = lazy(() => import("./pages/Contact"))
const CourseDetails = lazy(() => import("./pages/CourseDetails"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Error = lazy(() => import("./pages/Error"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Signup = lazy(() => import("./pages/Signup"))
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"))
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"))
const ViewCourse = lazy(() => import("./pages/ViewCourse"))

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />
      <Suspense
        fallback={
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route path="catalog/:catalogName" element={<Catalog />} />

          {/* Open Route - for Only Non Logged in User */}
          <Route
            path="login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />
          <Route
            path="forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />
          <Route
            path="update-password/:id"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />
          <Route
            path="signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />
          <Route
            path="verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />

          {/* Private Route - for Only Logged in User */}
          <Route
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/Settings" element={<Settings />} />

            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route path="dashboard/add-course" element={<AddCourse />} />
                <Route
                  path="dashboard/edit-course/:courseId"
                  element={<EditCourse />}
                />
              </>
            )}

            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route
                  path="dashboard/enrolled-courses"
                  element={<EnrolledCourses />}
                />
                <Route path="/dashboard/cart" element={<Cart />} />
              </>
            )}

            <Route path="dashboard/settings" element={<Settings />} />
          </Route>

          <Route
            element={
              <PrivateRoute>
                <ViewCourse />
              </PrivateRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            )}
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
