// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { ArrowLeft, UserPlus } from "lucide-react";
// import { toast } from "sonner"; // ✅ Correct import for notifications
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { supabase } from "@/lib/supabase";

// // ✅ Schema validation with Zod
// const formSchema = z
//   .object({
//     email: z.string().email({ message: "Please enter a valid email address" }),
//     password: z.string().min(6, { message: "Password must be at least 6 characters" }),
//     confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// type FormData = z.infer<typeof formSchema>;

// export default function RegisterPage() {
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   // ✅ Corrected toast implementation
//   const onSubmit = async (data: FormData) => {
//     setIsLoading(true);

//     try {
//       const { error } = await supabase.auth.signUp({
//         email: data.email,
//         password: data.password,
//       });

//       if (error) {
//         toast.error(`Registration failed: ${error.message}`);
//       } else {
//         toast.success("Registration successful! Please check your email.");
//       }
//     } catch (error) {
//       toast.error("Something went wrong! Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ✅ Animations
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 300, damping: 24 },
//     },
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
//       <motion.div className="w-full max-w-md" initial="hidden" animate="visible" variants={containerVariants}>
//         <motion.div variants={itemVariants} className="text-center mb-6">
//           <h2 className="text-3xl font-bold tracking-tight text-primary">Join us today</h2>
//           <p className="mt-2 text-sm text-muted-foreground">Create an account to get started</p>
//         </motion.div>

//         <motion.div variants={itemVariants}>
//           <Card className="border-border/40 shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-2xl">Sign up</CardTitle>
//               <CardDescription>Enter your details to create your account</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="name@example.com"
//                     autoComplete="email"
//                     {...register("email")}
//                     className={errors.email ? "border-destructive" : ""}
//                   />
//                   {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password</Label>
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="••••••••"
//                     autoComplete="new-password"
//                     {...register("password")}
//                     className={errors.password ? "border-destructive" : ""}
//                   />
//                   {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword">Confirm Password</Label>
//                   <Input
//                     id="confirmPassword"
//                     type="password"
//                     placeholder="••••••••"
//                     autoComplete="new-password"
//                     {...register("confirmPassword")}
//                     className={errors.confirmPassword ? "border-destructive" : ""}
//                   />
//                   {errors.confirmPassword && (
//                     <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
//                   )}
//                 </div>
//                 <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
//                   <Button type="submit" className="w-full" disabled={isLoading}>
//                     {isLoading ? (
//                       <motion.div
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                         className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
//                       />
//                     ) : (
//                       <UserPlus className="mr-2 h-4 w-4" />
//                     )}
//                     Create Account
//                   </Button>
//                 </motion.div>
//               </form>
//             </CardContent>
//             <CardFooter className="flex flex-col space-y-4">
//               <div className="relative w-full">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t border-border/30" />
//                 </div>
//                 <div className="relative flex justify-center text-xs">
//                   <span className="bg-card px-2 text-muted-foreground">Already have an account?</span>
//                 </div>
//               </div>
//               <Button variant="outline" className="w-full" asChild>
//                 <Link href="/login">
//                   <ArrowLeft className="mr-2 h-4 w-4" />
//                   Back to login
//                 </Link>
//               </Button>
//             </CardFooter>
//           </Card>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }


