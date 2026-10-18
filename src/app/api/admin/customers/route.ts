import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/firebase-admin';
import { listCustomers } from '@/lib/customers';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, 'crm.view');
    const limit = Number(request.nextUrl.searchParams.get('limit') || '50');
    const q = request.nextUrl.searchParams.get('q') || undefined;

    const customers = await listCustomers(limit, q);
    return NextResponse.json({ items: customers });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/customers GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
