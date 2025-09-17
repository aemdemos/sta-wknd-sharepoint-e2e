/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only operate if element is a magazine main container
  if (!element || !element.classList.contains('container')) return;

  const headerRow = ['Cards (cards4)'];
  const rows = [];

  // --- Featured Article Card ---
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured');
  if (featuredTeaser) {
    // Image (first column)
    const featuredImgWrap = featuredTeaser.querySelector('.cmp-teaser__image');
    let featuredImg = featuredImgWrap && featuredImgWrap.querySelector('img');
    // Text (second column)
    const featuredContent = featuredTeaser.querySelector('.cmp-teaser__content');
    let textContent = [];
    if (featuredContent) {
      // Pretitle
      const pretitle = featuredContent.querySelector('.cmp-teaser__pretitle');
      if (pretitle) textContent.push(pretitle);
      // Title
      const title = featuredContent.querySelector('.cmp-teaser__title');
      if (title) textContent.push(title);
      // Description
      const desc = featuredContent.querySelector('.cmp-teaser__description');
      if (desc) textContent.push(desc);
      // CTA
      const cta = featuredContent.querySelector('.cmp-teaser__action-link');
      if (cta) textContent.push(cta);
    }
    rows.push([
      featuredImg ? featuredImg : '',
      textContent.length ? textContent : ''
    ]);
  }

  // --- All Articles Cards ---
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
      const article = li.querySelector('article.cmp-image-list__item-content');
      if (!article) return;
      // Image (first column)
      let img = article.querySelector('.cmp-image-list__item-image img');
      // Text (second column)
      let textContent = [];
      // Title (as heading)
      const titleLink = article.querySelector('.cmp-image-list__item-title-link');
      if (titleLink) {
        // Use span as heading
        const span = titleLink.querySelector('.cmp-image-list__item-title');
        if (span) textContent.push(span);
      }
      // Description
      const desc = article.querySelector('.cmp-image-list__item-description');
      if (desc) textContent.push(desc);
      // CTA: Use title link if present
      if (titleLink) textContent.push(titleLink);
      rows.push([
        img ? img : '',
        textContent.length ? textContent : ''
      ]);
    });
  }

  // --- Members Only Cards (secure teasers) ---
  // Find all .teaser.cmp-teaser--list.cmp-teaser--secure
  element.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure').forEach((teaser) => {
    // Image (first column)
    const imgWrap = teaser.querySelector('.cmp-teaser__image');
    let img = imgWrap && imgWrap.querySelector('img');
    // Text (second column)
    const content = teaser.querySelector('.cmp-teaser__content');
    let textContent = [];
    if (content) {
      // Title
      const title = content.querySelector('.cmp-teaser__title');
      if (title) textContent.push(title);
      // Description
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) textContent.push(desc);
      // CTA (may just be text)
      const cta = content.querySelector('.cmp-teaser__action-container');
      if (cta) textContent.push(cta);
    }
    rows.push([
      img ? img : '',
      textContent.length ? textContent : ''
    ]);
  });

  // Build table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
