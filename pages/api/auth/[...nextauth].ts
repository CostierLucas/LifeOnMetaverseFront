import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../config/password";
import db from "../../../config/db";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in with Email",

      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials, req) {
        const { email, password } = credentials as unknown as {
          email: string;
          password: string;
        };

        let params = {
          TableName: "life-users",
          FilterExpression: "#email =:email",
          ExpressionAttributeValues: { ":email": email },
          ExpressionAttributeNames: { "#email": "email" },
        };

        let res = await db.scan(params).promise();

        if (res.Count === 0) {
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials!.password,
          res.Items?.[0].password
        );

        if (!isValid) {
          throw new Error("Password does not match!");
        }

        // Return null if user data could not be retrieved
        let user = res.Items?.[0].role;

        return user;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
    jwt: ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token, user }) => {
      session.role = token.user;
      return session;
    },
  },
  secret: "test",
  jwt: {
    secret: "test",
  },
  pages: {
    signIn: "/auth",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
  },
});
