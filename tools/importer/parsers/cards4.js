/* global WebImporter */
export default function parse(element, { document }) {
  // Find the primary card block (image list)
  let imageListBlock = element.querySelector('.cmp-image-list');
  if (!imageListBlock) return;

  const rows = [];
  // HEADER (must be exact, one cell)
  rows.push(['Cards (cards4)']);

  // For each card (li)
  imageListBlock.querySelectorAll(':scope > li').forEach((li) => {
    // FIRST CELL: image or icon, reference full image container if possible
    let imageCell = null;
    // Prefer the outermost .cmp-image, else .cmp-image-list__item-image (div), else img
    let imageDiv = li.querySelector('.cmp-image');
    if (imageDiv) {
      imageCell = imageDiv;
    } else {
      let itemImage = li.querySelector('.cmp-image-list__item-image');
      if (itemImage) {
        imageCell = itemImage;
      } else {
        let imgEl = li.querySelector('img');
        if (imgEl) imageCell = imgEl;
      }
    }

    // SECOND CELL: title, description, and any links, in semantic order, preserving bold and layout
    const textParts = [];
    const article = li.querySelector('.cmp-image-list__item-content') || li;
    // Title (always included)
    let titleEl = article.querySelector('.cmp-image-list__item-title');
    if (titleEl) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textParts.push(strong);
    }
    // Description
    let descEl = article.querySelector('.cmp-image-list__item-description');
    if (descEl) {
      textParts.push(document.createElement('br'));
      // Use the real description element to preserve semantics
      textParts.push(descEl);
    }
    // Optionally add the title as a link if that is semantically present (not in the cards4 example, but flexible)
    // Only if link text is different and not redundant
    // -- not needed for this example, so omitted
    // If nothing was found, ensure at least some fallback text
    if (!titleEl && !descEl) {
      const allText = article.textContent.trim();
      if (allText) {
        textParts.push(document.createTextNode(allText));
      }
    }
    rows.push([imageCell, textParts]);
  });

  // Create cards block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
