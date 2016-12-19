const httperrors = require('httperrors');

module.exports = (qs) => {
  const query = {};
  if (qs.per_page) query.limit = qs.per_page;
  if (qs.page) {
    if (!qs.per_page) throw httperrors.BadRequest('Cannot calculate page without per_page');

    query.offset = qs.per_page * (qs.page - 1);
  }

  if (qs.sort) {
    if (qs.sort.indexOf(',') > -1) throw httperrors.BadRequest('Cannot sort by multiple properties');

    if (qs.sort.charAt(0) === '-') {
      query.order = [[qs.sort.slice(1), 'DESC']];
    } else {
      query.order = [[qs.sort, 'ASC']];
    }
  }

  query.where = Object.keys(qs).reduce((f, k) => {
    if (k.slice(0, 7) === 'filter[') {
      f[k.slice(7, -1)] = qs[k];
      return f;
    }
    return f;
  }, {});

  if (qs.created_since) {
    query.where.created_at = { $gt: qs.created_since };
  }

  if (qs.created_before) {
    query.where.created_at = { $lt: qs.created_before };
  }

  if (qs.updated_since) {
    query.where.updated_at = { $gt: qs.updated_since };
  }

  if (qs.updated_before) {
    query.where.updated_at = { $lt: qs.updated_before };
  }

  if (query.where === {}) delete query.where;

  return query;
};
