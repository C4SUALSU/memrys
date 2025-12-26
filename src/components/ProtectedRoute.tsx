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
        console.log('ProtectedRoute: No user found, redirecting to /login')
        return <Navigate to="/login" replace />
    }

    console.log('ProtectedRoute: User authenticated, rendering children')
    return <>{children}</>
}
