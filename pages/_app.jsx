/* eslint-disable react/prop-types */
import { createTheme, NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import Navbar from '../components/navbar'

const theme = {
  colors: {
    primary: '#2980b9'
  }
}

const lightTheme = createTheme({
  type: 'light',
  theme: {
    ...theme
  }
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    ...theme
  }
})

function MyApp({ Component, pageProps }) {
  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className
      }}
    >
      <NextUIProvider>
        <Navbar />
        <Component {...pageProps} />
      </NextUIProvider>
    </NextThemesProvider>
  )
}

export default MyApp
