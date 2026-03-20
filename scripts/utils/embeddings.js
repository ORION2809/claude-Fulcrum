#!/usr/bin/env node
'use strict';

/**
 * Phase 2.3 - ONNX Local Embeddings Provider
 * Source: memsearch (onnx.py)
 *
 * Local embedding inference without API dependency.
 * Uses @xenova/transformers (Node.js ONNX pipeline) for proper tokenization
 * with vocabulary-aware WordPiece/BPE, special tokens, and padding.
 * Falls back to simpleEmbed (hash-based) when transformer pipeline unavailable.
 *
 * Source: memsearch uses HuggingFace tokenizers + onnxruntime for Python.
 * Node.js equivalent: @xenova/transformers bundles tokenizer + ONNX runtime.
 */

const path = require('path');
const fs = require('fs');

const DEFAULT_MODEL = 'Xenova/all-MiniLM-L6-v2';
const DEFAULT_BATCH_SIZE = 32;
const DEFAULT_MAX_LENGTH = 512;
const CACHE_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE || '.',
  '.cache', 'fulcrum', 'onnx-models'
);

let pipelineInstance = null;
let providerReady = false;
let initError = null;

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function l2Normalize(vector) {
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (norm === 0) {
    return vector;
  }
  return vector.map(val => val / norm);
}

/**
 * Hash-based fallback embedding. Not semantically meaningful but deterministic.
 * Used when @xenova/transformers is not installed.
 */
function simpleEmbed(text, dimensions = 384) {
  const tokens = String(text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, DEFAULT_MAX_LENGTH);

  const vector = new Array(dimensions).fill(0);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    for (let j = 0; j < token.length && j < dimensions; j++) {
      const charCode = token.charCodeAt(j);
      const position = (i * 7 + j * 13 + charCode) % dimensions;
      vector[position] += (charCode / 127.0 - 0.5) * (1.0 / Math.sqrt(tokens.length));
    }
  }

  return l2Normalize(vector);
}

/**
 * Source: memsearch OnnxEmbedding — proper tokenizer + ONNX inference.
 * Node.js port uses @xenova/transformers which bundles:
 * - WordPiece/BPE tokenizer loaded from model's tokenizer.json
 * - Special tokens ([CLS]=101, [SEP]=102, [PAD]=0) handled automatically
 * - ONNX runtime session with CPU execution
 * - Automatic model download from HuggingFace Hub (like memsearch's hf_hub_download)
 */
async function initOnnxProvider(options = {}) {
  if (providerReady) {
    return true;
  }
  if (initError) {
    return false;
  }

  try {
    ensureCacheDir();

    let transformers;
    try {
      transformers = await import('@xenova/transformers');
    } catch {
      initError = new Error(
        '@xenova/transformers not installed. Run: npm install @xenova/transformers\n' +
        'This provides proper vocabulary-aware tokenization + ONNX inference.\n' +
        'Falling back to simpleEmbed (hash-based, not semantically meaningful).'
      );
      return false;
    }

    const modelName = options.model || DEFAULT_MODEL;

    // Source: memsearch hf_hub_download — auto-download model on first use
    // @xenova/transformers handles this automatically via pipeline()
    pipelineInstance = await transformers.pipeline('feature-extraction', modelName, {
      cache_dir: options.cacheDir || CACHE_DIR,
      quantized: options.quantized !== false, // default to quantized like memsearch's int8
    });

    providerReady = true;
    return true;
  } catch (err) {
    initError = err;
    return false;
  }
}

/**
 * Source: memsearch OnnxEmbedding._encode
 * Proper embedding via transformer pipeline with real tokenization.
 * Returns L2-normalized vectors (same as memsearch's normalization step).
 */
async function embedWithTransformers(texts) {
  if (!pipelineInstance) {
    throw new Error('Transformer pipeline not initialized');
  }

  const results = [];

  for (const text of texts) {
    // Pipeline handles: tokenization → ONNX inference → output extraction
    const output = await pipelineInstance(text, {
      pooling: 'cls',       // CLS pooling like memsearch's fallback
      normalize: true,       // L2 normalization like memsearch
    });

    results.push(Array.from(output.data));
  }

  return results;
}

async function embed(texts, options = {}) {
  if (!Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  const sanitizedTexts = texts.map(t => String(t || ''));
  const batchSize = options.batchSize || DEFAULT_BATCH_SIZE;

  const onnxAvailable = await initOnnxProvider(options);

  if (onnxAvailable) {
    const results = [];
    for (let i = 0; i < sanitizedTexts.length; i += batchSize) {
      const batch = sanitizedTexts.slice(i, i + batchSize);
      const batchResults = await embedWithTransformers(batch);
      results.push(...batchResults);
    }
    return results;
  }

  return sanitizedTexts.map(text => simpleEmbed(text, options.dimensions || 384));
}

function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

function isProviderReady() {
  return providerReady;
}

function getProviderError() {
  return initError;
}

module.exports = {
  embed,
  cosineSimilarity,
  l2Normalize,
  simpleEmbed,
  initOnnxProvider,
  isProviderReady,
  getProviderError,
  DEFAULT_MODEL,
  DEFAULT_BATCH_SIZE,
  CACHE_DIR,
};
