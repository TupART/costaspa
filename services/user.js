import { useAuth } from './auth'

export function useMe() {
  // get user from auth context and search my info on microsoft graph api
  const { user } = useAuth()
  if (!user) return null
  return fetch(`https://graph.microsoft.com/v1.0/me`, {
    headers: {
      Authorization: `Bearer ${user.accessTocken}`
    }
  })
    .then((res) => res.json())
    .then((res) => res.value)
}
