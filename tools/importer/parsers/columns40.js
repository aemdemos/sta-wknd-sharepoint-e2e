/* global WebImporter */
export default function parse(element, { document }) {
  // Get direct children for layout
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find content and image containers
  let contentDiv = null;
  let imageDiv = null;
  children.forEach((child) => {
    if (child.classList.contains('cmp-teaser__content')) {
      contentDiv = child;
    } else if (child.classList.contains('cmp-teaser__image')) {
      imageDiv = child;
    }
  });

  // Defensive: fallback if structure changes
  if (!contentDiv && !imageDiv) {
    contentDiv = element.querySelector('.cmp-teaser__content');
    imageDiv = element.querySelector('.cmp-teaser__image');
  }

  // Compose image cell
  let imageCell = [];
  if (imageDiv) {
    const imgEl = imageDiv.querySelector('img');
    if (imgEl) imageCell = [imgEl];
  }

  // Compose content cell
  const contentCell = [];
  if (contentDiv) {
    // Get pretitle, title, description, CTA
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    const title = contentDiv.querySelector('.cmp-teaser__title');
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    const action = contentDiv.querySelector('.cmp-teaser__action-link');

    if (pretitle) contentCell.push(pretitle);
    if (title) contentCell.push(title);
    if (desc) contentCell.push(desc);
    if (action) contentCell.push(action);
  }

  // Table structure: header, then two columns (image, content)
  const headerRow = ['Columns (columns40)'];
  const contentRow = [imageCell, contentCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
