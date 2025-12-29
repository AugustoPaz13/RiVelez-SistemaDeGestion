import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = '', children, style, ...props }) => {
    const defaultStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
        overflow: 'hidden',
        ...style
    };

    return (
        <div className={className} style={defaultStyle} {...props}>
            {children}
        </div>
    );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children, style, ...props }) => {
    const defaultStyle: React.CSSProperties = {
        padding: '1.5rem',
        ...style
    };

    return (
        <div className={className} style={defaultStyle} {...props}>
            {children}
        </div>
    );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ className = '', children, style, ...props }) => {
    const defaultStyle: React.CSSProperties = {
        fontSize: '1.25rem',
        fontWeight: '600',
        ...style
    };

    return (
        <h3 className={className} style={defaultStyle} {...props}>
            {children}
        </h3>
    );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className = '', children, style, ...props }) => {
    const defaultStyle: React.CSSProperties = {
        padding: '1.5rem',
        paddingTop: 0,
        ...style
    };

    return (
        <div className={className} style={defaultStyle} {...props}>
            {children}
        </div>
    );
};
