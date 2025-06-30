/* global WebImporter */
export default function parse(element, { document }) {
  // Compose table header row exactly as required
  const cells = [
    ['Cards (cards31)']
  ];

  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach(item => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    // Image extraction
    let img = null;
    const imgDiv = article && article.querySelector('.cmp-image-list__item-image');
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }
    // Text cell: title (linked and bold), description below
    const textContent = [];
    // Title link (should be <a> with text in <span>)
    const titleLink = article && article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Instead of cloning, create <strong> and move the <span> inside it, keep <a> as is
      const titleA = titleLink;
      // The child is <span class="cmp-image-list__item-title">
      const titleSpan = titleA.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Wrap span in <strong>
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        // Remove existing span, then put <strong> in its place
        titleA.replaceChild(strong, titleSpan);
      }
      textContent.push(titleA);
    }
    // Description (if any)
    const desc = article && article.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textContent.push(p);
    }
    cells.push([
      img,
      textContent
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
