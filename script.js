const BUSINESS_WHATSAPP = '917428530125'; // digits only, with country code
const catalog = window.CATALOG_DATA;
const catalogTree = document.querySelector('#category-tree');
const catalogResults = document.querySelector('#taxonomy-results');
const catalogSearch = document.querySelector('#catalog-search');
const crumbCategory = document.querySelector('#breadcrumb-category');
const modal = document.querySelector('#quote-modal');
const form = document.querySelector('#quote-form');
const manualReference = document.querySelector('#manual-reference');
const formMessage = document.querySelector('#form-message');
let selectedCategory = null;
let selectedSubcategory = null;
let activeQuoteContext = null;

function esc(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function categoryIndex(category) { return String(catalog.indexOf(category) + 1).padStart(2, '0'); }
function setCrumbs(category = null, subcategory = null) {
  crumbCategory.textContent = category ? category.name.toUpperCase() : 'SELECT A CATEGORY';
  const rootButton = document.querySelector('[data-breadcrumb="all"]');
  rootButton.classList.toggle('crumb-current', !category);
  let sub = document.querySelector('#breadcrumb-subcategory');
  if (subcategory && !sub) {
    sub = document.createElement('span');
    sub.id = 'breadcrumb-subcategory';
    document.querySelector('#taxonomy-breadcrumb').append(Object.assign(document.createElement('span'), {textContent:'/' }), sub);
  }
  if (sub) {
    sub.textContent = subcategory ? subcategory.name.toUpperCase() : '';
    sub.hidden = !subcategory;
  }
}

function renderTree() {
  catalogTree.innerHTML = catalog.map(category => `
    <button class="tree-category ${selectedCategory?.id === category.id ? 'selected' : ''}" data-category="${category.id}">
      <span class="tree-index">${categoryIndex(category)}</span><span class="tree-name">${esc(category.name)}<small>${esc(category.group)}</small></span><span class="tree-arrow">↗</span>
    </button>`).join('');
  catalogTree.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
    selectedCategory = catalog.find(category => category.id === button.dataset.category);
    selectedSubcategory = null;
    catalogSearch.value = '';
    renderCatalog();
  }));
}

function renderRoot() {
  setCrumbs();
  catalogResults.innerHTML = `<div class="results-intro"><div><span class="results-kicker">10 SYSTEMS / BROWSE THE RANGE</span><h3>What are you working on?</h3><p>Choose a system to see its part families and model series.</p></div><span class="results-stamp">GW<br>INDEX</span></div><div class="category-card-grid">${catalog.map(category => `
    <button class="category-overview-card" data-category="${category.id}">
      <span class="overview-index">${categoryIndex(category)} <i>${esc(category.group)}</i></span>
      <b>${esc(category.name)}</b>
      <span class="overview-subcats">${category.subcategories.slice(0, 3).map(item => esc(item.name)).join(' · ')}${category.subcategories.length > 3 ? ` · +${category.subcategories.length - 3}` : ''}</span>
      <span class="overview-count">${category.subcategories.length} FAMILIES <i>↗</i></span>
    </button>`).join('')}</div>`;
  catalogResults.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
    selectedCategory = catalog.find(category => category.id === button.dataset.category);
    selectedSubcategory = null;
    renderCatalog();
  }));
}

function renderCategory(category) {
  setCrumbs(category);
  catalogResults.innerHTML = `<div class="results-intro"><div><span class="results-kicker">${categoryIndex(category)} / ${esc(category.group)} / ${category.subcategories.length} PART FAMILIES</span><h3>${esc(category.name)}</h3><p>Select a family to see common series and the details needed for a useful quote.</p></div><button class="back-to-systems" data-back>← All systems</button></div><div class="subcategory-list">${category.subcategories.map((subcategory, index) => `
    <button class="subcategory-row" data-subcategory="${index}"><span class="subcat-index">${categoryIndex(category)}.${String(index + 1).padStart(2, '0')}</span><span class="subcat-name">${esc(subcategory.name)}<small>${subcategory.models.length} illustrative model families</small></span><span class="subcat-model-preview">${subcategory.models.slice(0, 3).map(esc).join(' · ')}${subcategory.models.length > 3 ? ' · …' : ''}</span><span class="subcat-arrow">↗</span></button>`).join('')}</div>`;
  catalogResults.querySelector('[data-back]').addEventListener('click', () => { selectedCategory = null; renderCatalog(); });
  catalogResults.querySelectorAll('[data-subcategory]').forEach(button => button.addEventListener('click', () => {
    selectedSubcategory = category.subcategories[Number(button.dataset.subcategory)];
    renderCatalog();
  }));
}

function renderSubcategory(category, subcategory) {
  setCrumbs(category, subcategory);
  catalogResults.innerHTML = `<div class="results-intro"><div><span class="results-kicker">${categoryIndex(category)} / ${esc(category.name)}</span><h3>${esc(subcategory.name)}</h3><p>Common series shown as a starting point. Confirm dimensions and fit before ordering.</p></div><button class="back-to-systems" data-back>← ${esc(category.name)}</button></div><div class="series-toolbar"><span>MODEL FAMILIES / ${String(subcategory.models.length).padStart(2, '0')}</span><span>QUOTE BY SERIES OR SPECIFICATION</span></div><div class="model-list">${subcategory.models.map((model, index) => `
    <article class="model-row"><span class="model-number">${String(index + 1).padStart(2, '0')}</span><div class="model-name"><small>${esc(category.group)} / ${esc(subcategory.name)}</small><h4>${esc(model)}</h4></div><div class="model-specs"><small>SPECIFY FOR A FIT CHECK</small><span>${esc(subcategory.specs)}</span></div><button class="model-quote" data-model="${esc(model)}" data-subcategory="${esc(subcategory.name)}" data-specs="${esc(subcategory.specs)}">Request quote <i>↗</i></button></article>`).join('')}</div><div class="fit-note"><span>!</span><p><b>Fitment note</b> — Series names are examples, not a promise of stock or compatibility. Share the manufacturer, dimensions, and application for confirmation.</p></div>`;
  catalogResults.querySelector('[data-back]').addEventListener('click', () => { selectedSubcategory = null; renderCatalog(); });
  catalogResults.querySelectorAll('[data-model]').forEach(button => button.addEventListener('click', () => {
    openModal('', {
      category: category.name,
      family: button.dataset.subcategory,
      model: button.dataset.model,
      itemNo: button.dataset.itemNo || button.dataset.model,
      machineNo: button.dataset.machineNo || '',
      specs: button.dataset.specs
    });
  }));
}

function renderSearch(query) {
  const term = query.toLowerCase();
  const matches = [];
  catalog.forEach(category => {
    if (`${category.name} ${category.group}`.toLowerCase().includes(term)) matches.push({category, type:'category', label:category.name});
    category.subcategories.forEach(subcategory => {
      if (subcategory.name.toLowerCase().includes(term)) matches.push({category, subcategory, type:'subcategory', label:subcategory.name});
      subcategory.models.forEach(model => {
        if (model.toLowerCase().includes(term)) matches.push({category, subcategory, type:'model', label:model});
      });
    });
  });
  setCrumbs();
  catalogResults.innerHTML = `<div class="results-intro"><div><span class="results-kicker">CATALOG SEARCH / ${matches.length} MATCH${matches.length === 1 ? '' : 'ES'}</span><h3>Results for “${esc(query)}”</h3><p>Matches across systems, part families, and model series.</p></div><button class="back-to-systems" data-clear-search>Clear search ×</button></div>${matches.length ? `<div class="search-result-list">${matches.slice(0, 60).map((match, index) => `<button class="search-result" data-match="${index}"><span class="result-kind">${match.type.toUpperCase()}</span><b>${esc(match.label)}</b><span>${esc(match.category.name)}${match.subcategory ? ` / ${esc(match.subcategory.name)}` : ''}</span><i>↗</i></button>`).join('')}</div>` : `<div class="empty-search"><span>⌕</span><h4>No catalog match yet.</h4><p>Try a part number, brand, model, or a broader term. If you have a worn part or machine model, send it to the parts desk.</p><button class="button button-dark" data-open-quote>Ask a parts specialist <span>↗</span></button></div>`}`;
  catalogResults.querySelector('[data-open-quote]')?.addEventListener('click', () => openModal());
  catalogResults.querySelector('[data-clear-search]')?.addEventListener('click', () => { catalogSearch.value = ''; renderCatalog(); });
  catalogResults.querySelectorAll('[data-match]').forEach(button => button.addEventListener('click', () => {
    const match = matches[Number(button.dataset.match)];
    selectedCategory = match.category;
    if (match.type === 'category') selectedSubcategory = null;
    else selectedSubcategory = match.subcategory;
    if (match.type === 'model') {
      renderCatalog();
      const model = [...catalogResults.querySelectorAll('.model-row')].find(row => row.querySelector('h4')?.textContent === match.label);
      model?.scrollIntoView({behavior:'smooth', block:'center'});
      model?.classList.add('model-highlight');
    } else renderCatalog();
  }));
}

function renderCatalog() {
  renderTree();
  if (catalogSearch.value.trim()) return renderSearch(catalogSearch.value.trim());
  if (!selectedCategory) return renderRoot();
  if (!selectedSubcategory) return renderCategory(selectedCategory);
  renderSubcategory(selectedCategory, selectedSubcategory);
}
renderCatalog();

document.querySelector('[data-breadcrumb="all"]').addEventListener('click', () => { selectedCategory = null; selectedSubcategory = null; catalogSearch.value = ''; renderCatalog(); });
catalogSearch.addEventListener('input', () => { selectedCategory = null; selectedSubcategory = null; renderCatalog(); });
document.querySelector('#catalog-search-clear').addEventListener('click', () => { catalogSearch.value = ''; selectedCategory = null; selectedSubcategory = null; renderCatalog(); catalogSearch.focus(); });
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); catalogSearch.focus(); }
  if (event.key === 'Escape') closeModal();
});

const finderModes = { number:'e.g. 6205-2RS or a brand name', machine:'e.g. pump model, lathe or conveyor', describe:'e.g. 25 mm shaft bearing, dusty environment' };
const finderInput = document.querySelector('#finder-input');
document.querySelectorAll('[data-finder-mode]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-finder-mode]').forEach(tab => tab.classList.toggle('active', tab === button));
  finderInput.placeholder = finderModes[button.dataset.finderMode];
  finderInput.dataset.mode = button.dataset.finderMode;
  finderInput.focus();
}));
function submitFinder() {
  const query = finderInput.value.trim();
  if (!query) return finderInput.focus();
  catalogSearch.value = query;
  selectedCategory = null;
  selectedSubcategory = null;
  renderCatalog();
  document.querySelector('#catalog').scrollIntoView({behavior:'smooth'});
  if (!catalogResults.querySelector('.search-result')) {
    window.setTimeout(() => {
      openModal('', {
        reference: query,
        referenceKind: finderInput.dataset.mode === 'machine' ? 'Machine / OEM reference' : 'Search reference',
        machineNo: finderInput.dataset.mode === 'machine' ? query : ''
      });
    }, 350);
  }
}
document.querySelector('#finder-submit').addEventListener('click', submitFinder);
finderInput.addEventListener('keydown', event => { if (event.key === 'Enter') submitFinder(); });

function openModal(part = '', context = null) {
  form.reset();
  formMessage.textContent = '';
  formMessage.classList.remove('error');
  activeQuoteContext = context;
  const details = document.querySelector('#quote-item-details');
  const placeholder = document.querySelector('#quote-selected-part');
  document.querySelector('#quote-intro-copy').textContent = context || part
    ? 'Your selected reference is attached. Add quantity and contact details and we’ll take it from there.'
    : 'Enter a part or machine reference, quantity, and contact details to start your quote.';
  const setRow = (id, value) => {
    const row = document.querySelector(`#${id}`).parentElement;
    document.querySelector(`#${id}`).textContent = value || '—';
    row.hidden = !value;
  };
  if (context || part) {
    const displayName = context?.model || context?.reference || part;
    placeholder.innerHTML = `<h3>${esc(displayName)}</h3><p class="quote-selected-caption">${esc(context?.referenceKind || 'Selected from the parts index')}</p>`;
    setRow('quote-item-category', context?.category || '');
    setRow('quote-item-family', context?.family || context?.referenceKind || '');
    setRow('quote-item-model', context?.itemNo || context?.model || (context?.machineNo ? '' : context?.reference) || part || '');
    setRow('quote-item-specs', context?.specs || 'Fitment confirmation requested');
    const machineRow = document.querySelector('#quote-item-machine-row');
    machineRow.hidden = !context?.machineNo;
    document.querySelector('#quote-item-machine').textContent = context?.machineNo || '';
    details.hidden = false;
    manualReference.closest('label').hidden = true;
    manualReference.required = false;
  } else {
    placeholder.innerHTML = '<span class="quote-placeholder">No catalog item selected</span><p class="quote-placeholder-help">Select a model from the parts index, or add a reference in the form.</p>';
    details.hidden = true;
    manualReference.closest('label').hidden = false;
    manualReference.required = true;
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => document.querySelector('[name="name"]').focus(), 100);
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-open-quote]').forEach(button => button.addEventListener('click', () => openModal()));
document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });

function getEnquiry() {
  const data = new FormData(form);
  const itemFields = activeQuoteContext ? [
    ['System', activeQuoteContext.category],
    ['Part family', activeQuoteContext.family],
    ['Model / item no.', activeQuoteContext.itemNo || activeQuoteContext.model || activeQuoteContext.reference],
    ['Machine / OEM reference', activeQuoteContext.machineNo],
    ['Fitment details', activeQuoteContext.specs]
  ] : [['Part / machine reference', data.get('manualReference')]];
  const customerFields = [['Quantity',data.get('quantity')],['Name',data.get('name')],['Phone',data.get('phone')],['Email',data.get('email')],['Company',data.get('company')],['Delivery pincode',data.get('pincode')]];
  return [...itemFields, ...customerFields].filter(([, value]) => value?.trim()).map(([label, value]) => `${label}: ${value.trim()}`).join('\n');
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;
  formMessage.classList.remove('error');
  formMessage.textContent = 'Sending your enquiry…';
  const data = new FormData(form);
  const item = activeQuoteContext || { reference: data.get('manualReference') };
  const customer = Object.fromEntries(['name', 'phone', 'email', 'company', 'quantity', 'pincode'].map(key => [key, String(data.get(key) || '').trim()]));
  try {
    const response = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, customer, website: data.get('website') || '' })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'We could not send your enquiry. Please try again.');
    formMessage.textContent = 'Enquiry sent. Our parts team will be in touch soon.';
    form.reset();
  } catch (error) {
    formMessage.classList.add('error');
    formMessage.textContent = error.message || 'Could not connect. Please try again in a moment.';
  } finally {
    submitButton.disabled = false;
  }
});
document.querySelector('#whatsapp-quote').addEventListener('click', () => {
  if (!form.reportValidity()) return;
  if (!/^\d{10,15}$/.test(BUSINESS_WHATSAPP)) {
    formMessage.classList.add('error');
    formMessage.textContent = 'Set the real WhatsApp number in script.js before using this option.';
    return;
  }
  window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(`Hello, I would like a quotation.\n\n${getEnquiry()}`)}`, '_blank', 'noopener,noreferrer');
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuButton.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

const heroGearVideo = document.querySelector('#hero-gear-video');
if (heroGearVideo) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const syncHeroGearMotion = visible => {
    if (reducedMotion.matches || !visible) heroGearVideo.pause();
    else heroGearVideo.play().catch(() => {});
  };
  if ('IntersectionObserver' in window) {
    const heroGearObserver = new IntersectionObserver(entries => syncHeroGearMotion(entries[0].isIntersecting), { threshold: 0.15 });
    heroGearObserver.observe(heroGearVideo);
  } else syncHeroGearMotion(true);
  reducedMotion.addEventListener?.('change', event => {
    if (event.matches) heroGearVideo.pause();
    else syncHeroGearMotion(true);
  });
}
