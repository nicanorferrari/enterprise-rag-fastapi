# Enterprise RAG Service with FastAPI & pgvector

Arquitectura de referencia para un microservicio desacoplado de **Retrieval-Augmented Generation (RAG)** en producción, diseñado para garantizar baja latencia, respuestas estrictamente ancladas a datos contextuales y mitigación de alucinaciones.

## 🏛️ Arquitectura del Sistema

```mermaid
graph LR
    Client[Cliente / Frontend] --> API[FastAPI Gateway]
    API --> Retriever[Semantic Retriever & Cross-Encoder]
    Retriever --> DB[(PostgreSQL + pgvector)]
    Retriever --> Context[Inyección Contextual Estricta]
    Context --> LLM[Model Inference API]
    LLM --> API
    API --> Client
