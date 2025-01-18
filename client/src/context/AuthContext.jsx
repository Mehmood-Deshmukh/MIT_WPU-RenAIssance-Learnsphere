import React, { useEffect } from "react";
import { createContext, useReducer } from "react";
import { toast } from "react-toastify";
export const AuthContext = createContext();

const initialState = {
	isAuthenticated: false,
	loading: true,
	token: null,
	user: null,
};

export const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: action.payload?.user,
				token: action.payload?.token,
			};
		case "LOADING":
			return {
				...state,
				loading: true,
			};
		case "LOGOUT":
			return {
				...state,
				isAuthenticated: false,
				loading: false,
				user: null,
				token: null,
			};
		default:
			return state;
	}
};

const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	const fetchUserStatus = async (token) => {
		try {
			const user = await fetch("http://localhost:3000/auth/authenticate-user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			});

			const data = await user.json();
			if (user.ok) {
				dispatch({ type: "LOGIN", payload: { user: data.user, token } });
			} else {
				toast.error(data.message);
				dispatch({ type: "LOGOUT" });
			}
		} catch (e) {
			console.log(e.message);
			toast.error("An error occured, please try again later");
		}
	};

    useEffect(() => {
        console.log(state)
    }, [state]);

	useEffect(() => {
		try {
			dispatch({ type: "LOADING" });
            const token = localStorage.getItem("token");

            if (token) {
                fetchUserStatus(token);
            }else{
                dispatch({ type: "LOGOUT" });
            }

		} catch (e) {
			console.log(e.message);
			toast.error("An error occured, please try again later");
		}
	}, []);

	return (
		<AuthContext.Provider value={{ state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
