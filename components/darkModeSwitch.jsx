import { useTheme } from '@nextui-org/react'
import { useTheme as useNextTheme } from 'next-themes'
import { SunIcon } from './icons/SunIcon'
import { MoonIcon } from './icons/MoonIcon'

const COLORS = {
  dark: '#2980b9',
  light: '#f1c40f',
  grey: '#e6e8eb'
}

export default function DarkModeSwitch() {
  const { setTheme } = useNextTheme()
  const { isDark, type } = useTheme()

  const handleChange = () => {
    setTheme(type === 'light' ? 'dark' : 'light')
  }

  return isDark ? (
    <SunIcon
      onClick={handleChange}
      size={20}
      filled
      color={COLORS.light}
      style={{ cursor: 'pointer' }}
    />
  ) : (
    <MoonIcon
      onClick={handleChange}
      filled
      color={COLORS.dark}
      size={20}
      style={{ cursor: 'pointer' }}
    />
  )
}
