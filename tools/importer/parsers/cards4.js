/* global WebImporter */
export default function parse(element, { document }) {
  // Helper for text content of card right cell (strong title, description, CTA)
  function createTextCell({ pretitle, title, description, cta }) {
    const container = document.createElement('div');
    if (pretitle) {
      const p = document.createElement('p');
      p.textContent = pretitle;
      p.style.fontWeight = 'bold';
      container.appendChild(p);
    }
    if (title) {
      if (container.childNodes.length) container.appendChild(document.createElement('br'));
      const strong = document.createElement('strong');
      strong.textContent = title;
      container.appendChild(strong);
    }
    if (description) {
      container.appendChild(document.createElement('br'));
      const descDiv = document.createElement('div');
      descDiv.textContent = description;
      container.appendChild(descDiv);
    }
    if (cta) {
      container.appendChild(document.createElement('br'));
      container.appendChild(cta);
    }
    return container.childNodes.length === 1 ? container.firstChild : container;
  }

  // Compose cards array
  const cards = [];

  // 1. Featured Article (top card)
  const featured = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  if (featured) {
    const img = featured.querySelector('.cmp-teaser__image img');
    const pretitle = featured.querySelector('.cmp-teaser__pretitle')?.textContent.trim();
    const title = featured.querySelector('.cmp-teaser__title')?.textContent.trim();
    let description = '';
    const descDiv = featured.querySelector('.cmp-teaser__description');
    if (descDiv) description = descDiv.textContent.trim();
    const cta = featured.querySelector('.cmp-teaser__action-link');
    cards.push([
      img,
      createTextCell({ pretitle, title, description, cta })
    ]);
  }

  // 2. All Articles (image-list)
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (imageList) {
    const items = imageList.querySelectorAll('.cmp-image-list__item');
    items.forEach(item => {
      const img = item.querySelector('.cmp-image-list__item-image img');
      const title = item.querySelector('.cmp-image-list__item-title')?.textContent.trim();
      const description = item.querySelector('.cmp-image-list__item-description')?.textContent.trim();
      // Wrap title in strong, then break, then description
      const textCell = createTextCell({ title, description });
      cards.push([
        img,
        textCell
      ]);
    });
  }

  // 3. Members Only (secure teasers)
  const memberTeasers = element.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure .cmp-teaser');
  memberTeasers.forEach(teaser => {
    const img = teaser.querySelector('.cmp-teaser__image img');
    const title = teaser.querySelector('.cmp-teaser__title')?.textContent.trim();
    // Description can be direct text or wrapped in <p>
    let description = '';
    const descDiv = teaser.querySelector('.cmp-teaser__description');
    if (descDiv) {
      const p = descDiv.querySelector('p');
      if (p) description = p.textContent.trim();
      else description = descDiv.textContent.trim();
    }
    // The "Read More" in .cmp-teaser__action-container is plain text, not a link
    let cta = null;
    const ctaNode = teaser.querySelector('.cmp-teaser__action-container');
    if (ctaNode && ctaNode.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = ctaNode.textContent.trim();
      cta = span;
    }
    cards.push([
      img,
      createTextCell({ title, description, cta })
    ]);
  });

  // Table header as in the example
  const cells = [['Cards (cards4)'], ...cards];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
