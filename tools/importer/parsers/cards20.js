/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image list (the list of cards)
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  // Get all card items
  const items = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Prepare the table rows
  const rows = [['Cards (cards20)']]; // Header row must match example

  items.forEach(item => {
    // Get the image in the first column
    let imageEl = null;
    const imgContainer = item.querySelector('.cmp-image-list__item-image');
    if (imgContainer) {
      // Choose the first <img> inside the image container
      imageEl = imgContainer.querySelector('img');
    }
    
    // Get the text content: title (strong), description (normal)
    const textContent = [];
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for the card title as in the example
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textContent.push(strong);
      }
    }
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      // Only add a <br> if title is present and not empty
      if (textContent.length > 0) textContent.push(document.createElement('br'));
      textContent.push(descSpan);
    }
    
    // There are no separate CTAs in this HTML, so only title and description as in the example
    rows.push([
      imageEl,
      textContent
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
