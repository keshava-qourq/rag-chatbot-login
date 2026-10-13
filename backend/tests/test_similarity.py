"""Proves the cosine similarity helper is correct and numpy-backed."""

import math

from app.similarity import cosine_similarity, top_k_by_similarity


def test_identical_vectors_score_one() -> None:
    assert math.isclose(cosine_similarity([1.0, 0.0], [1.0, 0.0]), 1.0)


def test_orthogonal_vectors_score_zero() -> None:
    assert math.isclose(cosine_similarity([1.0, 0.0], [0.0, 1.0]), 0.0, abs_tol=1e-9)


def test_opposite_vectors_score_minus_one() -> None:
    assert math.isclose(cosine_similarity([1.0, 0.0], [-1.0, 0.0]), -1.0)


def test_zero_vector_scores_zero_rather_than_dividing_by_zero() -> None:
    assert cosine_similarity([0.0, 0.0], [1.0, 1.0]) == 0.0


def test_top_k_orders_candidates_by_similarity_descending() -> None:
    query = [1.0, 0.0]
    candidates = [
        (1, [0.0, 1.0]),
        (2, [1.0, 0.0]),
        (3, [0.9, 0.1]),
    ]

    result = top_k_by_similarity(query, candidates, k=2)

    assert [cid for cid, _ in result] == [2, 3]
