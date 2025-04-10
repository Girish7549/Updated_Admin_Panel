import React from 'react'
import {AppContent, AppSidebar, AppFooter, AppHeader } from '../../components/index';
import AddUnit from '../../components/units/AddUnit';
function AddHeadersAds() {
  return (
    <>
         <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
        <AddUnit/>
        </div>
        <AppFooter />
      </div>

    </div>
    </>
  )
}

export default AddHeadersAds