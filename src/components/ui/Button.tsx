import React, { forwardRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

const baseStyles = {
  solid:
    'inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors',
  outline:
    'inline-flex justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors',
}

const variantStyles = {
  solid: {
    slate:
      'relative overflow-hidden bg-slate-900 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-slate-900 active:text-white/80 before:transition-colors dark:bg-white dark:text-slate-900 dark:hover:before:bg-slate-900/10 dark:active:bg-white dark:active:text-slate-900/70',
    blue: 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 active:text-white/80',
    white:
      'bg-white text-slate-900 hover:bg-white/90 active:bg-white active:text-slate-900/70',
  },
  outline: {
    slate:
      'border-slate-300 text-slate-700 hover:border-slate-400 active:bg-slate-100 active:text-slate-700/80 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:active:bg-slate-800 dark:active:text-slate-400',
    white:
      'border-slate-300 text-white hover:border-slate-400 active:bg-slate-100 active:text-slate-700/80',
  },
}

type ButtonProps = (
  | {
      variant?: 'solid'
      color?: keyof typeof variantStyles.solid
    }
  | {
      variant: 'outline'
      color?: keyof typeof variantStyles.outline
    }
) &
  (
    | React.ComponentPropsWithoutRef<typeof Link>
    | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  )

export const Button = forwardRef<
  React.ElementRef<'button'>,
  ButtonProps
>(function Button(
  { variant = 'solid', color = 'slate', className, ...props },
  ref,
) {
  className = clsx(
    baseStyles[variant],
    variantStyles[variant][color],
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button ref={ref} className={className} {...props} />
  ) : (
    <Link ref={ref} className={className} {...props} />
  )
}) 