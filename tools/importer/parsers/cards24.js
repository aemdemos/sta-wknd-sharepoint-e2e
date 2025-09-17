/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Defensive: find image
    const imageWrap = section.querySelector('.image .cmp-image');
    let img = null;
    if (imageWrap) {
      img = imageWrap.querySelector('img');
    }

    // Defensive: find name/title
    let nameEl = null, roleEl = null;
    const titleEls = section.querySelectorAll('.title .cmp-title__text');
    titleEls.forEach((el) => {
      if (el.tagName.toLowerCase() === 'h3') nameEl = el;
      if (el.tagName.toLowerCase() === 'h5') roleEl = el;
    });

    // Defensive: find social buttons
    const buttonWrap = section.querySelector('.buildingblock, .cmp-buildingblock--btn-list');
    let socialLinks = [];
    if (buttonWrap) {
      socialLinks = Array.from(buttonWrap.querySelectorAll('a.cmp-button'));
    }

    // Defensive: find description text (if any)
    let descriptionEl = null;
    // Look for a text block that is a sibling or nearby
    // Try to find the closest .cmp-text before or after this section
    let descCandidate = section.parentElement.querySelector('.cmp-text');
    if (descCandidate && section.parentElement.contains(descCandidate)) {
      // Only use if it's before this section
      if (descCandidate.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING) {
        descriptionEl = descCandidate;
      }
    }
    // Compose text cell
    const textCell = [];
    if (nameEl) textCell.push(nameEl.cloneNode(true));
    if (roleEl) textCell.push(roleEl.cloneNode(true));
    if (descriptionEl) {
      // Only include the text content, not the whole element
      Array.from(descriptionEl.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
          textCell.push(node.cloneNode(true));
        }
      });
    }
    if (socialLinks.length) {
      // Wrap social links in a div for layout
      const socialDiv = document.createElement('div');
      socialLinks.forEach((l) => socialDiv.appendChild(l.cloneNode(true)));
      textCell.push(socialDiv);
    }

    // Compose row: [image, text]
    return [img ? img.cloneNode(true) : '', textCell];
  }

  // Find all contributor/guide sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards24)'];
  rows.push(headerRow);
  // Card rows
  cardSections.forEach((section) => {
    rows.push(extractCard(section));
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element
  element.replaceWith(block);
}
