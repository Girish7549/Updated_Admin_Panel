import React from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../../components/index'
import AddColorThemes from '../../components/ColorTheme/AddColorTheme'
function AddColorTheme() {
  return (
    <>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <AddColorThemes />
          </div>
          <AppFooter />
        </div>
      </div>
    </>
  )
}

export default AddColorTheme
