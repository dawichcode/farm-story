import { LabelHTMLAttributes } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export default function Label({ required, className = '', children, ...props }: LabelProps) {
  return (
    <label
      className={['block text-sm font-medium text-gray-700', className].join(' ')}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-crimson" aria-hidden="true">*</span>}
    </label>
  )
}
