<?php

namespace App\Http\Controllers;

use App\Models\AuditType;
use App\Models\AuditTypeItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditTypesController extends Controller
{
    public function typesView()
    {
        $user = auth()->user();

        if ($user->role === 'client_operator') {
            return redirect()->route('dashboard');
        }

        return Inertia::render('audits/types/page', [
            'types' => AuditType::all(),
            'user' => $user,
        ]);
    }

    public function typesConfigurationView($id)
    {
        $user = auth()->user();
        $items = AuditTypeItem::where('audit_type_id', $id)
            ->orderBy('order')
            ->get();

        if ($user->role === 'client_operator') {
            return redirect()->route('dashboard');
        }

        return Inertia::render('audits/types/configuration/page', [
            'type' => AuditType::find($id),
            'items' => $items,
            'user' => $user,
        ]);
    }

    public function reorderItems(Request $request, $id)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:audit_type_items,id',
            'items.*.order' => 'required|numeric',
        ]);

        foreach ($request->items as $item) {
            AuditTypeItem::where('id', $item['id'])
                ->where('audit_type_id', $id)
                ->update(['order' => $item['order']]);
        }

        return response()->json(['success' => true]);
    }

    public function createItem(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'term' => 'required|string',
            'laws' => 'required|string',
        ]);

        AuditTypeItem::create([
            'name' => $request->name,
            'term' => $request->term,
            'laws' => $request->laws,
            'audit_type_id' => $request->audit_type_id,
            'order' => $request->order,
        ]);

        return response()->json(['success' => true]);
    }

    public function editItem(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'term' => 'required|string',
            'laws' => 'required|string',
            'order' => 'required|numeric',
        ]);

        $item = AuditTypeItem::find($id);
        $item->name = $request->name;
        $item->term = $request->term;
        $item->laws = $request->laws;
        $item->order = $request->order;
        $item->save();

        return response()->json(['success' => true]);
    }

    public function deleteItem($id)
    {
        AuditTypeItem::find($id)->delete();

        return response()->json(['success' => true]);
    }
}
