import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PrimeReactProvider } from "primereact/api";
import AuthProvider from "./context/AuthContext.jsx";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

// Toast styles
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<PrimeReactProvider>
				<BrowserRouter>
					<App />
					<ToastContainer />
				</BrowserRouter>
			</PrimeReactProvider>
		</AuthProvider>
	</StrictMode>
);
