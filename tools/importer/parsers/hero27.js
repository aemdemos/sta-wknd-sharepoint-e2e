/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content and image containers
  const content = element.querySelector('.cmp-teaser__content');
  const imageWrapper = element.querySelector('.cmp-teaser__image');

  // Row 1: Block name header
  const headerRow = ['Hero (hero27)'];

  // Row 2: Background image (optional)
  let imageRow = [''];
  if (imageWrapper) {
    // Use the entire image wrapper div for resilience
    imageRow = [imageWrapper];
  }

  // Row 3: Title, description, CTA (all optional)
  let contentRow = [''];
  if (content) {
    // We'll collect the heading, description, and CTA into a fragment
    const frag = document.createDocumentFragment();
    // Heading (optional)
    const heading = content.querySelector('.cmp-teaser__title');
    if (heading) frag.appendChild(heading);
    // Description (optional)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) frag.appendChild(desc);
    // CTA (optional)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) frag.appendChild(cta);
    contentRow = [frag];
  }

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
