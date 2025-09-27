/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the 'Members Only' section
  function extractMemberCards(root) {
    // Find the 'Members Only' title
    const memberTitle = Array.from(root.querySelectorAll('.cmp-title__text'))
      .find((el) => el.textContent.trim() === 'Members Only');
    if (!memberTitle) return [];
    // Find the parent grid
    let grid = memberTitle.closest('.aem-Grid');
    if (!grid) grid = root;
    // Start after the 'Members Only' title
    let foundTitle = false;
    const memberCards = [];
    for (const child of grid.children) {
      if (!foundTitle && child.contains(memberTitle)) {
        foundTitle = true;
        continue;
      }
      if (foundTitle) {
        // Only process .teaser blocks
        if (child.classList.contains('teaser')) {
          const cmpTeaser = child.querySelector('.cmp-teaser');
          if (cmpTeaser) memberCards.push(cmpTeaser);
        }
      }
    }
    return memberCards;
  }

  // Helper to extract image, title, description, CTA from a .cmp-teaser
  function parseTeaserCard(teaser) {
    // Image: .cmp-teaser__image img
    const imageDiv = teaser.querySelector('.cmp-teaser__image');
    let img = imageDiv ? imageDiv.querySelector('img') : null;
    // Title: .cmp-teaser__title (h2)
    let title = teaser.querySelector('.cmp-teaser__title');
    // Description: .cmp-teaser__description
    let desc = teaser.querySelector('.cmp-teaser__description');
    // CTA: .cmp-teaser__action-link or text from .cmp-teaser__action-container
    let cta = teaser.querySelector('.cmp-teaser__action-link');
    if (!cta) {
      const actionContainer = teaser.querySelector('.cmp-teaser__action-container');
      if (actionContainer && actionContainer.querySelector('a')) {
        cta = actionContainer.querySelector('a');
      }
    }
    // Compose text cell
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title.cloneNode(true));
    if (desc) {
      // If description is a <div> or <p>, clone all children to preserve formatting
      if (desc.children.length) {
        Array.from(desc.childNodes).forEach((node) => textCell.appendChild(node.cloneNode(true)));
      } else {
        textCell.appendChild(desc.cloneNode(true));
      }
    }
    if (cta) textCell.appendChild(cta.cloneNode(true));
    else {
      const actionContainer = teaser.querySelector('.cmp-teaser__action-container');
      if (actionContainer && actionContainer.textContent.trim()) {
        // Add as plain text if not a link
        const span = document.createElement('span');
        span.textContent = actionContainer.textContent.trim();
        textCell.appendChild(span);
      }
    }
    return [img ? img.cloneNode(true) : '', textCell.childNodes.length ? textCell : ''];
  }

  // Extract member cards
  const memberCards = extractMemberCards(element);
  if (!memberCards.length) return;

  // Build table rows
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];
  memberCards.forEach((teaser) => {
    const [img, textCell] = parseTeaserCard(teaser);
    rows.push([
      img || '',
      textCell || '',
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
