<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ExpiryNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $expiringSoon;
    public $expired;
    public $currentDate;
    public $endDate;

    /**
     * Create a new message instance.
     */
    public function __construct($expiringSoon, $expired, $currentDate, $endDate)
    {
        $this->expiringSoon = $expiringSoon;
        $this->expired = $expired;
        $this->currentDate = $currentDate;
        $this->endDate = $endDate;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = "Reporte de Vencimientos - Próximos 30 días";
        
        return $this->subject($subject)
                    ->view('emails.expiry-notification')
                    ->with([
                        'expiringSoon' => $this->expiringSoon,
                        'expired' => $this->expired,
                        'currentDate' => $this->currentDate,
                        'endDate' => $this->endDate,
                    ]);
    }
}

