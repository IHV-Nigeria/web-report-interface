// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import axios from 'axios'
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Progress } from 'reactstrap'

const status = {
  1: { title: 'Active', color: 'light-primary' },
  2: { title: 'IIT', color: 'light-success' },
  3: { title: 'Transferred out', color: 'light-danger' },
  4: { title: 'Dead', color: 'light-warning' }
}

export let data

// ** Get initial Data
axios.get('/api/datatables/dataQuality').then(response => {
  data = response.data
})

// ** Expandable table component
const ExpandableTable = ({ data }) => {
  return (
    <div className='expandable-content p-2'>
      <p>
        <span className='fw-bold'>City:</span> {data.city}
      </p>
      <p>
        <span className='fw-bold'>Experience:</span> {data.experience}
      </p>
      <p className='m-0'>
        <span className='fw-bold'>Post:</span> {data.post}
      </p>
    </div>
  )
}

// ** Table Common Column
export const columns = [
  {
    name: 'State',
    sortable: true,
    minWidth: '50px',
    selector: row => row.state
  },
  {
    name: 'LGA',
    sortable: true,
    minWidth: '100px',
    selector: row => row.lga
  },
  {
    name: 'Datime Code',
    sortable: true,
    minWidth: '120px',
    selector: row => row.datim_code
  },
  {
    name: 'Facility',
    sortable: true,
    minWidth: '120px',
    selector: row => row.facility
  },
  {
    name: 'Name',
    minWidth: '250px',
    sortable: row => row.full_name,
    cell: row => (
      <div className='d-flex align-items-center'>     
        <div className='user-info text-truncate ms-1'>
          <small>{row.art_no}</small>
        </div>
      </div>
    )
  },
  {
    name: 'Hospital Number',
    sortable: true,
    minWidth: '250px',
    selector: row => row.hospital_number
  },
  {
    name: 'Status',
    minWidth: '150px',
    sortable: row => row.status.title,
    cell: row => {
      return (
        <Badge color={status[row.status].color} pill>
          {status[row.status].title}
        </Badge>
      )
    }
  }, 
  {
    name: 'Form with errors',
    sortable: true,
    minWidth: '150px',
    selector: row => row.no_of_errors
  },
  {
    name: 'Last updated on',
    sortable: true,
    minWidth: '100px',
    selector: row => row.last_update
  },
  {
    name: 'Score',
    sortable: true,
    minWidth: '50px',
    cell: row => (
      <div className='d-flex align-items-center'>       
        <div className='user-info text-truncate ms-1'>
          <span className='d-block fw-bold text-truncate'>score {row.score}%</span>
          <Progress value={row.score} />
        </div>
      </div>
    )
  },
  {
    name: 'Actions',
    allowOverflow: true,
    cell: () => {
      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <DropdownToggle className='pe-1' tag='span'>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                <FileText size={15} />
                <span className='align-middle ms-50'>Details</span>
              </DropdownItem>            
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )
    }
  }
]

export default ExpandableTable
