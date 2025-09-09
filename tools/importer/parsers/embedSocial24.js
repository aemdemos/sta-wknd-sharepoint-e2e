/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct block name for the header
  const headerRow = ['Embed (embedSocial24)'];
  let embedUrl = null;

  // 1. Look for data-href (e.g. Facebook share)
  const dataHref = element.querySelector('[data-href]');
  if (dataHref && dataHref.getAttribute('data-href') && dataHref.getAttribute('data-href').startsWith('http')) {
    embedUrl = dataHref.getAttribute('data-href');
  }

  // 2. Look for Pinterest share button
  if (!embedUrl) {
    const pinBtn = element.querySelector('a[data-pin-do][href]');
    if (pinBtn && pinBtn.getAttribute('href').startsWith('http')) {
      embedUrl = pinBtn.getAttribute('href');
    }
  }

  // 3. Look for any social link (fallback)
  if (!embedUrl) {
    const socialDomains = [
      'twitter.com', 'instagram.com', 'facebook.com', 'tiktok.com', 'pinterest.com',
      'youtube.com', 'youtu.be', 'linkedin.com', 'reddit.com', 'threads.net',
      'snapchat.com', 'soundcloud.com', 'spotify.com',
    ];
    const links = element.querySelectorAll('a[href]');
    for (const a of links) {
      const href = a.getAttribute('href');
      if (href && socialDomains.some(domain => href.includes(domain))) {
        embedUrl = href;
        break;
      }
    }
  }

  // If no URL found, do not create block
  if (!embedUrl) return;

  // Create the link element
  const link = document.createElement('a');
  link.href = embedUrl;
  link.textContent = embedUrl;

  // Only the link in the cell, per block requirements
  const rows = [headerRow, [link]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
