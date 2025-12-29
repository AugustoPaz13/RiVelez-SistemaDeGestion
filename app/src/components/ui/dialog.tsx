import React from 'react';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg';
}

export const Dialog: React.FC<DialogProps> = ({
    open,
    onClose,
    children,
    maxWidth = 'md'
}) => {
    if (!open) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                }}
                onClick={onClose}
            />

            {/* Dialog */}
            <div style={{
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                maxWidth: maxWidth === 'sm' ? '24rem' : maxWidth === 'md' ? '28rem' : maxWidth === 'lg' ? '32rem' : '36rem',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {children}
            </div>
        </div>
    );
};

interface DialogHeaderProps {
    children: React.ReactNode;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
    return (
        <div style={{ padding: '1.5rem', paddingBottom: '1rem' }}>
            {children}
        </div>
    );
};

interface DialogTitleProps {
    children: React.ReactNode;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
    return (
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', textAlign: 'center' }}>
            {children}
        </h2>
    );
};

interface DialogContentProps {
    children: React.ReactNode;
}


export const DialogContent: React.FC<DialogContentProps> = ({ children }) => {
    return (
        <div style={{
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            paddingBottom: '1.5rem',
            flex: 1,
            overflowY: 'auto'
        }}>
            {children}
        </div>
    );
};

