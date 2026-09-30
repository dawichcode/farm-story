import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={[
          'w-full rounded-lg border px-3 py-2.5 text-sm text-black bg-white',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-1',
          error
            ? 'border-crimson focus:border-crimson focus:ring-crimson'
            : 'border-gray-300 focus:border-agric-green focus:ring-agric-green',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
    )
  },
)

Select.displayName = 'Select'

export default Select
