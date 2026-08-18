export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <section
      className="flex-1 bg-sheet"
      style={{
        borderTopLeftRadius: "var(--radius-sheet)",
        borderTopRightRadius: "var(--radius-sheet)",
        padding: "24px 20px",
      }}
    >
      <h2 className="type-section-title text-text">{title}</h2>
      <p className="type-body text-muted mt-2">{note}</p>
    </section>
  );
}
