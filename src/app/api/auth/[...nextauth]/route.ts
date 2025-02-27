import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../../../lib/mongodb'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email // 🔥 Guardamos el email en el token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email // 🔥 Pasamos el email a la sesión
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
})

export { handler as GET, handler as POST }
