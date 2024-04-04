import { Card, Container, Grid, Table, Text } from '@nextui-org/react'
import { IoCheckmarkSharp, IoCloseSharp } from 'react-icons/io5'
import { readFile, utils, writeFile } from 'xlsx'

import Button from '../../components/Button'
import GoToButton from '../../components/goToButton'
import { useState } from 'react'

const Headers = [
  'NAME',
  'SURNAME',
  'Market',
  'PCC',
  'Inserted MyAccess',
  'Comments',
  'Training start date',
  'Assigned to',
  'Laptop assigned',
  'Production start date',
  'Windows Pwd',
  'Windows User',
  'Email',
  'B2E User',
  'CRM ID',
  'PCC Number',
  'Phone Number',
  'Profile completed',
  'Step 1 asked',
  'Step 1 done',
  'Step 2 asked',
  'Step 2 User Accepted',
  'Step 2 done',
  'Step 3 asked',
  'Step 3 done',
  'D365 Agent Ticket created',
  'D365 Agent Ticket closed',
  'D365 Email Ticket requested',
  'D365 Email Ticket closed',
  'User revoked',
  'Phone number assigned'
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
              {user['D365 Agent Ticket closed'] !== undefined ? (
                <IoCheckmarkSharp color="#27ae60" />
              ) : (
                <IoCloseSharp color="#c0392b" />
              )}
            </Table.Cell>
            <Table.Cell>
              {user['D365 Email Ticket closed'] !== undefined ? (
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
      return 'Laura Montes'
  }
}

const getBusinessUnit = (market) => {
  return `Agent-${market.toUpperCase()}`
}

const getTeam = (market) => {
  let letter = market.toUpperCase()[0]
  if (letter === 'S') {
    letter = 'E'
  }
  return `Team_${letter}_CCH_PCC`
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
            'IS PCC': user['PCC'],
            'Primary email': user.Email,
            'Email D365': '',
            Name: user.NAME,
            Surname: user.SURNAME,
            'Business Unit': getBusinessUnit(user.Market),
            Administrator: getTeamLeader(user.Market),
            Team: getTeam(user.Market),
            Phone: '',
            Workgroup: user['PCC number'],
            'CTI User': user['B2E User'],
            'TTG Code': '',
            'CCRM User ID': user['CRM ID'] || user.SURNAME.toLowerCase(),
            'TTG ID': user['B2E User'],
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
            Workgroup: user['PCC number'],
            'TTG UserID 1': user['B2E User'],
            'TTG UserID 2': '',
            'TTG UserID3': '',
            'Is PCC': user['PCC'],
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
            Mailaddress: `${user['Windows User Name']}.pcc@costa.it`,
            'Queue Name': `${user.NAME} ${user.SURNAME} - ${getQueueOwner(
              user.Market
            )}`,
            'Queue Owner': `${user.NAME} ${user.SURNAME}`,
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
            D365: `${user['Windows User Name']}.pcc@costa.it`
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
            user['D365 Agent Ticket closed'] === undefined ||
            user['D365 Email Ticket closed'] === undefined
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
    const text = document.getElementById('D365TEXT').innerText
    navigator.clipboard.writeText(text)

    const worksheet1 = utils.json_to_sheet(dataToExportD365.Agent)
    const worksheet2 = utils.json_to_sheet(dataToExportD365.LicenzeD365)
    const workbook = utils.book_new()

    utils.book_append_sheet(workbook, worksheet1, 'Agent')
    utils.book_append_sheet(workbook, worksheet2, 'LicenzeD365')

    const maxWidthSheet1 = dataToExportD365.Agent.reduce(
      (w, r) => {
        const lenght = [
          { wch: Math.max(r.Role.length + 1, w[0].wch) },
          { wch: Math.max(r['IS PCC'].length + 1, w[1].wch) },
          { wch: Math.max(r['Primary email'].length + 1, w[2].wch) },
          { wch: Math.max(r['Email D365'].length + 1, w[3].wch) },
          { wch: Math.max(r.Name.length + 1, w[4].wch) },
          { wch: Math.max(r.Surname.length + 1, w[5].wch) },
          { wch: Math.max(r['Business Unit'].length + 1, w[6].wch) },
          { wch: Math.max(r.Administrator.length + 1, w[7].wch) },
          { wch: Math.max(r.Team.length + 1, w[8].wch) },
          { wch: Math.max(r.Phone.length + 1, w[9].wch) },
          { wch: Math.max(r.Workgroup.length + 1, w[10].wch) },
          { wch: Math.max(r['CTI User'].length + 1, w[11].wch) },
          { wch: Math.max(r['TTG Code'].length + 1, w[12].wch) },
          { wch: Math.max(r['CCRM User ID'].length + 1, w[13].wch) },
          { wch: Math.max(r['TTG ID'].length + 1, w[14].wch) },
          { wch: Math.max(r.Market.length + 1, w[16].wch) }
        ]
        return lenght
      },
      [
        { wch: 4 },
        { wch: 6 },
        { wch: 13 },
        { wch: 10 },
        { wch: 4 },
        { wch: 7 },
        { wch: 13 },
        { wch: 13 },
        { wch: 4 },
        { wch: 5 },
        { wch: 9 },
        { wch: 8 },
        { wch: 8 },
        { wch: 12 },
        { wch: 6 },
        { wch: 11 },
        { wch: 6 }
      ]
    )
    console.log({ maxWidthSheet1 })
    const maxWidthSheet2 = dataToExportD365.LicenzeD365.reduce(
      (w, r) => {
        const lenght = [
          { wch: Math.max(r['Primary email'].length + 1, w[0].wch) },
          { wch: Math.max(r.Name.length + 1, w[1].wch) },
          { wch: Math.max(r.Surname.length + 1, w[2].wch) },
          { wch: Math.max(r['Business Unit'].length + 1, w[3].wch) },
          { wch: Math.max(r['CCRM User ID'].length + 1, w[4].wch) },
          { wch: Math.max(r['CTI User'].length + 1, w[5].wch) },
          { wch: Math.max(r.Workgroup.length + 1, w[6].wch) },
          { wch: Math.max(r['TTG UserID 1'].length + 1, w[7].wch) },
          { wch: Math.max(r['TTG UserID 2'].length + 1, w[8].wch) },
          { wch: Math.max(r['TTG UserID3'].length + 1, w[9].wch) },
          { wch: Math.max(r['Is PCC'].length + 1, w[10].wch) },
          { wch: Math.max(r['Role Agent?'].length + 1, w[11].wch) },
          { wch: Math.max(r['Role Team Leader?'].length + 1, w[12].wch) },
          { wch: Math.max(r['Role Senior Manager?'].length + 1, w[13].wch) },
          { wch: Math.max(r['Global Manager'].length + 1, w[14].wch) },
          { wch: Math.max(r['Compensation Approver'].length + 1, w[15].wch) },
          { wch: Math.max(r['Voucher Manager'].length + 1, w[16].wch) },
          { wch: Math.max(r['Loyalty Administrator?'].length + 1, w[17].wch) },
          { wch: Math.max(r['Blacklist Manager'].length + 1, w[18].wch) },
          { wch: Math.max(r['GDPR Super User'].length + 1, w[19].wch) },
          { wch: Math.max(r['Customer Service?'].length + 1, w[20].wch) },
          { wch: Math.max(r['Voucher Setup'].length + 1, w[21].wch) },
          { wch: Math.max(r['Voucher Discount Setup'].length + 1, w[22].wch) },
          { wch: Math.max(r['Voucher Approver'].length + 1, w[23].wch) },
          { wch: Math.max(r['VIP Manager'].length + 1, w[24].wch) },
          { wch: Math.max(r['Read Only?'].length + 1, w[25].wch) },
          { wch: Math.max(r['CRM Admin'].length + 1, w[26].wch) },
          { wch: Math.max(r['Task Manager'].length + 1, w[27].wch) },
          { wch: Math.max(r['Refund Manager'].length + 1, w[28].wch) }
        ]
        return lenght
      },
      [
        { wch: 13 },
        { wch: 4 },
        { wch: 7 },
        { wch: 13 },
        { wch: 12 },
        { wch: 8 },
        { wch: 9 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 6 },
        { wch: 12 },
        { wch: 17 },
        { wch: 20 },
        { wch: 15 },
        { wch: 21 },
        { wch: 15 },
        { wch: 22 },
        { wch: 17 },
        { wch: 15 },
        { wch: 17 },
        { wch: 13 },
        { wch: 22 },
        { wch: 16 },
        { wch: 11 },
        { wch: 10 },
        { wch: 9 },
        { wch: 12 },
        { wch: 14 }
      ]
    )
    worksheet1['!cols'] = [...maxWidthSheet1]
    worksheet2['!cols'] = [...maxWidthSheet2]

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
    const text = document.getElementById('PCCEMAILTEXT').innerText
    navigator.clipboard.writeText(text)

    const worksheet1 = utils.json_to_sheet(dataToExportEmail.sheet1)
    const worksheet2 = utils.json_to_sheet(dataToExportEmail.Foglio1)
    const workbook = utils.book_new()

    utils.book_append_sheet(workbook, worksheet1, 'sheet1')
    utils.book_append_sheet(workbook, worksheet2, 'Foglio1')

    const maxWidthSheet1 = dataToExportEmail.sheet1.reduce(
      (w, r) => {
        const lenght = [
          { wch: Math.max(r.Mailaddress.length + 1, w[0].wch) },
          { wch: Math.max(r['Queue Name'].length + 1, w[1].wch) },
          { wch: Math.max(r['Queue Owner'].length + 1, w[2].wch) },
          { wch: Math.max(r.SLA.length + 1, w[3].wch) },
          {
            wch: Math.max(
              r['User to be added in the queue'].length + 1,
              w[4].wch
            )
          },
          { wch: Math.max(r['Team Leader of the users'].length + 1, w[5].wch) }
        ]
        return lenght
      },
      [
        { wch: 11 },
        { wch: 10 },
        { wch: 11 },
        { wch: 3 },
        { wch: 29 },
        { wch: 24 }
      ]
    )
    console.log({ maxWidthSheet1 })
    const maxWidthSheet2 = dataToExportEmail.Foglio1.reduce(
      (w, r) => {
        console.log({ r })
        const lenght = [
          { wch: Math.max(r.PCC.length + 1, w[0].wch) },
          { wch: Math.max(r.Outlook.length + 1, w[1].wch) },
          { wch: Math.max(r.D365.length + 1, w[2].wch) },
          { wch: Math.max(r.MyAccess.length + 1, w[3].wch) }
        ]
        return lenght
      },
      [{ wch: 13 }, { wch: 4 }, { wch: 7 }, { wch: 13 }]
    )
    worksheet1['!cols'] = [...maxWidthSheet1]
    worksheet2['!cols'] = [...maxWidthSheet2]

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
                    <div id="D365TEXT">
                      <Text>
                        Hello team, <br />
                        <br />
                        Find attached Excel for to complete D365 Profile
                        configuration for the following users:
                      </Text>
                      <ul>
                        {usersSelectedWithData.map((user, index) => (
                          <li key={index}>{`${user.Email}`}</li>
                        ))}
                      </ul>
                      <Text>
                        Thanks in advance.
                        <br /> Best Regards
                      </Text>
                    </div>
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
                    <div id="PCCEMAILTEXT">
                      <Text>
                        Hello team, <br />
                        <br />
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
                    </div>
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
