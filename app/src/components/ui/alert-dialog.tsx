import React from 'react';
import { Button } from './button';

interface AlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onClick={() => onOpenChange(false)}
        >
            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            />
            {children}
        </div>
    );
};

interface AlertDialogContentProps {
    children: React.ReactNode;
}

export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ children }) => {
    return (
        <div
            style={{
                position: 'relative',
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                maxWidth: '32rem',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                zIndex: 51,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
};

export const AlertDialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ marginBottom: '1rem' }}>{children}</div>
);

export const AlertDialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>{children}</h3>
);

export const AlertDialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{children}</p>
);

export const AlertDialogFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        {children}
    </div>
);

export const AlertDialogCancel: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({
    onClick,
    children
}) => (
    <Button variant="outline" onClick={onClick}>
        {children}
    </Button>
);

export const AlertDialogAction: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({
    onClick,
    children,
    className
}) => (
    <Button onClick={onClick} className={className}>
        {children}
    </Button>
);
