import React from "react";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ReferenceMaterialCard from "../components/ReferenceMaterialCard";
import AssignmentStatusTemplate from "../components/AssignmentStatusTemplate";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FaChalkboardTeacher } from "react-icons/fa";

const CoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [instructorName, setInstructorName] = useState(null);
  const getCourse = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/course/get-course/${id}`
      );
      if (!response.data) {
        console.log("No such course exists");
      } else {
        console.log("course is", response.data.data);
        setCourse(response.data.data);
        await getInstructor(response.data.data.createdBy);
      }
    } catch {
      console.log("Error fetching course");
    }
  };

  const getInstructor = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/teacher/get-teacher-by-id/${id}`
      );
      if (!response.data) {
        console.log("No such instructor exists");
      } else {
        console.log("instructior", response.data.data);
        console.log(response.data.data.Name);
        setInstructorName(response.data.data.Name);
      }
    } catch {
      console.log("Error fetching course");
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

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

  //   Sample data for assignments
  //   const assignments = [
  //     { id: 1, title: "Assignment 1", dueDate: "2025-02-01", status: "Done" },
  //     { id: 2, title: "Assignment 2", dueDate: "2025-02-15", status: "Pending" },
  //     { id: 3, title: "Assignment 3", dueDate: "2025-03-01", status: "Overdue" },
  //   ];

  // need to get a route to get assignments by course id

  const EnrollmentButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    const handleEnrollment = () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsEnrolled(!isEnrolled);
      }, 1000);
    };

    return (
      <button
        onClick={handleEnrollment}
        disabled={isLoading}
        className={`
          relative
          w-30
          px-6
          py-3
          rounded-lg
          font-medium
          transition-all
          duration-200
          flex
          items-center
          justify-center
          space-x-2
          ${
            isEnrolled
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-[#1996ac] text-white hover:bg-[#15525d]"
          }
          disabled:opacity-50
          disabled:cursor-not-allowed
          shadow-sm
          hover:shadow-md
          text-center
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : isEnrolled ? (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Enrolled</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Enroll</span>
          </>
        )}
      </button>
    );
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <div className="mb-4 items-center">
        <h1 className="text-6xl font-bold text-center w-full mb-5">
          {course.title}
        </h1>

        <div className="text-center w-full flex justify-center">
          <p className="text-20px mb-5 flex items-center text-gray-400 gap-4">
            <CgProfile /> Instructor : {instructorName}
          </p>
        </div>
        <Panel
          header="Reference Materials"
          className="mb-4 text-2xl"
          toggleable
        >
          <div className="flex flex-wrap justify-content-center gap-3">
            {referenceMaterials.map((material) => (
              <ReferenceMaterialCard key={material.id} material={material} />
            ))}
          </div>
        </Panel>

        {/* <Panel header="Assignments" className="text-2xl" toggleable>
          <DataTable value={assignments} responsiveLayout="scroll">
            <Column field="title" header="Title" />
            <Column field="dueDate" header="Due Date" />
            <Column
              field="status"
              header="Status"
              body={AssignmentStatusTemplate}
            />
          </DataTable>
        </Panel> */}
        <Panel header="Assignments" className="text-2xl" toggleable>
          <AssignmentStatusTemplate courseId={id} />
        </Panel>
        <div className="w-full items-center flex justify-content-center mt-4">
          <EnrollmentButton />
        </div>
      </div>
    </Card>
  );
};

export default CoursePage;
