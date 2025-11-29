export function formatMessageTime(date) {
  return new Date(date).toLocaleString("en-US", {
    weekday: "short",   // Mon, Tue, Wed
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
