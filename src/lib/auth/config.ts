// Authentication configuration
// TODO: Implement proper authentication with NextAuth.js or Clerk

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  stripeAccountId?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface Session {
  user: User;
  expires: string;
}

// Placeholder auth functions - replace with real implementation
export async function getSession(): Promise<Session | null> {
  // TODO: Implement session retrieval
  return null;
}

export async function signIn(email: string, password: string): Promise<User | null> {
  // TODO: Implement sign in
  return null;
}

export async function signOut(): Promise<void> {
  // TODO: Implement sign out
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user || null;
}