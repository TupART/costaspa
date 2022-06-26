import { useTheme, Switch, Grid } from '@nextui-org/react'
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

  const handleChange = (e) => {
    setTheme(type === 'light' ? 'dark' : 'light')
  }

  return (
    <div>
      <SunIcon size={20} fill={isDark ? COLORS.grey : COLORS.light} filled />
      <Switch
        checked={isDark}
        onChange={handleChange}
        color="primary"
        label="Dark Mode"
        size={'xs'}
      />
      <MoonIcon size={20} fill={isDark ? COLORS.dark : COLORS.grey} filled />
    </div>
  )
}
