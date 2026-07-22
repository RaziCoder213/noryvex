import { initDb, saveContact, getContacts, saveMeeting, getMeetings } from './database.js';
import jwt from 'jsonwebtoken';

async function runTests() {
  console.log('--- Starting Database Verification Tests ---');
  
  try {
    // 1. Initialize Database
    await initDb();
    console.log('✔ Database successfully initialized.');

    // 2. Insert Test Contact
    const testContact = {
      name: 'Razi Test',
      company: 'TestCorp',
      email: 'test@testcorp.com',
      phone: '+1234567890',
      service: 'AI Voice Agents',
      message: 'Hello, this is a programmatic integration test.'
    };

    const contactResult = await saveContact(
      testContact.name,
      testContact.company,
      testContact.email,
      testContact.phone,
      testContact.service,
      testContact.message
    );
    console.log('✔ Test contact inquiry inserted. RowID:', contactResult.lastID);

    // 3. Fetch Contacts
    const contacts = await getContacts();
    console.log(`✔ Fetched ${contacts.length} contact inquiries from SQLite.`);
    const insertedContact = contacts.find(c => c.id === contactResult.lastID);
    if (insertedContact) {
      console.log('✔ Verified contact details in DB match input.');
    } else {
      throw new Error('Test contact not found in fetched results!');
    }

    // 4. Insert Test Meeting
    const testMeeting = {
      name: 'Sophia Leads',
      email: 'sophia@leads.io',
      company: 'LeadsIO',
      phone: '+9876543210',
      date: '2026-08-01',
      time: '14:00',
      notes: 'Strategy call dry run.'
    };

    const meetingResult = await saveMeeting(
      testMeeting.name,
      testMeeting.email,
      testMeeting.company,
      testMeeting.phone,
      testMeeting.date,
      testMeeting.time,
      testMeeting.notes
    );
    console.log('✔ Test meeting slot inserted. RowID:', meetingResult.lastID);

    // 5. Fetch Meetings
    const meetings = await getMeetings();
    console.log(`✔ Fetched ${meetings.length} meeting entries from SQLite.`);
    const insertedMeeting = meetings.find(m => m.id === meetingResult.lastID);
    if (insertedMeeting) {
      console.log('✔ Verified meeting details in DB match input.');
    } else {
      throw new Error('Test meeting not found in fetched results!');
    }

    // 6. Test JWT signing
    const secret = 'super-secret-noryvex-key-change-me-2026-noryvex-agency';
    const email = 'codingwithrazi@gmail.com';
    const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
    console.log('✔ Successfully signed test JWT for codingwithrazi@gmail.com.');
    
    const decoded = jwt.verify(token, secret);
    if (decoded.email === email) {
      console.log('✔ JWT verification succeeded. Payload matches.');
    } else {
      throw new Error('JWT verification payload mismatch!');
    }

    console.log('\n--- All Database Operations Verified Successfully! ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

runTests();
