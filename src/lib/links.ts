export function formatDisplayLink(link: string) {
  const value = String(link || "").trim();

  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    const path = `${url.pathname}${url.search}`.replace(/\/$/, "");
    const display = `${host}${path || ""}`;

    if (display.length <= 46) {
      return display;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const lastSegment = segments.at(-1);

    if (lastSegment) {
      return `${host}/.../${lastSegment}`;
    }

    return `${display.slice(0, 36)}...`;
  } catch {
    return value.length > 46 ? `${value.slice(0, 43)}...` : value;
  }
}
