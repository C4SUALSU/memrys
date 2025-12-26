import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getPartnerships } from '@/lib/actions/partnership';
import { Sparkles, Heart, Plus } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const partnerships = await getPartnerships();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Memory Jar</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user.email}</span>
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-glass-border overflow-hidden">
            {/* User Avatar Placeholder */}
          </div>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" /> Your Partnerships
          </h2>
          <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Invite
          </button>
        </div>

        {partnerships.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-4">
            <p className="text-gray-400">You don't have any active partnerships yet.</p>
            <p className="text-sm text-gray-500">Invite someone special to start sharing memories.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {partnerships.map((p: any) => (
              <div key={p.id} className="glass-card p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-lg">Partner Partnership</p>
                  <p className="text-sm text-gray-500 capitalize">{p.status}</p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-background" />
                  <div className="w-8 h-8 rounded-full bg-primary/40 border-2 border-background" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
