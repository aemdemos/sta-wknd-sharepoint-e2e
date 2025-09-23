/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the image-list block
  function extractImageListCards(imageListEl) {
    const cards = [];
    const items = imageListEl.querySelectorAll(':scope ul.cmp-image-list > li.cmp-image-list__item');
    items.forEach((li) => {
      // Image
      const img = li.querySelector('.cmp-image-list__item-image img');
      // Title (as heading)
      const titleLink = li.querySelector('.cmp-image-list__item-title-link');
      let titleSpan = titleLink && titleLink.querySelector('.cmp-image-list__item-title');
      let titleText = titleSpan ? titleSpan.textContent : '';
      let titleEl = document.createElement('strong');
      titleEl.textContent = titleText;
      // Description
      const descSpan = li.querySelector('.cmp-image-list__item-description');
      // Compose text cell
      const textCell = document.createElement('div');
      if (titleText) {
        textCell.appendChild(titleEl);
      }
      if (descSpan) {
        textCell.appendChild(document.createElement('br'));
        // Clone the description node to preserve text
        textCell.appendChild(descSpan.cloneNode(true));
      }
      cards.push([img, textCell]);
    });
    return cards;
  }

  // Helper to extract cards from teaser blocks
  function extractTeaserCards(teaserEls) {
    const cards = [];
    teaserEls.forEach((teaser) => {
      // Image
      const img = teaser.querySelector('.cmp-teaser__image img');
      // Title
      const titleEl = teaser.querySelector('.cmp-teaser__title');
      // Description
      let descEl = teaser.querySelector('.cmp-teaser__description');
      // CTA
      let ctaContainer = teaser.querySelector('.cmp-teaser__action-container');
      let ctaText = ctaContainer ? ctaContainer.textContent.trim() : '';
      // Compose text cell
      const textCell = document.createElement('div');
      if (titleEl) {
        let strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        textCell.appendChild(strong);
      }
      if (descEl) {
        textCell.appendChild(document.createElement('br'));
        // Clone the description node to preserve text
        textCell.appendChild(descEl.cloneNode(true));
      }
      if (ctaText && ctaText.toLowerCase().includes('read more')) {
        textCell.appendChild(document.createElement('br'));
        let cta = document.createElement('span');
        cta.textContent = ctaText;
        textCell.appendChild(cta);
      }
      cards.push([img, textCell]);
    });
    return cards;
  }

  // Find the image-list block
  const imageListEl = element.querySelector('.image-list.list');
  // Find all teasers that are direct children (for Members Only)
  const teaserEls = Array.from(element.querySelectorAll(':scope > div.teaser'));

  // Compose table rows
  const headerRow = ['Cards (cards4)'];
  let rows = [headerRow];

  // Add All Articles cards
  if (imageListEl) {
    rows = rows.concat(extractImageListCards(imageListEl));
  }
  // Add Members Only cards
  if (teaserEls.length) {
    rows = rows.concat(extractTeaserCards(teaserEls));
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
