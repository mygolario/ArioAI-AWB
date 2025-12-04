export default function PreviewPage({ params }: { params: { slug: string } }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>Preview: {params.slug}</h1>
      <p>Coming soon: Preview Renderer</p>
    </div>
  );
}
