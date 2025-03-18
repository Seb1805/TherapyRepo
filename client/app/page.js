'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
 const route = useRouter() 

  useEffect(() => {
    if(localStorage.getItem("access_token") && localStorage.getItem('refresg_token')) {
      route.replace('kalender')
    }
    else route.replace('login')
  },[])
  return (
    <div className="">
      
    </div>
  );
}
