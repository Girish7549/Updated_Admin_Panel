import React from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../../components/index';
import AllTopic from '../../components/Topic/AllTopic';

function TopicPage() {
  return (
    <>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <AllTopic />
          </div>
          <AppFooter />
        </div>

      </div>
    </>
  )
}

export default TopicPage;