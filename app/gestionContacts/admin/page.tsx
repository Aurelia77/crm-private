'use client'

import React from 'react'

import Admin from '../../Components/Admin'
import { useAuthUserContext } from '../../context/UseAuthContextProvider'

export default function AdminPage() {
const { currentUser } = useAuthUserContext()

  return (
    <Admin currentUserId = {currentUser?.uid} />
  )
}
