// Bare-body response helpers. NO {success,message,data} envelope — the locked
// frontend reads res.data directly (data?.<key> ?? data), so payloads are
// returned at the top level under their semantic key.
export const ok = (res, payload = {}, status = 200) => res.status(status).json(payload);
export const fail = (res, message = "Request failed.", status = 500, extra = {}) =>
  res.status(status).json({ message, ...extra });
