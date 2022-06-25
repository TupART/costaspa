import { Container } from "@nextui-org/react";
import DarkModeSwitch from "./darkModeSwitch";

export default function Navbar() {
    return (
        <Container>
            <h1>Navbar</h1>
            <DarkModeSwitch/>
        </Container>
    )
}