'use strict';
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
document.querySelectorAll('[data-interest]').forEach(link => {
  link.addEventListener('click', () => {
    const interest = document.querySelector('#interest');
    interest.value = link.dataset.interest;
    document.querySelector('#form-status').textContent = `Selected: ${interest.value}. Tell us a little about what you have in mind.`;
  });
});
document.querySelector('#year').textContent = new Date().getFullYear();

const trainingContent = {
  leadership: { title: 'Great leadership starts with everyday moments.', description: 'From first-time managers to established leaders, build the confidence to communicate clearly, coach others, manage performance and lead change.', outcomes: ['Confident conversations & feedback', 'Coaching, delegation & team development', 'Managing performance & leading change'], connection: 'Connect the learning: use AI to prepare a coaching conversation, and explore a tailored system to support team development.', cta: 'Shape your leadership programme', graphic: '◎' },
  projects: { title: 'Bring structure to the big idea.', description: 'Give your people practical tools to plan, deliver and review projects. Build a shared approach to priorities, stakeholders, risks and the next clear step.', outcomes: ['Project planning, scope & priorities', 'Stakeholder communication & risk awareness', 'Delivery, review & lessons learned'], connection: 'Connect the learning: explore AI-assisted planning, then scope a project dashboard that makes progress easier to see.', cta: 'Shape your project programme', graphic: '▦' },
  service: { title: 'Make every conversation count.', description: 'Support your team to understand customer needs, communicate with confidence and handle difficult situations. Use examples drawn from your own service environment.', outcomes: ['Listening, empathy & clear communication', 'Handling complaints & challenging conversations', 'Consistent service & continuous improvement'], connection: 'Connect the learning: practise reviewing AI-drafted responses, and explore a client portal that makes service feel more joined up.', cta: 'Shape your service programme', graphic: '◌' },
  operations: { title: 'Better processes. Stronger everyday performance.', description: 'Help your people see how work flows, where friction builds and what could improve. Turn day-to-day operational challenges into practical learning opportunities.', outcomes: ['Process mapping & practical problem-solving', 'Planning, quality & resource awareness', 'Performance review & continuous improvement'], connection: 'Connect the learning: explore AI for routine planning, and scope a bespoke workflow that supports the way your team actually works.', cta: 'Shape your operations programme', graphic: '⌘' }
};
function selectTraining(tab) {
  const content = trainingContent[tab.dataset.topic];
  document.querySelectorAll('.training-tab').forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  document.querySelector('#training-panel').setAttribute('aria-labelledby', tab.id);
  document.querySelector('#training-title').textContent = content.title;
  document.querySelector('#training-description').textContent = content.description;
  const outcomes = document.querySelector('#training-outcomes');
  outcomes.replaceChildren(...content.outcomes.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  document.querySelector('#training-connection').textContent = content.connection;
  document.querySelector('.topic-graphic').textContent = content.graphic;
  document.querySelector('#training-enquire').firstChild.textContent = content.cta + ' ';
}
const trainingTabs = [...document.querySelectorAll('.training-tab')];
trainingTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTraining(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % trainingTabs.length;
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + trainingTabs.length) % trainingTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = trainingTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTraining(trainingTabs[next]); trainingTabs[next].focus(); }
  });
});
const dashboardTabs = [...document.querySelectorAll('.dashboard-switch [role="tab"]')];
function selectDashboard(tab) {
  dashboardTabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
  const assessor = tab.id === 'assessor-tab';
  document.querySelector('#workspace-role').textContent = assessor ? 'Assessor workspace' : 'Master workspace';
  document.querySelector('#rail-selected span').textContent = assessor ? 'Assessor dashboard' : 'Master dashboard';
}
dashboardTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectDashboard(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (['ArrowRight','ArrowLeft'].includes(event.key)) next = 1 - index;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = 1;
    if (next !== undefined) { event.preventDefault(); selectDashboard(dashboardTabs[next]); dashboardTabs[next].focus(); }
  });
});

const productLightbox = document.querySelector('#product-lightbox');
let imageTrigger;
document.querySelectorAll('[data-product-image]').forEach(button => {
  button.addEventListener('click', () => {
    imageTrigger = button;
    const image = document.querySelector('#lightbox-image');
    image.src = button.querySelector('img').currentSrc || button.querySelector('img').src;
    image.alt = button.querySelector('img').alt;
    document.querySelector('#lightbox-caption').textContent = button.dataset.productCaption;
    productLightbox.showModal();
    document.body.classList.add('image-expanded');
  });
});
document.querySelector('.lightbox-close').addEventListener('click', () => productLightbox.close());
productLightbox.addEventListener('click', event => { if (event.target === productLightbox) productLightbox.close(); });
productLightbox.addEventListener('close', () => {
  document.body.classList.remove('image-expanded');
  imageTrigger?.focus();
});
