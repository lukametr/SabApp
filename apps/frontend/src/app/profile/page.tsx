import dynamic from 'next/dynamic';

// Static generation for this page
export async function generateStaticParams() {
  return [];
}

const ProfileClient = dynamic(() => import('./ProfileClient'), { ssr: false });

export default function ProfilePage() {
  return <ProfileClient />;
} 