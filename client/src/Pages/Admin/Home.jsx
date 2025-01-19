import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';
import {toast} from 'react-toastify';

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
    const { dispatch, state } = useAuthContext();
    const navigate = useNavigate();


    const adminData = {
        name: state.user?.name || "Admin",
        email: state.user?.email || "adminEmail",
        avatar: "https://avatar.iran.liara.run/public/12"
    };

    const fetchAdminRequests = async () => {
        try{
            const response = await fetch('http://localhost:3000/api/admin/requests', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`
                }
            });
            const data = await response.json();
            console.log(data);
            setRequests(data.data);
        }catch(e) {
            console.log(e);
            toast.error("Could not fetch requests, Contact Developer!");
        }
    
    }

    useEffect(() => {
        fetchAdminRequests();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        dispatch({ type: "LOGOUT" });
        navigate("/admin/login");
    };

    const handleAction = (request, action) => {
        setSelectedRequest(request);
        setActionType(action);
        setShowFeedbackDialog(true);
    };

    const submitAction = async () => {
        try {
            if (actionType === 'approve') {
                const response = await fetch("http://localhost:3000/api/admin/approve-request", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.token}`
                    },
                    body: JSON.stringify({
                        requestId: selectedRequest._id,
                        feedback: feedback
                    })
                });
                if(response.ok) {

                    toast.success("Request Approved Successfully");
                }       

                // await Request.approveRequest(selectedRequest.id, feedback);
            } else {
                const response = await fetch("http://localhost:3000/api/admin/reject-request", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.token}`
                    },
                    body: JSON.stringify({
                        requestId: selectedRequest._id,
                        feedback: feedback
                    })
                });
                if(response.ok) {
                    toast.success("Request Rejected Successfully");
                }
                // await Request.rejectRequest(selectedRequest.id, feedback);
            }
            
            // Refresh requests
            fetchAdminRequests();
            
            setShowFeedbackDialog(false);
            setFeedback('');
            setSelectedRequest(null);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-check" 
                    className="p-button-success" 
                    onClick={() => handleAction(rowData, 'approve')}
                    tooltip="Approve"
                />
                <Button 
                    icon="pi pi-times" 
                    className="p-button-danger" 
                    onClick={() => handleAction(rowData, 'reject')}
                    tooltip="Reject"
                />
            </div>
        );
    };

    const dateTemplate = (rowData) => {
        return new Date(rowData.createdAt).toLocaleDateString();
    };

    const requestTypeTemplate = (rowData) => {
        const typeMap = {
            'TEACHER_SIGNUP': 'Teacher Signup',
            'COURSE_CREATION': 'Course Creation'
        };
        return typeMap[rowData.type] || rowData.type;
    };

    return (
        <div className="p-4">
            <div className="flex justify-content-between align-items-center mb-4">
                <Card className="w-full md:w-4">
                    <div className="flex align-items-center">
                        <Avatar 
                            image={adminData.avatar || 'https://via.placeholder.com/150'} 
                            size="large" 
                            shape="circle" 
                            className="mr-4"
                        />
                        <div>
                            <h2 className="text-xl font-bold m-0">{adminData.name}</h2>
                            <p className="text-gray-600 m-0">{adminData.email}</p>
                        </div>
                        <Button 
                            icon="pi pi-sign-out" 
                            onClick={handleLogout}
                            className="ml-auto p-button-secondary"
                            tooltip="Logout"
                        />
                    </div>
                </Card>
            </div>

            <TabView>
                <TabPanel header="Pending Requests">
                    <DataTable 
                        value={requests.filter(r => r.status === 'PENDING')}
                        paginator 
                        rows={10}
                        className="p-datatable-sm"
                    >
                        <Column field="type" header="Type" body={requestTypeTemplate} />
                        <Column field="requestedBy.email" header="Requested By" />
                        <Column field="createdAt" header="Date" body={dateTemplate} />
                        <Column body={actionTemplate} header="Actions" />
                    </DataTable>
                </TabPanel>
                <TabPanel header="Approved Requests">
                    <DataTable 
                        value={requests.filter(r => r.status === 'APPROVED')}
                        paginator 
                        rows={10}
                        className="p-datatable-sm"
                    >
                        <Column field="type" header="Type" body={requestTypeTemplate} />
                        <Column field="requestedBy.email" header="Requested By" />
                        <Column field="createdAt" header="Date" body={dateTemplate} />
                        <Column field="feedback" header="Feedback" />
                    </DataTable>
                </TabPanel>
                <TabPanel header="Rejected Requests">
                    <DataTable 
                        value={requests.filter(r => r.status === 'REJECTED')}
                        paginator 
                        rows={10}
                        className="p-datatable-sm"
                    >
                        <Column field="type" header="Type" body={requestTypeTemplate} />
                        <Column field="requestedBy.email" header="Requested By" />
                        <Column field="createdAt" header="Date" body={dateTemplate} />
                        <Column field="feedback" header="Feedback" />
                    </DataTable>
                </TabPanel>
            </TabView>

            <Dialog 
                visible={showFeedbackDialog} 
                onHide={() => setShowFeedbackDialog(false)}
                header={`${actionType === 'approve' ? 'Approve' : 'Reject'} Request`}
                modal
                className="w-full md:w-6"
            >
                <div className="flex flex-column gap-4">
                    <InputTextarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={5}
                        placeholder="Enter feedback..."
                        className="w-full"
                    />
                    <div className="flex justify-content-end gap-2">
                        <Button 
                            label="Cancel" 
                            className="p-button-secondary" 
                            onClick={() => setShowFeedbackDialog(false)}
                        />
                        <Button 
                            label="Submit" 
                            onClick={submitAction}
                            className={actionType === 'approve' ? 'p-button-success' : 'p-button-danger'}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default AdminDashboard;