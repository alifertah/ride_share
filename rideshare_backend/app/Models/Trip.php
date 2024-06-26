<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;
    protected $fillable = [
        'departure',
        'arrival',
        'car',
        'price',
        'owner',
        'date',
        'places',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'bookings')->withPivot('status');
    }
}
