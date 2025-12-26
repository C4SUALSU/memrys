import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Sparkles, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
    const { user, loading: authLoading } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        console.log('LoginPage: Mounted. authLoading:', authLoading, 'User:', user?.email)

        // Extract error from URL if present
        const params = new URLSearchParams(window.location.search || window.location.hash.replace('#', '?'))
        const urlError = params.get('error_description') || params.get('error')
        if (urlError) {
            setError(decodeURIComponent(urlError.replace(/\+/g, ' ')))
        }

        if (!authLoading && user) {
            console.log('LoginPage: Authenticated user detected, redirecting to dashboard...')
            navigate('/', { replace: true })
        }
    }, [user, authLoading, navigate])

    const handleGoogleLogin = async () => {
        console.log('LoginPage: Initiating Google OAuth...')
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        })

        if (error) {
            console.error('LoginPage: Google OAuth error:', error.message)
            setError(error.message)
            setLoading(false)
        } else {
            console.log('LoginPage: Redirecting to Google...')
        }
    }

    const handleMagicLinkLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('LoginPage: Sending Magic Link to:', email)
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/`,
            },
        })

        if (error) {
            console.error('LoginPage: Magic Link error:', error.message)
            setError(error.message)
        } else {
            setSent(true)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="glass-card w-full max-w-md p-8 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="bg-primary/20 p-4 rounded-2xl">
                        <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-2">Memory Jar</h1>
                <p className="text-gray-400 mb-8">Your private sanctuary for shared moments.</p>

                {sent ? (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                        </div>
                        <h2 className="text-xl font-semibold">Check your email</h2>
                        <p className="text-gray-400">
                            We've sent a magic link to <span className="text-white">{email}</span>.
                        </p>
                        <button
                            onClick={() => setSent(false)}
                            className="text-primary hover:underline text-sm font-medium"
                        >
                            Try another email
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Google Sign-In Button */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-xl transition-colors"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-4 my-4">
                            <div className="flex-1 h-px bg-glass-border"></div>
                            <span className="text-gray-500 text-sm">or</span>
                            <div className="flex-1 h-px bg-glass-border"></div>
                        </div>

                        {/* Magic Link Form */}
                        <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="input-field w-full pl-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Send Magic Link <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {error && (
                            <p className="text-red-400 text-sm bg-red-400/10 py-2 px-3 rounded-lg border border-red-400/20">
                                {error}
                            </p>
                        )}
                    </div>
                )}

                <p className="mt-8 text-xs text-gray-500">
                    By continuing, you agree to our strict mutual-consent deletion protocol.
                </p>
            </div>
        </div>
    )
}
