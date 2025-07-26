/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all cards from the All Articles image list
  function extractCards(imageList) {
    const cards = [];
    const items = imageList.querySelectorAll('li.cmp-image-list__item');
    items.forEach((item) => {
      const article = item.querySelector('article.cmp-image-list__item-content');
      // Find the image (always first column)
      let imgEl = null;
      // Look for .cmp-image inside .cmp-image-list__item-image
      const imgContainer = article.querySelector('.cmp-image-list__item-image .cmp-image');
      if (imgContainer) {
        imgEl = imgContainer;
      } else {
        // fallback for unexpected structure
        const imgAlt = article.querySelector('img');
        if (imgAlt) {
          imgEl = imgAlt.closest('.cmp-image');
        }
      }
      // Compose text column
      const textContent = [];
      // Title (should be bold, but preserve heading semantics)
      let titleNode = article.querySelector('.cmp-image-list__item-title-link');
      if (titleNode) {
        // Use <strong> to match example, but preserve link if present
        const link = titleNode.closest('a');
        if (link) {
          // Only get the text node, not the link element itself
          const strong = document.createElement('strong');
          strong.textContent = titleNode.textContent.trim();
          textContent.push(strong);
        } else {
          const strong = document.createElement('strong');
          strong.textContent = titleNode.textContent.trim();
          textContent.push(strong);
        }
      }
      // Description
      const desc = article.querySelector('.cmp-image-list__item-description');
      if (desc && desc.textContent.trim()) {
        if (textContent.length) textContent.push(document.createElement('br'));
        textContent.push(document.createTextNode(desc.textContent.trim()));
      }
      // Fallback: If no title and no description, include all text
      if (textContent.length === 0) {
        const text = article.textContent.trim();
        if (text) textContent.push(document.createTextNode(text));
      }
      // Push row as [image, text]
      cards.push([
        imgEl || '',
        textContent.length === 1 ? textContent[0] : textContent
      ]);
    });
    return cards;
  }

  // Find the All Articles section's list
  let imageList = null;
  // Locate 'All Articles' title
  const allTitles = element.querySelectorAll('.cmp-title__text');
  for (const t of allTitles) {
    if (t.textContent.trim().toLowerCase() === 'all articles') {
      // Find the next sibling aem-GridColumn with an image-list
      let column = t.closest('.aem-GridColumn');
      let next = column && column.nextElementSibling;
      while (next) {
        const found = next.querySelector('.cmp-image-list');
        if (found) {
          imageList = found;
          break;
        }
        next = next.nextElementSibling;
      }
      break;
    }
  }
  // Fallback: just find first image-list if not found
  if (!imageList) {
    imageList = element.querySelector('.cmp-image-list');
  }

  if (imageList) {
    const headerRow = ['Cards (cards4)'];
    const cardRows = extractCards(imageList);
    if (cardRows.length) {
      const rows = [headerRow, ...cardRows];
      const block = WebImporter.DOMUtils.createTable(rows, document);
      element.replaceWith(block);
    }
  }
}
