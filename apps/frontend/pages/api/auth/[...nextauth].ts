import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Call your backend API to verify credentials
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
        const user = await res.json();
        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && account.provider === 'google' && profile) {
        // For Google login, create/find user in backend
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000/api'}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              picture: (profile as any).picture,
              googleId: (profile as any).sub,
            }),
          });
          
          if (response.ok) {
            const backendUser = await response.json();
            token.id = backendUser.user.id || backendUser.user._id;
            token.email = backendUser.user.email;
            token.name = backendUser.user.name;
            token.picture = backendUser.user.picture;
            token.role = backendUser.user.role;
          }
        } catch (error) {
          console.error('Error syncing Google user with backend:', error);
        }
      }
      
      if (user) {
        token.id = (user as any).id || (user as any)._id;
        token.email = user.email;
        token.name = user.name;
        token.picture = (user as any).picture;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).id = token.id;
      (session.user as any).role = token.role;
      (session.user as any).picture = token.picture;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    // error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
