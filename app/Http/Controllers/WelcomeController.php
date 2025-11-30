<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;

class WelcomeController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('home/page', [
            'user' => $user,
        ]);
    }
}
