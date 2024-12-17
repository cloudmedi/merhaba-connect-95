# Merhaba Connect Backend API

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/verify

### Users
- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

### Playlists
- GET /api/playlists
- GET /api/playlists/:id
- POST /api/playlists
- PUT /api/playlists/:id
- DELETE /api/playlists/:id

### Devices
- GET /api/devices
- GET /api/devices/:id
- POST /api/devices
- PUT /api/devices/:id
- DELETE /api/devices/:id

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/merhaba-connect
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production mode
npm start
```

## Testing

```bash
# Run tests
npm test
```

## Deployment

The backend can be deployed to any Node.js hosting service. We recommend using:
- Heroku
- DigitalOcean
- AWS Elastic Beanstalk

Make sure to set all required environment variables in your deployment environment.