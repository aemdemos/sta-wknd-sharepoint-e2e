/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a teaser block
  function extractTeaserCard(teaserDiv, pretitle) {
    // Image (mandatory)
    const imageContainer = teaserDiv.querySelector('.cmp-teaser__image .cmp-image__image');
    let imageEl = imageContainer;
    if (!imageEl) {
      const fallback = teaserDiv.querySelector('.cmp-teaser__image img');
      if (fallback) imageEl = fallback;
    }
    // Text content (mandatory)
    const contentDiv = teaserDiv.querySelector('.cmp-teaser__content');
    let textContent = [];
    if (contentDiv) {
      // Pretitle (if provided)
      if (pretitle) {
        const pre = document.createElement('div');
        pre.textContent = pretitle;
        pre.style.fontWeight = 'bold';
        textContent.push(pre);
      }
      // Title
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) {
        const h = document.createElement('h2');
        h.textContent = title.textContent.trim();
        textContent.push(h);
      }
      // Description
      const desc = contentDiv.querySelector('.cmp-teaser__description');
      if (desc) textContent.push(desc);
      // CTA (if present)
      const cta = contentDiv.querySelector('.cmp-teaser__action-link');
      if (cta) textContent.push(cta);
      else {
        const ctaText = contentDiv.querySelector('.cmp-teaser__action-container');
        if (ctaText && ctaText.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = ctaText.textContent.trim();
          textContent.push(span);
        }
      }
    }
    return [imageEl, textContent];
  }

  // Helper to extract card content from image-list block
  function extractImageListCard(li) {
    const article = li.querySelector('.cmp-image-list__item-content');
    let imageEl = article.querySelector('.cmp-image__image');
    let textContent = [];
    // Title (linked)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const h = document.createElement('h2');
      h.appendChild(titleLink.cloneNode(true));
      textContent.push(h);
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) textContent.push(desc);
    return [imageEl, textContent];
  }

  const cells = [];
  // Header row
  cells.push(['Cards (cards4)']);

  // Section headings
  // Magazine
  const magazineTitle = element.querySelector('.cmp-title h1');
  if (magazineTitle) {
    const h = document.createElement('h1');
    h.textContent = magazineTitle.textContent.trim();
    cells.push([null, [h]]);
  }

  // Featured Article (hero card)
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  if (featuredTeaser) {
    const pretitle = featuredTeaser.querySelector('.cmp-teaser__pretitle')?.textContent.trim();
    cells.push(extractTeaserCard(featuredTeaser, pretitle));
  }

  // All Articles heading
  const allArticlesTitle = Array.from(element.querySelectorAll('.title.cmp-title--underline .cmp-title__text')).find(
    el => el.textContent.trim().toLowerCase() === 'all articles'
  );
  if (allArticlesTitle) {
    const h = document.createElement('h2');
    h.textContent = allArticlesTitle.textContent.trim();
    cells.push([null, [h]]);
  }

  // All Articles (image-list cards)
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll('.cmp-image-list__item').forEach(li => {
      cells.push(extractImageListCard(li));
    });
  }

  // Members Only heading
  const membersTitle = Array.from(element.querySelectorAll('.title.cmp-title--underline .cmp-title__text')).find(
    el => el.textContent.trim().toLowerCase() === 'members only'
  );
  if (membersTitle) {
    const h = document.createElement('h2');
    h.textContent = membersTitle.textContent.trim();
    cells.push([null, [h]]);
    let next = membersTitle.parentElement.parentElement.nextElementSibling;
    let foundPrompt = false;
    while (next) {
      if (next.classList.contains('text') && !foundPrompt) {
        // Add sign-in prompt as a card (with no image)
        const textBlock = next.querySelector('.cmp-text');
        if (textBlock) {
          cells.push([null, [textBlock]]);
          foundPrompt = true;
        }
      } else if (next.classList.contains('teaser')) {
        const teaser = next.querySelector('.cmp-teaser');
        if (teaser) {
          cells.push(extractTeaserCard(teaser));
        }
      }
      next = next.nextElementSibling;
      if (!next || (!next.classList.contains('teaser') && !next.classList.contains('separator') && !next.classList.contains('text'))) {
        break;
      }
    }
  }

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
