export function trapCustomNotificationTab(event: KeyboardEvent, dialog: HTMLElement | null | undefined): void {
  if (event.key !== 'Tab' || !dialog) {
    return;
  }

  const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('textarea, button, a[href], input, select'))
    .filter((element) => !element.hasAttribute('disabled'));

  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;
  const inside = !!active && dialog.contains(active);

  if (event.shiftKey && (!inside || active === first)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (!inside || active === last)) {
    event.preventDefault();
    first.focus();
  }
}
