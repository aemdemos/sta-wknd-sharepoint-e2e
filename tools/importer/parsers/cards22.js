/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row exactly as instructed
  const headerRow = ['Cards (cards22)'];
  const cells = [headerRow];

  // Get the main image-list (ul)
  const imageList = element.querySelector('ul.cmp-image-list');
  if (imageList) {
    // For each card/list item
    imageList.querySelectorAll('li.cmp-image-list__item').forEach((item) => {
      // Get the image element (first <img> descendant)
      let image = null;
      const imageContainer = item.querySelector('.cmp-image-list__item-image');
      if (imageContainer) {
        image = imageContainer.querySelector('img');
      }

      // Compose the right cell: strong for title, then description (with line break if both)
      const rightCellContent = [];
      // Title in <strong>
      const titleContainer = item.querySelector('.cmp-image-list__item-title');
      if (titleContainer && titleContainer.textContent.trim().length > 0) {
        const strong = document.createElement('strong');
        strong.textContent = titleContainer.textContent.trim();
        rightCellContent.push(strong);
      }
      // Description as text, with br if both
      const descContainer = item.querySelector('.cmp-image-list__item-description');
      if (descContainer && descContainer.textContent.trim().length > 0) {
        if (rightCellContent.length > 0) {
          rightCellContent.push(document.createElement('br'));
        }
        // Reference existing <span>, not clone or text
        rightCellContent.push(descContainer);
      }
      cells.push([
        image,
        rightCellContent
      ]);
    });
  }
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
