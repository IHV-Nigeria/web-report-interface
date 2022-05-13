// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import axios from 'axios'
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

// ** Vars

const status = {
  1: { title: 'Processed', color: 'light-primary' },
  2: { title: 'pending', color: 'light-success' },
  3: { title: 'processed', color: 'light-danger' }
}

export let data

// ** Get initial Data
axios.get('/api/datatables/data-uploads').then(response => {
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
    name: 'Facility',
    minWidth: '450px',
    sortable: row => row.full_name,
    cell: row => (
      <div className='d-flex align-items-center'>
      
        <div className='user-info text-truncate ms-1'>
          <span className='d-block fw-bold text-truncate'>{row.state}</span>
          <span className='d-block fw-bold text-truncate'>{row.facility}</span>
          <small>{row.uploaded_by}</small>
        </div>
      </div>
    )
  },
  {
    name: 'Batch ID',
    sortable: true,
    minWidth: '50px',
    selector: row => row.batch_no
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
    name: 'Total',
    sortable: true,
    minWidth: '150px',
    selector: row => row.total
  },
  {
    name: 'Pending',
    sortable: true,
    minWidth: '150px',
    selector: row => row.pending
  },
  {
    name: 'Processed',
    sortable: true,
    minWidth: '150px',
    selector: row => row.processed
  }
]
export default ExpandableTable
