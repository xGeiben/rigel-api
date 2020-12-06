// =====================
// Port
// ====================
process.env.PORT = process.env.PORT || 3000;


// =====================
// Token expiration
// =====================
// 60 seconds * 60 minutes * 24 hours * 30 days
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30 ;

// =====================
// AUTH SEED
// ====================
process.env.SEED = process.env.SEED || 'secret-seed-dev';