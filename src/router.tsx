import { createRootRoute, createRoute, createRouter, Outlet, Link } from '@tanstack/react-router'
import React from 'react'
import { Home } from './screens/Home'
import { Projects } from './screens/Projects'

const RootComponent = () => {
  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <h1 style={{ marginRight: 'auto' }}>TanStack DB Sample</h1>
        <nav style={{ display: 'flex', gap: 8 }}>
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
        </nav>
      </header>
      <Outlet />
      <footer style={{ marginTop: 24, color: '#777' }}>
        <small>React + TS + TanStack Router/Query. DB layer is swap-ready.</small>
      </footer>
    </div>
  )
}

const rootRoute = createRootRoute({
  component: RootComponent,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: Projects,
})

const routeTree = rootRoute.addChildren([indexRoute, projectsRoute])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

