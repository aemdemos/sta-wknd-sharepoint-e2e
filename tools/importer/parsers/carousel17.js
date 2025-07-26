/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel inside the element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Gather all slide items
  const slides = Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));

  // Prepare content rows: each row is [img, textCell]
  const rows = [];
  slides.forEach((slide) => {
    // Image: find first <img> in the slide
    const img = slide.querySelector('img');
    // Text: all non-.image children
    const textElements = [];
    Array.from(slide.children).forEach(child => {
      if (!child.classList.contains('image')) {
        textElements.push(child);
      }
    });
    const textCell = textElements.length > 0 ? textElements : '';
    if (img) rows.push([img, textCell]);
  });

  // Only build the table if there's at least one slide
  if (rows.length > 0) {
    // Create a table with header row spanning two columns
    const table = document.createElement('table');
    const trHeader = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'Carousel (carousel17)';
    th.setAttribute('colspan', '2');
    trHeader.appendChild(th);
    table.appendChild(trHeader);
    // Add slide rows
    rows.forEach(([img, txt]) => {
      const tr = document.createElement('tr');
      const tdImg = document.createElement('td');
      if (img) tdImg.appendChild(img);
      tr.appendChild(tdImg);
      const tdTxt = document.createElement('td');
      if (Array.isArray(txt)) {
        txt.forEach(el => tdTxt.appendChild(el));
      } else if (txt) {
        tdTxt.appendChild(typeof txt === 'string' ? document.createTextNode(txt) : txt);
      }
      tr.appendChild(tdTxt);
      table.appendChild(tr);
    });
    element.replaceWith(table);
  }
}
