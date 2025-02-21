import React from 'react';
import { Input as AntInput, Form } from 'antd';

interface InputProps {
    name: string;
    type: string;
    placeholder: string;
    rules: Array<{ required?: boolean; message: string; pattern?: RegExp; max?: number }>;
}
const InputComponent: React.FC<InputProps> = ({
    name,
    type,
    placeholder,
    rules = [],
}) => {
    return (
        <Form.Item
            name={name}
            rules={rules}
        >
            <AntInput
                allowClear
                type={type}
                placeholder={placeholder}
            />
        </Form.Item>
    );
};

export default InputComponent;