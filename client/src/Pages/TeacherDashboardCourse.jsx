import { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import ViewEnrollmentRequest from "../components/ViewEnrollmentRequest";
import useAuthContext from "../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
const TeacherDashboardCourse = () => {
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const { courseid } = useParams();
  const toastRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [viewEnrollmentForm, setviewEnrollmentForm] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [course, setCourse] = useState({});
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [currentSubmissions, setCurrentSubmissions] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [requests, setRequests] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    deadline: null,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/course/enrollment-requests?instructorId=${state.user._id}&courseId=${courseid}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${state.token}` },
          }
        );
        const data = await response.json();
        console.log(data.data);
        setRequests(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    getCoursefromId(courseid);
  }, [courseid]);

  if (!state || !state.user || state.user.role !== "teacher") {
    return navigate("/login");
  }
  const getAssignments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/assignment/get-assignments-by-course-id/${courseid}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      setAssignments(response.data.data);
    } catch (err) {
      console.log(err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch assignments",
        life: 3000,
      });
    }
  };
  const viewSubmissions = async (assignment) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/attachments/assignment/${assignment._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      const data = await response.json();
      setCurrentSubmissions(data || []);
      setShowSubmissionsModal(true);
    } catch (err) {
      console.log(err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch submissions",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    getAssignments();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/course/getAllStudentsForCourse/${courseid}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      setEnrolledStudents(response.data.data);
    } catch (err) {
      console.log(err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch students",
        life: 3000,
      });
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

      const newAssignmentResponse = await createAssignmentfromRubrik(
        response.data.data
      );

      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Assignment created successfully",
        life: 3000,
      });
      setShowModal(false);
      setNewAssignment({ title: "", description: "", deadline: null });
      getAssignments();

      return newAssignmentResponse;
    } catch (err) {
      console.log(err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create assignment",
        life: 3000,
      });
    }
  };
  const getCoursefromId = async (courseid) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/course/get-course/${courseid}`
      );
      setCourse(response.data.data);
    } catch (err) {
      console.log(err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch course details",
        life: 3000,
      });
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
      return response.data;
    } catch (err) {
      throw new Error(err);
    }
  };
  const actionsTemplate = (rowData) => {
    const downloadFile = async (fileId) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/attachments/${fileId}`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        const data = await response.json();

        const contentType = data.contentType || "application/octet-stream";
        const encoding = data.encoding;
        const content = data.content;

        let blob;
        if (encoding === "base64") {
          const byteCharacters = atob(content);
          const byteArrays = [];

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }

          blob = new Blob(byteArrays, { type: contentType });
        } else {
          blob = new Blob([content], { type: contentType });
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = data.originalname || "download";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        console.error("Download error:", err);
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to download file",
          life: 3000,
        });
      }
    };
    const previewFile = async (fileId) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/attachments/${fileId}`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        const data = await response.json();

        const contentType = data.contentType || "application/octet-stream";
        const encoding = data.encoding;
        const content = data.content;

        let blob;
        if (encoding === "base64") {
          const byteCharacters = atob(content);
          const byteArrays = [];

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }

          blob = new Blob(byteArrays, { type: contentType });
        } else {
          blob = new Blob([content], { type: contentType });
        }

        // Cleanup previous preview URL if it exists
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setShowPreviewModal(true);
      } catch (err) {
        console.error("Preview error:", err);
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to preview file",
          life: 3000,
        });
      }
    };
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-sm p-button-info"
          onClick={() => previewFile(rowData.path)}
          tooltip="Preview"
        />
        <Button
          icon="pi pi-download"
          className="p-button-sm p-button-success"
          onClick={() => downloadFile(rowData.path)}
          tooltip="Download"
        />
      </div>
    );
  };
  const dateTemplate = (rowData) => {
    return new Date(rowData.createdAt).toLocaleString();
  };
  const submitterTemplate = (rowData) => {
    return rowData.uploadedBy?.Name || "N/A";
  };
  const createAssignmentFooter = (
    <div>
      <Button
        label="Create"
        icon="pi pi-check"
        onClick={handleCreateAssignment}
      />
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setShowModal(false)}
        className="p-button-text"
      />
    </div>
  );
  const submissionsModalFooter = (
    <div>
      <Button
        label="Close"
        icon="pi pi-times"
        onClick={() => setShowSubmissionsModal(false)}
        className="p-button-text"
      />
    </div>
  );
  const previewModalFooter = (
    <div>
      <Button
        label="Close"
        icon="pi pi-times"
        onClick={() => {
          setShowPreviewModal(false);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl("");
          }
        }}
        className="p-button-text"
      />
    </div>
  );
  return (
    <div className="p-4 md:w-[80%] w-[95%] m-auto">
      <Toast ref={toastRef} />

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
          <Column
            field="rollNumber"
            header="MIS"
            style={{ width: "25%" }}
          ></Column>
          <Column field="Name" header="Name" style={{ width: "25%" }}></Column>
        </DataTable>
      </Card>
      <Card title="Assignments" className="mb-4">
        <DataTable value={assignments} responsiveLayout="scroll">
          <Column
            className="flex-col justify-center items-center"
            align={"center"}
            field="title"
            header="Title"
          />
          <Column
            className="flex-col justify-center items-center"
            align={"center"}
            field="deadline"
            header="Deadline"
            body={(rowData) => new Date(rowData.deadline).toLocaleString()}
          />
          <Column
            header="View Submissions"
            body={(rowData) => (
              <Button
                label="View Submissions"
                icon="pi pi-eye"
                onClick={() => viewSubmissions(rowData)}
                severity="info"
              />
            )}
          />
        </DataTable>
      </Card>
      {/* Create Assignment Modal */}
      <Dialog
        header="Create New Assignment"
        visible={showModal}
        style={{ width: "50vw" }}
        footer={createAssignmentFooter}
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
            <label htmlFor="description">Description </label>
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

      {/* Submissions Modal */}
      <Dialog
        header="Assignment Submissions"
        visible={showSubmissionsModal}
        style={{ width: "90vw" }}
        footer={submissionsModalFooter}
        onHide={() => setShowSubmissionsModal(false)}
        maximizable
      >
        <DataTable
          value={currentSubmissions}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-sm"
          emptyMessage="No submissions found"
        >
          <Column field="filename" header="File Name" sortable />
          <Column
            field="uploadedBy.Name"
            header="Submitted By"
            body={submitterTemplate}
            sortable
          />
          <Column
            field="createdAt"
            header="Submitted At"
            body={dateTemplate}
            sortable
          />
          <Column
            header="Actions"
            body={actionsTemplate}
            style={{ width: "150px" }}
          />
        </DataTable>
      </Dialog>

      {/* Preview Modal */}
      <Dialog
        header="Document Preview"
        visible={showPreviewModal}
        style={{ width: "90vw", height: "90vh" }}
        footer={previewModalFooter}
        onHide={() => {
          setShowPreviewModal(false);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl("");
          }
        }}
        maximizable
      >
        <div className="h-full">
          <iframe
            src={previewUrl}
            className="w-full h-[calc(100%-2rem)]"
            title="Document Preview"
          />
        </div>
      </Dialog>

      {/* Enrollment Requests Dialog */}
      <ViewEnrollmentRequest
        visible={viewEnrollmentForm}
        onHide={() => setviewEnrollmentForm(false)}
        teacherId={state.user._id}
        courseId={courseid}
      />
    </div>
  );
};
export default TeacherDashboardCourse;
