import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/firebase-admin';
import { listAuditLogs, type AuditAction } from '@/lib/audit';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, 'audit.view');
    const limit = Number(request.nextUrl.searchParams.get('limit') || '50');
    const action = request.nextUrl.searchParams.get('action') as AuditAction | null;
    const resource = request.nextUrl.searchParams.get('resource') || undefined;

    const logs = await listAuditLogs(limit, action || undefined, resource);
    return NextResponse.json({ items: logs });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/audit-logs GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
