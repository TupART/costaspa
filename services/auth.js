import {
  OAuthProvider,
  getAuth,
  signInWithPopup,
  signOut as signOutAuth
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'

import Router from 'next/router'
import { auth } from './firebase'
import { createUser } from './db'

const authContext = createContext()

export function AuthProvider({ children }) {
  const auth = useFirebaseAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useFirebaseAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleUser = async (rawUser) => {
    if (rawUser === null || rawUser === undefined) {
      setUser(false)
      setLoading(false)
      return false
    }
    const user = await formatUser(rawUser)
    const { token, ...userWithoutToken } = user
    createUser(user.uid, userWithoutToken)
    setUser(user)
    setLoading(false)
    return user
  }

  const signInWithMicrosoft = async (redirect) => {
    setLoading(true)
    const provider = new OAuthProvider('microsoft.com')
    provider.setCustomParameters({
      tenant: process.env.NEXT_PUBLIC_FIREBASE_TENANT
    })
    return signInWithPopup(auth, provider).then((response) => {
      handleUser(response)
      if (redirect) {
        Router.push(redirect)
      }
    })
  }

  const signOut = () => {
    const auth = getAuth()
    return signOutAuth(auth)
      .then(() => {
        setUser(false)
      })
      .catch((error) => {
        console.error('Error signing out', error)
      })
  }

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged((user) => handleUser(user))
    return () => unsubscribe()
  }, [])

  return {
    user,
    loading,
    signInWithMicrosoft,
    signOut
  }
}

const formatUser = async (user) => {
  const credential = OAuthProvider.credentialFromResult(user)
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     Authorization: 'Bearer credential.accessToken'
  //   }
  // }
  //  const response = await fetch('https://graph.microsoft.com/v1.0/me', options)
  // const photoURL = ''
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    accessToken: credential?.accessToken || null,
    idToken: credential?.idToken || null
  }
}
