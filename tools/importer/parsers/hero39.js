/* global WebImporter */
export default function parse(element, { document }) {
  // Get the image element (background image)
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  let image = null;
  if (imageWrapper) {
    image = imageWrapper.querySelector('img');
  }

  // Get the content (title, description)
  const content = element.querySelector('.cmp-teaser__content');
  const contentEls = [];
  if (content) {
    // Get title (prefer h1 for hero block)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      // For semantic correctness, upgrade to h1 if not already
      let heading = title;
      if (heading.tagName.toLowerCase() !== 'h1') {
        const h1 = document.createElement('h1');
        h1.innerHTML = heading.innerHTML;
        heading = h1;
      }
      contentEls.push(heading);
    }
    // Get description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      // Use the paragraph directly if present, else the div as fallback
      if (desc.children.length === 1 && desc.children[0].tagName.toLowerCase() === 'p') {
        contentEls.push(desc.children[0]);
      } else {
        contentEls.push(desc);
      }
    }
  }

  const cells = [
    ['Hero'],
    [image || ''],
    [contentEls.length > 0 ? contentEls : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
