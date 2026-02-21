import Link from 'next/link';

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>✅ Test Page - Routes Are Working!</h1>
      <p>If you see this, the Next.js app is running properly.</p>
      <p>Your site is on Vercel and responding to requests.</p>
      
      <h2>Diagnostic Information:</h2>
      <ul>
        <li>Server-side rendering: ✅ WORKING</li>
        <li>Static routes: ✅ WORKING</li>
        <li>Check API endpoints: 
          <ul>
            <li><Link href="/api/health">/api/health</Link></li>
            <li><Link href="/api/diagnostics">/api/diagnostics</Link></li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
