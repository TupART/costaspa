import Link from "next/link";

export default function Horas() {
    return (
        <>
            <Link href="/horas/json">
                <a>JSON</a>
            </Link>
            <Link href="/horas/csv">
                <a>CSV</a>
            </Link>
        </>
    )
}