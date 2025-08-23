/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as required
  const headerRow = ['Cards (cards3)'];

  // Find all card sections (contributors/guides)
  const cardSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // Find all intro elements (titles and text) before first card
  let introRow = null;
  if (cardSections.length) {
    // Start from first card section, traverse back collecting direct siblings
    let node = cardSections[0].previousElementSibling;
    const introElements = [];
    // Only collect elements until we reach a grid boundary (div with grid or container)
    while (node && !node.matches('section.cmp-experience-fragment--contributor')) {
      // Only accept elements with non-empty text
      if (
        (node.classList.contains('cmp-title') || node.classList.contains('cmp-title--underline') || node.classList.contains('cmp-text') || node.classList.contains('cmp-text--font-small')) &&
        node.textContent.trim().length > 0
      ) {
        introElements.unshift(node); // Reverse order
      } else if (node.tagName === 'HR') {
        break; // Never pass a horizontal rule
      }
      node = node.previousElementSibling;
    }
    if (introElements.length) {
      // Reference the actual DOM nodes so formatting and links are preserved
      const introWrapper = document.createElement('div');
      introElements.forEach(el => introWrapper.appendChild(el));
      introRow = [introWrapper];
    }
  }

  // Card extraction - preserve all text and links from source
  function extractCard(section) {
    // First column: image
    const img = section.querySelector('img');
    // Second column: all text headings, subheading, and social links
    const textCell = [];
    // Headings in correct semantic order
    const h3 = section.querySelector('h3.cmp-title__text');
    if (h3) textCell.push(h3);
    const h5 = section.querySelector('h5.cmp-title__text');
    if (h5) textCell.push(h5);
    // If there are <p> or other descriptive text, include them
    Array.from(section.querySelectorAll('p')).forEach(p => {
      textCell.push(p);
    });
    // Social buttons group
    const socialLinks = Array.from(section.querySelectorAll('a.cmp-button'));
    if (socialLinks.length) {
      const socialDiv = document.createElement('div');
      socialLinks.forEach(a => socialDiv.appendChild(a));
      textCell.push(socialDiv);
    }
    // If no headings/text found, fallback to all text content
    if (!textCell.length && section.textContent.trim()) {
      textCell.push(document.createTextNode(section.textContent.trim()));
    }
    return [img ? img : '', textCell];
  }

  const cardRows = cardSections.map(extractCard);

  // Final block table structure
  const rows = [headerRow];
  if (introRow) rows.push(introRow);
  rows.push(...cardRows);

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
