import { cosine, dot, softmax, descentStep } from './math.mjs';

const menu = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const mobileNavigation = window.matchMedia('(max-width: 640px)');
function syncNavigation() {
  sidebar.inert = mobileNavigation.matches && !sidebar.classList.contains('open');
}
function closeMenu() {
  sidebar.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  syncNavigation();
}
menu.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  syncNavigation();
});
mobileNavigation.addEventListener('change', closeMenu);
syncNavigation();
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && sidebar.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!sidebar.contains(event.target) && !menu.contains(event.target)) closeMenu();
});
sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.querySelector('.print-button').addEventListener('click', () => window.print());
let closedBeforePrint = [];
window.addEventListener('beforeprint', () => {
  closedBeforePrint = [...document.querySelectorAll('main details:not([open])')];
  closedBeforePrint.forEach(details => { details.open = true; });
});
window.addEventListener('afterprint', () => {
  closedBeforePrint.forEach(details => { details.open = false; });
  closedBeforePrint = [];
});

const progress = document.querySelector('.reading-progress>div');
const headings = [...document.querySelectorAll('main h2[id]')];
const toc = [...document.querySelectorAll('.on-this-page nav a')];
function updateReading() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${distance > 0 ? Math.min(100, Math.max(0, window.scrollY / distance * 100)) : 0}%`;
  const current = headings.findLast(heading => heading.getBoundingClientRect().top <= 150) || headings[0];
  toc.forEach(link => {
    const active = link.hash === `#${current?.id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', updateReading, { passive: true });
window.addEventListener('resize', updateReading);
updateReading();

const alignment = document.querySelector('#alignment-lab');
if (alignment) {
  const scale = alignment.querySelector('input');
  const update = () => {
    const s = Number(scale.value);
    const a = [1, 2], b = [2 * s, s];
    alignment.querySelector('[data-output=scale]').textContent = s.toFixed(1);
    alignment.querySelector('[data-output=vector]').textContent = `[${b[0].toFixed(1)}, ${b[1].toFixed(1)}]`;
    alignment.querySelector('[data-output=dot]').textContent = dot(a, b).toFixed(2);
    alignment.querySelector('[data-output=cosine]').textContent = cosine(a, b).toFixed(2);
  };
  scale.addEventListener('input', update);
  update();
}

const descent = document.querySelector('#descent-lab');
if (descent) {
  let weight = 0, steps = 0;
  const rate = descent.querySelector('input');
  const render = (message = '') => {
    descent.querySelector('[data-output=rate]').textContent = Number(rate.value).toFixed(2);
    descent.querySelector('[data-output=weight]').textContent = weight.toFixed(3);
    descent.querySelector('[data-output=loss]').textContent = ((weight - 4) ** 2).toFixed(3);
    descent.querySelector('[data-output=steps]').textContent = steps;
    descent.querySelector('.lab-note').textContent = message;
  };
  rate.addEventListener('input', () => render('Learning rate changed. Reset for a fair comparison.'));
  descent.querySelector('[data-action=step]').addEventListener('click', () => {
    const previous = (weight - 4) ** 2;
    if (steps >= 20) {
      render('20-step experiment complete. Reset to try another learning rate.');
      return;
    }
    const result = descentStep(weight, Number(rate.value));
    weight = result.weight;
    steps++;
    render(result.loss > previous + 1e-10 ? 'Loss increased: this step was too large.' : Math.abs(result.loss - previous) < 1e-10 ? 'No loss improvement: at a minimum, or oscillating.' : 'Loss decreased. The negative gradient chose the direction.');
  });
  descent.querySelector('[data-action=reset]').addEventListener('click', () => {
    weight = 0;
    steps = 0;
    render('Reset to w = 0. Try another learning rate.');
  });
  render();
}

const logitsLab = document.querySelector('#softmax-lab');
if (logitsLab) {
  const inputs = [...logitsLab.querySelectorAll('input')];
  const update = () => {
    const logits = inputs.map(input => Number(input.value));
    const probabilities = softmax(logits);
    logitsLab.querySelectorAll('[data-logit]').forEach((el, i) => { el.textContent = logits[i].toFixed(1); });
    logitsLab.querySelectorAll('.bar-row').forEach((row, i) => {
      row.querySelector('.bar-fill').style.width = `${probabilities[i] * 100}%`;
      row.querySelector('output').textContent = `${(probabilities[i] * 100).toFixed(1)}%`;
    });
    logitsLab.querySelector('[data-output=ce]').textContent = (-Math.log(probabilities[0])).toFixed(3);
    logitsLab.querySelector('[data-output=gradient]').textContent = (probabilities[0] - 1).toFixed(3);
  };
  inputs.forEach(input => input.addEventListener('input', update));
  logitsLab.querySelector('button').addEventListener('click', () => {
    inputs.forEach((input, i) => { input.value = [2, 1, 0][i]; });
    update();
  });
  update();
}

document.documentElement.classList.remove('no-js');
