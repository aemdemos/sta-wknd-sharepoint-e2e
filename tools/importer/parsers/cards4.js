/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text from a card item
  function extractCardFromImageListItem(li) {
    const article = li.querySelector('.cmp-image-list__item-content');
    // Image
    let img = article.querySelector('.cmp-image-list__item-image img');
    // Title (as heading)
    let titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    let titleText = titleSpan ? titleSpan.textContent.trim() : '';
    let titleEl = null;
    if (titleText) {
      titleEl = document.createElement('h3');
      titleEl.textContent = titleText;
    }
    // Description
    let descSpan = article.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan && descSpan.textContent.trim()) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent.trim();
    }
    // CTA (link)
    let ctaLink = titleLink;
    let ctaEl = null;
    if (ctaLink && ctaLink.href) {
      ctaEl = document.createElement('a');
      ctaEl.href = ctaLink.href;
      ctaEl.textContent = 'Read More';
    }
    // Compose text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);
    if (ctaEl) textCell.push(ctaEl);
    return [img, textCell];
  }

  // Helper to extract image and text from a teaser block
  function extractCardFromTeaser(teaserDiv) {
    // Image
    let img = teaserDiv.querySelector('.cmp-teaser__image img');
    // Title
    let titleEl = teaserDiv.querySelector('.cmp-teaser__title');
    let titleText = titleEl ? titleEl.textContent.trim() : '';
    let headingEl = null;
    if (titleText) {
      headingEl = document.createElement('h3');
      headingEl.textContent = titleText;
    }
    // Description
    let descDiv = teaserDiv.querySelector('.cmp-teaser__description');
    let descEl = null;
    if (descDiv) {
      // If description is a <p>, use it, else wrap in <p>
      if (descDiv.querySelector('p')) {
        descEl = descDiv.querySelector('p');
      } else {
        descEl = document.createElement('p');
        descEl.textContent = descDiv.textContent.trim();
      }
    }
    // CTA
    let ctaLink = teaserDiv.querySelector('.cmp-teaser__action-link');
    let ctaEl = null;
    if (ctaLink) {
      ctaEl = ctaLink;
    } else {
      // Sometimes CTA is just text
      let ctaContainer = teaserDiv.querySelector('.cmp-teaser__action-container');
      if (ctaContainer && ctaContainer.textContent.trim()) {
        ctaEl = document.createElement('span');
        ctaEl.textContent = ctaContainer.textContent.trim();
      }
    }
    // Compose text cell
    const textCell = [];
    if (headingEl) textCell.push(headingEl);
    if (descEl) textCell.push(descEl);
    if (ctaEl) textCell.push(ctaEl);
    return [img, textCell];
  }

  // Find the relevant blocks
  const cards = [];

  // Featured Article (teaser)
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  if (featuredTeaser) {
    cards.push(extractCardFromTeaser(featuredTeaser));
  }

  // Image List (All Articles)
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach(li => {
      cards.push(extractCardFromImageListItem(li));
    });
  }

  // Members Only teasers
  const secureTeasers = element.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure .cmp-teaser');
  secureTeasers.forEach(teaserDiv => {
    cards.push(extractCardFromTeaser(teaserDiv));
  });

  // Compose table
  const headerRow = ['Cards (cards4)'];
  const tableRows = cards.map(card => card);
  const cells = [headerRow, ...tableRows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
