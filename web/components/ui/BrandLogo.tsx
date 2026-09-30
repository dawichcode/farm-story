import Image from 'next/image'

interface BrandLogoProps {
  /**
   * 'default' — logo image + wordmark, used in headers and sidebars
   * 'mark'    — logo image only, no wordmark text (for very tight spaces)
   */
  variant?: 'default' | 'mark'
  /**
   * Controls the rendered height of the logo image.
   * The wordmark text scales independently via font utilities.
   */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { img: 20, cls: 'text-xs' },
  md: { img: 28, cls: 'text-sm' },
  lg: { img: 40, cls: 'text-base' },
}

export default function BrandLogo({ variant = 'default', size = 'md', className = '' }: BrandLogoProps) {
  const { img, cls } = sizeMap[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="Farm Story"
        width={img}
        height={img}
        className="flex-shrink-0 w-auto"
        priority
      />
      {variant === 'default' && (
        <span className={`font-display font-bold text-black tracking-wide ${cls}`}>
          Farm Story
        </span>
      )}
    </div>
  )
}
