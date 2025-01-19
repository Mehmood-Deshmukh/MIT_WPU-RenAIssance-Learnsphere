import { useState } from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const TeacherDashboardMain = () => {
  const footer = (
    <div>
      <Button label="Create" icon="pi pi-check" />
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
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
  });
  const [showReqCourseModel, setShowReqCourseModel] = useState(false);

  // Sample teacher data - in real app, this would come from API/props
  const [teacherData] = useState({
    id: "T123",
    name: "Abhijit A.M",
    email: "sarah.johnson@example.edu",
    department: "Computer Science",
    joinDate: "2023-09-01",
    expertise: ["Web Development", "Data Structures", "Machine Learning"],
    profileImage: "https://via.placeholder.com/150",
    stats: {
      totalStudents: 245,
      averageRating: 4.8,
      coursesCount: 6,
      completionRate: 92,
    },
  });

  // Sample courses data
  const [courses] = useState([
    {
      id: 1,
      name: "Advanced Web Development",
      code: "CS401",
      schedule: "Mon, Wed 10:00 AM",
      enrolled: 45,
      maxCapacity: 50,
      status: "active",
      progress: 65,
      nextClass: "2025-01-20T10:00:00",
    },
    {
      id: 2,
      name: "Data Structures and Algorithms",
      code: "CS301",
      schedule: "Tue, Thu 2:00 PM",
      enrolled: 38,
      maxCapacity: 40,
      status: "active",
      progress: 45,
      nextClass: "2025-01-21T14:00:00",
    },
    {
      id: 3,
      name: "Introduction to Machine Learning",
      code: "CS501",
      schedule: "Wed, Fri 1:00 PM",
      enrolled: 35,
      maxCapacity: 35,
      status: "upcoming",
      progress: 0,
      nextClass: "2025-01-22T13:00:00",
    },
  ]);

  const getStatusSeverity = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "upcoming":
        return "warning";
      case "completed":
        return "info";
      default:
        return null;
    }
  };

  const courseTemplate = (course) => {
    return (
      <div className="col-12 md:col-6 lg:col-4 p-2">
        <Card className="h-full">
          <div className="flex flex-column h-full">
            <div className="flex justify-content-between align-items-center">
              <h3 className="text-xl font-bold m-0">{course.name}</h3>
              <Tag
                severity={getStatusSeverity(course.status)}
                value={course.status.toUpperCase()}
              />
            </div>

            <div className="my-3">
              <p className="m-0">
                <strong>Course Code:</strong> {course.code}
              </p>
              <p className="m-0">
                <strong>Schedule:</strong> {course.schedule}
              </p>
              <p className="m-0">
                <strong>Enrollment:</strong> {course.enrolled}/
                {course.maxCapacity}
              </p>
            </div>

            <div className="mt-3">
              <label className="block mb-2">Course Progress</label>
              <ProgressBar
                value={course.progress}
                showValue
                style={{ height: "20px" }}
              />
            </div>

            <div className="mt-auto pt-3">
              <Button
                label="View Details"
                className="p-button-outlined w-full"
              />
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
                image={teacherData.profileImage}
                size="xlarge"
                shape="circle"
                className="mb-3"
              />
              <h2 className="m-0 text-2xl font-bold">{teacherData.name}</h2>
              <p className="text-500">{teacherData.department}</p>
            </div>
          </div>

          <div className="col-12 md:col-8">
            <div className="grid">
              <div className="col-12">
                <h3>Personal Information</h3>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <p>
                      <strong>Email:</strong> {teacherData.email}
                    </p>
                    <p>
                      <strong>Department:</strong> {teacherData.department}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p>
                      <strong>Total Students:</strong>{" "}
                      {teacherData.stats.totalStudents}
                    </p>
                    <p>
                      <strong>Active Courses:</strong>{" "}
                      {teacherData.stats.coursesCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <h3>Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {teacherData.expertise.map((skill, index) => (
                    <Tag key={index} value={skill} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Courses Section */}
      <Card>
        <div className="flex justify-content-between align-items-center mb-4">
          <h2 className="m-0">My Courses</h2>
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
