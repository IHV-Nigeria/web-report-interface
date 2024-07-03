// ** React Imports
import { useState, Fragment } from 'react'

// ** Dropdowns Imports
import UserDropdown from '../../navbar/UserDropdown'

// ** Horizontal Menu Components
import HorizontalNavMenuItems from './HorizontalNavMenuItems'
import ihvn_logo from '@src/assets/images/portrait/small/ihvn_logo.jpg'

// ** Reactstrap Imports
import { NavItem, NavLink } from 'reactstrap'

const HorizontalMenu =  ({ menuData, currentActiveItem, routerProps }) => {


  // ** States
  const [activeItem, setActiveItem] = useState(null)
  const [groupActive, setGroupActive] = useState([])
  const [openDropdown, setOpenDropdown] = useState([])

  // ** On mouse enter push the ID to openDropdown array
  const onMouseEnter = id => {
    const arr = openDropdown
    arr.push(id)
    setOpenDropdown([...arr])
  }

  // ** On mouse leave remove the ID to openDropdown array
  const onMouseLeave = id => {
    const arr = openDropdown
    arr.splice(arr.indexOf(id), 1)
    setOpenDropdown([...arr])
  }

  return (
    <div className='navbar-container main-menu-content row'  style={{ 
      background: `linear-gradient(90deg, rgba(16,81,115,1) 0%, rgba(109,121,9,1) 100%, rgba(0,255,12,1) 100%)`
    }}>
      <div className='bookmark-wrapper d-flex align-items-left col-md-2' style={{
        paddingLeft:0
      }}>
      <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
          {/* <img src="http://ihvnigeria.org/wp-content/uploads/2020/04/xlogod.jpg.pagespeed.ic.QWdRKCbaOh.webp" alt="Italian Trulli" */}
          <img src={ihvn_logo} alt="Italian Trulli"
          style={{ 
            width: `200px`,
            padding: '5px'
            }}></img>
          </NavLink>
        </NavItem>
      
      </div>
      <ul className='nav navbar-nav  col-md-9' id='main-menu-navigation'>
        <HorizontalNavMenuItems
          submenu={false}
          items={menuData}
          activeItem={activeItem}
          groupActive={groupActive}
          routerProps={routerProps}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          openDropdown={openDropdown}
          setActiveItem={setActiveItem}
          setGroupActive={setGroupActive}
          setOpenDropdown={setOpenDropdown}
          currentActiveItem={currentActiveItem}
        />
      </ul>
      <ul className='nav navbar-nav align-items-center ms-auto col-md-1'>
        <UserDropdown />
      </ul>
    </div>
  )
}

export default HorizontalMenu
