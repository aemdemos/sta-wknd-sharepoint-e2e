/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) block parser
  // 1. Table header
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Helper to extract card content from the featured teaser
  function extractFeaturedCard(teaser) {
    if (!teaser) return null;
    // Image
    const imgWrap = teaser.querySelector('.cmp-teaser__image img');
    // Text
    const content = teaser.querySelector('.cmp-teaser__content');
    if (!content) return null;
    // Pretitle (optional)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    // Title
    const title = content.querySelector('.cmp-teaser__title');
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    // CTA
    let cta = content.querySelector('.cmp-teaser__action-link');
    if (!cta) {
      // Fallback: if CTA is just text
      cta = content.querySelector('.cmp-teaser__action-container');
      if (cta && cta.querySelector('a')) cta = cta.querySelector('a');
    }
    // Compose text cell
    const textCell = document.createElement('div');
    if (pretitle) textCell.appendChild(pretitle.cloneNode(true));
    if (title) textCell.appendChild(title.cloneNode(true));
    if (desc) textCell.appendChild(desc.cloneNode(true));
    if (cta) textCell.appendChild(cta.cloneNode(true));
    return [imgWrap, textCell];
  }

  // Helper to extract card content from image-list items
  function extractImageListCard(li) {
    const img = li.querySelector('img');
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    const desc = li.querySelector('.cmp-image-list__item-description');
    // Compose text cell
    const textCell = document.createElement('div');
    if (titleLink && titleSpan) {
      // Wrap title in link
      const link = document.createElement('a');
      link.href = titleLink.getAttribute('href');
      link.appendChild(titleSpan.cloneNode(true));
      textCell.appendChild(link);
    } else if (titleSpan) {
      textCell.appendChild(titleSpan.cloneNode(true));
    }
    if (desc) textCell.appendChild(desc.cloneNode(true));
    return [img, textCell];
  }

  // Helper to extract card content from teaser list (Members Only)
  function extractTeaserCard(teaser) {
    if (!teaser) return null;
    const img = teaser.querySelector('.cmp-teaser__image img');
    const content = teaser.querySelector('.cmp-teaser__content');
    if (!content) return null;
    const title = content.querySelector('.cmp-teaser__title');
    const desc = content.querySelector('.cmp-teaser__description');
    // CTA: sometimes just text, sometimes a link
    let cta = content.querySelector('.cmp-teaser__action-link');
    if (!cta) {
      cta = content.querySelector('.cmp-teaser__action-container');
      if (cta && cta.querySelector('a')) cta = cta.querySelector('a');
    }
    // Compose text cell
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title.cloneNode(true));
    if (desc) textCell.appendChild(desc.cloneNode(true));
    if (cta) textCell.appendChild(cta.cloneNode(true));
    return [img, textCell];
  }

  // --- 1. Featured Article Card ---
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  const featuredCard = extractFeaturedCard(featuredTeaser);
  if (featuredCard && featuredCard[0] && featuredCard[1]) {
    rows.push(featuredCard);
  }

  // --- 2. All Articles Cards ---
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
      const card = extractImageListCard(li);
      if (card && card[0] && card[1]) rows.push(card);
    });
  }

  // --- 3. Members Only Cards ---
  // Find all teaser cards in grid after separator
  let foundSeparator = false;
  element.querySelectorAll(':scope > div').forEach((div) => {
    if (div.classList.contains('separator')) foundSeparator = true;
    if (foundSeparator && div.classList.contains('teaser')) {
      const teaserCard = extractTeaserCard(div.querySelector('.cmp-teaser'));
      if (teaserCard && teaserCard[0] && teaserCard[1]) rows.push(teaserCard);
    }
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
