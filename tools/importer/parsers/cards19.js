/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a card row: [image, text content]
  function createCardRow(imageEl, textEls) {
    return [imageEl, textEls];
  }

  const rows = [];
  const headerRow = ['Cards (cards19)'];
  rows.push(headerRow);

  // Find the main content area that contains the cards
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // --- Skatepark Cards ---
  // Find all h2 skatepark titles
  const skateparkTitles = Array.from(contentFragment.querySelectorAll('h2'));
  skateparkTitles.forEach(h2 => {
    // Find the image in the same grid column or nearby
    let imgEl = null;
    let parentDiv = h2.closest('.aem-GridColumn') || h2.parentElement;
    if (parentDiv) {
      // Look for image in sibling .image div
      let imageDiv = null;
      let sibling = parentDiv.nextElementSibling;
      while (sibling) {
        if (sibling.classList && sibling.classList.contains('image')) {
          imageDiv = sibling;
          break;
        }
        sibling = sibling.nextElementSibling;
      }
      if (imageDiv && imageDiv.querySelector('img')) {
        imgEl = imageDiv.querySelector('img');
      }
    }
    if (!imgEl) {
      // fallback: next image in DOM
      const nextImg = h2.parentElement.querySelector('img');
      if (nextImg) imgEl = nextImg;
    }
    // Find all paragraphs between this h2 and the next h2
    const textEls = [h2];
    let next = h2.parentElement.nextElementSibling;
    while (next && !(next.querySelector && next.querySelector('h2'))) {
      if (next.tagName === 'P') textEls.push(next);
      next = next.nextElementSibling;
    }
    // Also try global search for address if not found
    if (!textEls.some(el => el.querySelector && el.querySelector('i'))) {
      const addr = Array.from(contentFragment.querySelectorAll('p')).find(p => p.querySelector('i') && p.textContent.includes(h2.textContent.split(' ')[0]));
      if (addr) textEls.push(addr);
    }
    // Only add a card if we have an image and some text
    if (imgEl && textEls.length > 1) {
      rows.push(createCardRow(imgEl, textEls));
    }
  });

  // Build the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
