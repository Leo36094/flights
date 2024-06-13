import { useCallback, useState } from 'react'
import { mockFlights } from '../mock/data';

const fakePromise = () => new Promise((res, rej) => {
  return res(mockFlights)
  // return rej('error')
})

export default function useApi<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async (url: string) => {
    setLoading(true)
    try {
      const response = await fetch(url)
      const result = await response.json()
      if (result) setData(result)
      // const response = await fakePromise();
      // console.log(response)
      // if (response) setData(response as T);
    } catch (error: any) {
      console.log(error, 'useapi')
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  const clearError = useCallback(() => {
    setError(null)
  }, [setError])

  return { data, loading, error, fetchData, clearError }
}
