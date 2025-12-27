import { Link } from 'react-router-dom'
import { Camera, Calendar, FileText, Sparkles, ArrowRight } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-glass-border">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <span className="font-bold text-xl">Memrys</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-gray-400 hover:text-white transition-colors font-medium"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="btn-primary text-sm py-2 px-4"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary font-medium">Your private sanctuary</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-primary bg-clip-text text-transparent">
                        Share moments.<br />Keep memories.
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        A private space for you and your partner to capture life's beautiful moments together.
                        Photos, calendars, and notes — all in one secure place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="btn-primary text-lg py-4 px-8 flex items-center justify-center gap-2"
                        >
                            Get Started <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="glass-card py-4 px-8 text-lg font-medium hover:bg-white/10 transition-colors"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        Everything you need, together.
                    </h2>
                    <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                        Built for couples who want to stay connected and preserve their memories.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Shared Album */}
                        <div className="glass-card p-8 hover:bg-white/5 transition-colors group">
                            <div className="bg-gradient-to-br from-pink-500 to-rose-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Camera className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Shared Album</h3>
                            <p className="text-gray-400">
                                Upload and view photos together. Relive your favorite moments in a private,
                                beautiful gallery made just for you two.
                            </p>
                        </div>

                        {/* Shared Calendar */}
                        <div className="glass-card p-8 hover:bg-white/5 transition-colors group">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Calendar className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Shared Calendar</h3>
                            <p className="text-gray-400">
                                Stay in sync with a shared calendar. Mark anniversaries, date nights,
                                and important moments you never want to forget.
                            </p>
                        </div>

                        {/* Shared Notes */}
                        <div className="glass-card p-8 hover:bg-white/5 transition-colors group">
                            <div className="bg-gradient-to-br from-purple-500 to-violet-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Shared Notes</h3>
                            <p className="text-gray-400">
                                Write love letters, bucket lists, or daily thoughts. A private notebook
                                that belongs to both of you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto glass-card p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to start your story?
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Create your private space in seconds. No ads, no distractions — just you and your partner.
                    </p>
                    <Link
                        to="/signup"
                        className="btn-primary text-lg py-4 px-10 inline-flex items-center gap-2"
                    >
                        Create Your Memory Jar <Sparkles className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 px-6 border-t border-glass-border">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Memrys</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2024 Memrys. Made with love for couples.
                    </p>
                </div>
            </footer>
        </div>
    )
}
