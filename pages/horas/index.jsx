import Link from "next/link";
import { useState, useEffect } from "react";

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