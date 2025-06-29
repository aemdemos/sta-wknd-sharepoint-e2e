/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-teaser block inside the provided element
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // --- Extract image from teaser ---
  let imageEl = null;
  const teaserImage = teaser.querySelector('.cmp-teaser__image img');
  if (teaserImage) {
    imageEl = teaserImage;
  }

  // --- Extract content components ---
  const content = teaser.querySelector('.cmp-teaser__content');
  // Use array to combine all content pieces
  const contentParts = [];
  if (content) {
    // Pretitle (e.g., Featured Article)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      contentParts.push(pretitle);
    }
    // Title (as heading, preserve existing heading level)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      contentParts.push(title);
    }
    // Description (as paragraph)
    const description = content.querySelector('.cmp-teaser__description');
    if (description && description.textContent.trim()) {
      // If description is not already a <p>, wrap in <p>
      if (description.tagName !== 'P') {
        const p = document.createElement('p');
        p.innerHTML = description.innerHTML;
        contentParts.push(p);
      } else {
        contentParts.push(description);
      }
    }
    // CTA/action link
    const action = content.querySelector('.cmp-teaser__action-link');
    if (action) {
      contentParts.push(action);
    }
  }

  // --- Construct the table structure ---
  const cells = [
    ['Hero (hero40)'], // header row, must match exactly
    [imageEl ? imageEl : ''], // image row
    [contentParts.length ? contentParts : ''] // content row, array or blank
  ];

  // Create the table block and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
