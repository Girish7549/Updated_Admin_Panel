import React from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../../components/index';
import AddQuestion from '../../components/Questions/AddQuestion';


function AddShowcasebox() {
  return (
    <>
         <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
        <AddQuestion/>
        </div>
        <AppFooter />
      </div>

    </div>
    </>
  )
}

export default AddShowcasebox