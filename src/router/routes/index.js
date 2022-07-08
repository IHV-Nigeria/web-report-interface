import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
  },
  {
    path: '/artlinelist',
    component: lazy(() => import('../../views/linelisting/list'))
  }, 
  
  {
    path: '/data-quality',
    component: lazy(() => import('../../views/data-quality/list'))
  }, 
  {
    path: '/analytics',
    component: lazy(() => import('../../views/analytics/list'))
  }, 
  {
    path: '/upload-file',
    component: lazy(() => import('../../views/file-upload/Import'))

  }, 
  {
    path: '/upload-tracker',
    component: lazy(() => import('../../views/file-upload/list'))
  }, 
  {
    path: '/users',
    component: lazy(() => import('../../views/users/list'))
  },
  {
    path: '/deduplication',
    component: lazy(() => import('../../views/deduplication/list'))
  },
  {
    path: '/pbstracker',
    component: lazy(() => import('../../views/pbs-tracker/list'))
  }, 
  {
    path: '/login',
    component: lazy(() => import('../../views/authentication/LoginBasic')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
      layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
