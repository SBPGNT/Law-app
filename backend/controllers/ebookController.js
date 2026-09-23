const prisma = require('../config/db');

exports.getEbooks = async (req, res) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const ebooks = await prisma.ebook.findMany({
      where: search ? {
        OR: [
          { title: { contains: search } },
          { authorName: { contains: search } },
          { category: { contains: search } },
        ],
      } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json(ebooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEbookDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const ebook = await prisma.ebook.findUnique({ where: { id: parseInt(id) } });
    if (ebook) res.json(ebook);
    else res.status(404).json({ error: 'Ebook not found' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.userId },
      include: { ebook: true }
    });
    res.json(favorites.map(f => f.ebook));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { ebookId } = req.params;
    const existing = await prisma.favorite.findUnique({
      where: { userId_ebookId: { userId: req.user.userId, ebookId } }
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      await prisma.favorite.create({
        data: { userId: req.user.userId, ebookId }
      });
      res.json({ message: 'Added to favorites', isFavorite: true });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
