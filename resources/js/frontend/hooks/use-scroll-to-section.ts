export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const header = document.querySelector('.frontend-site header');
  const headerHeight = header?.getBoundingClientRect().height ?? 72;
  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}
