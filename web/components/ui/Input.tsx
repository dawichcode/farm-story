import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={[
          'w-full rounded-lg border px-3 py-2.5 text-sm text-black placeholder-gray-400',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-1',
          error
            ? 'border-crimson focus:border-crimson focus:ring-crimson'
            : 'border-gray-300 focus:border-agric-green focus:ring-agric-green',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          className,
        ].join(' ')}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export default Input
