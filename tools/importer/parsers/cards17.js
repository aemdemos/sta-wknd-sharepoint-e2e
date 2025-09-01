/* global WebImporter */
export default function parse(element, { document }) {
  // Find the contentfragment block
  const cf = element.querySelector('.cmp-contentfragment');
  if (!cf) return;

  // Find the main content area
  const container = cf.querySelector('.cmp-contentfragment__elements');
  if (!container) return;

  // Find all card title elements (h2.cmp-title__text)
  const cardTitles = Array.from(container.querySelectorAll('h2.cmp-title__text'));

  // Helper: Extract all card content between title and next title including images and relevant text
  function getCardContent(titleEl) {
    const cardTextContent = [];
    // Add the card title as <strong>
    const strong = document.createElement('strong');
    strong.textContent = titleEl.textContent;
    cardTextContent.push(strong);
    // Start from titleEl's block's parent (cmp-title)
    let node = titleEl.closest('.cmp-title').parentElement.parentElement.parentElement.nextElementSibling;
    let cardImg = null;
    // Loop until next card title or end
    while (node && !(node.querySelector && node.querySelector('h2.cmp-title__text'))) {
      // Collect first image for the card image cell
      if (!cardImg) {
        const img = node.querySelector && node.querySelector('img');
        if (img) cardImg = img;
      }
      // Collect paragraphs and divs for text (description, address, etc.)
      if ((node.tagName === 'P' || node.tagName === 'DIV') && (node.textContent.trim() || node.childElementCount)) {
        cardTextContent.push(node);
      }
      node = node.nextElementSibling;
    }
    return [cardImg, cardTextContent];
  }

  // Compose all card rows
  const rows = cardTitles.map(titleEl => {
    const [img, textArr] = getCardContent(titleEl);
    // Ensure at least one text element for semantic compliance
    return [img, textArr];
  });

  // Header row as required by example
  const cells = [['Cards (cards17)'], ...rows];

  // Create, replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
