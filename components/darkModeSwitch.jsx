import { useTheme, Switch } from "@nextui-org/react"
import {useTheme as useNextTheme} from "next-themes"


export default function DarkModeSwitch() {
    const { setTheme } = useNextTheme()
    const { isDark, type } = useTheme()

    const handleChange = (e) => {
        console.log(e.target.checked? "dark" : "light")
        setTheme(type === 'light' ? 'dark' : 'light')
    }

    return (
        <Switch
            checked={isDark}
            onChange={handleChange}
            label="Dark Mode"
        />
    )
}