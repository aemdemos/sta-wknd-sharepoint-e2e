/* global WebImporter */
export default function parse(element, { document }) {
  // Try to find a Twitter/X embed in the element
  // Look for blockquote with a link to a tweet, or an iframe, or a direct link
  let url = null;

  // Search blockquotes for a twitter/x.com status link
  const blockquotes = element.querySelectorAll('blockquote');
  for (const bq of blockquotes) {
    const links = bq.querySelectorAll('a');
    for (const link of links) {
      if (link.href &&
          (link.href.includes('twitter.com') || link.href.includes('x.com')) &&
          /\/status\//.test(link.href)) {
        url = link.href;
        break;
      }
    }
    if (url) break;
  }

  // Search for iframe embeds
  if (!url) {
    const iframes = element.querySelectorAll('iframe');
    for (const iframe of iframes) {
      if (iframe.src &&
          (iframe.src.includes('twitter.com') || iframe.src.includes('x.com'))) {
        url = iframe.src;
        break;
      }
    }
  }

  // Look for a direct <a> link to a tweet status (not image links)
  if (!url) {
    const links = element.querySelectorAll('a');
    for (const link of links) {
      if (
        link.href &&
        (link.href.includes('twitter.com') || link.href.includes('x.com')) &&
        /\/status\//.test(link.href)
      ) {
        url = link.href;
        break;
      }
    }
  }

  // Look for data-href attribute (used by some widgets)
  if (!url) {
    const dataHrefEl = element.querySelector('[data-href*="twitter.com"], [data-href*="x.com"]');
    if (dataHrefEl && dataHrefEl.getAttribute('data-href')) {
      url = dataHrefEl.getAttribute('data-href');
    }
  }

  // As a last resort, look for any twitter/x.com link
  if (!url) {
    const links = element.querySelectorAll('a');
    for (const link of links) {
      if (link.href && (link.href.includes('twitter.com') || link.href.includes('x.com'))) {
        url = link.href;
        break;
      }
    }
  }

  // If we didn't find a URL, do not replace
  if (!url) return;

  // Create a link element referencing the original document
  const a = document.createElement('a');
  a.href = url;
  a.textContent = url;

  // Table structure per requirements
  const cells = [
    ['Embed'],
    [a],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
