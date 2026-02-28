<!-- BEGIN MCP Memory Service -->
# Kilo Code Rules
<mcp_memory_service_rules>
| Message                           | Required                                                           |
| --------------------------------- | ------------------------------------------------------------------ |
| **1st message**                   | Ensure MCP Memory Service is reachable and restore project context |
| **Subsequent messages (default)** | Retrieve relevant memories before coding                           |
| **Before file search**            | Query memory for prior decisions and known file locations          |
</mcp_memory_service_rules>

**Why?** MCP Memory Service preserves durable project context and reduces repeated discovery.

**Reference:** https://github.com/doobidoo/mcp-memory-service

## Legacy compatibility

- `init(...)` semantics: health check + context warm-up.
- `context(...)` semantics: recall first, persist outcome summary after action.
- `search(...)` semantics: memory-first retrieval, then local fallback.
<!-- END MCP Memory Service -->
