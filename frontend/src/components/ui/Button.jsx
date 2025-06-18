// frontend/src/components/ui/Button.jsx
import React from 'react';
 
const Button = ({
    variant = 'primary',  
    size = '',           
    disabled = false,
    onClick,
    children,
    className = '',
    type = 'button',
    ...rest  
}) => {
    const buttonClasses = `btn btn-${variant} ${size ? `btn-${size}` : ''} rounded-md ${className}`;

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
