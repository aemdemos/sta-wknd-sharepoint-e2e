/* global WebImporter */
export default function parse(element, { document }) {
  // Compose output: section headings and descriptions, then cards table
  // Find section headings and descriptions
  const sections = [
    {
      heading: 'Our Contributors',
      description: '',
      cardFirstName: 'Stacey Roswells',
    },
    {
      heading: 'WKND Guides',
      description: '',
      cardFirstName: 'Sofia Sjöberg',
    },
  ];

  // Find all title and text elements
  const allTitles = Array.from(element.querySelectorAll('.title'));
  const allTexts = Array.from(element.querySelectorAll('.text'));

  // Helper to get the next text element after a title
  function getNextTextEl(titleEl) {
    let el = titleEl.nextElementSibling;
    while (el) {
      if (el.classList && el.classList.contains('text')) return el;
      el = el.nextElementSibling;
    }
    return null;
  }

  // For each section, extract heading and description
  sections.forEach((section) => {
    const titleEl = allTitles.find(el => el.textContent.trim().toLowerCase().includes(section.heading.toLowerCase()));
    if (titleEl) {
      section.titleEl = titleEl;
      const descEl = getNextTextEl(titleEl);
      if (descEl) {
        section.description = descEl.innerHTML;
      }
    }
  });

  // Create a fragment to hold everything
  const fragment = document.createDocumentFragment();

  // Add headings and descriptions before the table
  sections.forEach((section) => {
    if (section.titleEl) {
      // Heading
      const h2 = document.createElement('h2');
      h2.textContent = section.heading;
      fragment.appendChild(h2);
      // Description
      if (section.description) {
        const descDiv = document.createElement('div');
        descDiv.innerHTML = section.description;
        fragment.appendChild(descDiv);
      }
    }
  });

  // Now build the cards table
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  // Find all card sections (contributors and guides)
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  cardSections.forEach((cardSection) => {
    // Image (mandatory)
    const img = cardSection.querySelector('.cmp-image__image');
    // Name/title (h3)
    const name = cardSection.querySelector('h3.cmp-title__text');
    // Subtitle/roles (h5)
    let subtitle = cardSection.querySelector('h5.cmp-title__text');
    if (!subtitle) subtitle = cardSection.querySelector('h5');
    // Social buttons
    const socialLinks = Array.from(cardSection.querySelectorAll('.button .cmp-button'));
    const socialContainer = document.createElement('div');
    socialLinks.forEach((btn) => socialContainer.appendChild(btn.cloneNode(true)));
    // Compose text cell
    const textCell = document.createElement('div');
    if (name) textCell.appendChild(name.cloneNode(true));
    if (subtitle) textCell.appendChild(subtitle.cloneNode(true));
    if (socialLinks.length) textCell.appendChild(socialContainer);
    rows.push([
      img ? img.cloneNode(true) : '',
      textCell
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  fragment.appendChild(table);
  element.replaceWith(fragment);
}
