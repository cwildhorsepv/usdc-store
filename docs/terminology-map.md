# Merlin Federated Value Wallet — Terminology Map
*(Addendum A companion file for Lexicon v1.3)*

This reference defines the public-facing vocabulary used in the USDC Store Sandbox
and its internal mapping to the Federated Value Lexicon.

| UI / UX Term | Lexicon Equivalent | Description / Usage |
|---------------|--------------------|---------------------|
| Wallet | Viewport | Individual projection of feds for a user |
| Wallets | Aggregated Viewports | Unified display of multiple wallets |
| Transaction | Pledge Object | Contract or hold over value |
| Account | Endpoint | Funding or custody source |
| Balance | Fed | Atomic unit of value |
| Delegate | Derived Viewport | Limited-rights projection |
| Processor | Federation Agent | Trusted operational service |
| Portfolio | Aggregated Viewport | Cross-wallet overview |
| Service Provider | Federation Agent | Third-party handler |
| Linked Account | Endpoint | Connected external account |
| Shared Wallet | Derived Viewport | Team or view-only wallet |
| Payment Contract | Pledge Object | Transaction with terms |
| Trusted Operator | Federation Agent | Authorized settlement node |

### Usage Policy
* UI copywriters and designers use **UI terms** for readability.  
* Engineers and integrators use **Lexicon terms** in code and schema.  
* Documentation and API specs include both (e.g., `Wallet (Viewport)`).

---
> This map ensures consistent language across all layers of the Federated Value Platform
and should accompany every release that touches user-facing terminology.
