import { Mail, Home, User, List } from 'react-feather'
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
    id: 'artlinelist',
    title: 'Linelist Generation',
    icon: <List size={20} />,
    navLink: '/artlinelist'
  },
  {
    id: 'reportGeneration',
    title: 'Report Generation',
    icon: <Mail size={20} />,
    navLink: '/artlinelist'
  },
  {
    id: 'dataQuality',
    title: 'Data Quality',
    icon: <Mail size={20} />,
    navLink: '/data-quality'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: <Mail size={20} />,
    navLink: '/analytics'
  },
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
        title: 'View Partner Uploads',
        icon: <Mail />,
        navLink: '/upload-tracker'
      }
    ]
  },
  {
    id: 'pbsTracker',
    title: 'PBS Tracker',
    icon: <User size={20} />,
    navLink: '/pbstracker'
  },
  {
    id: 'setttings',
    title: 'Setttings',
    icon: <Mail size={20} />,
    navLink: '/artlinelist'
  }
]
