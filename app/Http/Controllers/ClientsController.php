<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\IndustryCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ClientsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $categories = IndustryCategory::all();
        $clients = Client::with(['category', 'user_access'])->get();

        if ($user->role === 'client_operator') {
            return redirect()->route('dashboard');
        }

        return Inertia::render('clients/page', [
            'categories' => $categories,
            'clients' => $clients,
            'user' => $user,
        ]);
    }

    public function createView()
    {
        $user = auth()->user();
        $categories = IndustryCategory::all();

        if ($user->role === 'client_operator') {
            return redirect()->route('dashboard');
        }

        return Inertia::render('clients/create/page', [
            'categories' => $categories,
            'user' => $user,
        ]);
    }

    // create client backend
    public function create(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'cadastralNomenclature' => 'nullable|string|max:255',
                'phone' => 'required|string|max:255',
                'cuit' => 'required|string|max:255|unique:clients,cuit',
                'contactName' => 'required|string|max:255',
                'responsibleEmail' => 'required|email|max:255',
                'environmentalAuditResponsible' => 'nullable|email|max:255',
                'safetyAuditResponsible' => 'nullable|email|max:255',
                'category' => 'required|exists:industries_categories,id',
            ]);

            $client = Client::create([
                'name' => $request->name,
                'address' => $request->address,
                'cadastral_nomenclature' => $request->cadastralNomenclature,
                'phone' => $request->phone,
                'cuit' => $request->cuit,
                'contact_name' => $request->contactName,
                'responsible_email' => $request->responsibleEmail,
                'environmental_audit_responsible' => $request->environmentalAuditResponsible,
                'safety_audit_responsible' => $request->safetyAuditResponsible,
                'category_id' => $request->category,
            ]);

            return response()->json([
                'message' => 'Cliente creado exitosamente',
                'client' => $client->load('category'),
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            $errors = $e->errors();

            // Obtener el primer error personalizado en español
            $firstError = null;
            foreach ($errors as $field => $messages) {
                switch ($field) {
                    case 'name':
                        $firstError = 'El nombre es obligatorio';
                        break;
                    case 'address':
                        $firstError = 'El domicilio es obligatorio';
                        break;
                    case 'phone':
                        $firstError = 'El teléfono es obligatorio';
                        break;
                    case 'cuit':
                        if (in_array('The cuit has already been taken.', $messages)) {
                            $firstError = 'Este CUIT ya pertenece a otro cliente.';
                        } else {
                            $firstError = 'El CUIT es obligatorio';
                        }
                        break;
                    case 'contactName':
                        $firstError = 'El nombre de contacto es obligatorio';
                        break;
                    case 'responsibleEmail':
                        if (in_array('The responsible email field must be a valid email address.', $messages)) {
                            $firstError = 'El email del responsable debe ser una dirección de correo válida';
                        } else {
                            $firstError = 'El email del responsable es obligatorio';
                        }
                        break;
                    case 'environmentalAuditResponsible':
                        $firstError = 'El email del responsable de auditoría ambiental debe ser una dirección de correo válida';
                        break;
                    case 'safetyAuditResponsible':
                        $firstError = 'El email del responsable de auditoría de seguridad debe ser una dirección de correo válida';
                        break;
                    case 'category':
                        $firstError = 'La categoría seleccionada no es válida';
                        break;
                    default:
                        $firstError = $messages[0] ?? 'Error de validación';
                }

                // Salir del bucle después del primer error
                break;
            }

            return response()->json([
                'message' => $firstError,
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => 'Ha ocurrido un error inesperado. Por favor, intente nuevamente.',
            ], 500);
        }
    }

    // create user access
    public function createUserAccess(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|max:255',
        ]);

        $client = Client::where('id', $request->client_id)->first();

        if (! $client) {
            return response()->json([
                'message' => 'Cliente no encontrado',
            ], 404);
        }

        $user = User::create([
            'email' => $request->email,
            'password' => $request->password,
            'client_id' => $client->id,
            'role' => 'client_operator',
        ]);

        return response()->json([
            'message' => 'Usuario creado exitosamente',
        ]);
    }

    // modify user access password
    public function modifyUserAccessPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|max:255',
        ]);

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Contraseña modificada exitosamente',
        ]);
    }

    // delete user access
    public function deleteUserAccess(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();
        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente',
        ]);
    }
}
