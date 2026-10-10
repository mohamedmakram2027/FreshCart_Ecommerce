'use client';

import * as React from 'react';

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(
  undefined
);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const context = React.useContext(DropdownContext);
  if (!context) return null;

  const handleClick = () => context.setOpen(!context.open);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return <button onClick={handleClick}>{children}</button>;
}

export function DropdownMenuContent({
  children,
  align = 'end',
  className = '',
}: {
  children: React.ReactNode;
  align?: 'start' | 'end';
  className?: string;
}) {
  const context = React.useContext(DropdownContext);
  if (!context || !context.open) return null;

  const alignClass = align === 'end' ? 'right-0' : 'left-0';

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => context.setOpen(false)}
      />
      <div
        className={`absolute ${alignClass} mt-2 w-56 rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in-80 ${className}`}
      >
        {children}
      </div>
    </>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const context = React.useContext(DropdownContext);

  return (
    <button
      onClick={() => {
        onClick?.();
        context?.setOpen(false);
      }}
      className={`w-full text-left flex items-center px-3 py-2 text-sm rounded-lg hover:bg-slate-100 text-slate-700 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="h-px bg-slate-100 my-1" />;
}