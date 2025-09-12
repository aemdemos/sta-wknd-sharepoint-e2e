/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'Members Only' section title
  const titles = Array.from(element.querySelectorAll('.cmp-title'));
  let membersTitleIdx = -1;
  for (let i = 0; i < titles.length; i++) {
    const h2 = titles[i].querySelector('h2');
    if (h2 && h2.textContent.trim().toLowerCase() === 'members only') {
      membersTitleIdx = i;
      break;
    }
  }
  if (membersTitleIdx === -1) return;
  const membersTitle = titles[membersTitleIdx];

  // Find the two teaser cards after the Members Only section
  // They are .teaser.cmp-teaser--list.cmp-teaser--secure
  // Find the parent grid container
  let grid = membersTitle.parentElement;
  while (grid && !grid.classList.contains('aem-Grid')) {
    grid = grid.parentElement;
  }
  if (!grid) return;

  // Find all teasers after the Members Only title
  const allTeasers = Array.from(grid.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure'));
  // Defensive: Only keep teasers that are after the Members Only title in the DOM
  const membersTitleIndex = Array.from(grid.children).indexOf(membersTitle.parentElement);
  const teasers = allTeasers.filter(teaser => {
    const idx = Array.from(grid.children).indexOf(teaser);
    return idx > membersTitleIndex;
  });
  if (teasers.length === 0) return;

  // Build the cards table
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  teasers.forEach(teaser => {
    // Get image (first column)
    let imageDiv = teaser.querySelector('.cmp-teaser__image');
    let imageEl = null;
    if (imageDiv) {
      imageEl = imageDiv.querySelector('img');
    }
    // Defensive: fallback to the image container if img not found
    if (!imageEl && imageDiv) imageEl = imageDiv;

    // Get text content (second column)
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    let textContent = [];
    if (contentDiv) {
      // Title
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) textContent.push(title);
      // Description
      const desc = contentDiv.querySelector('.cmp-teaser__description');
      if (desc) textContent.push(desc);
      // CTA (if present)
      const action = contentDiv.querySelector('.cmp-teaser__action-container');
      if (action) textContent.push(action);
    }
    if (textContent.length === 1) textContent = textContent[0];
    rows.push([
      imageEl || '',
      textContent || ''
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the first teaser with the table, remove the rest
  teasers[0].replaceWith(table);
  for (let i = 1; i < teasers.length; i++) {
    teasers[i].remove();
  }
}
