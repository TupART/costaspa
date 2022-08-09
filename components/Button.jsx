import { Button } from '@nextui-org/react'

export default function App({ action, disabled, children }) {
  const handleClick = () => {
    action()
  }
  return (
    <Button
      flat
      color="secondary"
      disabled={disabled}
      auto
      onClick={handleClick}
    >
      {children}
    </Button>
  )
}
