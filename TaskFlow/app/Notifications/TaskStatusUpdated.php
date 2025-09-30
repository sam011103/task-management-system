<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class TaskStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $task;

    /**
     * Create a new notification instance.
     */
    public function __construct($task)
    {
        $this->task = $task;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $message = $this->task->status === 'overdue' ? 
                        "Due at {$this->task->due_at_formatted}." : 
                        "Please complete it by {$this->task->due_at_formatted}.";

        return (new MailMessage)
            ->subject(ucfirst($this->task->status) . ' Task Notification')
            ->line("Your task **{$this->task->title}** is **{$this->task->status}**.")
            ->line($message)
            ->line("Please check your task list for more details.")
            ->action('View Task', url("/tasks"))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }

    // public function toBroadcast(object $notifiable): BroadcastMessage
    // {
    //     return new BroadcastMessage([
    //         'task_id' => $this->task->id,
    //         'task_title' => $this->task->title,
    //         'task_status' => $this->task->status,
    //     ]);
    // }
}
