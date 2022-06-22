import { useState } from "react";
import {parse} from "papaparse";
import { clearPreviewData } from "next/dist/server/api-utils";

const states = {
    UPLOAD_FILE: "UPLOAD_FILE",
    SELECT_USER: "SELECT_USER",
    USER_INFO: "USER_INFO",
}

export default function Csv() {
  const [files, setFiles] = useState("");
  const [currentPage, setCurrentPage] = useState(states.UPLOAD_FILE);
  const [user, setUser] = useState("");
  const [hours, setHours] = useState("");
  const [laborers, setLaborers] = useState("");

  const handleChange = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      const doc = parse(e.target.result, {
        header: true,
        skipEmptyLines: true
      })
      const laborersList = doc.data.map(laborer => {
        return laborer.Laborer
      })
      const laborerList = laborersList.reduce((acc, curr) => {
        if (!acc.includes(curr)) {
          acc.push(curr)
        }
        return acc
      }, [])
      setLaborers(laborerList)
      setFiles(JSON.stringify(doc.data));
    };
    //console.log(files)
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(states.SELECT_USER)
  }

  const getUsers = () => {
    const file = JSON.parse(files)
    const users = file.users.filter((user) => user.role==='admin')
    return users;
  }

  const handleSelectUser = (e) => {
    const selected = document.querySelectorAll(".selected")
    selected.forEach((element) => element.classList.remove("selected"))
    e.target.classList.add("selected")
    setUser(e.target.getAttribute('data-key'))
  }

  const handleSelectedUser = (e) => {
    const file = JSON.parse(files)
    const tickets = file.filter((ticket) => ticket.Laborer === user)
    const timeWorked = tickets.reduce((acc, cur) => {
        console.log({acc, cur})
        acc += parseInt(cur["Minutes Worked"])
        return acc
    },0)
    console.log({timeWorked})

    setHours(timeWorked)
    setCurrentPage(states.USER_INFO)
  }

  const goBackToImport = () => {
    setCurrentPage(states.UPLOAD_FILE)
  }
  
  const goBackToUser = () => { 
    setCurrentPage(states.SELECT_USER)
  }

  switch (currentPage) {
    case states.UPLOAD_FILE:
        return (
            <>
                <h1>Upload CSV file</h1>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleChange} />
                    <input type="submit" value="Enviar" />
                </form>
            </>
        )
    case states.SELECT_USER:
        return (
            <>
                <button onClick={goBackToImport}>Importar otro usuario</button>
                {laborers.map((user) => {
                    return <h1 key={user} data-key={user} onClick={handleSelectUser}>{user}</h1>
                })}
                <button onClick={handleSelectedUser}>Siguente</button>
            </>
        )
    
    case states.USER_INFO:
        return (
            <>
                <button onClick={goBackToUser}>Selecciona otro usuario</button>
                Minutos trabajados hoy: {hours} minutos
            </>
        )
  }

  return (
    currentPage == states.UPLOAD_FILE ?? <>
        
    </>
  );
}