// // export default SidebarComponent;
// import React, { useState } from 'react';
// import { Sidebar } from 'primereact/sidebar';
// import { Button } from 'primereact/button';
// import { Menu } from 'primereact/menu';
// import useAuthContext from '../hooks/useAuthContext';
// import { useNavigate } from 'react-router';


// const SidebarComponent = ({ userRole }) => {
//     const [visible, setVisible] = useState(false);
//     const { dispatch, isAuthenticated, state } = useAuthContext();
//     const navigate = useNavigate();
//     function logout() {
//         localStorage.clear();
//         dispatch({ type: 'LOGOUT' });
//         navigate('/login');
//     }

//     function navigateDashboard() {
//         if(state?.user?.role === "teacher") {
//             navigate("/teacher/teacher-dashboard")
//         }
//         else if(state?.user?.role === "student") {
//             navigate("/studentDashboard")
//         }else if(state?.user?.role === "admin") {
//             navigate("/admin/home")
//         }

//         setVisible(false);
//     }

//     // Custom menu item template for better spacing and larger text
//     const itemTemplate = (item) => (
//         <div className="flex items-center py-3 px-4 text-lg">
//             <i className={`${item.icon} mr-4 text-xl`}></i>
//             <span>{item.label}</span>
//         </div>
//     );

//     // Define menu items based on user role
//     const getMenuItems = () => {
//         const commonItems = [
//             // {
//             //     template: itemTemplate,
//             //     label: 'All Courses',
//             //     icon: 'pi pi-book',
//             //     command: () => {/* handle navigation */}
//             // },
//             {
//                 template: itemTemplate,
//                 label: 'Dashboard',
//                 icon: 'pi pi-home',
//                 command: () => {navigateDashboard} 
//             }
//         ];

//         const teacherItems = [
//             ...commonItems,
//             // {
//             //     template: itemTemplate,
//             //     label: 'Pending Assignments',
//             //     icon: 'pi pi-clock',
//             //     command: () => {/* handle navigation */}
//             // },
//             // {
//             //     template: itemTemplate,
//             //     label: 'Grade Management',
//             //     icon: 'pi pi-chart-bar',
//             //     command: () => {/* handle navigation */}
//             // }
//         ];

//         const studentItems = [
//             ...commonItems,
//             // {
//             //     template: itemTemplate,
//             //     label: 'My Grades',
//             //     icon: 'pi pi-chart-line',
//             //     command: () => {/* handle navigation */}
//             // }
//         ];

//         return userRole === 'teacher' ? teacherItems : studentItems;
//     };

//     // Custom styles for logout item
//     const logoutTemplate = (item) => (
//         <div onClick={logout} className="flex items-center justify-center py-3 px-4 text-lg text-red-600">
//             <i className={`${item.icon} mr-4 text-xl`}></i>
//             <span>{item.label}</span>
//         </div>
//     );

//     const logoutItem = [{
//         template: logoutTemplate,
//         label: 'Logout',
//         icon: 'pi pi-power-off',
//         command: () => {logout()}
//     }];

//     return (
//         <div className="card flex">
//             <Sidebar 
//                 visible={visible} 
//                 onHide={() => setVisible(false)}
//                 className="w-72 h-full" // Slightly wider for better text display
//                 showCloseIcon={true}
//             >
//                 {/* Add Logo at the Top */}
//                 <div className="flex flex-col items-center py-6">
//                     <img
//                         src="/public/logo.png" // Ensure this matches the location of your logo in the public folder
//                         alt="LearnSphere Logo"
//                         className="h-20 w-20 rounded-full" // Adjust height/width as necessary
//                     />
//                     <h2 className="mt-2 text-xl font-semibold text-gray-800">LearnSphere</h2>
//                 </div>
//                 <div className="flex flex-col h-auto">
//                     <div className="flex-grow">
//                         <Menu 
//                             model={getMenuItems()} 
//                             className="w-full border-none mt-4"
//                         />
//                     </div>
//                     <div className="border-t border-gray-200 mt-auto">
//                         <Menu 
//                             model={logoutItem} 
//                             className="w-full border-none"
//                         />
//                     </div>
//                 </div>
//             </Sidebar>
            
//             {/* Hamburger toggle button */}
//             <Button 
//                 icon={visible ? "pi pi-times" : "pi pi-bars"}
//                 onClick={() => setVisible(!visible)}
//                 className="p-button-text p-button-lg" // Larger button
//                 style={{ fontSize: '1.5rem' }} // Larger icon
//             />
//         </div>
//     );
// };

// // Add custom CSS to override PrimeReact default styles
// const style = document.createElement('style');
// style.textContent = `
//     .p-menu .p-menuitem:hover {
//         background-color: #f3f4f6 !important;
//     }
    
//     .p-menu .p-menuitem {
//         margin: 0.25rem 0;
//     }
    
//     .p-sidebar {
//         box-shadow: 2px 0 8px rgba(0,0,0,0.1) !important;
//     }
// `;
// document.head.appendChild(style);

// export default SidebarComponent;


import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import useAuthContext from '../hooks/useAuthContext';
import { useNavigate } from 'react-router';

const SidebarComponent = () => {
    const { dispatch, isAuthenticated, state } = useAuthContext();
    const userRole = state.user.role
    const [visible, setVisible] = useState(false);
    
    const navigate = useNavigate();

    function logout() {
        localStorage.clear();
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
    }

    function navigateDashboard() {
        if(state?.user?.role === "teacher") {
            navigate("/teacher-dashboard");
        }
        else if(state?.user?.role === "student") {
            navigate("/studentDashboard");
        }
        setVisible(false);
    }

    // Custom menu item template for better spacing and larger text
    const itemTemplate = (item) => (
        <div className="flex items-center py-3 px-4 text-lg">
            <i className={`${item.icon} mr-4 text-xl`}></i>
            <span>{item.label}</span>
        </div>
    );

    // Define menu items based on user role
    const getMenuItems = () => {
        const commonItems = [
            {
                template: itemTemplate,
                label: 'Dashboard',
                icon: 'pi pi-home',
                command: () => {navigateDashboard()} // Fixed: Now properly calls the function
            }
        ];

        const teacherItems = [
            ...commonItems
        ];

        const studentItems = [
            ...commonItems
        ];

        return userRole === 'teacher' ? teacherItems : studentItems;
    };

    // Custom styles for logout item
    const logoutTemplate = (item) => (
        <div className="flex items-center justify-center py-3 px-4 text-lg text-red-600 cursor-pointer">
            <i className={`${item.icon} mr-4 text-xl`}></i>
            <span>{item.label}</span>
        </div>
    );

    const logoutItem = [{
        template: logoutTemplate,
        label: 'Logout',
        icon: 'pi pi-power-off',
        command: () => logout()  // Fixed: Now properly calls the logout function
    }];

    return (
        <div className="card flex">
            <Sidebar 
                visible={visible} 
                onHide={() => setVisible(false)}
                className="w-72 h-full"
                showCloseIcon={true}
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center py-6">
                    <img
                        src="/public/logo.png"
                        alt="LearnSphere Logo"
                        className="h-20 w-20 rounded-full"
                    />
                    <h2 className="mt-2 text-xl font-semibold text-gray-800">LearnSphere</h2>
                </div>
                <div className="flex flex-col h-auto">
                    <div className="flex-grow">
                        <Menu 
                            model={getMenuItems()} 
                            className="w-full border-none mt-4"
                            onClick={navigateDashboard}
                        />
                    </div>
                    <div className="border-t border-gray-200 mt-auto">
                        <Menu 
                            model={logoutItem} 
                            className="w-full border-none"
                        />
                    </div>
                </div>
            </Sidebar>
            
            {/* Hamburger toggle button */}
            <Button 
                icon={visible ? "pi pi-times" : "pi pi-bars"}
                onClick={() => setVisible(!visible)}
                className="p-button-text p-button-lg"
                style={{ fontSize: '1.5rem' }}
            />
        </div>
    );
};

// Add custom CSS to override PrimeReact default styles
const style = document.createElement('style');
style.textContent = `
    .p-menu .p-menuitem:hover {
        background-color: #f3f4f6 !important;
    }
    
    .p-menu .p-menuitem {
        margin: 0.25rem 0;
    }
    
    .p-sidebar {
        box-shadow: 2px 0 8px rgba(0,0,0,0.1) !important;
    }
`;
document.head.appendChild(style);

export default SidebarComponent;