/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract card content from a section
  function extractCard(section, introTextEls = []) {
    // Image
    let imageEl = null;
    const imageContainer = section.querySelector('.image');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }
    // Text cell: gather all h3/h5 titles, descriptive text and social links
    const textParts = [];
    // Add any intro text passed in (from preceding .text)
    if (introTextEls.length > 0) {
      introTextEls.forEach(el => textParts.push(el));
    }
    // Add h3/h5
    section.querySelectorAll('h3, h5').forEach(el => textParts.push(el));
    // Add descriptive text inside this card (should be rare but just in case)
    section.querySelectorAll('.text').forEach(el => {
      if (!textParts.includes(el)) textParts.push(el);
    });
    // Add social links container(s)
    Array.from(section.querySelectorAll('.buildingblock, .aem-Grid')).forEach(child => {
      if (child.querySelector('.button')) {
        textParts.push(child);
      }
    });
    return [imageEl, textParts];
  }

  // Output table rows
  const rows = [['Cards (cards22)']];

  // Get main grid containing titles, text, and card sections
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // Track pending intro text blocks for the next set of cards
  let pendingIntro = [];
  Array.from(mainGrid.children).forEach(child => {
    if (
      child.classList.contains('title') && child.classList.contains('cmp-title--underline')
    ) {
      // Section title, just queue it for next cards
      pendingIntro = [child];
    } else if (child.classList.contains('text')) {
      // Section description: accumulate for next cards
      if (pendingIntro.length > 0) {
        pendingIntro.push(child);
      } else {
        pendingIntro = [child];
      }
    } else if (child.matches('section.experiencefragment')) {
      // Card section: add the pending intro (if any) to the card
      rows.push(extractCard(child, pendingIntro));
      // Intro only applied to first card of a group, then reset
      pendingIntro = [];
    } else {
      // If not title/text/section, reset intro
      pendingIntro = [];
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
