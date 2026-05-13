// app/page.tsx
export default function Home() {
  return (
    <div>
      <h1>Dashboard</h1>

      <div className="card">
        <p>Links:</p>
        <a href="https://example.com/my-long-url">
          https://example.com/my-long-url
        </a>
      </div>

      <div className="card">
        <p>Afiliado:</p>
        <strong>Fulano</strong>
      </div>
    </div>
  );
}