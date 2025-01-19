import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import useAuthContext from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const TeacherDashboardMain = () => {
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
  });
  const [showReqCourseModel, setShowReqCourseModel] = useState(false);

  useEffect(() => {
    const getTeacherCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/course/instructor/${currentUser._id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        setCourses([...courses, ...response.data.data]);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    getTeacherCourses();
  }, []);

  const handleNewCourseRequest = async () => {
    const data = {
      title: newCourse.title,
      description: newCourse.description,
      createdBy: currentUser._id,
      instructors: [],
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/course/create",
        data,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 200) {
        Swal.fire({ title: "Course Requested Successfully", icon: "success" });
        setShowReqCourseModel(false);
        setCourses([...courses, response.data.data]);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setShowReqCourseModel(false);
    }
  };

  if (!state || !state.user || state.user.role !== "teacher") {
    return navigate("/login");
  }
  const currentUser = state?.user;

  const footer = (
    <div>
      <Button
        label="Create"
        icon="pi pi-check"
        onClick={handleNewCourseRequest}
      />
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => {
          setShowReqCourseModel(false);
        }}
        className="p-button-text"
      />
    </div>
  );

  const profileImage = `https://avatar.iran.liara.run/username?username=${
    currentUser.Name.split()[0]
  }}`;

  // Sample courses data

  const courseTemplate = (course) => {
    return (
      <div className="col-12 md:col-6 lg:col-4 p-2">
        <Card className="h-full">
          <div className="flex flex-column h-full">
            <div className="flex justify-content-between align-items-center">
              <h3 className="text-xl font-bold m-0">{course.name}</h3>
              {/* <Tag
                severity={getStatusSeverity(course.status)}
                value={course.status?.toUpperCase()}
              /> */}
            </div>
            <div className="my-3">
              <p className="m-0">
                <strong>Course Title: {course.title}</strong>
              </p>
              <p className="m-0">
                <strong>
                  Description: {course.description.substring(0, 20)}....
                </strong>
              </p>
              <p className="m-0">
                <strong>No of Students: {course.students.length}</strong>
              </p>
              <p className="m-0">
                <strong>
                  Course Status :{" "}
                  {course.isApproved ? (
                    <span className="text-green-700">Ongoing</span>
                  ) : (
                    <span className="text-orange-500">Pending Approval</span>
                  )}
                </strong>
              </p>
            </div>

            <div className="mt-auto pt-3">
              {course.isApproved ? (
                <Button
                  label="View Details"
                  className="p-button-outlined w-full"
                  onClick={() => navigate(`/teacherdashboard/${course._id}`)}
                />
              ) : (
                <div className="text-orange-500 border-2 p-2 text-center font-semibold rounded-md border-orange-500">
                  Waiting for Approval
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-4 mt-3 md:w-[80%] w-[95%] mx-auto">
      {/* Teacher Profile Section */}
      <Card className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-4">
            <div className="flex flex-column align-items-center">
              <Avatar
                image={profileImage}
                size="xlarge"
                shape="circle"
                className="mb-3"
              />
              <h2 className="m-0 text-2xl font-bold">{currentUser.Name}</h2>
              <p className="text-500">{currentUser.role.toUpperCase()}</p>
            </div>
          </div>

          <div className="col-12 md:col-8 flex flex-col justify-center gap-3">
            <div className="grid">
              <div className="col-12">
                <h3>Personal Information</h3>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <p>
                      <strong>Email:</strong> {currentUser.email}
                    </p>
                    <p>
                      <strong>MIS No :</strong> {currentUser.rollNumber}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p>
                      <strong>Active Courses: </strong>
                      {courses.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Courses Section */}
      <Card>
        <div className="flex justify-content-between align-items-center mb-4">
          <h2 className="m-0 text-xl font-semibold">My Courses</h2>
          <Button
            label="Request New Course"
            icon="pi pi-user"
            severity="secondary"
            className="p-2 m-3 md:text-md text-sm"
            onClick={() => setShowReqCourseModel(true)}
          />
        </div>
        <DataView value={courses} itemTemplate={courseTemplate} layout="grid" />
      </Card>
      <Dialog
        header="Request New Course"
        visible={showReqCourseModel}
        className="w-[95vw] sm:w-[80vw] lg:w-[50vw]"
        footer={footer}
        onHide={() => setShowReqCourseModel(false)}
      >
        <div className="p-fluid">
          <div className="p-field mb-3">
            <label htmlFor="title">Course Title</label>
            <InputText
              id="title"
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="description">Description</label>
            <InputTextarea
              id="description"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  description: e.target.value,
                })
              }
              rows={3}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default TeacherDashboardMain;
