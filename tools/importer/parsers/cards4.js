/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the hero/featured card
  function extractFeaturedCard(teaserDiv) {
    let img = teaserDiv.querySelector('.cmp-teaser__image img');
    let pretitle = teaserDiv.querySelector('.cmp-teaser__pretitle');
    let titleEl = teaserDiv.querySelector('.cmp-teaser__title');
    let title = titleEl ? document.createElement('h3') : null;
    if (title && titleEl) {
      title.textContent = titleEl.textContent.trim();
    }
    let descDiv = teaserDiv.querySelector('.cmp-teaser__description');
    let ctaLink = teaserDiv.querySelector('.cmp-teaser__action-link');
    const textCell = [];
    if (pretitle) {
      const strong = document.createElement('strong');
      strong.textContent = pretitle.textContent;
      textCell.push(strong);
    }
    if (title) textCell.push(title);
    if (descDiv) textCell.push(descDiv);
    if (ctaLink) textCell.push(ctaLink);
    return [img, textCell];
  }

  // Helper to extract card content from a cmp-image-list__item
  function extractImageListCard(li) {
    const article = li.querySelector('.cmp-image-list__item-content');
    if (!article) return null;
    let img = article.querySelector('.cmp-image-list__item-image img');
    let titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    let title = titleSpan ? document.createElement('h3') : null;
    if (title && titleSpan) {
      title.textContent = titleSpan.textContent;
    }
    let descSpan = article.querySelector('.cmp-image-list__item-description');
    const textCell = [];
    if (titleLink && title) {
      const link = document.createElement('a');
      link.href = titleLink.getAttribute('href');
      link.textContent = title.textContent;
      title.replaceWith(link);
      textCell.push(link);
    } else if (title) {
      textCell.push(title);
    }
    if (descSpan) textCell.push(descSpan);
    return [img, textCell];
  }

  // Helper to extract teaser card content (members-only)
  function extractTeaserCard(teaserDiv) {
    let img = teaserDiv.querySelector('.cmp-teaser__image img');
    let titleEl = teaserDiv.querySelector('.cmp-teaser__title');
    let title = titleEl ? document.createElement('h3') : null;
    if (title && titleEl) {
      title.textContent = titleEl.textContent.trim();
    }
    let descDiv = teaserDiv.querySelector('.cmp-teaser__description');
    let ctaDiv = teaserDiv.querySelector('.cmp-teaser__action-container');
    let ctaText = ctaDiv ? ctaDiv.textContent.trim() : '';
    const textCell = [];
    // Add lock icon for members-only cards
    const lock = document.createElement('span');
    lock.textContent = '🔒 ';
    textCell.push(lock);
    if (title) textCell.push(title);
    if (descDiv) textCell.push(descDiv);
    if (ctaText) {
      const span = document.createElement('span');
      span.textContent = ctaText;
      span.style.opacity = '0.5';
      textCell.push(span);
    }
    return [img, textCell];
  }

  // Section headings and sign-in prompt
  const magazineTitle = element.querySelector('.title .cmp-title__text');
  const allArticlesTitle = element.querySelector('.title.cmp-title--underline .cmp-title__text');
  const membersTitle = element.querySelectorAll('.title.cmp-title--underline')[1]?.querySelector('.cmp-title__text');
  const signInPrompt = element.querySelector('.text .cmp-text p');

  // Find the featured/hero card
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  // Find the cards parent container (image-list)
  const imageList = element.querySelector('.image-list .cmp-image-list');
  // Find teaser cards (members-only section)
  const teaserCards = Array.from(element.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure .cmp-teaser'));

  // Compose rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards4)']);

  // Section heading: Magazine
  if (magazineTitle) rows.push([magazineTitle.textContent]);

  // Featured card
  if (featuredTeaser) {
    const cardRow = extractFeaturedCard(featuredTeaser);
    if (cardRow) rows.push(cardRow);
  }

  // Section heading: All Articles
  if (allArticlesTitle) rows.push([allArticlesTitle.textContent]);

  // Parse image-list cards
  if (imageList) {
    Array.from(imageList.querySelectorAll('.cmp-image-list__item')).forEach(li => {
      const cardRow = extractImageListCard(li);
      if (cardRow) rows.push(cardRow);
    });
  }

  // Section heading: Members Only
  if (membersTitle) rows.push([membersTitle.textContent]);
  // Sign-in prompt
  if (signInPrompt) rows.push([signInPrompt.textContent]);

  // Parse teaser cards (members-only)
  teaserCards.forEach(teaserDiv => {
    const cardRow = extractTeaserCard(teaserDiv);
    if (cardRow) rows.push(cardRow);
  });

  // Replace element with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
