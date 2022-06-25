/* eslint-disable react/prop-types */
import {Card} from "@nextui-org/react"

export default function Task({ time, title, url}) {
    return (
        <Card isHoverable variant="bordered">
            <Card.Body>
                {title}
            </Card.Body>
        </Card>
    )
}