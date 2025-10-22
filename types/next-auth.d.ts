import { NextAuthOptions } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: string
      name: string
      lastName: string
    }
  }

  interface User {
    role: string
    name: string
    lastName: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    name: string
    lastName: string
  }
}



