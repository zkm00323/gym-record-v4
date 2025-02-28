import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Main from './Main';
import Exercise from './Exercise';
import Layout from './components/Layout';
import { Session } from '@supabase/supabase-js';

interface RoutesProps {
    session: Session | null;
}

const AppRoutes: React.FC<RoutesProps> = ({ session }) => {
    return (
        <BrowserRouter>
            <Routes>
                {!session ? (
                    <Route path="*" element={<Auth />} />
                ) : (
                    <>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Navigate to="/main" replace />} />
                            <Route path="main" element={<Main />} />
                            <Route path="exercise" element={<Exercise />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/main" replace />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes; 