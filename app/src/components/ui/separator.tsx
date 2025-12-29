import React from 'react';

const Separator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        style={{
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '0.5rem 0'
        }}
        {...props}
    />
));
Separator.displayName = 'Separator';

export { Separator };
