'use client'
import React from 'react'
import Admin from '@/app/Components/Admin'
import { useAuthUserContext } from '@/app/context/UseAuthContextProvider'

export default function AdminPage() {
  const { currentUser } = useAuthUserContext()

  return (
    <Admin currentUserId = {currentUser?.uid} />
  )
}
