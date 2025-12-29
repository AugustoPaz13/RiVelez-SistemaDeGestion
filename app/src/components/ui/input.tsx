import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', type = 'text', style, ...props }, ref) => {
        const defaultStyle: React.CSSProperties = {
            display: 'flex',
            height: '2.5rem',
            width: '100%',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            ...style
        };

        return (
            <input
                type={type}
                className={className}
                style={defaultStyle}
                ref={ref}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                }}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
