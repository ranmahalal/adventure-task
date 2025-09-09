# AI Exercise Generator - Installation Guide

## Prerequisites

Before setting up the application, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **OpenAI API Key**
- **Unsplash API Key** - Obtain from [Unsplash Developers](https://unsplash.com/developers)

## Installation (Git Repository)


### 1. Clone Repository

Clone the repository and navigate into the project directory:

```bash
git clone <repository-url>
cd adventure-task
```


### 2. Install Dependencies

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
cd ..
```
More dependencies:
```bash
npm install nodemon --save-dev
npm install concurrently --save-dev
cd backend 
npm install cors
```

Install development dependencies for concurrent execution:
```bash
npm install concurrently --save-dev
```

### 3. Environment Configuration

Create environment files using the templates included in the repository (`.env_example` files):

**`.env` (Root directory)** — base on `.env_example` at the root:
```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

Create environment file in the backend directory based on `backend/.env_example`:

**`backend/.env`:**
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
NODE_ENV=development
```

### 4. API Key Setup

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key to `backend/.env` as `OPENAI_API_KEY` (make sure you have credits)

#### Unsplash API Key
1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Create a free account
3. Create a new application
4. Copy the Access Key to `.env` as `REACT_APP_UNSPLASH_ACCESS_KEY`

### 4. Running the Application

Start both frontend and backend servers concurrently:
```bash
npm run dev
```

This command will:
- Start the backend server on port 5000
- Start the frontend development server on port 3000
- Automatically open the application in your browser

### 6. Access Information

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000


## Next Steps

After successful installation:
1. Test the application by generating exercises for a simple topic
2. Test different difficulty levels and tones
3. Check background image loading functionality