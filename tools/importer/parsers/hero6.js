/* global WebImporter */
export default function parse(element, { document }) {
  // HERO (hero6) block: 1 col, 3 rows: header, image, content

  // 1. Header row
  const headerRow = ['Hero (hero6)'];

  // 2. Find the image element (background image)
  let imageEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }

  // 3. Find the content (title, subheading, CTA)
  let contentEls = [];
  const teaserContentDiv = element.querySelector('.cmp-teaser__content');
  if (teaserContentDiv) {
    // Only heading present in this example; trim whitespace
    contentEls = Array.from(teaserContentDiv.children).map((el) => {
      if (el.tagName === 'H2') {
        const clone = el.cloneNode(true);
        clone.textContent = clone.textContent.trim();
        return clone;
      }
      return el;
    });
  }

  // 4. Compose table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentEls.length ? contentEls : ''],
  ];

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Find the separator <hr> and insert it after the table (not inside)
  const separatorHr = element.querySelector('.cmp-separator__horizontal-rule') || element.querySelector('.separator hr');
  let hrEl = null;
  if (separatorHr) {
    hrEl = separatorHr.cloneNode(true);
    block.after(hrEl);
    element.replaceWith(block, hrEl);
  } else {
    element.replaceWith(block);
  }
}
