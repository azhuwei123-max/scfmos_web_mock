export function getImageUrl(url: string) {
  return new URL(`./assets/imgs/${url}.png`, import.meta.url).href
}