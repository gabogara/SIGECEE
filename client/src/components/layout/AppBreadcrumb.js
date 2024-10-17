import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from './routes'

import { Breadcrumbs, Link, Box, Divider } from '@mui/material'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute.name
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      breadcrumbs.push({
        pathname: currentPathname,
        name: getRouteName(currentPathname, routes),
        active: index + 1 === array.length ? true : false,
      })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <>
      <Box sx={{ py: 1, px: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard">
            <small>Inicio</small>
          </Link>
          {breadcrumbs.map((breadcrumb, index) => {
            return (
              <Link
                underline="hover"
                color={breadcrumb.active ? 'primary' : 'inherit'}
                {...(breadcrumb.active ? { active: 'true' } : { href: breadcrumb.pathname })}
                key={index}
              >
                <small sx={breadcrumb.active ? { fontWeight: 'medium' } : { fontWeight: 'light' }}>
                  {breadcrumb.name}
                </small>
              </Link>
            )
          })}
        </Breadcrumbs>
      </Box>
      <Divider />
    </>
  )
}

export default React.memo(AppBreadcrumb)
