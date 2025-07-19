/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero teaser component
  const heroTeaser = element.querySelector('.cmp-teaser');
  if (!heroTeaser) return;

  // Get the background image element (direct reference to <img>)
  let imgEl = null;
  const imageWrapper = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    imgEl = imageWrapper.querySelector('img');
  }

  // Get all relevant content (title, subheading, paragraph, cta) in order
  let contentCell = [];
  const contentDiv = heroTeaser.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Collect all H1-H6, P, and A elements in order
    contentCell = Array.from(contentDiv.children).filter(
      el => /^H[1-6]$/.test(el.tagName) || el.tagName === 'P' || el.tagName === 'A'
    );
  }

  // Prepare the table rows
  const rows = [];
  rows.push(['Hero (hero6)']); // Table header matches exactly
  rows.push([imgEl || '']);   // Second row: background image or blank
  rows.push([contentCell]);   // Third row: all relevant text content in a single cell, in order

  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
