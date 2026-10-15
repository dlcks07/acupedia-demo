export function publicPath(path: string) {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function cls(...classnames: string[]) {
  return classnames.join(' ');
}

export function isToday(curDate: string) {
  const date = new Date(curDate);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
