// Client-side search index for offline/fast search
export function buildIndex(data = {}) {
  const index = [];
  (data.meetings || []).forEach((m) => index.push({ type: "meeting", title: m.title, id: m._id || m.id }));
  (data.tasks    || []).forEach((t) => index.push({ type: "task",    title: t.title, id: t._id || t.id }));
  return index;
}

export function searchIndex(index = [], query = "") {
  const q = query.toLowerCase();
  return index.filter((item) => item.title?.toLowerCase().includes(q));
}
