import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        console.log('AuthProvider: Mounted')

        async function getInitialSession() {
            console.log('AuthProvider: Fetching initial session...')
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error('AuthProvider: getSession error:', error.message)
            }

            if (mounted) {
                if (session) {
                    console.log('AuthProvider: Session found for user:', session.user.email)
                    setSession(session)
                    setUser(session.user)
                } else {
                    console.log('AuthProvider: No initial session found')
                }
                setLoading(false)
            }
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('AuthProvider: authStateChange event:', event, 'Session present:', !!session)
                if (mounted) {
                    setSession(session)
                    setUser(session?.user ?? null)
                    setLoading(false)
                }
            }
        )

        return () => {
            console.log('AuthProvider: Unmounting')
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
