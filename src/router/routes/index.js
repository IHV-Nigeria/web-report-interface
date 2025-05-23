import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - IHVN CDR'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/dasboard/Dashboard'))
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
    path: '/treatment',
    component: lazy(() => import('../../views/analytics/treatment/list'))
  }, 
/*   {
    path: '/performance-dashboard',
    component: lazy(() => import('../../views/performance-dashboard/list'))

  },  */
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
    path: '/viralload-monitoring',
    component: lazy(() => import('../../views/analytics/viralload-monitoring/list'))
  }, 
  {
    path: '/tb-monitoring',
    component: lazy(() => import('../../views/analytics/tb-monitoring/list'))
  },
  {
    path: '/tx-ml',
    component: lazy(() => import('../../views/analytics/tx_ml/list'))
  },
  {
    path: '/dqa',
    component: lazy(() => import('../../views/dqa/newDQA'))
  },
  {
    path: '/dqas',
    component: lazy(() => import('../../views/dqa/DQAs'))
  },
  {
    path: '/dqa-system-questions',
    component: lazy(() => import('../../views/dqa/systemsProcessesQuestions'))
  },
  {
    path: '/new-dqa-system-questions/:dqaId',
    component: lazy(() => import('../../views/dqa/newDQASPQuestions'))
  },
  {
    path: '/dqa-upload-files/:dqaId',
    component: lazy(() => import('../../views/dqa/newDQAFiles'))
  },
  {
    path: '/new-dqa-dv-questions/:dqaId',
    component: lazy(() => import('../../views/dqa/newDQADVQuestions'))
  },
  {
    path: '/dqa-details/:dqaId',
    component: lazy(() => import('../../views/dqa/dqaDetails'))
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
