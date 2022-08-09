import { useState } from 'react'
import { readFile, utils } from 'xlsx'
import { Container, Table, Grid, Card, Text, Link } from '@nextui-org/react'
import GoToButton from '../../components/goToButton'
import { IoCheckmarkSharp, IoCloseSharp } from 'react-icons/io5'
import Button from '../../components/Button'

const Headers = [
  'NAME',
  'SURNAME',
  'Market',
  'Va a ser PCC',
  'Training start date',
  'Asignado a',
  'Portatil asignado',
  'Portatil ok',
  'Production start date',
  'Supervisor Name',
  'Inserted on MyHR Portal',
  'Windows Pwd',
  'Windows User',
  'Email',
  'B2E User',
  'CRM ID',
  'PCC Number',
  'Phone Number',
  'Pcc Email',
  'Step 1 asked',
  'Step 1 done',
  'Step 2 asked',
  'Step 2 User Accepted',
  'Step 2 done',
  'Step 2.2 asked',
  'Step 2.2 User Accepted',
  'Step 2.2 done',
  'Step 2.3 asked',
  'Step 2.3 done',
  'Step 3 asked',
  'Step 3 done',
  'D365 Agent Role requester',
  'D365 Agent User Accepted',
  'D365 Agent Ticket excel',
  'D365 Email Role requester',
  'D365 Email Role approved',
  'D365 Email Ticket excel',
  'User revoked'
]

const states = {
  UPLOAD_FILE: 'UPLOAD_FILE',
  SELECT_USERS: 'SELECT_USERS',
  EXPORT: 'EXPORT'
}

const SelectUsers = ({ users, handleSelectedUsers }) => {
  const selectableUsers = users.filter(
    (user) =>
      user['D365 Agent Ticket excel'] === undefined ||
      user['D365 Email Ticket excel'] === undefined
  )
  return (
    <Table
      aria-label="Example static collection table with multiple selection"
      css={{
        height: 'auto',
        minWidth: '100%'
      }}
      selectionMode="multiple"
      onSelectionChange={handleSelectedUsers}
    >
      <Table.Header>
        <Table.Column>NAME</Table.Column>
        <Table.Column>SURNAME</Table.Column>
        <Table.Column>D365 Agent User Accepted</Table.Column>
        <Table.Column>D365 Email Role Approved</Table.Column>
      </Table.Header>
      <Table.Body>
        {selectableUsers.map((user) => (
          <Table.Row key={user.Email}>
            <Table.Cell>{user.NAME}</Table.Cell>
            <Table.Cell>{user.SURNAME}</Table.Cell>
            <Table.Cell>
              {user['D365 Agent User Accepted'] !== undefined ? (
                <IoCheckmarkSharp color="#27ae60" />
              ) : (
                <IoCloseSharp color="#c0392b" />
              )}
            </Table.Cell>
            <Table.Cell>
              {user['D365 Email Role approved'] !== undefined ? (
                <IoCheckmarkSharp color="#27ae60" />
              ) : (
                <IoCloseSharp color="#c0392b" />
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default function Excel() {
  const [file, setFile] = useState('')
  const [isValidExcel, setIsValidExcel] = useState(false)
  const [currentPage, setCurrentPage] = useState(states.UPLOAD_FILE)
  const [users, setUsers] = useState([])
  const [usersSelected, setUsersSelected] = useState([])
  const [usersSelectedWithData, setUsersSelectedWithData] = useState([])
  const [canExportD365, setCanExportD365] = useState(false)

  const handleChange = (e) => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(e.target.files[0])
    fileReader.onload = (e) => {
      const excel = readFile(e.target.result)
      setFile(excel)
      const excelIsValid = excel.SheetNames.includes('New Hirings')
      setIsValidExcel(excelIsValid)
      if (!excelIsValid) {
        alert('Invalid Excel File')
        return
      }
      const data = excel.Sheets['New Hirings']
      const users = utils.sheet_to_json(data, { header: Headers }).slice(25)
      console.log(users)
      setUsers(users)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ file })
    isValidExcel
      ? setCurrentPage(states.SELECT_USERS)
      : alert('Please add a valid file')
  }

  const handleSelectedUsers = (selected) => {
    const selectedU = []
    selected.forEach((user) => {
      selectedU.push(user)
    })
    setUsersSelected(selectedU)
    console.log(selectedU)
  }

  const goBackTo = (state) => {
    setCurrentPage(state)
  }

  const handleNextPageSelected = () => {
    const usersSelectedWithData = users.filter((user) => {
      return usersSelected.includes(user.Email)
    })
    setUsersSelectedWithData(usersSelectedWithData)
    const canExport = usersSelectedWithData.some(
      (user) => user['D365 Agent Ticket excel'] !== undefined
    )
    console.log(canExport)
    setCanExportD365(canExport)
    setCurrentPage(states.EXPORT)
  }

  const handled365Export = () => {
    console.log('export')
  }

  switch (currentPage) {
    case states.UPLOAD_FILE:
      return (
        <Container>
          <h1>Upload XLSX file</h1>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleChange} />
            <input type="submit" value="Enviar" />
          </form>
        </Container>
      )
    case states.SELECT_USERS:
      return (
        <Container>
          <GoToButton doAction action={goBackTo} href={states.UPLOAD_FILE}>
            Importar otro archivo
          </GoToButton>
          <SelectUsers
            users={users}
            handleSelectedUsers={handleSelectedUsers}
          />
          <Container
            css={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingBlock: '$10',
              gap: 4
            }}
          >
            <Button action={handleNextPageSelected} href={states.EXPORT}>
              Continuar
            </Button>
          </Container>
        </Container>
      )

    case states.EXPORT:
      return (
        <Grid.Container gap={2}>
          <Grid>
            <Card css={{ p: '$6', mw: '400px' }}>
              <Card.Header>
                <img
                  alt="nextui logo"
                  src="https://1000marcas.net/wp-content/uploads/2021/05/Dynamics-365-logo-2.png"
                  width="34px"
                  height="34px"
                />
                <Grid.Container css={{ pl: '$6' }}>
                  <Grid xs={12}>
                    <Text h4 css={{ lineHeight: '$xs' }}>
                      Excel para configurar D365
                    </Text>
                  </Grid>
                  <Grid xs={12}>
                    <Text css={{ color: '$accents8' }}>Personas incluidas</Text>
                  </Grid>
                </Grid.Container>
              </Card.Header>
              <Card.Body css={{ py: '$2' }}>
                <Text>
                  {!canExportD365 ? (
                    'No puede exportar en D365'
                  ) : (
                    <ul>
                      {usersSelected.map((user, index) => (
                        <li key={index}>{`${user.NAME} ${user.SURNAME}`}</li>
                      ))}
                    </ul>
                  )}
                </Text>
              </Card.Body>
              <Card.Footer
                css={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button action={handled365Export} disabled={canExportD365}>
                  Exportar
                </Button>
              </Card.Footer>
            </Card>
          </Grid>
          <Grid>
            <Card css={{ p: '$6', mw: '400px' }}>
              <Card.Header>
                <img
                  alt="nextui logo"
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                  width="34px"
                  height="34px"
                />
                <Grid.Container css={{ pl: '$6' }}>
                  <Grid xs={12}>
                    <Text h4 css={{ lineHeight: '$xs' }}>
                      Next UI
                    </Text>
                  </Grid>
                  <Grid xs={12}>
                    <Text css={{ color: '$accents8' }}>nextui.org</Text>
                  </Grid>
                </Grid.Container>
              </Card.Header>
              <Card.Body css={{ py: '$2' }}>
                <Text>
                  Make beautiful websites regardless of your design experience.
                </Text>
              </Card.Body>
              <Card.Footer>
                <Link
                  icon
                  color="primary"
                  target="_blank"
                  href="https://github.com/nextui-org/nextui"
                >
                  Visit source code on GitHub.
                </Link>
              </Card.Footer>
            </Card>
          </Grid>
        </Grid.Container>
      )
  }

  return currentPage === states.UPLOAD_FILE ?? <></>
}
