"use client";
import LoginForm from "@/components/forms/loginform";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const  route = useRouter()

  useEffect(() => {
      if(localStorage.getItem("access_token") && localStorage.getItem('refresh_token')) {
        route.replace('kalender')
      }
    },[])

  return (
    <div className="flex flex-col gap-6 min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
      {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <br /><a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
