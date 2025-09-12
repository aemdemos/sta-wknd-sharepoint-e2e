/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists and is a container for cards
  if (!element || !document) return;

  // Table header row as specified
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Find all card items (li elements)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // Defensive: find the article containing card content
    const content = item.querySelector('article.cmp-image-list__item-content');
    if (!content) return;

    // --- Image cell ---
    // Find the image element inside the card
    let imageCell = null;
    const imageLink = content.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // The image is inside the link, but we want only the image (not the link)
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageCell = img;
        }
      }
    }
    // Fallback: if no image found, leave cell empty
    if (!imageCell) imageCell = '';

    // --- Text cell ---
    // Title (as heading)
    let titleElem = content.querySelector('.cmp-image-list__item-title');
    let titleHeading = null;
    if (titleElem) {
      titleHeading = document.createElement('h3');
      titleHeading.textContent = titleElem.textContent;
    }
    // Description
    let descElem = content.querySelector('.cmp-image-list__item-description');
    // Compose text cell contents
    const textCellContent = [];
    if (titleHeading) textCellContent.push(titleHeading);
    if (descElem) textCellContent.push(descElem);
    // If there is a CTA link (title link), add it at the bottom
    const titleLink = content.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Only add if it's not just wrapping the title
      // We'll add the link as a separate element if it has meaningful href
      const ctaLink = document.createElement('a');
      ctaLink.href = titleLink.getAttribute('href');
      ctaLink.textContent = titleElem ? titleElem.textContent : titleLink.textContent;
      // Only add if the link is not already represented by the heading
      // (If you want to always show CTA, uncomment below)
      // textCellContent.push(ctaLink);
    }
    // Defensive: if no content, add empty string
    const textCell = textCellContent.length ? textCellContent : [''];

    // Add row to table
    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
