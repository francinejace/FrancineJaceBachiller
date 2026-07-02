<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ContactMessageController extends Controller
{
    public function index(Request $request): JsonResponse|InertiaResponse
    {
        $messages = ContactMessage::latest()->paginate(20)->withQueryString();

        if ($request->expectsJson()) {
            return response()->json($messages);
        }

        return Inertia::render('admin/messages', [
            'messages' => $messages,
            'unreadCount' => ContactMessage::unread()->count(),
        ]);
    }

    public function markRead(Request $request, ContactMessage $contactMessage): JsonResponse|RedirectResponse
    {
        $contactMessage->update(['read_at' => now()]);

        if ($request->expectsJson()) {
            return response()->json($contactMessage->fresh());
        }

        return back()->with('success', 'Message marked as read.');
    }

    public function destroy(Request $request, ContactMessage $contactMessage): JsonResponse|RedirectResponse
    {
        $contactMessage->delete();

        if ($request->expectsJson()) {
            return response()->json(status: 204);
        }

        return back()->with('success', 'Message deleted.');
    }
}
