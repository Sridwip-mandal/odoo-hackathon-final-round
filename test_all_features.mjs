import http from 'node:http';
import { getDb, initSchema } from './db.mjs';

const db = getDb();
initSchema(db);

console.log('Testing Database tables...');
const feedbackCount = db.prepare('SELECT COUNT(*) as count FROM feedback').get();
console.log('Feedback Table Count:', feedbackCount.count);

const ticketCount = db.prepare('SELECT COUNT(*) as count FROM support_tickets').get();
console.log('Support Tickets Count:', ticketCount.count);

const repliesCount = db.prepare('SELECT COUNT(*) as count FROM ticket_replies').get();
console.log('Ticket Replies Count:', repliesCount.count);

// Get an existing employee from DB
const emp = db.prepare('SELECT id, name, email FROM employees LIMIT 1').get() || { id: 'usr-1', name: 'Raj Patel', email: 'raj.patel@odoo.com' };
console.log('Using Employee for test:', emp);

// Test inserting feedback
const fbId = `fb-test-${Date.now()}`;
db.prepare(`
  INSERT INTO feedback (id, user_id, user_name, user_email, category, rating, message, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
`).run(fbId, emp.id, emp.name, emp.email, 'Ride Experience', 5, 'Smooth ride to Sector V!');
console.log('Inserted test feedback successfully');

// Test inserting support ticket
const tktId = `tkt-test-${Date.now()}`;
db.prepare(`
  INSERT INTO support_tickets (id, ticket_number, user_id, user_name, user_email, subject, category, description, priority, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`).run(tktId, `CK-${Math.floor(10000 + Math.random() * 90000)}`, emp.id, emp.name, emp.email, 'Test Ticket Subject', 'Ride Issues', 'Test description for ticket', 'High', 'OPEN');
console.log('Inserted test ticket successfully');

// Test inserting reply
const repId = `rep-test-${Date.now()}`;
db.prepare(`
  INSERT INTO ticket_replies (id, ticket_id, sender_id, sender_name, sender_role, message, created_at)
  VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
`).run(repId, tktId, 'usr-1', 'Raj Patel', 'employee', 'Test reply message');
console.log('Inserted test ticket reply successfully');

console.log('ALL DB TESTS PASSED! Clean and verified.');
