export function Loading() {
  return <p className="muted">Loading…</p>;
}

export function ErrorBox({ message }) {
  return (
    <div className="notice error">
      <strong>Something went wrong.</strong>
      <p>{message}</p>
      <p>Check that the server is running. Open a terminal in the interview-coach folder and run <code>npm start</code>.</p>
    </div>
  );
}
