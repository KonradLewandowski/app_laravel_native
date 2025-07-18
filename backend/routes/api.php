<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

Route::prefix('user')->group(function () {
    Route::post('/register', function (Request $request) {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'name' => 'nullable|string',
        ]);

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'name' => $request->name,
        ]);

        return response()->json(['message' => 'Użytkownik zarejestrowany!'], 201);
    });

    Route::post('/login', function (Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Nieprawidłowy e-mail lub hasło.'],
            ]);
        }

        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    });

    Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Wylogowano']);
    });

    Route::middleware('auth:sanctum')->delete('/delete', function (Request $request) {
        $user = $request->user();
        $user->delete();
        return response()->json(['message' => 'Konto zostało usunięte.']);
    });
});
