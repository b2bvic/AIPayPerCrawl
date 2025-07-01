import { clsx } from 'clsx'
import React from 'react'

interface CardProps<T extends React.ElementType = 'div'> {
  as?: T
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
}

export function Card<T extends React.ElementType = 'div'>({
  as,
  className,
  children,
  variant = 'default',
  size = 'md',
  interactive = false,
  ...props
}: CardProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof CardProps<T>>) {
  const Component = as ?? 'div'

  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg border border-gray-200',
    outlined: 'bg-white border border-gray-300',
    ghost: 'bg-transparent'
  }

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <Component
      className={clsx(
        'rounded-lg',
        variants[variant],
        sizes[size],
        interactive && 'transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

// Card sub-components
export function CardHeader({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx('flex flex-col space-y-1.5 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3 className={clsx('text-lg font-semibold leading-none tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p className={clsx('text-sm text-gray-600', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx('pt-0', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx('flex items-center pt-4', className)} {...props}>
      {children}
    </div>
  )
} 