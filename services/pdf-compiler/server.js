const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const execAsync = promisify(exec);
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per 15min
  message: 'Too many compilation requests, please try again later.'
});
app.use('/compile', limiter);

// API Key authentication
const API_KEY = process.env.PDF_COMPILER_API_KEY;

function authenticateAPIKey(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header'
    });
  }

  const token = authHeader.substring(7);

  if (token !== API_KEY) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key'
    });
  }

  next();
}

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'alpha-pdf-compiler',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Compile endpoint
app.post('/compile', authenticateAPIKey, async (req, res) => {
  const jobId = crypto.randomUUID();
  const { latexContent } = req.body;

  if (!latexContent) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Missing latexContent in request body'
    });
  }

  console.log(`[${jobId}] New compilation request`);

  try {
    // Create temp directory
    const tempDir = '/tmp';
    const texFile = path.join(tempDir, `${jobId}.tex`);
    const pdfFile = path.join(tempDir, `${jobId}.pdf`);

    // Write LaTeX file
    await fs.writeFile(texFile, latexContent, 'utf-8');
    console.log(`[${jobId}] LaTeX file written`);

    // Compile with pdflatex (run twice for references)
    console.log(`[${jobId}] Starting compilation...`);

    const compileCommand = `pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texFile}`;

    // First pass
    await execAsync(compileCommand, {
      cwd: tempDir,
      timeout: 30000 // 30 second timeout
    });

    // Second pass (for references)
    await execAsync(compileCommand, {
      cwd: tempDir,
      timeout: 30000
    });

    console.log(`[${jobId}] Compilation successful`);

    // Check if PDF was created
    await fs.access(pdfFile);

    // Read PDF
    const pdfBuffer = await fs.readFile(pdfFile);
    console.log(`[${jobId}] PDF read, size: ${pdfBuffer.length} bytes`);

    // Cleanup
    await cleanupFiles(jobId, tempDir);
    console.log(`[${jobId}] Cleanup completed`);

    // Send PDF
    res.contentType('application/pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error(`[${jobId}] Compilation error:`, error.message);

    // Cleanup even on error
    try {
      await cleanupFiles(jobId, '/tmp');
    } catch (cleanupError) {
      console.error(`[${jobId}] Cleanup error:`, cleanupError.message);
    }

    res.status(500).json({
      error: 'Compilation Failed',
      message: 'LaTeX compilation failed. Check your LaTeX syntax.',
      jobId: jobId
    });
  }
});

// Cleanup function
async function cleanupFiles(jobId, tempDir) {
  const extensions = ['.tex', '.pdf', '.aux', '.log', '.out', '.toc', '.nav', '.snm'];

  for (const ext of extensions) {
    const filePath = path.join(tempDir, `${jobId}${ext}`);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Ignore if file doesn't exist
      if (error.code !== 'ENOENT') {
        console.error(`Failed to delete ${filePath}:`, error.message);
      }
    }
  }
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Log error but don't expose details
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(60));
  console.log('🚀 Alpha PDF Compiler Service');
  console.log('='.repeat(60));
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ Compile endpoint: POST http://localhost:${PORT}/compile`);
  console.log(`🔐 API Key authentication: ${API_KEY ? 'ENABLED' : 'DISABLED (⚠️  WARNING)'}`);
  console.log('='.repeat(60));
});
