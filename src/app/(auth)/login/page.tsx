// "use client"

// import { useState } from "react"
// import { signIn } from "next-auth/react"
// import { motion } from "framer-motion"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { Eye, EyeOff, Loader2 } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// const formSchema = z.object({
//   email: z.string().email({ message: "Please enter a valid email address" }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters" }),
// })

// export default function LoginPage() {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   })

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     setIsLoading(true)

//     try {
//       const result = await signIn("credentials", {
//         redirect: false,
//         email: values.email,
//         password: values.password,
//       })

//       if (result?.error) {
//         form.setError("root", {
//           message: "Invalid email or password",
//         })
//       } else {
//         router.push("/dashboard")
//       }
//     } catch (error) {
//       console.error("Login error:", error)
//       form.setError("root", {
//         message: "Something went wrong. Please try again.",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const togglePasswordVisibility = () => setShowPassword(!showPassword)

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
//         <Card className="border-border/40 shadow-lg">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
//             <CardDescription className="text-center">Enter your credentials to sign in to your account</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <motion.div whileTap={{ scale: 0.99 }}>
//                           <Input
//                             placeholder="name@example.com"
//                             {...field}
//                             disabled={isLoading}
//                             className="bg-background"
//                           />
//                         </motion.div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Password</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <motion.div whileTap={{ scale: 0.99 }}>
//                             <Input
//                               type={showPassword ? "text" : "password"}
//                               placeholder="••••••••"
//                               {...field}
//                               disabled={isLoading}
//                               className="bg-background pr-10"
//                             />
//                           </motion.div>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="icon"
//                             onClick={togglePasswordVisibility}
//                             className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
//                           >
//                             {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                           </Button>
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 {form.formState.errors.root && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-sm font-medium text-destructive"
//                   >
//                     {form.formState.errors.root.message}
//                   </motion.div>
//                 )}
//                 <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
//                   <Button type="submit" className="w-full" disabled={isLoading}>
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Signing in...
//                       </>
//                     ) : (
//                       "Sign in"
//                     )}
//                   </Button>
//                 </motion.div>
//               </form>
//             </Form>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4">
//             <div className="text-sm text-center text-muted-foreground">
//               <Link href="/forgot-password" className="underline underline-offset-4 hover:text-primary">
//                 Forgot your password?
//               </Link>
//             </div>
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-card px-2 text-muted-foreground">Or</span>
//               </div>
//             </div>
//             <div className="text-sm text-center text-muted-foreground">
//               Don&apos;t have an account?{" "}
//               <Link href="/register" className="underline underline-offset-4 hover:text-primary">
//                 Sign up
//               </Link>
//             </div>
//           </CardFooter>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }

// // use this command to get the all dependencies
// // npm install next-auth framer-motion next zod @hookform/resolvers react-hook-form lucide-react
// // npx shadcn-ui@latest init
// // npx shadcn-ui@latest add button input card form
// // npx shadcn@latest init
// // npx shadcn@latest add button input card form

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (result.error) {
      alert(result.error);
    } else {
      alert('Login Successful!');
      if (result.role === 'job_seeker') {
        router.push('/dashboard/job-seeker');
      } else if (result.role === 'interviewer') {
        router.push('/dashboard/interviewer');
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
