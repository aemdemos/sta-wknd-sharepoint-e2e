/* global WebImporter */
export default function parse(element, { document }) {
  // Find main cmp-teaser inside the given element
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the content and image containers
  const content = teaser.querySelector('.cmp-teaser__content');
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');

  // Compose the right column using EXISTING (not clone) nodes
  const rightColContent = [];
  // Optional pretitle
  const pretitle = content?.querySelector('.cmp-teaser__pretitle');
  if (pretitle) rightColContent.push(pretitle);
  // Title
  const title = content?.querySelector('.cmp-teaser__title');
  if (title) rightColContent.push(title);
  // Description
  const desc = content?.querySelector('.cmp-teaser__description');
  if (desc) rightColContent.push(desc);
  // Action link(s)
  const actions = content?.querySelector('.cmp-teaser__action-container');
  if (actions) {
    const actionLinks = actions.querySelectorAll('a');
    actionLinks.forEach((a) => {
      rightColContent.push(a);
    });
  }

  // Compose the left column using the EXISTING image element
  let leftColContent = null;
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) leftColContent = img;
  }

  // If either column is empty, use an empty string as fallback
  const row = [leftColContent || '', rightColContent.length ? rightColContent : ''];

  // Create the table with a single cell header row, then the columns row
  const cells = [
    ['Columns (columns5)'], // header row as a single cell
    row                    // content row with two cells
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
