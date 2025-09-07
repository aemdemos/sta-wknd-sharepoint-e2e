/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only operate on the main magazine container
  if (!element || !element.classList.contains('container')) return;

  // Helper to extract teaser card info
  function extractTeaserCard(teaser) {
    // Image: find .cmp-teaser__image img
    const imgDiv = teaser.querySelector('.cmp-teaser__image');
    let img = null;
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }
    // Text content
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    let textContent = [];
    if (contentDiv) {
      // Featured label (optional)
      const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
      if (pretitle) textContent.push(pretitle);
      // Title
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) textContent.push(title);
      // Description
      const desc = contentDiv.querySelector('.cmp-teaser__description');
      if (desc) textContent.push(desc);
      // CTA
      const action = contentDiv.querySelector('.cmp-teaser__action-container');
      if (action) {
        // If action contains a link, use it; else, wrap text in span
        const link = action.querySelector('a');
        if (link) {
          textContent.push(link);
        } else if (action.textContent && action.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = action.textContent.trim();
          textContent.push(span);
        }
      }
    }
    return [img, textContent];
  }

  // Helper to extract image-list card info
  function extractImageListCard(li) {
    // Image: .cmp-image-list__item-image img
    const imgDiv = li.querySelector('.cmp-image-list__item-image');
    let img = null;
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }
    // Text content: title, description
    const article = li.querySelector('.cmp-image-list__item-content');
    let textContent = [];
    if (article) {
      // Title
      const titleLink = article.querySelector('.cmp-image-list__item-title-link');
      if (titleLink) {
        const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
        if (titleSpan) textContent.push(titleSpan);
      }
      // Description
      const descSpan = article.querySelector('.cmp-image-list__item-description');
      if (descSpan) textContent.push(descSpan);
    }
    return [img, textContent];
  }

  // Helper to extract secure teaser card info
  function extractSecureTeaserCard(teaser) {
    // Image: .cmp-teaser__image img
    const imgDiv = teaser.querySelector('.cmp-teaser__image');
    let img = null;
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }
    // Text content
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    let textContent = [];
    if (contentDiv) {
      // Title
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) textContent.push(title);
      // Description
      const desc = contentDiv.querySelector('.cmp-teaser__description');
      if (desc) textContent.push(desc);
      // CTA
      const action = contentDiv.querySelector('.cmp-teaser__action-container');
      if (action) {
        // If action contains a link, use it; else, wrap text in span
        const link = action.querySelector('a');
        if (link) {
          textContent.push(link);
        } else if (action.textContent && action.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = action.textContent.trim();
          textContent.push(span);
        }
      }
    }
    return [img, textContent];
  }

  // Find all relevant card blocks in order
  const cells = [];
  // Header row
  const headerRow = ['Cards (cards4)'];
  cells.push(headerRow);

  // 1. Featured Article Card (teaser cmp-teaser--featured)
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured');
  if (featuredTeaser) {
    cells.push(extractTeaserCard(featuredTeaser));
  }

  // 2. All Articles Cards (image-list)
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach(li => {
      cells.push(extractImageListCard(li));
    });
  }

  // 3. Members Only Cards (teaser cmp-teaser--list cmp-teaser--secure)
  // Find all teasers with cmp-teaser--list and cmp-teaser--secure
  element.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure').forEach(teaser => {
    cells.push(extractSecureTeaserCard(teaser));
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
