import React, { useState, useEffect, useMemo } from "react"
import DataTable from "react-data-table-component"
import { getData } from '../../store'
import { Link } from 'react-router-dom'

import {useSelector, useDispatch} from 'react-redux'

const UserList = () => {
    const dispatch = useDispatch()
    const store = useSelector(state => state.users)
    //const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const fetchUsersLineList = async(page = 0, size = perPage) => {
        setLoading(true)
        setTotalRows(size)
        setLoading(false)
        dispatch(getData({page, size}))
         
    }
    const handleRemoveClick = () => {

    }

    const handlePageChange = page => {
      const pageToLoad = page - 1
      dispatch(getData({pageToLoad, perPage}))
      setTotalRows(store.allData.data.totalRows)
      setCurrentPage(page)
    }

    const handlePerRowsChange = async(newPerPage, page) => {
      fetchUsersLineList(page - 1, newPerPage)  
      setTotalRows(store.allData.data.totalRows)
      setPerPage(newPerPage) 
    }

    useEffect(() => {
      fetchUsersLineList(0)  
    }, [])    
    
    const columns = useMemo(
        () => [
            {
              name: 'User Name',
              minWidth: '200px',
              cell: row => (
                <div className='d-flex align-items-center'>              
                  <div className='user-info text-truncate ms-1'>
                    <span className='d-block fw-bold text-truncate'>{row.userFirstName} {row.userLastName}</span>
                  </div>
                </div>
              )
            },
            {
              name: 'State',
              cell: row => (
                <div className='d-flex align-items-center'>              
                  <div className='user-info text-truncate ms-1'>
                    <span className='d-block fw-bold text-truncate'>{(row.state !== null) ? row.state.stateName : "Central"}</span>
                  </div>
                </div>
              )
            },      
            {
                name: "Email",
                selector: row => row.userEmail,
                sortable: true
            },         
            {
                name: "Role",
                selector: row => row.role[0].roleName,
                sortable: true
            },
            {
              name: 'User Name',
              minWidth: '450px',
              cell: row => (
                <div className='d-flex align-items-center'>              
                  <div className='user-info text-truncate ms-1'>
                    <span className='d-block fw-bold text-truncate'>{row.userName}</span>
                  </div>
                </div>
              )
            },
            {
              name: 'Action',
              minWidth: '450px',
              cell: row => (
                <div className='d-flex align-items-center'>              
                  <div className='user-info text-truncate ms-1'>
                    <Link className='brand-logo' to ='{$row.userFirstName}'   onClick={() => handleRemoveClick(row.id)}>
                      Edit
                    </Link>
                  </div>
                </div>
              )
            }           
         
        ], []
    )

 
    return (
      
        <
        DataTable title = ""
        columns = { columns }
        data = { store.allData.data }
        progressPending = { loading }
        pagination paginationServer paginationTotalRows = { totalRows }
        paginationDefaultPage = { currentPage }
        onChangeRowsPerPage = { handlePerRowsChange }
        onChangePage = { handlePageChange }
       selectableRows onSelectedRowsChange = {
            ({ selectedRows }) => console.log(selectedRows)
        }
        />
    )
}
export default UserList