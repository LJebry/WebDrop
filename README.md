# WebDrop

WebDrop is a web-based AirDrop-style MVP for nearby browser-to-browser file transfer.

Users open the same website, confirm a device name, automatically discover nearby devices, send a transfer request, and move file bytes directly between browsers over WebRTC `RTCDataChannel`.

## How It Works

1. The frontend connects to the Socket.IO signaling server.
2. The server places the socket into an internal nearby discovery channel derived from the client IP.
3. The client receives only nearby `PublicPeer` objects.
4. A sender chooses a nearby device and sends a transfer request.
5. The receiver accepts or rejects the request.
6. On accept, the browsers exchange WebRTC offer, answer, and ICE candidates through the signaling server.
7. File metadata and chunks are sent over `RTCDataChannel`.
8. The receiver rebuilds the file as a `Blob` and shows a download link.

The server never receives, stores, or relays file contents.

## Tech Stack

- pnpm workspaces
- Turbo
- TypeScript
- Next.js App Router
- React
- Tailwind CSS
- Zustand
- Node.js, Express, Socket.IO
- WebRTC `RTCDataChannel`
- Shared package for events, constants, and common types

## Setup

Install pnpm if needed:

```bash
corepack enable
corepack prepare pnpm@10.0.0 --activate
```

Install dependencies:

```bash
pnpm install
```

## Environment

Frontend, `apps/web/.env.local`:

```bash
NEXT_PUBLIC_SIGNALING_SERVER_URL=http://localhost:4000
```

Server, `apps/server/.env`:

```bash
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
```

Example files are included in both apps.

## Run Locally

```bash
pnpm dev
```

Then open:

- Frontend: `http://localhost:3000`
- Signaling health check: `http://localhost:4000/health`

Open two browser windows to test nearby discovery and transfers.

## Architecture

The monorepo has three main parts:

- `apps/web`: the Next.js UI, Socket.IO client, WebRTC connection logic, and file chunking.
- `apps/server`: the Express and Socket.IO signaling server.
- `packages/shared`: shared socket event names, constants, and TypeScript contracts.

The server is intentionally small. It tracks connected peers in memory, groups them for nearby discovery, forwards transfer requests, and forwards WebRTC signaling messages. It does not include authentication, storage, database access, accounts, or file history.

## Public-IP Discovery Limitations

The MVP groups nearby users by client IP. In production this usually means users behind the same NAT or network egress can see each other. This is a practical MVP strategy, but it is not precise physical proximity.

Limitations:

- Different networks in the same location may not see each other.
- Carrier-grade NAT can group unrelated users.
- VPNs and privacy relays can change discovery behavior.
- Local development uses a normalized local-development group for loopback and private LAN addresses.

## Future Improvements

- TURN server support for stricter networks
- Better nearby detection
- QR pairing fallback
- Optional device verification
- PWA install
- End-to-end encryption layer
- Redis adapter for multi-instance scaling
