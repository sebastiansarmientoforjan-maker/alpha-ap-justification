import { NextResponse } from 'next/server';
import { testPDFCompilation } from '@/lib/pdf/cloud-generator';

export async function GET() {
  try {
    console.log('🧪 Testing Railway PDF Compiler...');
    console.log('📡 URL:', process.env.PDF_COMPILER_URL);

    const pdfBuffer = await testPDFCompilation();

    console.log('✅ PDF compiled successfully!');
    console.log(`📊 Size: ${pdfBuffer.length} bytes`);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=test-railway.pdf'
      }
    });
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    return NextResponse.json({
      error: 'PDF compilation failed',
      message: error.message
    }, { status: 500 });
  }
}
