/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the 'All Articles' section title
  const allTitles = Array.from(element.querySelectorAll('.cmp-title__text'));
  let imageListDiv = null;
  for (const titleEl of allTitles) {
    if (titleEl.textContent.trim().toLowerCase() === 'all articles') {
      // The image list follows this title's container
      let next = titleEl.closest('.cmp-title').parentElement.nextElementSibling;
      while (next && !next.classList.contains('image-list')) {
        next = next.nextElementSibling;
      }
      imageListDiv = next;
      break;
    }
  }
  if (!imageListDiv) return; // No cards block found
  // All cards
  const cardItems = imageListDiv.querySelectorAll('li.cmp-image-list__item');
  const rows = [['Cards (cards4)']];
  cardItems.forEach((li) => {
    // Image element (first cell)
    let imageEl = null;
    const imageDiv = li.querySelector('.cmp-image');
    if (imageDiv) {
      imageEl = imageDiv.querySelector('img');
    }
    // Text content (second cell)
    const textFragments = [];
    // Title (bolded, as closest to heading in the example)
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <b> for bold (to match example style)
      const b = document.createElement('b');
      b.textContent = titleLink.textContent.trim();
      textFragments.push(b);
    }
    // Description - plain text after title
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      textFragments.push(document.createElement('br'));
      textFragments.push(document.createTextNode(desc.textContent.trim()));
    }
    rows.push([
      imageEl || '',
      textFragments
    ]);
  });
  // Create the cards block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  imageListDiv.replaceWith(block);
}
