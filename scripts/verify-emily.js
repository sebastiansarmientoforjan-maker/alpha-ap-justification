/**
 * Verify Emily Smith's exact course
 */

require('dotenv').config({ path: '../Documents/alpha-tracker/.env.local' });

const API_KEY = process.env.MATH_ACADEMY_API_KEY;
const BASE_URL = process.env.MATH_ACADEMY_BASE_URL;

async function main() {
  console.log('==================================================');
  console.log('  VERIFYING EMILY SMITH COURSE');
  console.log('==================================================\n');

  // Fetch Emily's profile
  const response = await fetch(`${BASE_URL}/students/5433`, {
    headers: {
      'Public-API-Key': API_KEY,
      'Accept': 'application/json',
    },
  });

  const data = await response.json();
  const student = data.student;

  console.log('RAW API RESPONSE:');
  console.log('=====================================');
  console.log(JSON.stringify(student, null, 2));
  console.log('=====================================\n');

  console.log('PARSED DATA:');
  console.log(`ID: ${student.id}`);
  console.log(`First Name: ${student.firstName}`);
  console.log(`Last Name: ${student.lastName}`);
  console.log(`Email: ${student.email || 'N/A'}`);
  console.log(`Current Course (full object):`);
  console.log(JSON.stringify(student.currentCourse, null, 2));
  console.log('');

  if (student.currentCourse) {
    console.log('COURSE DETAILS:');
    console.log(`  Name: ${student.currentCourse.name}`);
    console.log(`  ID: ${student.currentCourse.id || 'N/A'}`);
  }

  console.log('\n==================================================\n');
}

main().catch(console.error);
