import test from 'node:test';
import assert from 'node:assert/strict';
import { dot, cosine, softmax, descentStep } from '../book/assets/math.mjs';

const near = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
const multiply = (a, b) => a.map(row => b[0].map((_, j) => dot(row, b.map(r => r[j]))));

test('chapter 5: all nine backward derivatives match finite differences and the full update', () => {
  // Parameter order: W11, W12, W21, W22, b1, b2, v1, v2, c.
  const forward = (p, x = [2, 1]) => {
    const z = [p[0] * x[0] + p[1] * x[1] + p[4], p[2] * x[0] + p[3] * x[1] + p[5]];
    const h = z.map(value => Math.max(0, value));
    const prediction = p[6] * h[0] + p[7] * h[1] + p[8];
    return { z, h, prediction, loss: (prediction - 1) ** 2 };
  };
  const old = [1, -1, 0.5, 1, 0, -0.5, 1, -1, 0.5];
  const before = forward(old);
  assert.deepEqual(before.z, [1, 1.5]);
  assert.equal(before.prediction, 0);
  assert.equal(before.loss, 1);
  const upstream = 2 * (before.prediction - 1);
  const dz = before.z.map((z, j) => upstream * old[6 + j] * (z > 0 ? 1 : 0));
  const gradient = [dz[0] * 2, dz[0], dz[1] * 2, dz[1], ...dz,
    upstream * before.h[0], upstream * before.h[1], upstream];
  assert.deepEqual(gradient, [-4, -2, 4, 2, -2, 2, -2, -3, -2]);
  for (let j = 0; j < old.length; j++) {
    const plus = [...old], minus = [...old], epsilon = 1e-5;
    plus[j] += epsilon;
    minus[j] -= epsilon;
    near((forward(plus).loss - forward(minus).loss) / (2 * epsilon), gradient[j], 1e-7);
  }
  near(dz[0] * old[0] + dz[1] * old[2], -1);
  near(dz[0] * old[1] + dz[1] * old[3], 4);
  const next = old.map((value, j) => value - 0.05 * gradient[j]);
  [1.2, -0.9, 0.3, 0.9, 0.1, -0.6, 1.1, -0.85, 0.6].forEach((value, j) => near(next[j], value));
  const after = forward(next);
  near(after.z[0], 1.6);
  near(after.z[1], 0.9);
  near(after.prediction, 1.595);
  near(after.loss, 0.354025);
  assert.ok(after.loss < before.loss);
  const perturbWeight = [...old]; perturbWeight[0] += 0.001;
  near(forward(perturbWeight).loss, 0.996004);
  const perturbOutput = [...old]; perturbOutput[7] += 0.001;
  near(forward(perturbOutput).loss, 0.99700225);
  assert.deepEqual(forward(old, [1, 2]).h, [0, 2]);
});

test('chapter 5: activation, probability, and negative/zero-weight exercises', () => {
  const sigmoid = z => 1 / (1 + Math.exp(-z));
  near(sigmoid(-1), 0.268941, 1e-6);
  near(sigmoid(1), 0.731059, 1e-6);
  near(Math.tanh(-1), -0.761594, 1e-6);
  near(Math.tanh(1), 0.761594, 1e-6);
  near(sigmoid(2.5), 0.924142, 1e-6);
  near(Math.tanh(2.5), 0.986614, 1e-6);
  const count = 200, step = 1 / count;
  const density = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  let sum = density(0) + density(1);
  for (let i = 1; i < count; i++) sum += (i % 2 ? 4 : 2) * density(i * step);
  const phi = 0.5 + sum * step / 3;
  near(phi, 0.841345, 1e-6);
  near(-(1 - phi), -0.158655, 1e-6);
  const probabilities = softmax([Math.log(2), 0, 0]);
  assert.deepEqual(probabilities, [0.5, 0.25, 0.25]);
  near(-Math.log(probabilities[0]), 0.693147, 1e-6);
  near(-Math.log(probabilities[1]), 1.386294, 1e-6);
  near(-Math.log(softmax([Math.log(3), 0])[0]), 0.287682, 1e-6);
  softmax([0, -Math.log(2), -Math.log(2)]).forEach((value, j) => near(value, probabilities[j]));
});

test('chapter 5: shared FFN, masked mixture, concatenation, and residual values', () => {
  const w1 = [[1, 0], [0, 1], [1, -1]], w2 = [[1, 0, 1], [0, 1, -1]];
  const ffn = x => w2.map(row => dot(row, w1.map(weights => Math.max(0, dot(weights, x)))));
  assert.deepEqual(ffn([2, 1]), [3, 0]);
  assert.deepEqual(ffn([1, 2]), [1, 2]);
  assert.deepEqual(ffn([0, 2]), [0, 2]);
  const weights = softmax([0, Math.log(3)]);
  const mixture = [2 * weights[0], 4 * weights[1]];
  mixture.forEach((value, j) => near(value, [0.5, 3][j]));
  const joined = [...mixture, 2, 0];
  near(dot([1, 0, 1, 0], joined), 2.5);
  near(dot([0, 1, 0, 1], joined), 3);
  assert.deepEqual([2, 1].map((x, j) => x + ffn([2, 1])[j]), [5, 1]);
  const recurrent = [2, 0, 1, 0].reduce((states, x) => [...states, x + 0.5 * states.at(-1)], [0]);
  assert.deepEqual(recurrent, [0, 2, 1, 1.5, 0.75]);
});

test('chapter 5: feature-wise normalization, constant row, and pre/post order', () => {
  const normalize = (x, gamma = [2, 0.5], beta = [0.1, -0.2]) => {
    const mean = x.reduce((a, b) => a + b) / x.length;
    const variance = x.reduce((sum, value) => sum + (value - mean) ** 2, 0) / x.length;
    return x.map((value, j) => gamma[j] * (value - mean) / Math.sqrt(variance + 0.00001) + beta[j]);
  };
  const original = normalize([1, 3]);
  near(original[0], -1.899990, 1e-6);
  near(original[1], 0.299998, 1e-6);
  assert.deepEqual(normalize([11, 13]), original);
  assert.deepEqual(normalize([5, 5]), [0.1, -0.2]);
  const post = normalize([2, 3], [1, 1], [0, 0]);
  near(post[0], -0.999980, 1e-6);
  near(post[1], 0.999980, 1e-6);
  assert.notDeepEqual(post, [2, 3]);
});

test('chapter 4: lookup selectors, repeated IDs, and masked mean pooling', () => {
  const table = [[3, 4, 0], [4, 3, 0], [0, 0, 5], [2, 1, 2]];
  assert.deepEqual([1, 3, 1].map(id => table[id]), [[4, 3, 0], [2, 1, 2], [4, 3, 0]]);
  assert.deepEqual(multiply([[0, 1, 0, 0]], table), [[4, 3, 0]]);
  const rows = [[2, 0, 1], [0, 2, 1], [8, 8, 8]];
  const mask = [1, 1, 0];
  const count = mask.reduce((a, b) => a + b);
  const pooled = rows[0].map((_, j) => rows.reduce((sum, row, i) => sum + mask[i] * row[j], 0) / count);
  assert.deepEqual(pooled, [1, 1, 1]);
  const norm = Math.hypot(...pooled);
  pooled.map(x => x / norm).forEach(x => near(x, 0.577350, 1e-6));
});

test('chapter 4: embedding gradients match finite differences and recomputed target loss', () => {
  const loss = ([a, b], target = 0) => -Math.log(softmax([a + b, 0])[target]);
  const epsilon = 1e-5;
  const gradients = [0, 1].map(j => {
    const plus = [0, 0], minus = [0, 0];
    plus[j] = epsilon;
    minus[j] = -epsilon;
    return (loss(plus) - loss(minus)) / (2 * epsilon);
  });
  gradients.forEach(g => near(g, -0.5));
  near(loss([0, 0]), 0.693147, 1e-6);
  near(loss([0.001, 0]), 0.69264730556, 1e-10);
  near(loss([-0.001, 0]), 0.69364730556, 1e-10);
  for (const [rate, probability, expectedLoss] of [[0.2, 0.549834, 0.598139], [0.1, 0.524979, 0.644397]]) {
    const next = gradients.map(g => -rate * g);
    near(softmax([next[0] + next[1], 0])[0], probability, 1e-6);
    near(loss(next), expectedLoss, 1e-6);
    assert.ok(loss(next) < loss([0, 0]));
  }
  near((loss([epsilon, 0], 1) - loss([-epsilon, 0], 1)) / (2 * epsilon), 0.5);
  const token = [1, 2].map((x, j) => x - 0.1 * [0.4, -0.2][j]);
  const position = [-0.1, 0.3].map((x, j) => x - 0.1 * [0.4, -0.2][j]);
  [0.82, 2.34].forEach((x, j) => near(token[j] + position[j], x));
});

test('chapter 4: scale-dependent metrics and unit-distance equivalence', () => {
  const a = [3, 4, 0], b = [4, 3, 0], scaled = b.map(x => 2 * x);
  const distance = (u, v) => Math.hypot(...u.map((x, i) => x - v[i]));
  near(dot(a, b), 24);
  near(cosine(a, b), 0.96);
  near(dot(a, scaled), 48);
  near(cosine(a, scaled), 0.96);
  near(distance(a, b), 1.414214, 1e-6);
  near(distance(a, scaled), 5.385165, 1e-6);
  const unit = v => v.map(x => x / Math.hypot(...v));
  near(distance(unit(a), unit(b)) ** 2, 2 - 2 * cosine(a, b));
  assert.throws(() => cosine(a, [0, 0, 0]), /zero vector/);
  assert.deepEqual([[4, 3, 0], [0, 5, 0], [0, 0, 5]].map(v => cosine(a, v)), [0.96, 0.8, 0]);
});

test('chapter 4: sinusoidal pair rates and every generated position-2 coordinate', () => {
  const encode = (position, width) => Array.from({ length: width / 2 }, (_, j) => {
    const angle = position / 10000 ** (2 * j / width);
    return [Math.sin(angle), Math.cos(angle)];
  }).flat();
  assert.deepEqual(encode(0, 4), [0, 1, 0, 1]);
  const expected = [0.909297, -0.416147, 0.019999, 0.999800];
  encode(2, 4).forEach((x, j) => near(x, expected[j], 1e-6));
  const token = [0.2, 0.5, 0.1, 0.8], combined = [1.109297, 0.083853, 0.119999, 1.799800];
  encode(2, 4).forEach((x, j) => near(x + token[j], combined[j], 1e-6));
  const s = Math.sin(1), c = Math.cos(1);
  near(s * Math.cos(1) + c * Math.sin(1), Math.sin(2));
  near(c * Math.cos(1) - s * Math.sin(1), Math.cos(2));
});

test('chapter 4: RoPE preserves pair lengths, relative geometry, and cache positions', () => {
  const rotate = ([x, y], angle) => [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
  const q = [1, 2], k = [3, 4];
  for (const angle of [0, Math.PI / 2, 2, 0.02]) {
    near(Math.hypot(...rotate(q, angle)), Math.hypot(...q));
    near(dot(rotate(q, angle), rotate(k, angle)), dot(q, k));
  }
  near(dot(rotate(q, 2), rotate(k, 5)), dot(q, rotate(k, 3)));
  const rotated = [...rotate([1, 0], 2), ...rotate([0, 1], 0.02)];
  rotated.forEach((x, j) => near(x, [-0.416147, 0.909297, -0.019999, 0.999800][j], 1e-6));
  const rate = Math.PI / 4, content = [1, 0];
  for (const [m, n] of [[0, 1], [1, 2], [2, 3], [5, 6]]) near(dot(rotate(content, m * rate), rotate(content, n * rate)), Math.SQRT1_2);
  const cached = rotate(content, rate);
  near(dot(rotate(content, 2 * rate), cached), Math.SQRT1_2);
  near(dot(rotate(content, 2 * rate), rotate(cached, rate)), 1);
  near(dot(rotate(content, 3 * rate), cached), 0);
  near(dot(rotate(content, 0), cached), Math.SQRT1_2);
});

test('chapter 4: remaining context, offset, storage, circle, and exercise arithmetic', () => {
  const mix = (a, b) => a.map((x, j) => 0.75 * x + 0.25 * b[j]);
  assert.deepEqual(mix([1, 1], [3, 0]), [1.5, 0.75]);
  assert.deepEqual(mix([1, 1], [0, 3]), [0.75, 1.5]);
  assert.deepEqual(mix([2, 0], [0, 2]), [1.5, 0.5]);
  assert.deepEqual(mix([0, 2], [2, 0]), [0.5, 1.5]);
  const a = [1, 1], b = [3, 2], c = [2, 4];
  const offset = b.map((x, j) => x - a[j]);
  assert.deepEqual(offset, [2, 1]);
  assert.deepEqual(c.map((x, j) => x + offset[j]), [4, 5]);
  near(Math.hypot(4 - 5, 5 - 5), 1);
  near(Math.hypot(4 - 4, 7 - 5), 2);
  near(cosine([1, 0], [0, -2]), 0);
  near(Math.hypot(1 - 0, 0 - (-2)), 2.236068, 1e-6);
  near(dot([3, 4], [6, 8]), 50);
  near(cosine([3, 4], [6, 8]), 1);
  assert.equal(20000 * 256 * 4, 20480000);
  assert.equal(2048 * 128, 262144);
  assert.equal(100 * (4 + 4) * 4, 3200);
  near(Math.cos(45 * Math.PI / 180), Math.sqrt(2) / 2);
  near(2 * Math.PI / 0.01, 628.318531, 1e-6);
  near(2 / 3 * 100, 66.67, 0.005);
});

test('chapter 4: projected roles and masked scaled attention exclude future values', () => {
  const row = [[1, 2]];
  assert.deepEqual(multiply(row, [[1, 0], [0, 1]]), [[1, 2]]);
  assert.deepEqual(multiply(row, [[2, 0], [0, 1]]), [[2, 2]]);
  assert.deepEqual(multiply(row, [[0, 1], [1, 0]]), [[2, 1]]);
  const query = [1, 0], keys = [[0, 0], [Math.SQRT2 * Math.log(2), 0], [10, 0]];
  const scores = keys.map(key => dot(query, key) / Math.SQRT2);
  const weights = [...softmax(scores.slice(0, 2)), 0];
  weights.forEach((x, j) => near(x, [1 / 3, 2 / 3, 0][j]));
  const values = [[2, 0], [0, 3], [9, 9]];
  const result = values[0].map((_, j) => values.reduce((total, value, i) => total + weights[i] * value[j], 0));
  near(result[0], 2 / 3);
  near(result[1], 2);
  assert.ok(softmax(scores)[2] > 0.99);
});

test('chapter 3: weighted BPE recounts, deterministic ties, and frozen encoding', () => {
  const corpus = [
    { units: [...'map'], frequency: 4 },
    { units: [...'maps'], frequency: 2 },
    { units: [...'maple'], frequency: 1 }
  ];
  const replacePair = (units, [left, right]) => {
    const result = [];
    for (let i = 0; i < units.length; i++) {
      if (units[i] === left && units[i + 1] === right) {
        result.push(left + right);
        i++;
      } else result.push(units[i]);
    }
    return result;
  };
  const pairCounts = () => {
    const counts = new Map();
    for (const { units, frequency } of corpus) {
      for (let i = 0; i < units.length - 1; i++) {
        const key = `${units[i]}|${units[i + 1]}`;
        counts.set(key, (counts.get(key) || 0) + frequency);
      }
    }
    return [...counts];
  };
  const expectedCounts = [
    [['m|a', 7], ['a|p', 7], ['p|s', 2], ['p|l', 1], ['l|e', 1]],
    [['ma|p', 7], ['p|s', 2], ['p|l', 1], ['l|e', 1]],
    [['map|s', 2], ['map|l', 1], ['l|e', 1]],
    [['map|l', 1], ['l|e', 1]],
    [['mapl|e', 1]],
    []
  ];
  const expectedStates = [
    ['m a p', 'm a p s', 'm a p l e'],
    ['ma p', 'ma p s', 'ma p l e'],
    ['map', 'map s', 'map l e'],
    ['map', 'maps', 'map l e'],
    ['map', 'maps', 'mapl e'],
    ['map', 'maps', 'maple']
  ];
  const occurrenceCounts = [25, 18, 11, 9, 8, 7];
  const vocabulary = new Set('mapsle');
  const merges = [];
  for (let step = 0; step <= 5; step++) {
    const counts = pairCounts();
    assert.deepEqual(counts, expectedCounts[step]);
    assert.deepEqual(corpus.map(row => row.units.join(' ')), expectedStates[step]);
    assert.equal(corpus.reduce((total, row) => total + row.units.length * row.frequency, 0), occurrenceCounts[step]);
    assert.equal(vocabulary.size, 6 + step);
    if (step === 5) break;
    // Map insertion order preserves the specified first-encounter tie break.
    const winner = counts.reduce((best, pair) => pair[1] > best[1] ? pair : best);
    const pair = winner[0].split('|');
    merges.push(pair);
    vocabulary.add(pair.join(''));
    for (const row of corpus) row.units = replacePair(row.units, pair);
  }
  const encode = (text, ranks, base = 'mapsle') => {
    let units = [...text];
    if (units.some(unit => !base.includes(unit))) throw new RangeError('Missing base character');
    while (true) {
      const pair = ranks.find(([a, b]) => units.some((unit, i) => unit === a && units[i + 1] === b));
      if (!pair) return units;
      units = replacePair(units, pair);
    }
  };
  const frozen = encode('maples', merges.slice(0, 2));
  assert.deepEqual(frozen, ['map', 'l', 'e', 's']);
  const idEntries = ['m', 'a', 'p', 's', 'l', 'e', 'ma', 'map'];
  const ids = frozen.map(token => idEntries.indexOf(token));
  assert.deepEqual(ids, [7, 4, 5, 3]);
  assert.equal(ids.map(id => idEntries[id]).join(''), 'maples');
  assert.deepEqual(encode('maples', merges), ['maple', 's']);
  assert.throws(() => encode('mapped', merges), /Missing base character/);
  assert.deepEqual(replacePair(['a', 'a', 'a'], ['a', 'a']), ['aa', 'a']);
  const conflictingRanks = [['b', 'c'], ['a', 'b']];
  assert.deepEqual(encode('abc', conflictingRanks, 'abc'), ['a', 'bc']);
  const dictionary = ['a', 'b', 'c', 'bc', 'ab'];
  const longestPrefix = dictionary.filter(token => 'abc'.startsWith(token)).sort((a, b) => b.length - a.length)[0];
  assert.deepEqual([longestPrefix, 'abc'.slice(longestPrefix.length)], ['ab', 'c']);
});

test('chapter 3: WordPiece continuation constraints and greedy whole-word failure', () => {
  const encode = (text, vocabulary) => {
    const pieces = [];
    let start = 0;
    while (start < text.length) {
      let found = false;
      for (let end = text.length; end > start; end--) {
        const piece = `${start ? '##' : ''}${text.slice(start, end)}`;
        if (!vocabulary.has(piece)) continue;
        pieces.push(piece);
        start = end;
        found = true;
        break;
      }
      if (!found) return ['[UNK]'];
    }
    return pieces;
  };
  const vocabulary = new Set(['p', 'pla', 'play', '##a', '##b', '##ing', '##er']);
  assert.deepEqual(encode('playing', vocabulary), ['play', '##ing']);
  assert.deepEqual(encode('player', vocabulary), ['play', '##er']);
  assert.deepEqual(encode('playful', vocabulary), ['[UNK]']);
  assert.deepEqual(encode('ing', vocabulary), ['[UNK]']);
  assert.deepEqual(encode('abc', new Set(['a', 'ab', '##bc'])), ['[UNK]']);
  assert.equal(['a', 'bc'].join(''), 'abc');
});

test('chapter 3: Unigram paths, likelihood, log scores, and fractional estimation', () => {
  const probabilities = { a: 0.4, b: 0.3, ab: 0.2, ba: 0.1 };
  const paths = text => {
    if (!text) return [[]];
    return Object.keys(probabilities).flatMap(token => text.startsWith(token)
      ? paths(text.slice(token.length)).map(rest => [token, ...rest])
      : []);
  };
  const candidates = paths('aba').map(tokens => ({
    tokens, score: tokens.reduce((product, token) => product * probabilities[token], 1)
  }));
  assert.equal(candidates.length, 3);
  const likelihood = candidates.reduce((sum, path) => sum + path.score, 0);
  near(likelihood, 0.168);
  assert.deepEqual(candidates.toSorted((a, b) => b.score - a.score)[0].tokens, ['ab', 'a']);
  for (const { tokens, score } of candidates) {
    near(-Math.log(score), tokens.reduce((sum, token) => sum - Math.log(probabilities[token]), 0));
  }
  near(-Math.log(0.08), 2.5257286443);
  near(-Math.log(0.04), 3.2188758249);
  near(-Math.log(0.048), 3.0365542681);
  const counts = { a: 0, b: 0, ab: 0, ba: 0 };
  for (const { tokens, score } of candidates) {
    for (const token of tokens) counts[token] += score / likelihood;
  }
  near(counts.a, 27 / 21);
  near(counts.b, 6 / 21);
  near(counts.ab, 10 / 21);
  near(counts.ba, 5 / 21);
  const expectedLength = Object.values(counts).reduce((a, b) => a + b, 0);
  near(expectedLength, 48 / 21);
  for (const [token, numerator] of Object.entries({ a: 27, b: 6, ab: 10, ba: 5 })) {
    near(counts[token] / expectedLength, numerator / 48);
  }
  const prunedLikelihood = candidates.filter(path => !path.tokens.includes('ab')).reduce((sum, path) => sum + path.score, 0);
  near(prunedLikelihood, 0.088);
  near(-Math.log(prunedLikelihood) + Math.log(likelihood), 0.6466271649);
  const withoutBa = candidates.filter(path => !path.tokens.includes('ba')).reduce((sum, path) => sum + path.score, 0);
  near(withoutBa, 0.128);
  near(-Math.log(withoutBa), 2.0557250151);
  near(-Math.log(withoutBa) + Math.log(likelihood), 0.2719337155);
  assert.ok(withoutBa > prunedLikelihood);
  near(paths('ab').reduce((sum, tokens) => sum + tokens.reduce((product, token) => product * probabilities[token], 1), 0), 0.32);
  const text = 'aba';
  const best = [{ score: 1, tokens: [] }];
  const total = [1];
  for (let end = 1; end <= text.length; end++) {
    best[end] = { score: 0, tokens: [] };
    total[end] = 0;
    for (const [token, probability] of Object.entries(probabilities)) {
      const start = end - token.length;
      if (start < 0 || text.slice(start, end) !== token) continue;
      total[end] += total[start] * probability;
      const score = best[start].score * probability;
      if (score > best[end].score) best[end] = { score, tokens: [...best[start].tokens, token] };
    }
  }
  [1, 0.4, 0.32, 0.168].forEach((value, i) => near(total[i], value));
  [1, 0.4, 0.2, 0.08].forEach((value, i) => near(best[i].score, value));
  assert.deepEqual(best[3].tokens, ['ab', 'a']);
});

test('chapter 3: learned byte pieces change count without changing Unicode text', () => {
  const text = '\u00e9\u00e9';
  const raw = [...Buffer.from(text, 'utf8')];
  assert.deepEqual(raw, [195, 169, 195, 169]);
  const baseEntries = Array.from({ length: 256 }, (_, value) => [value]);
  const artifactA = raw.map(value => baseEntries[value]);
  const artifactB = [];
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === 195 && raw[i + 1] === 169) {
      artifactB.push([195, 169]);
      i++;
    } else artifactB.push(baseEntries[raw[i]]);
  }
  assert.equal(artifactA.length, 4);
  assert.equal(artifactB.length, 2);
  for (const payloads of [artifactA, artifactB]) assert.equal(Buffer.from(payloads.flat()).toString('utf8'), text);
});

test('chapter 3: UTF-8, memory, padding, chunk overlap, context, and cost', () => {
  assert.deepEqual([...Buffer.from('A\u00e9', 'utf8')], [65, 195, 169]);
  assert.deepEqual([...Buffer.from('e\u0301', 'utf8')], [101, 204, 129]);
  assert.equal('e\u0301'.normalize('NFC'), '\u00e9');
  const parameters = 64000 * 2048;
  assert.equal(parameters, 131072000);
  assert.equal(parameters * 2, 262144000);
  assert.equal(parameters * 2 / 2 ** 20, 250);
  assert.equal(50000 * 768 * 2 / 1e6, 76.8);
  near((10 - (3 + 5)) / 10, 0.2);
  near((15 - (2 + 4 + 5)) / 15, 4 / 15);
  const chunks = [];
  for (let start = 1; start <= 1250; start += 500 - 50) chunks.push([start, Math.min(start + 499, 1250)]);
  assert.deepEqual(chunks, [[1, 500], [451, 950], [901, 1250]]);
  assert.equal(chunks.reduce((sum, [start, end]) => sum + end - start + 1, 0), 1350);
  const input = 1000 + 2000 + 7000 + 1000;
  assert.equal(16000 - input - 3000, 2000);
  assert.equal(16000 - (input + 2500) - 3000, -500);
  near(input / 1e6 * 2 + 1200 / 1e6 * 6, 0.0292);
});

test('chapter 1: coordinate arithmetic, similarity, and matrix examples', () => {
  assert.equal(dot([1, 2], [2, 1]), 4);
  assert.equal(dot([1, 2], [4, 2]), 8);
  near(cosine([1, 2], [2, 1]), 0.8);
  near(cosine([1, 2], [4, 2]), 0.8);
  near(cosine([1, 0], [1, 0.1]), 0.9950371902);
  assert.deepEqual(multiply([[1, 2, -1], [0, 1, 1]], [[2], [1], [3]]), [[1], [4]]);
  assert.deepEqual(multiply([[1, 2], [3, 4]], [[2, 0], [1, 3]]), [[4, 6], [10, 12]]);
  assert.deepEqual(multiply([[2, 0], [1, 3]], [[1, 2], [3, 4]]), [[2, 4], [10, 14]]);
});

test('chapter 1: attention weights, singular map, and low-rank counts', () => {
  const p = softmax([0, Math.log(3)]);
  near(p[0], 0.25);
  near(p[1], 0.75);
  const [output] = multiply([p], [[2, 0], [0, 4]]);
  near(output[0], 0.5);
  near(output[1], 3);
  const singular = [[1, 1], [2, 2]];
  assert.deepEqual(multiply(singular, [[1], [0]]), multiply(singular, [[0], [1]]));
  assert.equal(256 ** 2 / (256 * 4 + 4 * 256), 32);
  assert.equal(128 * 4 + 4 * 64, 768);
  near(9 / (9 + 1), 0.9);
});

test('chapter 2: local changes and two-parameter updates', () => {
  near(2.01 ** 2 - 4, 0.0401);
  near(1.99 ** 2 + 2 * 0.98 ** 2, 5.8809);
  near(1.6 ** 2 + 2 * 0.6 ** 2, 3.28);
  near((-0.4) ** 2 + 2 * (-1.4) ** 2, 4.08);
  near((1.4 * 2 + 1.2 - 5) ** 2, 1);
  near(Math.hypot(1.2, 1.6), 2);
});

test('chain-rule examples agree with independent finite differences', () => {
  const derivative = (f, x) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
  near(derivative(w => (2 * w + 1 - 5) ** 2, 1), -8);
  near(derivative(b => (2 + b - 5) ** 2, 1), -4);
  near(derivative(w => (3 * w) ** 2 + w, 2), 37);
});

test('descent converges or oscillates/diverges for the stated rates', () => {
  const first = descentStep(0, 0.1);
  near(first.weight, 0.8);
  near(first.loss, 10.24);
  const second = descentStep(first.weight, 0.1);
  near(second.weight, 1.44);
  near(second.loss, 6.5536);
  near(descentStep(0, 0.5).loss, 0);
  near(descentStep(0, 1).weight, 8);
  near(descentStep(8, 1).weight, 0);
  assert.ok(descentStep(0, 1.1).loss > 16);
});

test('softmax and cross-entropy match worked examples and gradients', () => {
  const p = softmax([2, 1, 0]);
  near(p[0], 0.6652409558);
  near(-Math.log(p[0]), 0.4076059644);
  near(-Math.log(0.9), 0.1053605157);
  near(-Math.log(0.1), 2.3025850930);
  softmax([1002, 1001, 1000]).forEach((value, i) => near(value, p[i]));
  softmax([1000, 1000, 1000]).forEach(value => near(value, 1 / 3));
  for (let i = 0; i < 3; i++) {
    const shifted = delta => [2, 1, 0].map((v, j) => v + (i === j ? delta : 0));
    const numerical = (-Math.log(softmax(shifted(1e-5))[0]) + Math.log(softmax(shifted(-1e-5))[0])) / 2e-5;
    near(numerical, p[i] - (i === 0 ? 1 : 0));
  }
  near(p.reduce((a, b) => a + b, 0), 1);
});

test('undefined similarity and malformed numerical inputs are explicit errors', () => {
  assert.throws(() => cosine([0, 0], [1, 2]), RangeError);
  assert.throws(() => dot([1], [1, 2]), RangeError);
  assert.throws(() => softmax([]), RangeError);
  assert.throws(() => softmax([Infinity, 1]), RangeError);
});

test('expanded algebra: inverse recovery and least-squares optimality', () => {
  const inverse = [[1, -1], [-1, 2]];
  assert.deepEqual(multiply([[2, 1], [1, 1]], inverse), [[1, 0], [0, 1]]);
  assert.deepEqual(multiply(inverse, [[5], [3]]), [[2], [1]]);
  const x = [[1, 0], [1, 1], [1, 2]];
  const transpose = [[1, 1, 1], [0, 1, 2]];
  assert.deepEqual(multiply(transpose, x), [[3, 3], [3, 5]]);
  assert.deepEqual(multiply(transpose, [[1], [2], [2]]), [[5], [6]]);
  const loss = ([b, w]) => [1, 2, 2].reduce((s, y, i) => s + (b + w * i - y) ** 2, 0);
  const fitted = [7 / 6, 1 / 2];
  near(loss(fitted), 1 / 6);
  for (const [db, dw] of [[0.1, 0], [-0.1, 0], [0, 0.1], [0.1, -0.1]]) {
    assert.ok(loss([fitted[0] + db, fitted[1] + dw]) > loss(fitted));
  }
  near(Math.acos(0.8) * 180 / Math.PI, 36.86989765);
});

test('expanded algebra: covariance construction, eigenpairs and SVD truncation', () => {
  const data = [[1, 2], [2, 3], [3, 4]];
  const mean = data[0].map((_, j) => data.reduce((s, row) => s + row[j], 0) / data.length);
  assert.deepEqual(mean, [2, 3]);
  const centered = data.map(row => row.map((v, j) => v - mean[j]));
  const transpose = centered[0].map((_, j) => centered.map(row => row[j]));
  const covariance = multiply(transpose, centered).map(row => row.map(v => v / (data.length - 1)));
  assert.deepEqual(covariance, [[1, 1], [1, 1]]);
  assert.deepEqual(multiply(covariance, [[1], [1]]), [[2], [2]]);
  assert.deepEqual(multiply(covariance, [[1], [-1]]), [[0], [0]]);
  const coordinates = centered.map(row => dot(row, [1 / Math.SQRT2, 1 / Math.SQRT2]));
  near(coordinates.reduce((s, v) => s + v * v, 0) / 2, 2);
  const a = [[3, 0], [0, 1], [0, 0]];
  const truncated = [[3, 0], [0, 0], [0, 0]];
  near(Math.hypot(...a.flatMap((row, i) => row.map((v, j) => v - truncated[i][j]))), 1);
  assert.deepEqual(multiply(a, [[2], [4]]), [[6], [4], [0]]);
  assert.deepEqual(multiply([[2, 1], [1, 2]], [[1], [-1]]), [[1], [-1]]);
});

test('expanded calculus: differentiation rules and matrix backpropagation', () => {
  const derivative = (f, x) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
  for (const [f, x, expected] of [
    [x => 3 * x * x + 2 * x + 5, 2, 14],
    [x => (x + 1) * x * x, 2, 16],
    [x => x / (x + 1), 1, 0.25],
    [x => (2 * x + 1) ** 2, 1, 12],
    [x => Math.log(x), 2, 0.5]
  ]) near(derivative(f, x), expected);
  near(3 * 2.01 ** 2 + 2 * 2.01 + 5, 21.1403);
  const x = [[1, 2], [3, 4]];
  const loss = ([a, b]) => multiply(x, [[a], [b]]).reduce((sum, [v], i) => sum + (v - [3, 12][i]) ** 2, 0);
  near(derivative(a => loss([a, 1]), 2), -10);
  near(derivative(b => loss([2, b]), 1), -12);
  assert.deepEqual(multiply([[2], [-4]], [[2, 1]]), [[4, 2], [-8, -4]]);
  const sigmoid = x => 1 / (1 + Math.exp(-x));
  near(sigmoid(Math.log(3)), 0.75);
  near(derivative(sigmoid, Math.log(9)), 0.09);
});

test('expanded calculus: batch averages, momentum and bias-corrected Adam', () => {
  const gradients = [1, 3, 5, 7].map(target => -2 * target);
  near(gradients.reduce((a, b) => a + b) / gradients.length, -8);
  near((gradients[0] + gradients[1]) / 2, -4);
  let velocity = 0, weight = 0;
  for (const gradient of [-4, -3]) {
    velocity = 0.9 * velocity + gradient;
    weight -= 0.1 * velocity;
  }
  near(velocity, -6.6);
  near(weight, 1.06);
  const m = (1 - 0.9) * -4, v = (1 - 0.99) * (-4) ** 2;
  const correctedM = m / (1 - 0.9), correctedV = v / (1 - 0.99);
  near(correctedM, -4);
  near(correctedV, 16);
  near(-0.1 * correctedM / (Math.sqrt(correctedV) + 1e-8), 0.1);
  near((1 - 0.1 * 0.01) * 5, 4.995);
});

test('expanded calculus: mixed curvature, stationary points and narrow valleys', () => {
  const f = (u, v) => u * u + u * v + 2 * v * v;
  const h = 1e-3, u = 1, v = 2;
  const mixed = (f(u + h, v + h) - f(u + h, v - h) - f(u - h, v + h) + f(u - h, v - h)) / (4 * h * h);
  near(mixed, 1, 1e-6);
  near((f(u + h, v) - 2 * f(u, v) + f(u - h, v)) / (h * h), 2, 1e-6);
  near((f(u, v + h) - 2 * f(u, v) + f(u, v - h)) / (h * h), 4, 1e-6);
  const twoWell = x => x ** 4 / 4 - x ** 3 / 3 - x ** 2;
  near(twoWell(-1), -5 / 12);
  near(twoWell(2), -8 / 3);
  near(0.982 ** 2, 0.964324);
  near(0.5 * (2 * 0.01 ** 2 + 4 * 0.02 ** 2), 0.0009);
  near(0 - (-8) / 2, 4);
});

test('expanded calculus: sequence likelihood and integral rectangle bounds', () => {
  near(-Math.log(0.5 * 0.25), 2.0794415417);
  near((-Math.log(0.5) - Math.log(0.25)) / 2, 1.0397207708);
  const rectangles = (n, right) => Array.from({ length: n }, (_, j) => 2 * ((j + (right ? 1 : 0)) * 3 / n) * 3 / n).reduce((a, b) => a + b, 0);
  near(rectangles(3, false), 6);
  near(rectangles(3, true), 12);
  near(rectangles(6, false), 7.5);
  near(rectangles(6, true), 10.5);
  assert.ok(Math.abs(rectangles(3000, true) - 9) < 0.004);
  assert.ok(Math.abs(rectangles(3000, false) - 9) < 0.004);
});
