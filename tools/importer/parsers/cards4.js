/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' section's image-list
  const imageList = element.querySelector('.image-list ul.cmp-image-list');
  if (!imageList) return;

  // Compose header row exactly as required
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((li) => {
    // First cell: image element from the card
    const img = li.querySelector('.cmp-image-list__item-image img');
    // Second cell: text container (uses strong for title, then description)
    const textContainer = document.createElement('div');
    // Title
    const titleSpan = li.querySelector('.cmp-image-list__item-title-link .cmp-image-list__item-title');
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textContainer.appendChild(strong);
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
      textContainer.appendChild(descDiv);
    }
    rows.push([
      img,
      textContainer
    ]);
  });

  // Build the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original image list with the block table
  imageList.parentNode.replaceChild(block, imageList);
}
