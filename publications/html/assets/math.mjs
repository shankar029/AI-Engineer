export function dot(a, b) {
  if (a.length !== b.length) throw new RangeError('Dot product dimensions must match.');
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

export function cosine(a, b) {
  const denominator = Math.hypot(...a) * Math.hypot(...b);
  if (denominator === 0) throw new RangeError('Cosine similarity is undefined for a zero vector.');
  return dot(a, b) / denominator;
}

export function softmax(logits) {
  if (!logits.length || !logits.every(Number.isFinite)) throw new RangeError('Softmax requires finite logits.');
  const maximum = Math.max(...logits);
  const exp = logits.map(value => Math.exp(value - maximum));
  const total = exp.reduce((sum, value) => sum + value, 0);
  return exp.map(value => value / total);
}

export function descentStep(weight, rate, target = 4) {
  const gradient = 2 * (weight - target);
  const next = weight - rate * gradient;
  return { weight: next, gradient, loss: (next - target) ** 2 };
}
