/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the logo (image) and search elements
  let logo = null;
  let search = null;

  Array.from(grid.children).forEach((child) => {
    if (child.classList.contains('image')) {
      logo = child;
    } else if (child.classList.contains('search')) {
      search = child;
    }
  });

  // Extract the logo as an image element (with alt and src, wrapped in link if present)
  let logoContent = '';
  if (logo) {
    const img = logo.querySelector('img');
    const link = logo.querySelector('a');
    if (img) {
      const logoImg = document.createElement('img');
      logoImg.src = img.src;
      logoImg.alt = img.alt || '';
      if (link) {
        const logoLink = document.createElement('a');
        logoLink.href = link.href;
        logoLink.appendChild(logoImg);
        logoContent = logoLink;
      } else {
        logoContent = logoImg;
      }
    } else {
      logoContent = logo.textContent.trim();
    }
  }

  // Extract the search field (icon + input placeholder + clear button)
  let searchContent = '';
  if (search) {
    const fieldDiv = search.querySelector('.cmp-search__field');
    if (fieldDiv) {
      searchContent = fieldDiv.cloneNode(true);
    } else {
      searchContent = search.textContent.trim();
    }
  }

  // Always use the correct header row
  const headerRow = ['Columns (columns2)'];

  // Only include logo and search (2 columns)
  const columns = [logoContent, searchContent];
  const rows = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
