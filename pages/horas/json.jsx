import { useState } from "react";
import { Button } from "@nextui-org/react";

const states = {
    UPLOAD_FILE: "UPLOAD_FILE",
    SELECT_USER: "SELECT_USER",
    USER_INFO: "USER_INFO",
}

export default function Horas() {
  const [files, setFiles] = useState("");
  const [currentPage, setCurrentPage] = useState(states.UPLOAD_FILE);
  const [user, setUser] = useState("");
  const [hours, setHours] = useState("");

  const handleChange = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      setFiles(e.target.result);
    };
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
    const tickets = file.tickets
    const timeWorked = tickets.reduce((acc, cur) => {
        const comments = cur.Comments.filter(c => {
            return c.creator_id == user }
        )
        if (comments.length > 0) {
            const hoursTotal = comments.reduce((acc, cur) => {
                console.log(cur)
                if(!isNaN(cur.duration)) acc = acc + cur.duration
                return acc
            },0)
            acc.horas += hoursTotal
        }
        return acc
    },{
        tickets: [],
        horas: 0
    })

    setHours(timeWorked.horas)
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
                <h1>Upload Json file - Example</h1>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleChange} />
                    <input type="submit" value="Enviar" />
                </form>
            </>
        )
    case states.SELECT_USER:
        return (
            <>
                <Button onClick={goBackToImport}>Importar otro usuario</Button>
                {getUsers().map((user) => {
                    return <h1 key={user.import_id} data-key={user.import_id} onClick={handleSelectUser}>{user.first_name} {user.last_name}</h1>
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