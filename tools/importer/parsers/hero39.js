/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row matches example: 'Hero'
  const headerRow = ['Hero'];

  // 2. Get background image element (second row)
  let imageCell = '';
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // 3. Compose content cell: Title (as heading) + subheading/description (preserving <p>)
  const contentElements = [];
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Title
    const h2 = teaserContent.querySelector('h2');
    if (h2) {
      // Use h1 as per Hero block convention
      const h1 = document.createElement('h1');
      h1.innerHTML = h2.innerHTML;
      contentElements.push(h1);
    }
    // Description - preserve any <p> or text
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) {
      desc.childNodes.forEach((node) => {
        // Only append element (like <p>) or text, not comments
        if (node.nodeType === 1 /* ELEMENT_NODE */ || node.nodeType === 3 /* TEXT_NODE */) {
          contentElements.push(node);
        }
      });
    }
  }

  // 4. Assemble table rows as per example: header, image, content
  const cells = [
    headerRow,
    [imageCell],
    [contentElements]
  ];

  // 5. Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element with the table
  element.replaceWith(table);
}
