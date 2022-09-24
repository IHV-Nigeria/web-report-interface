import React, { useState, useEffect, useMemo } from "react"
import DataTable from "react-data-table-component"
import {fetchUploadsData} from '../../../../api/uploadService'

const UploadList = (props) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const {updateStats} = props

    const fetchUploadsLineList = async(page, size = perPage) => {
        setLoading(true)
        setTotalRows(size)
        setLoading(false)
        fetchUploadsData(page, size).then((response) => {
          setData(response.data.fileBatch)        
          setTotalRows(response.data.totalRows)
          setLoading(false)
          updateStats(response.data)
        }).catch((err) => {
          console.log(err)
          //toast.error(err, { icon: false, hideProgressBar: true })
        })     
    }

    useEffect(() => {
      fetchUploadsLineList(0)     
    }, [])    
    
    const columns = useMemo(
        () => [
            {
              name: 'Uploader',
              minWidth: '150px',
              cell: row => (
                <div className='d-flex align-items-center'>              
                  <div className='user-info text-truncate ms-1'>
                    <span className='d-block fw-bold text-truncate'>{row.user.userFirstName} {row.user.userLastName}</span>
                    <span className='d-block fw-bold text-truncate'>{row.user.userEmail}</span>
                  </div>
                </div>
              )
            },
            {
              name: 'State',
              cell: row => (
                <div className='d-flex align-items-center'>              
                  <div className='user-info text-truncate ms-1'>
                    <span className='d-block fw-bold text-truncate'>{(row.user.state) !== null ? row.user.state.stateName : "Central"}</span>
                  </div>
                </div>
              )
            }, 
            {
              name: "Facility Name",
              selector: row => row.facility.facilityName,
              sortable: true
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
       fetchUploadsData(page - 1, 10).then((response) => {
        setData(response.data.fileBatch)
        setTotalRows(response.data.totalRows)
        setLoading(false)
      }).catch((err) => {
        console.log(err)
        //toast.error(err, { icon: false, hideProgressBar: true })
      })      
      setCurrentPage(page)
    }

    const handlePerRowsChange = async(newPerPage, page) => {
      fetchUploadsLineList(page, newPerPage)
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
export default UploadList