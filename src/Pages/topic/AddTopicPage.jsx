import React from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../../components/index';
import AddTopic from '../../components/Topic/AddTopic';

function AddTopicPage() {
  return (
    <>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <AddTopic />
          </div>
          <AppFooter />
        </div>

      </div>
    </>
  )
}

export default AddTopicPage;