/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero/teaser component
  // We'll look for .cmp-teaser--hero or .cmp-teaser
  let teaser = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');
  if (!teaser) {
    // fallback: if not found, use the element itself
    teaser = element;
  }

  // --- Extract background image (row 2) ---
  let bgImg = null;
  // Find cmp-image inside teaser (background image)
  const teaserImage = teaser.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    const img = teaserImage.querySelector('img');
    if (img) {
      bgImg = img;
    }
  }

  // --- Extract content (row 3) ---
  let contentArr = [];
  const teaserContent = teaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Find all direct children that are likely headings, subheadings, paragraph or CTA
    // For this case, it's just a heading (h2)
    // We'll collect all children that are element nodes and likely relevant
    Array.from(teaserContent.children).forEach((child) => {
      // Accept all heading and paragraph elements as possible content
      if (/^H[1-6]$/.test(child.tagName) || child.tagName === 'P' || child.classList.contains('cmp-teaser__title') || child.classList.contains('cmp-teaser__subtitle')) {
        contentArr.push(child);
      } else if (child.querySelector('a, button')) {
        // If this block includes a CTA link or button
        contentArr.push(child.querySelector('a, button'));
      }
    });
    // If nothing found, fallback to any text content
    if (contentArr.length === 0 && teaserContent.textContent.trim()) {
      const para = document.createElement('p');
      para.textContent = teaserContent.textContent.trim();
      contentArr.push(para);
    }
  }

  // Prepare table structure
  const cells = [
    ['Hero (hero6)'],
    [bgImg ? bgImg : ''],
    [contentArr.length ? contentArr : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
