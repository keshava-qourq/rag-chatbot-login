"""In-process cosine similarity over JSON-stored embeddings.

`chunks.embedding` is a plain JSON list of floats on both SQLite and
Postgres -- neither database is asked for a vector type or an extension.
Similarity search instead happens here, in Python, with numpy: the chunk
count a free-tier document produces is small enough that no database-side
nearest-neighbour index is needed.
"""

import numpy as np


def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Cosine similarity between two embeddings, as a float in [-1, 1].

    Returns 0.0 for a zero-length vector rather than dividing by zero, since
    an embedding is never expected to be all zeros but a defensive caller
    should not crash if one ever is.
    """
    vec_a = np.asarray(a, dtype=float)
    vec_b = np.asarray(b, dtype=float)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))


def top_k_by_similarity(
    query_embedding: list[float],
    candidates: list[tuple[int, list[float]]],
    k: int,
) -> list[tuple[int, float]]:
    """Return the `k` (id, score) pairs from `candidates` most similar to the query.

    `candidates` is a list of (id, embedding) pairs, so callers can map the
    result back to the chunk it came from without a second lookup.
    """
    scored = [(cid, cosine_similarity(query_embedding, emb)) for cid, emb in candidates]
    scored.sort(key=lambda pair: pair[1], reverse=True)
    return scored[:k]
