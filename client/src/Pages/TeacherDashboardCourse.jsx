//Open this file only if you dont get offended by bad code
import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";

import ViewEnrollmentRequest from "../components/ViewEnrollmentRequest";
import useAuthContext from "../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

const TeacherDashboardCourse = () => {
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [viewEnrollmentForm, setviewEnrollmentForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    deadline: null,
  });
  useEffect(() => {
    getCoursefromId(courseid);
  }, []);

  const [allStudents, setAllStudents] = useState([]);
  const { courseid } = useParams();
  const [course, setCourse] = useState({});

  if (!state || !state.user || state.user.role !== "teacher") {
    return navigate("/login");
  }

  // Dummy data

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/course/getAllStudentsForCourse/${courseid}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      setAllStudents(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateAssignment = async () => {
    const data = `Title: ${newAssignment.title},\n ${newAssignment.description}`;
    try {
      const response = await axios.post(
        "http://localhost:3000/get-rubrick",
        {
          prompt: data,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      console.log(response);
      const newAssignment = await createAssignmentfromRubrik(
        response.data.data
      );
      console.log(newAssignment);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Assignment created successfully",
        life: 3000,
      });

      setShowModal(false);
      return response;
    } catch (err) {
      console.log(err);
    }
    setShowModal(false);
    setNewAssignment({ title: "", description: "", deadline: null });
  };

  const getCoursefromId = async (courseid) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/course/get-course/${courseid}`
      );
      console.log(response);
      setCourse(response.data.data);
      console.log("Course", response.data.data);
    } catch (err) {
      throw new Error(err);
    }
  };

  const createAssignmentfromRubrik = async (rubrick) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/assignment/create-assignment",
        { rubrick, course, deadline: newAssignment.deadline },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      console.log(response);
      return response.data;
    } catch (err) {
      throw new Error(err);
    }
  };

  //dummy data
  const enrolledStudents = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
  ];
  const assignments = [
    { id: 1, title: "React Basics", status: "Active", submissions: 2 },
    { id: 2, title: "State Management", status: "Past", submissions: 3 },
    { id: 3, title: "Hooks in Depth", status: "Active", submissions: 1 },
  ];

  const footer = (
    <div>
      <Button
        label="Create"
        icon="pi pi-check"
        onClick={handleCreateAssignment}
      />
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => {
          setShowModal(false);
        }}
        className="p-button-text"
      />
    </div>
  );

  return (
    <div className="p-4 md:w-[80%] w-[95%] m-auto">
      <Card className="mb-5">
        <div className="w-full flex md:flex-row justify-between flex-col">
          <div>
            <h1 className="text-5xl mb-4">Course - {course.title}</h1>
            <h2 className="text-2xl mb-4">Welcome Back {state.user.Name}</h2>
            <div>
              <Button
                label="Create New Assignment"
                icon="pi pi-plus"
                severity="success"
                className="p-2 my-2 mx-3 ml-0"
                onClick={() => setShowModal(true)}
              />
              <Button
                label="View Enrollment Requests"
                icon="pi pi-eye"
                className="p-2 mx-3 my-2 ml-0"
                severity="info"
                onClick={() => setviewEnrollmentForm(true)}
              />
            </div>
          </div>
        </div>
      </Card>
      <Card title="Enrolled Students" className="mb-5">
        <DataTable
          value={enrolledStudents}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="id" header="MIS" style={{ width: "25%" }}></Column>
          <Column field="name" header="Name" style={{ width: "25%" }}></Column>
          <Column
            field="company"
            header="Company"
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="representative.name"
            header="Representative"
            style={{ width: "25%" }}
          ></Column>
        </DataTable>
      </Card>
      <Card title="Assignments" className="mb-4">
        <DataTable value={assignments} responsiveLayout="scroll">
          <Column
            className="flex-col justify-center items-center"
            align={"center"}
            field="title"
            header="Title"
          ></Column>
          <Column
            className="flex-col justify-center items-center"
            align={"center"}
            field="status"
            header="Status"
          ></Column>
          <Column
            className="flex-col justify-center items-center"
            align={"center"}
            field="submissions"
            header="Submissions"
          ></Column>
          <Column
            header="View Submissions"
            body={(rowData) => (
              <Button
                label="View"
                icon="pi pi-eye"
                className="p-button-text p-button-sm"
                onClick={() => viewSubmissions(rowData)}
              />
            )}
          ></Column>
        </DataTable>
      </Card>

      <Dialog
        header="Create New Assignment"
        visible={showModal}
        className="w-[95vw] sm:w-[80vw] lg:w-[50vw]"
        footer={footer}
        onHide={() => setShowModal(false)}
      >
        <div className="p-fluid">
          <div className="p-field mb-3">
            <label htmlFor="title">Title</label>
            <InputText
              id="title"
              value={newAssignment.title}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, title: e.target.value })
              }
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="description">Description</label>
            <InputTextarea
              id="description"
              value={newAssignment.description}
              onChange={(e) =>
                setNewAssignment({
                  ...newAssignment,
                  description: e.target.value,
                })
              }
              rows={3}
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="deadline">Deadline</label>
            <Calendar
              id="deadline"
              value={newAssignment.deadline}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, deadline: e.value })
              }
              showTime
              hourFormat="24"
            />
          </div>
        </div>
      </Dialog>
      {/* Request Course Dialog */}

      <div>
        <ViewEnrollmentRequest
          visible={viewEnrollmentForm}
          onHide={() => setviewEnrollmentForm(false)}
          teacherId={state.user._id}
        />
      </div>
    </div>
  );
};

export default TeacherDashboardCourse;
