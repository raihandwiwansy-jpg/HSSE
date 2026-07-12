<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;

class LocationController extends Controller
{
    public function index()
    {
        return response()->json(Location::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:locations']);
        $location = Location::create(['name' => $request->name]);
        return response()->json(['message' => 'Location created', 'location' => $location], 201);
    }

    public function destroy($id)
    {
        $location = Location::find($id);
        if (!$location) return response()->json(['message' => 'Not found'], 404);
        $location->delete();
        return response()->json(['message' => 'Location deleted']);
    }
}
