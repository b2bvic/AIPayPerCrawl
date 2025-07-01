import { clsx } from 'clsx'

interface ContainerProps {
  className?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Container({
  className,
  children,
  size = 'lg'
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-7xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  }

  return (
    <div className={clsx(className, 'px-6 lg:px-8')}>
      <div className={clsx('mx-auto', sizeClasses[size])}>
        {children}
      </div>
    </div>
  )
} 