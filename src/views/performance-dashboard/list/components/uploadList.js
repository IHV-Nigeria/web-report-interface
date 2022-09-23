import React, { useState, useEffect, useMemo } from "react"
import DataTable from "react-data-table-component"
import {performanceDashboard} from '../../../../api/performanceDashboardService'

const UploadList = () => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    //const {updateStats} = props

    const dashboard = async(page, size = perPage) => {
        setLoading(true)
        setTotalRows(size)
        setLoading(false)
        performanceDashboard(page, size).then((response) => {
         setData(response.data)        
         //setTotalRows(response.data.totalRows)
         setLoading(false)
          //updateStats(response.data)
        }).catch((err) => {
          console.log(err)
          //toast.error(err, { icon: false, hideProgressBar: true })
        })     
    }

    useEffect(() => {
      dashboard(0)     
    }, [])    
    
    const columns = useMemo(
        () => [
            {
              name: 'Facility Information',
              minWidth: '450px',
              cell: row => (
                <div className='d-flex align-items-center'>              
                  <div className='user-info text-truncate ms-1'>
                    <span className='d-block fw-bold text-truncate'>{row.state}</span>
                    <span className='d-block fw-bold text-truncate'>{row.facility_name}</span>
                  </div>
                </div>
              )
            },      
            {
                name: "Expected",
                selector: row => row.expectedpickup,
                sortable: true
            },          
            {
                name: "Achiement",
                selector: row => row.drugpickup,
                sortable: true
            },
            {
              name: "Coverage",
              selector: row => `${Math.round(eval(row.drugpickup / row.expectedpickup) * 100)}%`,
              sortable: true
          }
         
        ], []
    )

    const handlePageChange = page => {
      dashboard(page - 1, 10).then((response) => {
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
      dashboard(page, newPerPage)
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