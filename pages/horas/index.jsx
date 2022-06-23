import Link from "next/link";

export function hello() {
    console.log   ("heelo"); 
    return (
        <>
        <h1>Hello</h1>
        <Link href="/">
            <a>Home</a>
        </Link>
        </>
    );
}

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