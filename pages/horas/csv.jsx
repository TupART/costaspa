import { useState } from 'react'
import { parse } from 'papaparse'
import { Container, Grid } from '@nextui-org/react'
import GoToButton from '../../components/goToButton'
import Task from '../../components/task'

const states = {
  UPLOAD_FILE: 'UPLOAD_FILE',
  SELECT_USER: 'SELECT_USER',
  USER_INFO: 'USER_INFO'
}

export default function Csv() {
  const [files, setFiles] = useState('')
  const [currentPage, setCurrentPage] = useState(states.UPLOAD_FILE)
  const [user, setUser] = useState('')
  const [hours, setHours] = useState('')
  const [laborers, setLaborers] = useState('')
  const [tickets, setTickets] = useState('')

  const handleChange = (e) => {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], 'UTF-8')
    fileReader.onload = (e) => {
      const doc = parse(e.target.result, {
        header: true,
        skipEmptyLines: true
      })
      const laborersList = doc.data.map((laborer) => {
        return laborer.Laborer
      })
      const laborerList = laborersList.reduce((acc, curr) => {
        if (!acc.includes(curr)) {
          acc.push(curr)
        }
        return acc
      }, [])
      setLaborers(laborerList)
      setFiles(JSON.stringify(doc.data))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(states.SELECT_USER)
  }

  const handleSelectUser = (e) => {
    const selected = document.querySelectorAll('.selected')
    selected.forEach((element) => element.classList.remove('selected'))
    e.target.classList.add('selected')
    setUser(e.target.getAttribute('data-key'))
  }

  const handleSelectedUser = () => {
    const file = JSON.parse(files)
    const ticketsList = file.filter((ticket) => ticket.Laborer === user)
    const timeWorked = ticketsList.reduce((acc, cur) => {
      acc += parseInt(cur['Minutes Worked'])
      return acc
    }, 0)
    setTickets(JSON.stringify(ticketsList))
    setHours(timeWorked)
    setCurrentPage(states.USER_INFO)
  }

  const goBackTo = (state) => {
    setCurrentPage(state)
  }

  const getTimeInHours = () => {
    const horas = Math.floor(hours / 60)
    const minutes = hours - horas * 60
    return (
      <span>
        {horas} horas y {minutes} minutos
      </span>
    )
  }

  const getTicketList = () => {
    const ticketList = JSON.parse(tickets)

    return (
      <Grid.Container direction="column" gap={2}>
        {ticketList.map((ticket, index) => (
          <Grid key={index}>
            <Task
              time={ticket['Minutes Worked']}
              title={ticket.Summary}
              url={ticket['Link to Ticket']}
            />
          </Grid>
        ))}
      </Grid.Container>
    )
  }

  switch (currentPage) {
    case states.UPLOAD_FILE:
      return (
        <Container>
          <h1>Upload CSV file</h1>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleChange} />
            <input type="submit" value="Enviar" />
          </form>
        </Container>
      )
    case states.SELECT_USER:
      return (
        <Container>
          <GoToButton doAction action={goBackTo} href={states.UPLOAD_FILE}>
            Importar otro archivo
          </GoToButton>
          {laborers.map((user) => {
            return (
              <h1 key={user} data-key={user} onClick={handleSelectUser}>
                {user}
              </h1>
            )
          })}
          <button onClick={handleSelectedUser}>Siguente</button>
        </Container>
      )

    case states.USER_INFO:
      return (
        <Container>
          <GoToButton doAction action={goBackTo} href={states.SELECT_USER}>
            Selecciona otro usuario
          </GoToButton>
          <h2>
            Minutos trabajados hoy: <span>{hours}</span> minutos que són{' '}
            <span>{getTimeInHours()}</span>
          </h2>
          <h3>En los siguientes tickets:</h3>
          {getTicketList()}
        </Container>
      )
  }

  return currentPage === states.UPLOAD_FILE ?? <></>
}
