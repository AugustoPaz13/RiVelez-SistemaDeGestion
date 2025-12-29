import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ style, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.5rem',
      backgroundColor: '#f3f4f6',
      padding: '0.25rem',
      color: '#6b7280',
      ...style
    }}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ style, children, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        borderRadius: '0.375rem',
        padding: '0.625rem 1rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        color: 'inherit',
        ...style
      }}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ style, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    style={{
      marginTop: '0.5rem',
      ...style
    }}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
