import NextAuth, { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@auth/prisma-adapter";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {

  adapter: PrismaAdapter(prisma),

  providers: [

    // GOOGLE
    GoogleProvider({

      clientId:
        process.env.GOOGLE_CLIENT_ID!,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET!,

    }),

    // EMAIL + PASSWORD
    CredentialsProvider({

      name: "credentials",

      credentials: {

        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },

      },

      async authorize(credentials) {

        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        // BUSCAR USUARIO
        const user =
          await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

        if (!user || !user.password) {
          return null;
        }

        // VALIDAR PASSWORD
        const validPassword =
          await bcrypt.compare(
            credentials.password,
            user.password
          );

        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };

      },

    }),

  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {

    async jwt({ token }) {

      // BUSCAR USUARIO REAL EN DB
      if (token.email) {

        const dbUser =
          await prisma.user.findUnique({
            where: {
              email: token.email,
            },
          });

        if (dbUser) {

          token.id = dbUser.id;
          token.role = dbUser.role;

        }

      }

      return token;
    },

    async session({ session, token }) {

      if (session.user) {

        session.user.id =
          token.id as string;

        session.user.role =
          token.role as string;

      }

      return session;
    },

  },

  pages: {

    signIn: "/login",

  },

  secret:
    process.env.NEXTAUTH_SECRET,

};

const handler =
  NextAuth(authOptions);

export {
  handler as GET,
  handler as POST,
};