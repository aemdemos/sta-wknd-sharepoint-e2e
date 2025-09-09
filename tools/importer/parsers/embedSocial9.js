/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Embed (embedSocial9)'];

  // Find a social embed URL in the element itself (not the whole document)
  let embedUrl = null;

  // Twitter embed: look for a link to a tweet
  const twitterLink = element.querySelector('a[href*="twitter.com/"]');
  if (twitterLink) {
    embedUrl = twitterLink.href;
  }

  // Instagram embed: look for a link to an Instagram post
  if (!embedUrl) {
    const instaLink = element.querySelector('a[href*="instagram.com/"]');
    if (instaLink) {
      embedUrl = instaLink.href;
    }
  }

  // Facebook embed: look for a link to a Facebook post
  if (!embedUrl) {
    const fbLink = element.querySelector('a[href*="facebook.com/"]');
    if (fbLink) {
      embedUrl = fbLink.href;
    }
  }

  // If no embed found, fallback: look for any iframe src
  if (!embedUrl) {
    const iframe = element.querySelector('iframe[src]');
    if (iframe) {
      embedUrl = iframe.src;
    }
  }

  // If no embed found, do not create the block
  if (!embedUrl) return;

  // Create a link element for the embed URL
  const link = document.createElement('a');
  link.href = embedUrl;
  link.textContent = embedUrl;

  // Compose the table cells
  const cells = [
    headerRow,
    [link]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
