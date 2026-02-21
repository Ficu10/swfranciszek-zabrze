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
            <li><a href="/api/health">/api/health</a></li>
            <li><a href="/api/diagnostics">/api/diagnostics</a></li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
