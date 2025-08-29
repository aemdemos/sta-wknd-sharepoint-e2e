/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all text content from a node (including nested tags)
  function getFullTextContent(node) {
    if (!node) return '';
    if (node.nodeType === 3) return node.textContent;
    let text = '';
    node.childNodes.forEach((child) => {
      text += getFullTextContent(child);
    });
    return text.trim();
  }

  // Helper to extract image-list cards
  function extractImageListCards(imageListUL) {
    const rows = [];
    imageListUL.querySelectorAll(':scope > li').forEach((li) => {
      // Get image
      const imgEl = li.querySelector('img');
      // Compose text cell: title, description, and CTA
      const textCell = [];
      const titleEl = li.querySelector('.cmp-image-list__item-title');
      if (titleEl) {
        const heading = document.createElement('strong');
        heading.textContent = getFullTextContent(titleEl);
        textCell.push(heading);
      }
      const descEl = li.querySelector('.cmp-image-list__item-description');
      if (descEl && descEl.textContent.trim()) {
        textCell.push(document.createElement('br'));
        textCell.push(getFullTextContent(descEl));
      }
      const ctaEl = li.querySelector('.cmp-image-list__item-title-link');
      // Only add CTA link if it's not duplicate of the title, and is visible in source
      if (ctaEl && ctaEl.href && ctaEl.textContent.trim()) {
        textCell.push(document.createElement('br'));
        const ctaLink = document.createElement('a');
        ctaLink.href = ctaEl.href;
        ctaLink.textContent = getFullTextContent(ctaEl);
        textCell.push(ctaLink);
      }
      rows.push([imgEl, textCell]);
    });
    return rows;
  }

  // Helper to extract teaser (secure) cards
  function extractTeaserCards(teaserDivs) {
    const rows = [];
    teaserDivs.forEach((teaserDiv) => {
      const imgEl = teaserDiv.querySelector('img');
      const textCell = [];
      const titleEl = teaserDiv.querySelector('.cmp-teaser__title');
      if (titleEl && titleEl.textContent.trim()) {
        const heading = document.createElement('strong');
        heading.textContent = getFullTextContent(titleEl);
        textCell.push(heading);
      }
      const descEl = teaserDiv.querySelector('.cmp-teaser__description');
      if (descEl && descEl.textContent.trim()) {
        textCell.push(document.createElement('br'));
        // Preserve paragraphs if present
        if (descEl.querySelector('p')) {
          descEl.querySelectorAll('p').forEach((p, idx, arr) => {
            textCell.push(getFullTextContent(p));
            if (idx < arr.length - 1) textCell.push(document.createElement('br'));
          });
        } else {
          textCell.push(getFullTextContent(descEl));
        }
      }
      const ctaEl = teaserDiv.querySelector('.cmp-teaser__action-container');
      if (ctaEl && ctaEl.textContent.trim()) {
        textCell.push(document.createElement('br'));
        textCell.push(getFullTextContent(ctaEl));
      }
      rows.push([imgEl, textCell]);
    });
    return rows;
  }

  // Find the "All Articles" image-list block
  const imageList = element.querySelector('.image-list .cmp-image-list');
  let cards = [];
  if (imageList) {
    cards = extractImageListCards(imageList);
  }

  // Find "Members Only" teaser cards
  const teaserCards = Array.from(element.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure'));
  if (teaserCards.length > 0) {
    cards = cards.concat(extractTeaserCards(teaserCards));
  }

  // Compose header row as a single cell spanning two columns
  const headerRow = ['Cards (cards2)'];

  // Table: header row (single cell), then each card row (two cells)
  const cells = [headerRow, ...cards];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block table
  element.replaceWith(block);
}
