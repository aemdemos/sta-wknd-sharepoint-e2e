/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Embed (embedSocial18)'];

  // Find all links that look like social embeds (Twitter, Facebook, Instagram, etc.)
  // We'll look for <a> tags with hrefs that match common social media domains
  const socialSelectors = [
    'a[href*="twitter.com"]',
    'a[href*="facebook.com"]',
    'a[href*="instagram.com"]',
    'a[href*="tiktok.com"]',
    'a[href*="youtube.com"]',
    'a[href*="pinterest.com"]',
    'a[data-pin-do="buttonPin"]', // Pinterest button
  ];

  let embedUrl = '';
  let linkEl = null;

  for (const selector of socialSelectors) {
    const found = element.querySelector(selector);
    if (found) {
      // For Pinterest, the href is on the <a> itself
      embedUrl = found.href || '';
      linkEl = found.cloneNode(true);
      // If the link has no text, set it to the URL
      if (!linkEl.textContent.trim()) linkEl.textContent = embedUrl;
      break;
    }
  }

  // Fallback: if no social embed found, do not create the block
  if (!embedUrl) return;

  const cells = [
    headerRow,
    [linkEl]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
