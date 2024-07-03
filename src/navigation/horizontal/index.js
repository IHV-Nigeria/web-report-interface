import { Mail, Home, User, List, File } from 'react-feather'
import { Icons } from 'react-toastify'
//import { List } from 'reactstrap'

export default [
  {
    id: 'home',
    title: 'Home',
    icon: <Home size={20} />,
    navLink: '/home'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: <Mail size={20} />,
    children: [
      {
        id: 'Treament Dashboard',
        title: 'Treament Monitoring Dashboard',
        icon: <Mail />,
        navLink: '/treatment'
      },
      {
        id: 'Viralload Monitoring Dashboard',
        title: 'Viral Load Monitoring Dashboard',
        icon: <Mail />,
        navLink: '/viralload-monitoring'
      },
      {
        id: 'TB Dashboard',
        title: 'TX_TB Monitoring Dashboard',
        icon: <Mail />,
        navLink: '/tb-monitoring'
      },
      {
        id: 'TX ML',
        title: 'TX_ML Monitoring Dashboard',
        icon: <Mail />,
        navLink: '/tx-ml'
      }
    ]
  },
  // {
  //   id: 'reporting',
  //   title: 'Reporting',
  //   icon: <Mail size={20} />,
  //   children: [
  //     {
  //       id: 'Treament Dashboard',
  //       title: 'Treament Monitoring Dashboard',
  //       icon: <Mail />,
  //       navLink: '/treatment'
  //     },
  //     {
  //       id: 'Viralload Monitoring Dashboard',
  //       title: 'Viral Load Monitoring Dashboard',
  //       icon: <Mail />,
  //       navLink: '/viralload-monitoring'
  //     },
  //     {
  //       id: 'TB Dashboard',
  //       title: 'TX_TB Monitoring Dashboard',
  //       icon: <Mail />,
  //       navLink: '/tb-monitoring'
  //     },
  //     {
  //       id: 'TX ML',
  //       title: 'TX_ML Monitoring Dashboard',
  //       icon: <Mail />,
  //       navLink: '/tx-ml'
  //     }
  //   ]
  // },
  {
    id: 'uploads',
    title: 'Uploads',
    icon: <Mail size={20} />,
    children: [
      {
        id: 'newUpload',
        title: 'New Upload',
        icon: <Mail />,
        navLink: '/upload-file'
      },
      {
        id: 'viewPartnerUploads',
        title: 'View Facility Uploads',
        icon: <Mail />,
        navLink: '/upload-tracker'
      }
    ]
  },  
  {
    id: 'Settings',
    title: 'Setttings',
    icon: <Mail size={20} />,
    children: [
      {
        id: 'users',
        title: 'Users',
        icon: <User size={20} />,
        navLink: '/users'
      }      
    ]
  }
]
