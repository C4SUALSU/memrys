import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Sparkles, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/`,
            },
        })

        if (error) {
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
                    <form onSubmit={handleLogin} className="space-y-4">
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

                        {error && (
                            <p className="text-red-400 text-sm bg-red-400/10 py-2 px-3 rounded-lg border border-red-400/20">
                                {error}
                            </p>
                        )}

                        <button
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Connect <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                )}

                <p className="mt-8 text-xs text-gray-500">
                    By continuing, you agree to our strict mutual-consent deletion protocol.
                </p>
            </div>
        </div>
    )
}
