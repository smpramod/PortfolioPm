export function eventElement(target: EventTarget | null): Element | null {
  if (target instanceof Element) return target;
  if (target instanceof CharacterData) return target.parentElement;
  return null;
}
