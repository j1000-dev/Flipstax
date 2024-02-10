import React from 'react';
import {Form} from '../components/Form';

export const SignUp: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Form formType="signup" />
        </div>
    );
};
