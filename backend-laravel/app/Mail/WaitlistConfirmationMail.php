<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WaitlistConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $messageText;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $messageText)
    {
        $this->name = $name;
        $this->messageText = $messageText;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Welcome to the Myzuwa Waitlist!')
            ->view('emails.waitlist_confirmation')
            ->with([
                'name' => $this->name,
                'messageText' => $this->messageText,
            ]);
    }
}
