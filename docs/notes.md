Dynamic Enumerators (Future Consideration)

The enums defined in schema.prisma (EndpointType, PledgeStatus, etc.) are static in this POC for simplicity.
In production, these should become enumerator tables to support federated extensions (e.g., partner-defined endpoint types or pledge states).
This approach maintains forward compatibility without schema migrations.

🧩 Dynamic Enumerators — Future Consideration

For this POC the following enums are static in schema.prisma:

EndpointType

PledgeRole

PledgeStatus

FedType (via name field)

They’re fine for now, but in a production or federated deployment they should be converted into enumerator tables so new values can be introduced without a schema migration.
Each enumerator table would include:

Column	Purpose
id	Stable unique key (UUID or cuid)
name	Machine-readable code ("ETH", "BANK", "MILES")
label	Human-friendly display string
metadata	JSON field for icons, colors, partner IDs
active	Boolean flag
createdAt	Timestamp

Example:
Future EndpointType table could let partners register their own endpoint kinds (e.g. "POLYGON", "SOLANA", "LOYALTY").
The static enum would remain only as a fallback for legacy values.

Decision (POC Phase): Keep enums static for simplicity.
Action (Prod Phase): Refactor to enumerator tables and expose via /api/enums/* endpoints.
