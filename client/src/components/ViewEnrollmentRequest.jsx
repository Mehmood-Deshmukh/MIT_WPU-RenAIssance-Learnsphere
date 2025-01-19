import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";

const ViewEnrollmentRequest = ({ visible, onHide, data, courseId }) => {
  const [requests, setRequests] = useState(data);
  const { state } = useAuthContext();

  useEffect(() => {
    setRequests(data);
  }, [data]);

  const handleApprove = async (requestId) => {
    console.log(requestId);
    try {
      // Make API call here
      const response = await axios.post(
        `http://localhost:3000/api/teacher/approve-course-enrollment/${requestId}`,
        {
          requestId: requestId,
          courseId: courseId,
          feedback: "",
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      console.log(response.data);
      setRequests(
        requests.map((request) =>
          request._id === requestId
            ? { ...request, status: "APPROVED" }
            : request
        )
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      // Make API call here
      setRequests(
        requests.map((request) =>
          request._id === requestId
            ? { ...request, status: "REJECTED" }
            : request
        )
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusBodyTemplate = (rowData) => {
    const statusClass =
      {
        PENDING: "bg-yellow-100 text-yellow-900",
        APPROVED: "bg-green-100 text-green-900",
        REJECTED: "bg-red-100 text-red-900",
      }[rowData.status] || "bg-gray-100";

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${statusClass}`}>
        {rowData.status}
      </span>
    );
  };

  const actionBodyTemplate = (rowData) => {
    if (rowData.status === "PENDING") {
      return (
        <div className="flex gap-2">
          <Button
            icon="pi pi-check"
            className="p-button-success p-2"
            onClick={() => handleApprove(rowData._id)}
            tooltip="Approve"
          />
          <Button
            icon="pi pi-times"
            className="p-button-danger p-2"
            onClick={() => handleReject(rowData._id)}
            tooltip="Reject"
          />
        </div>
      );
    }
    return null;
  };

  const columns = [
    {
      field: "requestedBy.Name",
      header: "Student Name",
      body: (rowData) => rowData.requestedBy.Name,
      sortable: true,
    },
    {
      field: "requestedBy.email",
      header: "Email",
      body: (rowData) => rowData.requestedBy.email,
      sortable: true,
    },
    {
      field: "createdAt",
      header: "Request Date",
      body: (rowData) => formatDate(rowData.createdAt),
      sortable: true,
    },
    {
      field: "status",
      header: "Status",
      body: statusBodyTemplate,
      sortable: true,
    },
    {
      field: "actions",
      header: "Actions",
      body: actionBodyTemplate,
    },
  ];

  return (
    <Dialog
      header="Enrollment Requests"
      visible={visible}
      onHide={onHide}
      style={{ width: "80vw" }}
      modal
      className="p-fluid"
    >
      <div className="card">
        <DataTable
          value={requests}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-sm"
          stripedRows
          responsiveLayout="scroll"
          emptyMessage="No enrollment requests found"
        >
          {columns.map((col) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              sortable={col.sortable}
              body={col.body}
            />
          ))}
        </DataTable>
      </div>
    </Dialog>
  );
};

export default ViewEnrollmentRequest;
