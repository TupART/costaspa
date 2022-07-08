import { useState, useEffect, useContext, createContext } from 'react'
import { useAuth } from './auth'

const taskContext = createContext()

export function TaskProvider({ children }) {
  const tasks = useMicrosoftTasks()
  return <taskContext.Provider value={tasks}>{children}</taskContext.Provider>
}

export const useTask = () => {
  return useContext(taskContext)
}

function useMicrosoftTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // get tasks from microsoft graph api with the user access token
  const getTasks = async () => {
    console.log({ user })
    const response = await fetch('https://graph.microsoft.com/v1.0/me/tasks', {
      headers: {
        Authorization: `Bearer ${user?.accessTocken}`
      }
    })
    const data = await response.json()
    console.log(data)
  }

  return {
    tasks,
    loading,
    getTasks
  }
}
