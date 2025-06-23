/* global WebImporter */
export default function parse(element, { document }) {
  // Get the image element from the teaser
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) {
      imageEl = img;
    }
  }

  // Gather the content nodes for the right-hand column
  const content = element.querySelector('.cmp-teaser__content');
  const nodes = [];
  if (content) {
    // Optional pretitle (subheading or label)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      nodes.push(pretitle);
    }
    // Main title as h1
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML;
      nodes.push(h1);
    }
    // Description text
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      nodes.push(desc);
    }
    // CTA link
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      nodes.push(cta);
    }
  }

  // Compose the table according to the example: header, image, then content
  const table = WebImporter.DOMUtils.createTable([
    ['Hero'],
    [imageEl ? imageEl : ''],
    [nodes]
  ], document);
  element.replaceWith(table);
}
