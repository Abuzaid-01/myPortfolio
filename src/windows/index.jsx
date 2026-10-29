import { lazy } from 'react'
import Finder from './Finder'
import Notes from './Notes'
import Terminal from './Terminal'
import Contact from './Contact'

// Lazy-loaded window contents for performance
const Resume = lazy(() => import('./Resume'))
const GitHub = lazy(() => import('./GitHub'))
const LinkedIn = lazy(() => import('./LinkedIn'))
const X = lazy(() => import('./X'))
const Photos = lazy(() => import('./Photos'))
const Settings = lazy(() => import('./Settings'))

// id -> window body component (ids match windowConfig + dockApps)
export const windowContent = {
  finder: Finder,
  notes: Notes,
  terminal: Terminal,
  resume: Resume,
  contact: Contact,
  github: GitHub,
  linkedin: LinkedIn,
  x: X,
  photos: Photos,
  settings: Settings,
}
