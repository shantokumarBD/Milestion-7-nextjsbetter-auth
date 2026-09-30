import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "http://localhost:3000"
})

export const { 
    signIn, 
    signUp,
    signOut,
    updateUser, 
    useSession,
    changePassword, 
    requestPasswordReset,
    resetPassword
} = createAuthClient()

// sign up: create account : first time
// sign in: already have account : second time
// 