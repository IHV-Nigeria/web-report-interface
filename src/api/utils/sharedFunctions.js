export const indicatorOptions = [
    { value: 'TX_CURR', label: 'TX_CURR', color: '#00B8D9', isFixed: true },
    { value: 'TX_NEW', label: 'TX_NEW', color: '#00B8D9', isFixed: true }
/*     { value: 'PVLS', label: 'PVLS', color: '#00B8D9', isFixed: true },
    { value: 'HTS', label: 'HTS', color: '#00B8D9', isFixed: false } */
  ]
  const orgUnit = JSON.parse(localStorage.getItem('orgUnit'))

  const quarter = JSON.parse(localStorage.getItem('quarters'))

  //options
  const facilities = []
  const stateOptions = []
  const lgas = []  
  const quarterOptions = []

  orgUnit.map((item) => {
    const stateObj = { value: item.stateName, label: item.stateName, color: '#00B8D9', isFixed: true }
    stateOptions.push(stateObj)
  })

  quarter.map((item) => {
    const  quarterObj = { value: item, label: item, color: '#00B8D9', isFixed: true }
    quarterOptions.unshift(quarterObj)
  })

  export const handleChangeQuarter = selectedOption => {
    setSelectedQuarter(selectedOption.value)
  }

  export const fetchLgas = (selectedOption) => {   
    orgUnit.forEach((item) => {
      const state = item
      item.lgas.forEach((item) => {
        const lga = {
          stateId:state.id, 
          stateName:state.stateName,
          lgaId:item.id, 
          value: item.lga, 
          label:item.lga, 
          facilities:item.facilities,
          color: '#00B8D9', 
          isFixed: true 
        }
        lgas.push(lga)
      })
    })
    return lgas.filter(item => { return  selectedOption.includes(item.stateName) })
  }

  export const fetchFacilities = (selectedOption) => {   
    selectedOption.forEach((item) => {
      const lga = item
      item.facilities.forEach((item) => {
        const facility = {
          stateId:lga.stateId, 
          stateName:lga.stateName,
          lgaId:lga.lgaId, 
          lga:lga.value, 
          facilityId:item.id, 
          value: item.facilityName, 
          label:item.facilityName, 
          color: '#00B8D9', 
          isFixed: true 
        }
        facilities.push(facility)
      })
      })
      return facilities   
  }
  export {
    stateOptions,
    quarterOptions
  }