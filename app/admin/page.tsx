import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin · Born Of God Ministries',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AdminLogin />;
  }

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRow) {
    return <AdminLogin notAdmin email={user.email ?? undefined} />;
  }

  return <AdminDashboard email={user.email ?? ''} />;
}
