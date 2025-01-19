import { useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";

const ViewEnrollmentRequest = ({ visible, onHide, courseId }) => {
  // Sample data - in real app, this would come from props or AP
  const [requests, setRequests] = useState([
    {
      id: 1,
      studentName: "John Doe",
      email: "john.doe@example.com",
      requestDate: "2025-01-15",
      status: "pending",
    },
    {
      id: 2,
      studentName: "Jane Smith",
      email: "jane.smith@example.com",
      requestDate: "2025-01-16",
      status: "pending",
    },
  ]);

  const handleApprove = (requestId) => {
    setRequests(
      requests.map((request) =>
        request.id === requestId ? { ...request, status: "approved" } : request
      )
    );
    // In real app: Make API call to update status
  };

  const handleReject = (requestId) => {
    setRequests(
      requests.map((request) =>
        request.id === requestId ? { ...request, status: "rejected" } : request
      )
    );
    // In real app: Make API call to update status
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span className={`status-badge status-${rowData.status.toLowerCase()}`}>
        {rowData.status}
      </span>
    );
  };

  const actionBodyTemplate = (rowData) => {
    if (rowData.status === "pending") {
      return (
        <div className="action-buttons">
          <Button
            icon="pi pi-check"
            className="p-button-success p-button-sm mr-2"
            onClick={() => handleApprove(rowData.id)}
          />
          <Button
            icon="pi pi-times"
            className="p-button-danger p-button-sm"
            onClick={() => handleReject(rowData.id)}
          />
        </div>
      );
    }
    return null;
  };

  const columns = [
    {
      field: "studentName",
      header: "Student Name",
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
    },
    {
      field: "requestDate",
      header: "Request Date",
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
