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

        console.log('AuthProvider: Global mounted at:', window.location.href)

        // HELPER: Check if URL has auth parameters (Magic Link, etc)
        const hasAuthParams = () => {
            const hash = window.location.hash
            const search = window.location.search
            const found = (hash && (hash.includes('access_token=') || hash.includes('type=recovery') || hash.includes('error='))) ||
                (search && (search.includes('code=') || search.includes('error=')))

            console.log('AuthProvider: Checking params:', {
                hash,
                search,
                found
            })
            return found
        }

        console.log('AuthProvider: Mounted. Has hash token:', !!hasAuthParams())

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
                    setLoading(false)
                } else if (!hasAuthParams()) {
                    // ONLY stop loading if there is NO token in URL
                    // If there IS a token, we wait for onAuthStateChange to fire SIGNED_IN
                    console.log('AuthProvider: No initial session found')
                    setLoading(false)
                } else {
                    console.log('AuthProvider: Token detected in URL, waiting for processing...')
                }
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
