import { useState, useEffect, useContext, createContext } from 'react'
import Router from 'next/router'
import { auth } from './firebase'
import { createUser } from './db'
import { signInWithPopup, OAuthProvider, signOut, getAuth } from 'firebase/auth'

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
    if (rawUser) {
      const user = await formatUser(rawUser)
      const { token, ...userWithoutToken } = user

      createUser(user.uid, userWithoutToken)
      setUser(user)
      setLoading(false)
      return user
    } else {
      setUser(false)
      setLoading(false)
      return false
    }
  }

  const signInWithMicrosoft = async (redirect) => {
    setLoading(true)
    const provider = new OAuthProvider('microsoft.com')
    provider.setCustomParameters({
      tenant: process.env.NEXT_PUBLIC_FIREBASE_TENANT
    })
    return signInWithPopup(auth, provider).then((response) => {
      handleUser(response.user)
      if (redirect) {
        Router.push(redirect)
      }
    })
  }

  const signout = () => {
    const auth = getAuth()
    return signOut(auth)
      .then(() => {
        setUser(false)
        Router.push('/')
      })
      .catch((error) => {
        console.error('Error signing out', error)
      })
  }

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(handleUser)
    return () => unsubscribe()
  }, [])

  return {
    user,
    loading,
    signInWithMicrosoft,
    signout
  }
}

const formatUser = async (user) => {
  return {
    token: user.refreshToken,
    accessTocken: user.accessToken,
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL
  }
}
