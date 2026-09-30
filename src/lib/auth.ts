import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from "resend";

const client = new MongoClient(process.env.AUTH_DB_URL as string);
const db = client.db("better-auth");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      void resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email as string,
        subject: "Reset your password",
        html: `
        <h2>Rest your password</h2>
        Click  the link to reset your password <a href="${url}">here</a>`,
      });
    },
    
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const { data, error } = await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: user.email as string,
          subject: "Verify your email address",
          html: `Click <a href="${url}">here</a> to verify your email.`,
        });
        if (error) {
          console.error("Resend error:", error);
        } else {
          console.log("Verification email sent:", data);
        }
      } catch (err) {
        console.error("Failed to send verification email:", err);
      }
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_SECRET as string,
    },
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET as string,
    },
  },

  database: mongodbAdapter(db, { client }),
});
