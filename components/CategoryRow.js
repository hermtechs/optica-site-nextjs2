export default function CategoryRow() {
  const cats = ["Men Collection", "Women Collection", "Kids Collection"];
  return (
    <div className="container-tight py-8 grid sm:grid-cols-3 gap-6">
      {cats.map((c) => (
        <div key={c} className="pill text-center">
          {c}
        </div>
      ))}
    </div>
  );
}
