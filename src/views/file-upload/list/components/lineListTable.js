import React, { useState, useEffect, useMemo } from "react"
import DataTable from "react-data-table-component"
import {fetchUploadsData} from '../../../../api/uploadService'

const LineListTable = () => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const fetchUsers = async(page, size = perPage) => {
        setLoading(true)
        setData([])
        setTotalRows(size)
        setLoading(false)
       fetchUploadsData(page, size).then((response) => {
          setData(response.data)
          setTotalRows(response.data.total)
          setLoading(false)
        }).catch((err) => {
          toast.error(err, { icon: false, hideProgressBar: true })
        })     
    }

    useEffect(() => {
        fetchUsers(1)
    }, [])    
    
    const columns = useMemo(
        () => [
          {
            name: 'Uploader',
            minWidth: '450px',
            cell: row => (
              <div className='d-flex align-items-center'>              
                <div className='user-info text-truncate ms-1'>
                  <span className='d-block fw-bold text-truncate'>{row.uploader.userFirstName} {row.uploader.userLastName}</span>
                  <span className='d-block fw-bold text-truncate'>{row.uploader.userEmail}</span>
                </div>
              </div>
            )
          },      
            {
                name: "Batch Number",
                selector: row => row.batchNumber,
                sortable: true
            },          
            {
                name: "Upload Date",
                selector: row => row.uploadDate,
                sortable: true
            },
            {
                name: "Status",
                selector: row => row.status,
                sortable: true
            }
         
        ], []
    )

    const handlePageChange = page => {
        fetchUsers(page)
        setCurrentPage(page)
    }

    const handlePerRowsChange = async(newPerPage, page) => {
        fetchUsers(page, newPerPage)
        setPerPage(newPerPage)
    }

    return (

        <
        DataTable title = ""
        columns = { columns }
        data = { data }
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
export default LineListTable