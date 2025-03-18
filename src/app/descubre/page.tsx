'use client'

import { useState } from 'react'
import Feed from './feed'
import UserProfileCard from './userProfileCard'

export default function Page() {
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false)

  return (
    <div className='min-h-screen'>
      <UserProfileCard setRefreshTrigger={setRefreshTrigger} />
      <Feed refreshTrigger={refreshTrigger} />
    </div>
  )
}
