/* global WebImporter */
export default function parse(element, { document }) {
  const rows = [];
  // Header row
  rows.push(['Cards (cards4)']);

  // Featured Card
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  if (featuredTeaser) {
    const imgDiv = featuredTeaser.querySelector('.cmp-teaser__image img');
    const contentDiv = featuredTeaser.querySelector('.cmp-teaser__content');
    let textContent = [];
    if (contentDiv) {
      let pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
      if (pretitle) textContent.push(pretitle);
      let title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) textContent.push(title);
      let desc = contentDiv.querySelector('.cmp-teaser__description');
      if (desc) textContent.push(desc);
      let cta = contentDiv.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, .cmp-teaser__action-container');
      if (cta && cta.textContent.trim()) textContent.push(cta);
    }
    rows.push([
      imgDiv,
      textContent
    ]);
  }

  // Article Cards
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (imageList) {
    const items = imageList.querySelectorAll('.cmp-image-list__item');
    items.forEach(item => {
      const img = item.querySelector('img');
      const content = item.querySelector('.cmp-image-list__item-content');
      let textContent = [];
      let title = content && content.querySelector('.cmp-image-list__item-title');
      if (title) textContent.push(title);
      let desc = content && content.querySelector('.cmp-image-list__item-description');
      if (desc) textContent.push(desc);
      if (img && textContent.length > 0) {
        rows.push([
          img,
          textContent
        ]);
      }
    });
  }

  // Member Cards
  const memberTeasers = element.querySelectorAll('.teaser.cmp-teaser--list');
  memberTeasers.forEach(teaser => {
    const img = teaser.querySelector('.cmp-teaser__image img');
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    let textContent = [];
    // Lock icon: create a span with lock emoji
    const lockIcon = document.createElement('span');
    lockIcon.textContent = '🔒';
    textContent.push(lockIcon);
    let title = contentDiv && contentDiv.querySelector('.cmp-teaser__title');
    if (title) textContent.push(title);
    let desc = contentDiv && contentDiv.querySelector('.cmp-teaser__description');
    if (desc) textContent.push(desc);
    let cta = contentDiv && contentDiv.querySelector('a, .cmp-teaser__action-container');
    if (cta && cta.textContent.trim()) textContent.push(cta);
    if (img && textContent.length > 1) {
      rows.push([
        img,
        textContent
      ]);
    }
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
