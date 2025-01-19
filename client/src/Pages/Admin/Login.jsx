import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import useAuthContext from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
          const response = await fetch('http://localhost:3000/api/admin/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);

          dispatch({ type: 'LOGIN', payload: data });
          navigate("/admin/home");
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex align-items-center justify-content-center min-h-screen bg-gray-100">
            <div className="w-full md:w-5 lg:w-4 xl:w-3">
                <Card title="Admin Login" className="shadow-2">
                    <form onSubmit={handleSubmit} className="p-fluid">
                        {error && (
                            <div className="mb-5">
                                <Message severity="error" text={error} />
                            </div>
                        )}

                        <div className="field mb-6">
                            <span className="p-float-label p-input-icon-left">
                                <InputText
                                    id="email"
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label htmlFor="email">email</label>
                            </span>
                        </div>

                        <div className="field mb-4 mt-3">
                            <span className="p-float-label p-input-icon-left">
                                <Password
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    feedback={false}
                                    toggleMask
                                    required
                                />
                                <label htmlFor="password">Password</label>
                            </span>
                        </div>

                        <Button
                            type="submit"
                            label={loading ? 'Signing in...' : 'Sign in'}
                            icon="pi pi-sign-in"
                            loading={loading}
                        />
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AdminLogin;