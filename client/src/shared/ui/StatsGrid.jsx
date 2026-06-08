export default function StatsGrid({ children, cols = 4 }) {
  const colMap = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 xl:grid-cols-4" };
  return (
    <div className={`grid gap-4 ${colMap[cols] || colMap[4]}`}>{children}</div>
  );
}
