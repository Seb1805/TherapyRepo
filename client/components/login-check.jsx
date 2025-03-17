import { useRouter } from 'next/navigation';
import { useEffect } from 'react'

export default function LoginCheck() {
    const route = useRouter()
  
    useEffect(() => {
      if(!localStorage.getItem('access_token') || !localStorage.getItem('refresh_token') ) {
        route.replace('/login');
      }
    },[])
}
