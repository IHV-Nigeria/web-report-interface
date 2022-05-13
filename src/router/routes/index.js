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
    path: '/second-page',
    component: lazy(() => import('../../views/SecondPage'))
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/authentication/Login')),
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
