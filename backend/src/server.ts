import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import { corsMiddleware } from './middlewares/corsMiddleware';
import { errorHandler } from './middlewares/errorHandler';
import { queryDatabase, initializeDatabase } from './repository/database';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(express.json());
corsMiddleware(app);

const features = [
  { id: 1, name: 'Destination Gallery', description: 'Browse curated collections of international destinations' },
  { id: 2, name: 'Trip Planning', description: 'Create and manage your travel itineraries' },
  { id: 3, name: 'Budget Tracker', description: 'Keep track of your travel expenses' },
  { id: 4, name: 'Recommendations', description: 'Get personalized travel recommendations' },
  { id: 5, name: 'Community Reviews', description: 'Read and write travel reviews' },
  { id: 6, name: 'Travel Forums', description: 'Ask questions in active travel forums' },
];

const support = {
  email: 'support@travelmithra.com',
  phone: '+1-800-TRAVEL-1',
  hours: 'Monday - Friday, 9AM - 6PM UTC',
  faqCount: 45,
  ticketResolutionTime: '24 hours',
};

app.get('/', (req, res) => {
  res.json({ message: 'Travelmithra backend running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.get('/api/community', async (req, res) => {
  try {
    const result = await queryDatabase('SELECT * FROM community_stats LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch community data' });
  }
});

app.get('/api/features', async (req, res) => {
  try {
    const result = await queryDatabase('SELECT id, name, description FROM features');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch feature data' });
  }
});

app.get('/api/support', async (req, res) => {
  try {
    const result = await queryDatabase(
      'SELECT email, phone, hours, faq_count AS "faqCount", ticket_resolution_time AS "ticketResolutionTime" FROM support_info LIMIT 1'
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch support data' });
  }
});

app.get('/api/community/stories', async (req, res) => {
  try {
    const result = await queryDatabase('SELECT * FROM stories ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch stories' });
  }
});

app.post('/api/community/stories', async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'Title, content, and author are required' });
  }

  try {
    const result = await queryDatabase('INSERT INTO stories (title, content, author) VALUES ($1, $2, $3) RETURNING id', [
      title,
      content,
      author,
    ]);
    res.status(201).json({ id: result.rows[0].id, message: 'Story posted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to save story' });
  }
});

app.get('/api/community/tips', async (req, res) => {
  try {
    const result = await queryDatabase('SELECT * FROM tips ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch tips' });
  }
});

app.post('/api/community/tips', async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'Title, content, and author are required' });
  }

  try {
    const result = await queryDatabase('INSERT INTO tips (title, content, author) VALUES ($1, $2, $3) RETURNING id', [
      title,
      content,
      author,
    ]);
    res.status(201).json({ id: result.rows[0].id, message: 'Tip posted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to save tip' });
  }
});

app.get('/api/support/tickets', async (req, res) => {
  try {
    const result = await queryDatabase('SELECT * FROM support_tickets ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch support tickets' });
  }
});

app.post('/api/support/ticket', async (req, res) => {
  const { subject, description, email } = req.body;
  if (!subject || !description || !email) {
    return res.status(400).json({ error: 'Subject, description, and email are required' });
  }

  try {
    const result = await queryDatabase(
      'INSERT INTO support_tickets (subject, description, email) VALUES ($1, $2, $3) RETURNING id',
      [subject, description, email]
    );
    res.status(201).json({ ticketId: result.rows[0].id, message: 'Support ticket created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create ticket' });
  }
});

app.use(errorHandler);

function listenWithFallback(portNumber: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = app.listen(portNumber, () => {
      resolve(portNumber);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE' && portNumber < 65535) {
        console.warn(`Port ${portNumber} is busy, trying ${portNumber + 1}...`);
        server.close(() => {
          listenWithFallback(portNumber + 1).then(resolve).catch(reject);
        });
        return;
      }

      reject(error);
    });
  });
}

async function startServer() {
  try {
    await initializeDatabase();
    const listeningPort = await listenWithFallback(port);
    console.log(`Server running on http://localhost:${listeningPort}`);
  } catch (error) {
    console.error('Backend startup failed. Fix the database configuration and try again.');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

startServer();
