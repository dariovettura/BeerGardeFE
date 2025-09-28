import * as React from 'react'

interface UseControllableStateProps<T> {
  prop?: T
  defaultProp?: T
  onChange?: (value: T) => void
}

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateProps<T>) {
  const [uncontrolledProp, setUncontrolledProp] = React.useState(defaultProp)
  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolledProp

  const setValue = React.useCallback(
    (nextValue: T | ((prevValue: T) => T)) => {
      const nextValueResolved =
        typeof nextValue === 'function'
          ? (nextValue as (prevValue: T) => T)(value as T)
          : nextValue

      if (!isControlled) {
        setUncontrolledProp(nextValueResolved)
      }

      onChange?.(nextValueResolved)
    },
    [isControlled, onChange, value]
  )

  return [value, setValue] as const
}
