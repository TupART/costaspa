import Link from "next/link";
import { useState, useEffect } from "react";

export default function Horas() {
    const [data, setData] = useState([]);

    //function that gets the data from the API of spiceworks
    async function getData() {
        const response = await fetch("https://on.spiceworks.com/api/main/tickets?sort=id-desc&page[number]=1&page[size]=15&filter[status][eq]=open");     
        const data = await response.json();
        return data;
    }

    useEffect(() => {
        getData().then(data => setData(JSON.stringify(data)));
    }, []);
    return (
        <>
            <Link href="/horas/json">
                <a>JSON</a>
            </Link>
            <Link href="/horas/csv">
                <a>CSV</a>
            </Link>
            {data}
        </>
    )
}