// import React from "react";
// import { Card } from "primereact/card";
// import { Panel } from "primereact/panel";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import ReferenceMaterialCard from "../components/ReferenceMaterialCard";
// import AssignmentStatusTemplate from "../components/AssignmentStatusTemplate";
// import { CgProfile } from "react-icons/cg";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router";
// import { FaChalkboardTeacher } from "react-icons/fa";
// import useAuthContext from "../hooks/useAuthContext";

// const CoursePage = () => {
//     const {state} = useAuthContext();
//     const currentUserId = state?.user?.id;
//     const { id } = useParams();
//     const [course, setCourse] = useState({});
//     const [instructorName, setInstructorName] = useState(null);

//     const getCourse = async () => {
//         try {
//             const response = await axios.get(
//                 `http://localhost:3000/api/course/get-course/${id}`, {withCredentials : true, headers : {Authorization : `Bearer ${localStorage.getItem("token")}`}}
//             );
//             if (!response.data) {
//                 console.log("No such course exists");
//             } else {
//                 console.log("course is", response.data.data);
//                 setCourse(response.data.data);
//                 await getInstructor(response.data.data.createdBy);
//             }
//         } catch {
//             console.log("Error fetching course");
//         }
//     };

//     const getInstructor = async (id) => {

//         try {
//             const response = await axios.get(`http://localhost:3000/api/teacher/get-teacher-by-id/${id}`)
//             if (!response.data) {
//                 console.log("No such instructor exists");
//             } else {
//                 // console.log("instructior", response.data.data);
//                 // console.log(response.data.data.Name)
//                 setInstructorName(response.data.data.Name)
//             }
//         } catch {
//             console.log("Error fetching course");
//         }
//     }

//     useEffect(() => {

//         getCourse();
//     }

//         , []);

//     const referenceMaterials = [
//         {
//             id: 1,
//             title: "Course Textbook",
//             type: "PDF",
//             size: "15MB",
//             preview: "/api/placeholder/200/280",
//             description: "Main course textbook covering all essential topics",
//         },
//         {
//             id: 2,
//             title: "Lecture Notes",
//             type: "PDF",
//             size: "5MB",
//             preview: "/api/placeholder/200/280",
//             description: "Comprehensive notes from all lectures",
//         },
//         {
//             id: 3,
//             title: "Additional Reading",
//             type: "PDF",
//             size: "8MB",
//             preview: "/api/placeholder/200/280",
//             description: "Supplementary materials and research papers",
//         },
//     ];

//     //   Sample data for assignments
//     //   const assignments = [
//     //     { id: 1, title: "Assignment 1", dueDate: "2025-02-01", status: "Done" },
//     //     { id: 2, title: "Assignment 2", dueDate: "2025-02-15", status: "Pending" },
//     //     { id: 3, title: "Assignment 3", dueDate: "2025-03-01", status: "Overdue" },
//     //   ];

//     // need to get a route to get assignments by course id

//     const EnrollmentButton = async () => {
//         const [isLoading, setIsLoading] = useState(false);
//         const [isEnrolled, setIsEnrolled] = useState(false);

//         const handleEnrollment = async () => {
//             setIsLoading(true);
//             // Simulate API call

//             const data = {studentId : currentUserId, courseId : id}
//             console.log("Sending enrollment request to server", data)
//             try {
//                 console.log("Course id", id)
//                 const response = await axios.get(`http://localhost:3000/api/course//enroll-student/${id}`, {withCredentials : true, headers : {Authorization : `Bearer ${localStorage.getItem("token")}`, data : data}},)
//                 if(response)
//                 {
//                     setIsEnrolled(true)
//                     console.log("Sent request successfully")
//                 } else {
//                     console.log("Couldnt send request")
//                 }
//             }
//             catch {
//             }
//             setTimeout(() => {
//                 setIsLoading(false);
//                 toast.error("Could not send request")
//             }, 1000);
//         };

//         return (
//             <button
//                 onClick={handleEnrollment}
//                 disabled={isLoading}
//                 className={`
//           relative
//           w-30
//           px-6
//           py-3
//           rounded-lg
//           font-medium
//           transition-all
//           duration-200
//           flex
//           items-center
//           justify-center
//           space-x-2
//           ${isEnrolled
//                         ? "bg-green-100 text-green-700 hover:bg-green-200"
//                         : "bg-[#1996ac] text-white hover:bg-[#15525d]"
//                     }
//           disabled:opacity-50
//           disabled:cursor-not-allowed
//           shadow-sm
//           hover:shadow-md
//           text-center
//         `}
//             >
//                 {isLoading ? (
//                     <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         <span>Processing...</span>
//                     </>
//                 ) : isEnrolled ? (
//                     <>
//                         <svg
//                             className="w-5 h-5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M5 13l4 4L19 7"
//                             />
//                         </svg>
//                         <span>Enrolled</span>
//                     </>
//                 ) : (
//                     <>
//                         <svg
//                             className="w-5 h-5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                             />
//                         </svg>
//                         <span>Enroll</span>
//                     </>
//                 )}
//             </button>
//         );
//     };

//     return (
//         <>
//         <Card className="w-full max-w-6xl mx-auto">
//             <div className="mb-4 items-center">
//                 <h1 className="text-6xl font-bold text-center w-full mb-5">
//                     {course.title} : {course.description}
//                 </h1>

//                 <div className="text-center w-full flex justify-center">
//                     <p className="text-20px mb-5 flex items-center text-gray-400 gap-4">
//                         <CgProfile /> Instructor : {instructorName}
//                     </p>
//                 </div>
//                 <Panel
//                     header="Reference Materials"
//                     className="mb-4 text-2xl"
//                     toggleable
//                 >
//                     <div className="flex flex-wrap justify-content-center gap-3">
//                         {referenceMaterials.map((material) => (
//                             <ReferenceMaterialCard key={material.id} material={material} />
//                         ))}
//                     </div>
//                 </Panel>

//                 <Panel header="Assignments" className="text-2xl" toggleable>
//                     <AssignmentStatusTemplate courseId={id} />
//                 </Panel>
//                 <div className="w-full items-center flex justify-content-center mt-4">
//                     <EnrollmentButton />
//                 </div>
//             </div>
//         </Card>
//         </>
//     );
// };

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
