// export default CoursePage;
import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { useParams } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import ReferenceMaterialCard from "../components/ReferenceMaterialCard";
import AssignmentStatusTemplate from "../components/AssignmentStatusTemplate";

const CoursePage = () => {
  const { state } = useAuthContext();
  const currentUserId = state?.user?.id;
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [instructorName, setInstructorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const toast = React.useRef(null);

  // Reference materials data
  const referenceMaterials = [
    {
      id: 1,
      title: "Course Textbook",
      type: "PDF",
      size: "15MB",
      preview: "/api/placeholder/200/280",
      description: "Main course textbook covering all essential topics",
    },
    {
      id: 2,
      title: "Lecture Notes",
      type: "PDF",
      size: "5MB",
      preview: "/api/placeholder/200/280",
      description: "Comprehensive notes from all lectures",
    },
    {
      id: 3,
      title: "Additional Reading",
      type: "PDF",
      size: "8MB",
      preview: "/api/placeholder/200/280",
      description: "Supplementary materials and research papers",
    },
  ];

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:3000/api/course/get-course/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      if (response.data?.data) {
        setCourse(response.data.data);
        await fetchInstructorData(response.data.data.createdBy);
      } else {
        throw new Error("Course data not found");
      }
    } catch (err) {
      setError(err.message || "Error fetching course data");
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load course data",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructorData = async (instructorId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/teacher/get-teacher-by-id/${instructorId}`
      );

      if (response.data?.data) {
        setInstructorName(response.data.data.Name);
      }
    } catch (err) {
      console.error("Error fetching instructor data:", err);
      setInstructorName("Unknown Instructor");
    }
  };

  const handleEnrollment = async () => {
    try {
      setEnrolling(true);
      const response = await fetch(
        `http://localhost:3000/api/course/enroll-student/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        setIsEnrolled(true);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully enrolled in the course",
          life: 3000,
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to enroll in the course",
        life: 3000,
      });
    } finally {
      setEnrolling(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  const EnrollButton = () => (
    <button
      onClick={handleEnrollment}
      disabled={enrolling || isEnrolled}
      className={`
                relative px-6 py-3 rounded-lg font-medium
                transition-all duration-200
                flex items-center justify-center gap-2
                ${
                  isEnrolled
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-[#1996ac] text-white hover:bg-[#15525d]"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-sm hover:shadow-md
            `}
    >
      {enrolling ? (
        <>
          <ProgressSpinner style={{ width: "20px", height: "20px" }} />
          <span>Processing...</span>
        </>
      ) : isEnrolled ? (
        <>
          <i className="pi pi-check mr-2" />
          <span>Enrolled</span>
        </>
      ) : (
        <>
          <i className="pi pi-plus mr-2" />
          <span>Enroll</span>
        </>
      )}
    </button>
  );

  return (
    <>
      <Toast ref={toast} />
      <Card className="w-full max-w-6xl mx-auto">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-center mb-5">
            {course?.title}
          </h1>
          <p className="text-xl text-center text-gray-600 mb-4">
            {course?.description}
          </p>

          <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
            <CgProfile className="text-xl" />
            <span className="text-lg">{instructorName}</span>
          </div>

          <Panel header="Reference Materials" className="mb-4" toggleable>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {referenceMaterials.map((material) => (
                <ReferenceMaterialCard key={material.id} material={material} />
              ))}
            </div>
          </Panel>

          <Panel header="Assignments" className="mb-4" toggleable>
            <AssignmentStatusTemplate courseId={id} />
          </Panel>

          <div className="flex justify-center mt-6">
            <EnrollButton />
          </div>
        </div>
      </Card>
    </>
  );
};

export default CoursePage;
