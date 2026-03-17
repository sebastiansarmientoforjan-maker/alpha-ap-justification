/**
 * Test script for Railway PDF compiler
 * Run: npx ts-node test-railway-pdf.ts
 */

import { testPDFCompilation } from './lib/pdf/cloud-generator.ts';
import fs from 'fs';

async function test() {
  console.log('🧪 Testing Railway PDF Compiler...');
  console.log('📡 URL:', process.env.PDF_COMPILER_URL);
  console.log('');

  try {
    console.log('⏳ Compiling test PDF...');
    const pdfBuffer = await testPDFCompilation();

    const outputPath = 'test-railway-output.pdf';
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log('✅ PDF compiled successfully!');
    console.log(`📄 Saved to: ${outputPath}`);
    console.log(`📊 Size: ${pdfBuffer.length} bytes`);
    console.log('');
    console.log('🎉 Railway PDF Compiler is working correctly!');
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

test();
