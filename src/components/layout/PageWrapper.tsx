import { cn } from '@/lib/utils'

interface PageWrapperProps {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function PageWrapper({ title, description, actions, children, className, fullWidth }: PageWrapperProps) {
  return (
    <div className={cn('flex-1 min-h-screen', className)}>
      <div className={cn('mx-auto px-4 md:px-6 py-6', fullWidth ? 'max-w-none' : 'max-w-5xl')}>
        {/* Page header */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-black">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-black" style={{ fontFamily: 'Georgia, serif' }}>
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-xs uppercase tracking-widest text-gray-500 font-mono">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              {actions}
            </div>
          )}
        </div>

        {children}
      </div>
    </div>
  )
}
