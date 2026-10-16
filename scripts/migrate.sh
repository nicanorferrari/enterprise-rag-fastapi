#!/usr/bin/env bash
set -euo pipefail

echo "==> Running database migrations for RAG backend..."
psql "${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/rag_db}" -f ./sql/migrations/001_init_pgvector.sql
echo "==> Migrations applied successfully."