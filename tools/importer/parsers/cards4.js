/* global WebImporter */
export default function parse(element, { document }) {
  // Select the cards block
  const imageList = element.querySelector('.image-list.list .cmp-image-list');
  if (!imageList) return;
  // Get all direct card items
  const items = Array.from(imageList.children).filter(li => li.classList.contains('cmp-image-list__item'));
  const headerRow = ['Cards (cards4)'];
  const rows = [];

  items.forEach((item) => {
    // 1st column: the image element
    let imgCell = null;
    const img = item.querySelector('img');
    if (img) {
      imgCell = img;
    }
    // 2nd column: all text-related content
    // Gather the title (link), description, and any text in the card
    const article = item.querySelector('article');
    const fragments = [];
    if (article) {
      // Title (with link)
      const titleLink = article.querySelector('.cmp-image-list__item-title-link');
      if (titleLink && titleLink.textContent.trim()) {
        // Heading level is h3 for cards as in example
        const h3 = document.createElement('h3');
        h3.appendChild(titleLink);
        fragments.push(h3);
      }
      // Description
      const desc = article.querySelector('.cmp-image-list__item-description');
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        fragments.push(p);
      }
    }
    rows.push([imgCell, fragments]);
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
