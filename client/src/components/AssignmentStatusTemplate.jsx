import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";
import { useNavigate } from "react-router";

const AssignmentsTable = ({ courseId }) => {
    const [assignments, setAssignments] = useState([]);
    const token = localStorage.getItem("token");
    const { state } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/assignment/get-assignments-by-course-id/${courseId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const userAssignments = state.user.assignments;
                const updatedAssignments = response.data.data.map((assignment) => {
                    if (userAssignments.includes(assignment._id)) {
                        return { ...assignment, status: "completed" };
                    } else if (new Date() < new Date(assignment.deadline)) {
                        return { ...assignment, status: "pending" };
                    } else {
                        return { ...assignment, status: "overdue" };
                    }
                });

                setAssignments(updatedAssignments);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            }
        };

        fetchAssignments();
    }, [courseId, state.user.assignments, token]);

    const [displayDialog, setDisplayDialog] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        deadline: null,
        status: "",
    });

    const statusOptions = [
        { label: "Completed", value: "completed" },
        { label: "Pending", value: "pending" },
        { label: "Overdue", value: "overdue" },
    ];

    const getStatusDetails = (status) => {
        switch (status) {
            case "completed":
                return {
                    icon: "pi pi-check-circle",
                    className: "bg-green-50 text-green-700",
                };
            case "pending":
                return {
                    icon: "pi pi-exclamation-circle",
                    className: "bg-orange-50 text-orange-700",
                };
            case "overdue":
                return {
                    icon: "pi pi-times-circle",
                    className: "bg-red-50 text-red-700",
                };
            default:
                return { icon: null, className: "" };
        }
    };

    const statusBodyTemplate = (rowData) => {
        const { icon, className } = getStatusDetails(rowData.status);
        return (
            <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm ${className}`}
            >
                <i className={`${icon} mr-2`}></i>
                <span className="capitalize">{rowData.status}</span>
            </div>
        );
    };

    const handleSave = () => {
        if (newAssignment.id) {
            setAssignments(
                assignments.map((a) => (a.id === newAssignment.id ? newAssignment : a))
            );
        } else {
            setAssignments([
                ...assignments,
                { ...newAssignment, id: assignments.length + 1 },
            ]);
        }
        setDisplayDialog(false);
        setNewAssignment({ title: "", deadline: null, status: "" });
    };

    const handleRowClick = (rowData) => {
        navigate(`/studentAssignment/${rowData._id}`);
    };

    const dialogFooter = (
        <div className="flex justify-end gap-2 mt-4">
            <Button
                label="Cancel"
                className="p-button-text text-xs sm:text-sm"
                onClick={() => setDisplayDialog(false)}
            />
            <Button
                label="Save"
                className="p-button-primary text-xs sm:text-sm"
                onClick={handleSave}
            />
        </div>
    );

    return (
        <Card className="p-4 sm:p-6">
            <DataTable
                value={assignments}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 20]}
                className="p-datatable-sm cursor-pointer"
                responsiveLayout="stack"
                emptyMessage="No assignments found"
                stripedRows
                onRowClick={(e) => handleRowClick(e.data)}
            >
                <Column field="title" header="Title" sortable />
                <Column
                    field="deadline"
                    header="Due Date"
                    sortable
                    body={(rowData) =>
                        new Date(rowData.deadline).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                    }
                />
                <Column
                    field="status"
                    header="Status"
                    sortable
                    body={statusBodyTemplate}
                />
            </DataTable>

            <Dialog
                visible={displayDialog}
                header={newAssignment.id ? "Edit Assignment" : "New Assignment"}
                modal
                className="p-4"
                style={{ width: "90%" }}
                footer={dialogFooter}
                onHide={() => setDisplayDialog(false)}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <InputText
                            value={newAssignment.title}
                            onChange={(e) =>
                                setNewAssignment({ ...newAssignment, title: e.target.value })
                            }
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Due Date
                        </label>
                        <Calendar
                            value={
                                newAssignment.deadline ? new Date(newAssignment.deadline) : null
                            }
                            onChange={(e) =>
                                setNewAssignment({ ...newAssignment, deadline: e.value })
                            }
                            showIcon
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <Dropdown
                            value={newAssignment.status}
                            options={statusOptions}
                            onChange={(e) =>
                                setNewAssignment({ ...newAssignment, status: e.value })
                            }
                            placeholder="Select Status"
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>
        </Card>
    );
};

export default AssignmentsTable;