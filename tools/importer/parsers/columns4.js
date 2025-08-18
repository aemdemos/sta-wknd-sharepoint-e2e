/* global WebImporter */
export default function parse(element, { document }) {
  // Main grid wrapper
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const children = Array.from(grid.children);

  // Helper: extract and remove first matching child
  function extract(predicate) {
    const idx = children.findIndex(predicate);
    if (idx !== -1) return children.splice(idx, 1)[0];
    return undefined;
  }

  // Group 1: Magazine title + Featured Article teaser
  const col1 = [];
  const magazineTitleDiv = extract(ch => ch.querySelector('h1.cmp-title__text'));
  if (magazineTitleDiv) col1.push(magazineTitleDiv);
  const featuredTeaserDiv = extract(ch => ch.classList.contains('cmp-teaser--featured'));
  if (featuredTeaserDiv) col1.push(featuredTeaserDiv);

  // Group 2: All Articles title + image-list
  const col2 = [];
  const allArticlesTitleDiv = extract(ch => ch.querySelector('h2.cmp-title__text') && ch.textContent.includes('All Articles'));
  if (allArticlesTitleDiv) col2.push(allArticlesTitleDiv);
  const imageListDiv = extract(ch => ch.classList.contains('image-list'));
  if (imageListDiv) col2.push(imageListDiv);

  // Group 3: Members Only title + sign-in text
  const col3 = [];
  const membersOnlyTitleDiv = extract(ch => ch.querySelector('h2.cmp-title__text') && ch.textContent.includes('Members Only'));
  if (membersOnlyTitleDiv) col3.push(membersOnlyTitleDiv);
  const signInTextDiv = extract(ch => ch.classList.contains('cmp-text'));
  if (signInTextDiv) col3.push(signInTextDiv);

  // Group 4: All secure teasers (may be multiple)
  const col4 = children.filter(ch => ch.classList.contains('cmp-teaser--secure'));

  // Final block: each group is one column (array of elements)
  const headerRow = ['Columns (columns4)'];
  const columnsRow = [col1, col2, col3, col4];

  const table = WebImporter.DOMUtils.createTable([headerRow, columnsRow], document);
  element.replaceWith(table);
}
