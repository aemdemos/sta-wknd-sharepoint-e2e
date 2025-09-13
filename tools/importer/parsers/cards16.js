/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment block containing the cards
  const contentFragment = element.querySelector('.contentfragment');
  if (!contentFragment) return;

  // Find the main article inside contentfragment
  const cfArticle = contentFragment.querySelector('article.cmp-contentfragment');
  if (!cfArticle) return;

  // Get all direct children of the contentfragment elements container
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll collect card rows: each card is an image (mandatory) and heading + description (mandatory)
  const rows = [];
  const headerRow = ['Cards (cards16)'];
  rows.push(headerRow);

  // We'll iterate through cfElements children and group them
  let cardImage = null;
  let cardHeading = null;
  let cardDescription = null;

  // Flatten all children (including nested .aem-Grid) for easier processing
  const children = Array.from(cfElements.childNodes).filter(node => {
    return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
  });

  // Track if we've seen the intro paragraph (should be skipped)
  let seenIntro = false;

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    // Look for image inside .aem-Grid
    if (node.nodeType === 1 && node.classList.contains('aem-Grid')) {
      const imageBlock = node.querySelector('.image .cmp-image');
      if (imageBlock) {
        cardImage = imageBlock;
      }
    } else if (node.nodeType === 1 && node.tagName.match(/^H[2-4]$/)) {
      cardHeading = node;
    } else if (node.nodeType === 1 && node.tagName === 'P') {
      // The first <p> is the intro, skip it
      if (!seenIntro) {
        seenIntro = true;
        continue;
      }
      cardDescription = node;
      // Only add a card if we have a heading or image
      if (cardHeading || cardImage) {
        const imageCell = cardImage ? cardImage : '';
        const textCell = [];
        if (cardHeading) textCell.push(cardHeading);
        if (cardDescription) textCell.push(cardDescription);
        rows.push([imageCell, textCell]);
        cardImage = null;
        cardHeading = null;
        cardDescription = null;
      }
    }
  }

  // Only create the table if there are card rows
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    contentFragment.replaceWith(block);
  }
}
