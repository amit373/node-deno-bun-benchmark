# Deno API (Oak)

Secure Student Management API built with Deno 2 and Oak framework.

## Features

- **Deno 2.x**: Modern, secure JavaScript/TypeScript runtime
- **Oak Framework**: Express-like middleware framework for Deno
- **Built-in Security**: Deno's permission system
- **TypeScript Native**: No build step required
- **JWT Auth**: Secure authentication
- **RBAC**: Role-based access control

## Getting Started

### Prerequisites

- Deno 2.x

### Development

```bash
deno task dev
```

### Production

```bash
deno task start
```

### Testing

```bash
deno task test
```

### Benchmarking

```bash
deno task benchmark
```

## API Endpoints

Same as Express API - see main README for full documentation.

## Security

Deno runs with explicit permissions:

- `--allow-net`: Network access
- `--allow-env`: Environment variables
- `--allow-read`: File system read

## Performance

Deno offers excellent performance with built-in TypeScript support and modern V8 optimizations.

## License

MIT
