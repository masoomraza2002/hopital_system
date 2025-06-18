// frontend/src/components/ui/Card.jsx
import React from 'react';
 
const Card = ({ title, children, className = '', headerClass = '', bodyClass = '' }) => {
    return (
        <div className={`card shadow-sm rounded-lg ${className}`}>
            {title && (
                <div className={`card-header bg-light text-primary font-bold p-3 rounded-t-lg ${headerClass}`}>
                    {title}
                </div>
            )}
            <div className={`card-body p-4 ${bodyClass}`}>
                {children}
            </div>
        </div>
    );
};

export default Card;
