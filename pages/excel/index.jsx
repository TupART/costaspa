import { useState } from 'react'
import { readFile, utils, writeFile } from 'xlsx'
import { Container, Table, Grid, Card, Text } from '@nextui-org/react'
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
  'D365 PCC Email Ticket number',
  'D365 Email Ticket excel',
  'User revoked'
]

const states = {
  UPLOAD_FILE: 'UPLOAD_FILE',
  SELECT_USERS: 'SELECT_USERS',
  EXPORT: 'EXPORT'
}

const SelectUsers = ({ users, handleSelectedUsers }) => {
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
        <Table.Column>D365 Agent Excel Sended</Table.Column>
        <Table.Column>D365 PCC Email Ticket number</Table.Column>
        <Table.Column>D365 Email Excel Sended</Table.Column>
      </Table.Header>
      <Table.Body>
        {users.map((user, index) => (
          <Table.Row key={index}>
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
              {user['D365 Agent Ticket excel'] !== undefined ? (
                <IoCheckmarkSharp color="#27ae60" />
              ) : (
                <IoCloseSharp color="#c0392b" />
              )}
            </Table.Cell>
            <Table.Cell>
              {user['D365 PCC Email Ticket number'] !== undefined ? (
                <IoCheckmarkSharp color="#27ae60" />
              ) : (
                <IoCloseSharp color="#c0392b" />
              )}
            </Table.Cell>
            <Table.Cell>
              {user['D365 Email Ticket excel'] !== undefined ? (
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

const getQueueOwner = (market) => {
  switch (market.toUpperCase()) {
    case 'DACH':
      return 'Costa Kreuzfahrten'
    case 'FRANCE':
      return 'Costa Croisieres'
    case 'ITALY':
      return 'Costa Crociere'
    case 'SPAIN':
      return 'Costa Cruceros'
  }
}

const getTeamLeader = (market) => {
  switch (market.toUpperCase()) {
    case 'DACH':
      return 'Valerie Guyuox'
    case 'FRANCE':
      return 'Stephanie Auclair'
    case 'ITALY':
      return 'Valeria Amoroso'
    case 'SPAIN':
      return 'Gerard Dalmau'
  }
}

const getBusinessUnit = (market) => {
  return `Agent-${market.toUpperCase()}`
}

const getTeam = (market) => {
  return `Team_${market.toUpperCase()[0]}_CCCC_PCC`
}

export default function Excel() {
  const [isValidExcel, setIsValidExcel] = useState(false)
  const [currentPage, setCurrentPage] = useState(states.UPLOAD_FILE)
  const [users, setUsers] = useState([])
  const [selectableUsers, setSelectableUsers] = useState([])
  const [usersSelected, setUsersSelected] = useState([])
  const [usersSelectedWithData, setUsersSelectedWithData] = useState([])
  const [canExportD365, setCanExportD365] = useState(false)
  const [canExportEmail, setCanExportEmail] = useState(false)

  const [dataToExportD365, setDataToExportD365] = useState([])
  const [dataToExportEmail, setDataToExportEmail] = useState([])

  const createDocumentToExport = () => {
    setDataToExportD365(() => {
      return {
        Agent: usersSelected.map((id) => {
          const user = selectableUsers[id]
          return {
            Role: 'Agent',
            'IS PCC': user['Va a ser PCC'],
            'Primary email': user.Email,
            'Email D365': '',
            Name: user.NAME,
            Surname: user.SURNAME,
            'Business Unit': getBusinessUnit(user.Market),
            Administrator: getTeamLeader(user.Market),
            Team: getTeam(user.Market),
            Phone: '',
            Workgroup: user['PCC Number'],
            'CTI User': user['B2E User'],
            'TTG Code': '',
            'CCRM User ID': user['CRM ID'] || user.SURNAME.toLowerCase(),
            'TTG ID': user['B2E User'],
            'Agency name': '',
            Market: user.Market.toUpperCase()
          }
        }),
        LicenzeD365: usersSelected.map((id) => {
          const user = selectableUsers[id]
          return {
            'Primary email': user.Email,
            Name: user.NAME,
            Surname: user.SURNAME,
            'Business Unit': getBusinessUnit(user.Market),
            'CCRM User ID': user['CRM ID'] || user.SURNAME.toLowerCase(),
            'CTI User': user['B2E User'],
            Workgroup: user['PCC Number'],
            'TTG UserID 1': user['B2E User'],
            'TTG UserID 2': '',
            'TTG UserID3': '',
            'Is PCC': user['Va a ser PCC'],
            'Role Agent?': 'Y',
            'Role Team Leader?': 'N',
            'Role Senior Manager?': 'N',
            'Global Manager': 'N',
            'Compensation Approver': 'N',
            'Voucher Manager': 'N',
            'Loyalty Administrator?': 'N',
            'Blacklist Manager': 'N',
            'GDPR Super User': 'N',
            'Customer Service?': 'N',
            'Voucher Setup': 'N',
            'Voucher Discount Setup': 'N',
            'Voucher Approver': 'N',
            'VIP Manager': 'N',
            'Read Only?': 'N',
            'CRM Admin': 'N',
            'Task Manager': 'N',
            'Refund Manager': 'N'
          }
        })
      }
    })
    setDataToExportEmail(() => {
      return {
        sheet1: usersSelected.map((id) => {
          const user = selectableUsers[id]
          return {
            Mailaddress: user.Email,
            'Queue Name': `${user.NAME} ${user.SURNAME}`,
            'Queue Owner': getQueueOwner(user.Market),
            SLA: '2 days',
            'User to be added in the queue': `${user.NAME} ${user.SURNAME}`,
            'Team Leader of the users': getTeamLeader(user.Market)
          }
        }),
        Foglio1: usersSelected.map((id) => {
          const user = selectableUsers[id]
          return {
            PCC: `${user.NAME} ${user.SURNAME}`,
            Outlook: user.Email,
            D365: `${user['Windows User']}.pcc@costa.it`,
            MyAccess: user['D365 PCC Email Ticket number']
          }
        })
      }
    })
  }

  const handleChange = (e) => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(e.target.files[0])
    fileReader.onload = (e) => {
      const excel = readFile(e.target.result)
      const excelIsValid = excel.SheetNames.includes('New Hirings')
      setIsValidExcel(excelIsValid)
      if (!excelIsValid) {
        alert('Invalid Excel File')
        return
      }
      const data = excel.Sheets['New Hirings']
      const users2 = utils.sheet_to_json(data, { header: Headers }).slice(2)
      setUsers(users2)
      setSelectableUsers(
        users2.filter(
          (user) =>
            user['D365 Agent Ticket excel'] === undefined ||
            user['D365 Email Ticket excel'] === undefined
        )
      )
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    isValidExcel
      ? setCurrentPage(states.SELECT_USERS)
      : alert('Please add a valid file')
  }

  const handleSelectedUsers = (selected) => {
    setUsersSelected(() => [...selected])
  }

  const goBackTo = (state) => {
    setCurrentPage(state)
  }

  const handleNextPageSelected = () => {
    if (usersSelected[0] === 'a') {
      setUsersSelectedWithData(() => {
        return { ...users }
      })
    } else {
      const usersTemp = usersSelected.map((user) => {
        return selectableUsers[user]
      })
      setUsersSelectedWithData(usersTemp)
    }
    setCanExportD365(true)
    setCanExportEmail(true)
    createDocumentToExport()
    setCurrentPage(states.EXPORT)
  }

  const handled365Export = () => {
    const worksheet1 = utils.json_to_sheet(dataToExportD365.Agent)
    const worksheet2 = utils.json_to_sheet(dataToExportD365.LicenzeD365)
    const workbook = utils.book_new()

    utils.book_append_sheet(workbook, worksheet1, 'Agent')
    utils.book_append_sheet(workbook, worksheet2, 'LicenzeD365')

    // get todays date like ddmmyyyy format
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const today = `${day}${month}${year}`
    const fileName = `D365_BCN_rev${today}.xlsx`

    writeFile(workbook, fileName)
  }

  const handledEmailExport = () => {
    const worksheet1 = utils.json_to_sheet(dataToExportEmail.sheet1)
    const worksheet2 = utils.json_to_sheet(dataToExportEmail.Foglio1)
    const workbook = utils.book_new()

    utils.book_append_sheet(workbook, worksheet1, 'sheet1')
    utils.book_append_sheet(workbook, worksheet2, 'Foglio1')

    // get todays date like ddmmyyyy format
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const today = `${day}${month}${year}`
    const fileName = `Sync of new mailboxes in D365 PCC Users ${today}.xlsx`

    writeFile(workbook, fileName)
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
            users={selectableUsers}
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
        <Container>
          <GoToButton doAction action={goBackTo} href={states.SELECT_USERS}>
            Seleccionar usuarios
          </GoToButton>
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
                      <Text css={{ color: '$accents8' }}>
                        Personas incluidas
                      </Text>
                    </Grid>
                  </Grid.Container>
                </Card.Header>
                <Card.Body css={{ py: '$2' }}>
                  {!canExportD365 ? (
                    <Text>No puede exportar el excel del D365</Text>
                  ) : (
                    <ul>
                      {usersSelectedWithData.map((user, index) => (
                        <li key={index}>{`${user.NAME} ${user.SURNAME}`}</li>
                      ))}
                    </ul>
                  )}
                </Card.Body>
                <Card.Footer
                  css={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Button action={handled365Export} disabled={!canExportD365}>
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
                    src="data:image/png;base64,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"
                    width="34px"
                    height="34px"
                  />
                  <Grid.Container css={{ pl: '$6' }}>
                    <Grid xs={12}>
                      <Text h4 css={{ lineHeight: '$xs' }}>
                        Excel para configurar el correo de PCC
                      </Text>
                    </Grid>
                    <Grid xs={12}>
                      <Text css={{ color: '$accents8' }}>
                        Personas incluidas
                      </Text>
                    </Grid>
                  </Grid.Container>
                </Card.Header>
                <Card.Body css={{ py: '$2' }}>
                  {!canExportEmail ? (
                    <Text>No puede exportar el excel del PCC Email</Text>
                  ) : (
                    <>
                      <Text>
                        Hi Team, <br />
                        Please Syncronize the attached new .pcc mailboxes in to
                        the following PCC Agents profiles:
                      </Text>
                      <ul>
                        {usersSelectedWithData.map((user, index) => (
                          <li key={index}>{`${user.NAME} ${user.SURNAME}`}</li>
                        ))}
                      </ul>
                      <Text>
                        Thanks in advance.
                        <br />
                        Best Regards
                      </Text>
                    </>
                  )}
                </Card.Body>
                <Card.Footer
                  css={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Button
                    action={handledEmailExport}
                    disabled={!canExportEmail}
                  >
                    Exportar
                  </Button>
                </Card.Footer>
              </Card>
            </Grid>
          </Grid.Container>
        </Container>
      )
  }

  return currentPage === states.UPLOAD_FILE ?? <></>
}
