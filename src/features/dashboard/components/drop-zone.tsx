import { useDroppable } from '@dnd-kit/core'

interface DropZoneProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function DropZone({ id, children, className = '' }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`relative ${className} ${isOver ? 'ring-2 ring-primary/50 bg-primary/5' : ''}`}
      style={{
        minHeight: '200px', // Altezza minima per facilitare il drop
      }}
    >
      {/* Drop indicator */}
      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-primary/50 bg-primary/10 rounded-lg flex items-center justify-center">
          <div className="text-primary/70 text-sm font-medium">
            Rilascia qui
          </div>
        </div>
      )}
      
      {children}
    </div>
  )
} 