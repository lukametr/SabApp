import dynamic from 'next/dynamic';

// Static generation for this page
export async function generateStaticParams() {
  return [];
}

const DocumentsClient = dynamic(() => import('./DocumentsClient'), { ssr: false });

export default function DocumentsPage() {
  return <DocumentsClient />;
}