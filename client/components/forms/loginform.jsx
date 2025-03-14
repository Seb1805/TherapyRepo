// "use client";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";

// export default function LoginForm() {
//   const form = useForm({
//     defaultValues: {
//       email: '', 
//       password: ''
//     },
//     mode: "onSubmit",
//     reValidateMode: "onSubmit"
//   })

//   async function onSubmit(data) {
//     try {
//       const response = await fetch("http://localhost:8000/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           username: data.email,
//           password: data.password,
//         })
//       });

//       if (!response.ok) {
//         throw new Error("Login failed");
//       }

//       const result = await response.json();
//       localStorage.setItem("access_token", result.access_token);
//       localStorage.setItem("refresh_token", result.refresh_token);

//       // Redirect or update UI as needed
//       console.log("Login successful", result);
//     } catch (error) {
//       console.error("Error logging in:", error);
//     }
//   }

//   return (
//     <div className="flex flex-col gap-6">
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}  className="flex flex-col gap-6"
//       >
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem className="grid gap-2">
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input placeholder="m@example.com" type="email" {...field} />
//               </FormControl>

//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="password"
//           rules={{
//             required: "Password must be atleast 8 characters long.",
//             minLength: {
//               value: 8,
//               message: "Password must be atleast 8 characters long."
//             }
//           }}
//           render={({ field }) => (
//             <FormItem className="grid gap-2">
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input type="password" {...field} />
//               </FormControl>

//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button type="submit">Login</Button>
//       </form>
//     </Form>
//     </div>
//   );
// }



"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const api = useApi();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_DIFF_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: data.email,
          password: data.password,
        }),
        // headers: {
        //   "Content-Type": "application/json",
        //   "allow-origin" : '*'

        // },
        // body: JSON.stringify({
        //   username: data.email,
        //   password: data.password,
        // }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const result = await response.json();
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("refresh_token", result.refresh_token);

      // Redirect or update UI as needed
      console.log("Login successful", result);
      router.push('/kalender');
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}  className="flex flex-col gap-3">
      <div className="grid gap-1">
        <label>Email</label>
        <Input {...register("email", { required: true })} />
        {errors.email && <span className="text-red-600">This field is required</span>}
      </div>
      <div className="grid gap-1">
        <label>Password</label>
        <Input type="password" {...register("password", { required: true })} />
        {errors.password && <span className="text-red-600">This field is required</span>}
      </div>
      <Button className="mt-4" type="submit">Login</Button>
    </form>
  );
}