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
        title: 'Treament Dashboard',
        icon: <Mail />,
        navLink: '/analytics'
      },
      {
        id: 'Viralload Monitoring Dashboard',
        title: 'Viralload Monitoring Dashboard',
        icon: <Mail />,
        navLink: '/viralload-monitoring'
      },
      {
        id: 'Performance Dashboard',
        title: 'Performance Dashboard',
        icon: <Mail />,
        navLink: '/performance-dashboard'
      }
    ]
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
