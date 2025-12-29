import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
    children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    className = '',
    children,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';

    const variants = {
        default: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800',
        outline: 'border border-gray-300 text-gray-700',
        destructive: 'bg-red-100 text-red-800',
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </span>
    );
};
