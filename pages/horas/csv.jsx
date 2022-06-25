import { useState } from "react";
import {parse} from "papaparse";
import { Button, Grid } from "@nextui-org/react";
import Task from "../../components/task";

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
  const [tickets, setTickets] = useState("");

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
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(states.SELECT_USER)
  }

  const handleSelectUser = (e) => {
    const selected = document.querySelectorAll(".selected")
    selected.forEach((element) => element.classList.remove("selected"))
    e.target.classList.add("selected")
    setUser(e.target.getAttribute('data-key'))
  }

  const handleSelectedUser = () => {
    const file = JSON.parse(files)
    const ticketsList = file.filter((ticket) => ticket.Laborer === user)
    const timeWorked = ticketsList.reduce((acc, cur) => {
        acc += parseInt(cur["Minutes Worked"])
        return acc
    },0)  
    setTickets(JSON.stringify(ticketsList))
    setHours(timeWorked)
    setCurrentPage(states.USER_INFO)
  }

  const goBackToImport = () => {
    setCurrentPage(states.UPLOAD_FILE)
  }
  
  const goBackToUser = () => { 
    setCurrentPage(states.SELECT_USER)
  }

  const getTimeInHours = () => {
    const horas = Math.floor(hours / 60)
    const minutes = hours - (horas*60)
    return (
      <>
        <span>{horas} horas y {minutes} minutos</span>
      </>
    )
  }

  const getTicketList = () => {
    const ticketList = JSON.parse(tickets);
    
    return (
      <Grid>
        {ticketList.map((ticket, index) => <Task key={index} time={ticket["Minutes Worked"]} title={ticket.Summary} url={ticket["Link to Ticket"]} />)}
      </Grid>
    )
    
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
                <Button onClick={goBackToImport}>Importar otro archivo</Button>
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
                <h2>Minutos trabajados hoy: <span>{hours}</span> minutos que són <span>{getTimeInHours()}</span></h2>
                <h3>En los siguientes tickets:</h3>
                {getTicketList()}
            </>
        )
  }

  return (
    currentPage === states.UPLOAD_FILE ?? <>
        
    </>
  );
}