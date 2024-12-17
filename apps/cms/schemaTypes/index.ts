import {dashboardGlobalComponents} from './dashboardGlobalComponents'
import {dashboardHome} from './dashboardHome'
import {manageAccount} from './dashboardMyAccount/manageAccount'
import {subscription} from './dashboardMyAccount/subscription'
import {generalSettings} from './dashboardSettings/generalSettings'
import {myWines} from './dashboardWinery/myWines'
import {wineStepper} from './dashboardWinery/myWines/stepper'
import {wineryDetails} from './dashboardWinery/wineryDetails'
import {pages} from './pages'
import {publicComponents} from './publicComponents'
import {systemVariables} from './systemVariables'

export const schemaTypes = [
  systemVariables,
  pages,
  publicComponents,
  dashboardGlobalComponents,
  dashboardHome,
  wineryDetails,
  myWines,
  wineStepper,
  subscription,
  manageAccount,
  generalSettings,
]
