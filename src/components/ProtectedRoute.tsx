import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth()

    console.log('ProtectedRoute: loading:', loading, 'user:', user?.email)

    if (loading) {
        console.log('ProtectedRoute: Loading state, showing spinner...')
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (!user) {
        // Double check: if there is a hash or query token, keep loading (Supabase might still be processing it)
        const hasHashToken = window.location.hash && window.location.hash.includes('access_token=')
        const hasSearchToken = window.location.search && window.location.search.includes('code=')

        if (hasHashToken || hasSearchToken) {
            console.log('ProtectedRoute: No user yet, but token detected. Staying in loading state...')
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            )
        }

        console.log('ProtectedRoute: No user found and no token. Redirecting to /login')
        return <Navigate to="/login" replace />
    }

    console.log('ProtectedRoute: User authenticated, rendering children')
    return <>{children}</>
}
