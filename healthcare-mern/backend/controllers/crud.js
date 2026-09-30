// Generic CRUD controller factory: reuse for any Mongoose model
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const crud = (Model, { populate = '', searchFields = [] } = {}) => ({
  // GET /  ?page=1&limit=10&search=abc
  getAll: asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const { search } = req.query;

    const filter = {};
    if (search && searchFields.length) {
      const rx = new RegExp(escapeRegex(search), 'i');
      filter.$or = searchFields.map((f) => ({ [f]: rx }));
    }

    let query = Model.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit);
    if (populate) query = query.populate(populate);

    const [items, total] = await Promise.all([query, Model.countDocuments(filter)]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
  }),

  // GET /:id
  getOne: asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (populate) query = query.populate(populate);
    const doc = await query;
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  }),

  // POST /
  create: asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  }),

  // PUT /:id
  update: asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  }),

  // DELETE /:id
  remove: asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  }),
});

export { asyncHandler };
