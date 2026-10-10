import * as React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      default: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
      outline:
        'border border-slate-200 bg-white hover:bg-slate-100 text-slate-700',
      ghost: 'hover:bg-slate-100 text-slate-700',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10 p-0',
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

    return <button className={combinedClassName} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button };