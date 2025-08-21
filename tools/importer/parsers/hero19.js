/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero image: the first .cmp-image inside the first .image block
  let heroImage = null;
  const mainImage = element.querySelector('.aem-Grid > .image .cmp-image');
  if (mainImage) {
    heroImage = mainImage;
  } else {
    // fallback: any first .cmp-image globally
    heroImage = element.querySelector('.cmp-image');
  }

  // Collect hero text (main heading, subheading, first main paragraph)
  let textElements = [];
  const mainContent = element.querySelector(
    'main.container.responsivegrid.aem-GridColumn--tablet--12, main.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--8'
  ) || element;

  // Add first h1 (main title)
  const h1 = mainContent.querySelector('h1');
  if (h1) textElements.push(h1);

  // Add next heading if present (author or subheading)
  const subH = mainContent.querySelector('h2, h3, h4, h5, h6');
  if (subH && subH !== h1) textElements.push(subH);

  // Add first paragraph after heading(s) (lead/summary)
  // Find any p that is not in aside/sidebar and comes after the heading
  let foundP = null;
  const allPs = mainContent.querySelectorAll('p');
  for (const p of allPs) {
    // skip paragraphs inside <aside> (sidebar)
    let parent = p.parentElement;
    let inAside = false;
    while (parent) {
      if (parent.tagName.toLowerCase() === 'aside') {
        inAside = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (!inAside) {
      foundP = p;
      break;
    }
  }
  if (foundP) textElements.push(foundP);

  // Compose the block table
  const cells = [
    ['Hero (hero19)'],
    [heroImage],
    [textElements]
  ];

  // Replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
