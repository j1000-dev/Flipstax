import React from 'react';
import {Form} from '../components/Form';

const Login: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Form formType="login" />
        </div>
    );
};

export default Login;
