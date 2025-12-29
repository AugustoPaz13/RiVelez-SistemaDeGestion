import React from 'react';

const Table = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div style={{ width: '100%', overflowX: 'auto' }}>
        <table
            ref={ref}
            style={{ width: '100%', captionSide: 'bottom', borderCollapse: 'collapse' }}
            {...props}
        />
    </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ ...props }, ref) => (
    <thead ref={ref} style={{ borderBottom: '1px solid #e5e7eb' }} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ ...props }, ref) => <tbody ref={ref} {...props} />);
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ ...props }, ref) => (
    <tr
        ref={ref}
        style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s' }}
        {...props}
    />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ ...props }, ref) => (
    <th
        ref={ref}
        style={{
            height: '3rem',
            padding: '0.75rem 1rem',
            textAlign: 'left',
            fontWeight: '500',
            fontSize: '0.875rem',
            color: '#6b7280',
        }}
        {...props}
    />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ ...props }, ref) => (
    <td
        ref={ref}
        style={{
            padding: '1rem',
            fontSize: '0.875rem',
        }}
        {...props}
    />
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
