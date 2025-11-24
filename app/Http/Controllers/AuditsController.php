<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\AuditType;
use App\Models\AuditTypeItem;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditsController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = Audit::with([
            'client',
            'auditType',
            'items.auditTypeItem',
        ]);

        // Si el usuario tiene un client_id, solo mostrar auditorías de ese cliente
        if ($user->client_id) {
            $query->where('client_id', $user->client_id);
        } else {
            // Filtrar por cliente (solo si el usuario no tiene client_id asignado)
            if ($request->has('client_id') && $request->client_id !== 'all') {
                $query->where('client_id', $request->client_id);
            }
        }

        // Filtrar por tipo de auditoría
        if ($request->has('audit_type_id') && $request->audit_type_id !== 'all') {
            $query->where('audit_type_id', $request->audit_type_id);
        }

        // Filtrar por rango de fechas de vencimiento
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereHas('items', function ($q) use ($request) {
                $q->whereBetween('expiry_date', [$request->start_date, $request->end_date]);
            });
        } elseif ($request->has('start_date')) {
            $query->whereHas('items', function ($q) use ($request) {
                $q->where('expiry_date', '>=', $request->start_date);
            });
        } elseif ($request->has('end_date')) {
            $query->whereHas('items', function ($q) use ($request) {
                $q->where('expiry_date', '<=', $request->end_date);
            });
        }

        $audits = $query->get();
        
        // Si el usuario tiene un client_id, solo devolver ese cliente
        if ($user->client_id) {
            $clients = Client::where('id', $user->client_id)->get();
        } else {
            $clients = Client::all();
        }
        
        $auditTypes = AuditType::all();

        return Inertia::render('audits/page', [
            'audits' => $audits,
            'clients' => $clients,
            'auditTypes' => $auditTypes,
            'user' => $user,
        ]);
    }

    public function createView()
    {
        $user = auth()->user();
        
        // Si el usuario tiene un client_id, solo devolver ese cliente
        if ($user->client_id) {
            $clients = Client::where('id', $user->client_id)->get();
        } else {
            $clients = Client::all();
        }
        
        $auditTypes = AuditType::all();

        return Inertia::render('audits/create/page', [
            'user' => $user,
            'clients' => $clients,
            'auditTypes' => $auditTypes,
        ]);
    }

    public function getAuditTypeItems($auditTypeId)
    {
        $items = AuditTypeItem::where('audit_type_id', $auditTypeId)
            ->whereNull('deleted_at')
            ->orderBy('order')
            ->get();

        return response()->json($items);
    }

    public function create(Request $request)
    {
        $request->validate([
            'clientId' => 'required|integer|exists:clients,id',
            'auditTypeId' => 'required|integer|exists:audit_types,id',
            'creationDate' => 'required|date_format:Y-m-d',
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:audit_type_items,id,deleted_at,NULL',
            'items.*.date' => 'required|date_format:Y-m-d',
            'items.*.expiry_date' => 'nullable|date_format:Y-m-d',
            'items.*.apply' => 'nullable|boolean',
            'items.*.complies' => 'nullable|boolean',
            'items.*.documents' => 'nullable|string',
            'items.*.comments' => 'nullable|string',
            'items.*.status' => 'nullable|string|in:warning,normal,error',
        ]);

        $user = auth()->user();
        
        // Si el usuario tiene un client_id, verificar que solo cree auditorías para su cliente
        if ($user->client_id && $user->client_id != $request->clientId) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para crear auditorías para este cliente'
            ], 403);
        }

        // Create the audit
        $audit = Audit::create([
            'client_id' => $request->clientId,
            'audit_type_id' => $request->auditTypeId,
            'creation_date' => $request->creationDate,
        ]);

        // Create audit items
        foreach ($request->items as $item) {
            $audit->items()->create([
                'audit_type_item_id' => $item['id'],
                'date' => $item['date'],
                'expiry_date' => $item['expiry_date'] ?? null,
                'apply' => $item['apply'] ?? true,
                'complies' => $item['complies'] ?? false,
                'documents' => $item['documents'] ?? null,
                'comments' => $item['comments'] ?? null,
                'status' => $item['status'] ?? 'normal',
            ]);
        }

        response()->json(['success' => true]);
    }

    public function view($id)
    {
        $user = auth()->user();
        $query = Audit::with(['client', 'auditType', 'items.auditTypeItem']);
        
        // Si el usuario tiene un client_id, verificar que la auditoría pertenezca a ese cliente
        if ($user->client_id) {
            $query->where('client_id', $user->client_id);
        }
        
        $audit = $query->find($id);

        if (!$audit) {
            abort(404, 'Auditoría no encontrada o no tienes permisos para verla');
        }

        return Inertia::render('audits/view/page', [
            'audit' => $audit,
            'user' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'clientId' => 'required|integer|exists:clients,id',
            'auditTypeId' => 'required|integer|exists:audit_types,id',
            'creationDate' => 'required|date_format:Y-m-d',
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:audit_type_items,id,deleted_at,NULL',
            'items.*.date' => 'required|date_format:Y-m-d',
            'items.*.expiry_date' => 'nullable|date_format:Y-m-d',
            'items.*.apply' => 'nullable|boolean',
            'items.*.complies' => 'nullable|boolean',
            'items.*.documents' => 'nullable|string',
            'items.*.comments' => 'nullable|string',
            'items.*.status' => 'nullable|string|in:warning,normal,error',
        ]);

        $user = auth()->user();
        $query = Audit::query();
        
        // Si el usuario tiene un client_id, verificar que la auditoría pertenezca a ese cliente
        if ($user->client_id) {
            $query->where('client_id', $user->client_id);
        }
        
        $audit = $query->find($id);

        if (!$audit) {
            return response()->json([
                'success' => false,
                'message' => 'Auditoría no encontrada o no tienes permisos para editarla'
            ], 404);
        }

        $audit->client_id = $request->clientId;
        $audit->audit_type_id = $request->auditTypeId;
        $audit->creation_date = $request->creationDate;
        $audit->items()->delete();
        foreach ($request->items as $item) {
            $audit->items()->create([
                'audit_type_item_id' => $item['id'],
                'date' => $item['date'],
                'expiry_date' => $item['expiry_date'] ?? null,
                'apply' => $item['apply'] ?? true,
                'complies' => $item['complies'] ?? false,
                'documents' => $item['documents'] ?? null,
                'comments' => $item['comments'] ?? null,
                'status' => $item['status'] ?? 'normal',
            ]);
        }
        $audit->save();

        return response()->json(['success' => true, 'audit' => $audit]);
    }

    public function print($id)
    {
        $user = auth()->user();
        $query = Audit::with(['client', 'auditType', 'items.auditTypeItem']);
        
        // Si el usuario tiene un client_id, verificar que la auditoría pertenezca a ese cliente
        if ($user->client_id) {
            $query->where('client_id', $user->client_id);
        }
        
        $audit = $query->find($id);

        if (!$audit) {
            abort(404, 'Auditoría no encontrada o no tienes permisos para verla');
        }

        return Inertia::render('audits/print/page', [
            'audit' => $audit,
            'user' => $user,
        ]);
    }

    public function delete($id)
    {
        $user = auth()->user();
        $query = Audit::query();
        
        // Si el usuario tiene un client_id, verificar que la auditoría pertenezca a ese cliente
        if ($user->client_id) {
            $query->where('client_id', $user->client_id);
        }
        
        $audit = $query->find($id);

        if (!$audit) {
            return response()->json([
                'success' => false,
                'message' => 'Auditoría no encontrada o no tienes permisos para eliminarla'
            ], 404);
        }

        // Soft delete de la auditoría
        $audit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Auditoría eliminada exitosamente'
        ]);
    }

    /**
     * Enviar notificaciones de vencimientos por email (para cron job)
     * Endpoint público de uso interno
     */
    public function sendExpiryNotifications(Request $request)
    {
        $now = now();
        $thirtyDaysFromNow = $now->copy()->addDays(30);

        // Obtener items vencidos (pasado hasta hoy)
        $expiredItems = \App\Models\AuditItem::with(['audit.client', 'audit.auditType', 'auditTypeItem'])
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<', $now)
            ->whereHas('audit.client') // Asegurar que el audit tenga un cliente
            ->whereHas('auditTypeItem') // Asegurar que el item type no esté eliminado
            ->get();

        // Obtener items próximos a vencer (desde hoy hasta 30 días)
        $expiringSoonItems = \App\Models\AuditItem::with(['audit.client', 'audit.auditType', 'auditTypeItem'])
            ->whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [$now, $thirtyDaysFromNow])
            ->whereHas('audit.client') // Asegurar que el audit tenga un cliente
            ->whereHas('auditTypeItem') // Asegurar que el item type no esté eliminado
            ->get();

        $expired = [];
        $expiringSoon = [];

        // Procesar items vencidos
        foreach ($expiredItems as $item) {
            $expiryDate = \Carbon\Carbon::parse($item->expiry_date);
            $daysRemaining = $now->diffInDays($expiryDate, false);

            $expired[] = [
                'client_name' => $item->audit->client->name,
                'audit_type_name' => $item->audit->auditType->name,
                'item_name' => $item->auditTypeItem->name,
                'expiry_date' => $item->expiry_date,
                'days_remaining' => round($daysRemaining),
                'audit_id' => $item->audit->id,
            ];
        }

        // Procesar items próximos a vencer
        foreach ($expiringSoonItems as $item) {
            $expiryDate = \Carbon\Carbon::parse($item->expiry_date);
            $daysRemaining = $now->diffInDays($expiryDate, false);

            $expiringSoon[] = [
                'client_name' => $item->audit->client->name,
                'audit_type_name' => $item->audit->auditType->name,
                'item_name' => $item->auditTypeItem->name,
                'expiry_date' => $item->expiry_date,
                'days_remaining' => round($daysRemaining),
                'audit_id' => $item->audit->id,
            ];
        }

        // Ordenar por fecha de vencimiento
        usort($expired, function($a, $b) {
            return strtotime($a['expiry_date']) - strtotime($b['expiry_date']);
        });

        usort($expiringSoon, function($a, $b) {
            return strtotime($a['expiry_date']) - strtotime($b['expiry_date']);
        });

        // Preparar datos para la respuesta
        $recipientEmail = env('EXPIRY_NOTIFICATION_EMAIL', 'admin@example.com');
        $currentDate = $now->locale('es')->translatedFormat('d/m/Y');
        $endDate = $thirtyDaysFromNow->locale('es')->translatedFormat('d/m/Y');

        // Si se pasa el parámetro preview=true, solo retornar los datos sin enviar email
        if ($request->query('preview') === 'true' || $request->query('dry_run') === 'true') {
            return response()->json([
                'success' => true,
                'message' => 'Vista previa - Email NO enviado (modo prueba)',
                'data' => [
                    'expired_count' => count($expired),
                    'expiring_soon_count' => count($expiringSoon),
                    'email_would_be_sent_to' => $recipientEmail,
                    'current_date' => $currentDate,
                    'end_date' => $endDate,
                    'expired_items' => $expired,
                    'expiring_soon_items' => $expiringSoon,
                ]
            ]);
        }

        // Enviar email
        try {
            \Illuminate\Support\Facades\Mail::to($recipientEmail)
                ->send(new \App\Mail\ExpiryNotificationMail(
                    $expiringSoon,
                    $expired,
                    $currentDate,
                    $endDate
                ));

            return response()->json([
                'success' => true,
                'message' => 'Notificación enviada exitosamente',
                'data' => [
                    'expired_count' => count($expired),
                    'expiring_soon_count' => count($expiringSoon),
                    'email_sent_to' => $recipientEmail,
                    'current_date' => $currentDate,
                    'end_date' => $endDate,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el email: ' . $e->getMessage()
            ], 500);
        }
    }
}
