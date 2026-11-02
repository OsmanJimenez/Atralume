/** CDK 22 reads the browser keyCode field; user-event synthetic events omit it.
 * Kept in documentation tests only. Production behavior comes directly from CDK.
 */
export async function pressKey(document: Document, key: string): Promise<void> {
  const codes: Record<string, number> = {
    ArrowDown: 40,
    ArrowUp: 38,
    ArrowLeft: 37,
    ArrowRight: 39,
    Home: 36,
    End: 35,
    Escape: 27,
    Enter: 13,
    " ": 32,
  };
  const keyCode = codes[key] ?? key.toUpperCase().charCodeAt(0);
  const target = document.activeElement;
  for (const type of ["keydown", "keyup"])
    target?.dispatchEvent(
      new KeyboardEvent(type, {
        key,
        code: key,
        keyCode,
        bubbles: true,
        cancelable: true,
      }),
    );
  await Promise.resolve();
}
