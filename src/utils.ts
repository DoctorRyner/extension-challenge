export const isOnKayak = window.location.host === 'www.kayak.com';
// const isSkyscanner = window.location.host === 'www.skyscanner.com';
// const isKayakOrSkyscanner = isKayak || isSkyscanner

export async function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function filterClassList(f: (className: string) => boolean, node: HTMLElement) {
  const classList = Array.from(node.classList);

  classList.forEach((className) => {
    if (f(className)) {
      node.classList.remove(className);
    }
  });
}
