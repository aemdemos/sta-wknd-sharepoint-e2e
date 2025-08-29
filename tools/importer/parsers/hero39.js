/* global WebImporter */
export default function parse(element, { document }) {
  // Header: always as specified in requirements
  const headerRow = ['Hero (hero39)'];

  // Second row: Background Image (optional)
  let imageRow;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    const img = teaserImageDiv.querySelector('img');
    if (img) {
      imageRow = [img]; // reference the existing img element
    } else {
      imageRow = [''];
    }
  } else {
    imageRow = [''];
  }

  // Third row: Headline/title, description, CTA (text with link)
  // Gather content in order as in the source
  let contentRow;
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    const contentFragment = document.createDocumentFragment();

    const titleEl = contentDiv.querySelector('.cmp-teaser__title');
    if (titleEl) contentFragment.appendChild(titleEl);

    const descDiv = contentDiv.querySelector('.cmp-teaser__description');
    if (descDiv) {
      // include each node as-is so paragraphs etc. are preserved
      Array.from(descDiv.childNodes).forEach((node) => {
        contentFragment.appendChild(node);
      });
    }

    // CTA: If a link is present in the contentDiv outside description, add it
    // (not present in this example, but required for generality)
    const ctaLink = contentDiv.querySelector('a');
    if (ctaLink && !contentFragment.contains(ctaLink)) {
      contentFragment.appendChild(ctaLink);
    }

    contentRow = [contentFragment];
  } else {
    contentRow = [''];
  }

  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
