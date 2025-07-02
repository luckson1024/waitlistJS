<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Waitlist Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif;">
    <h2>Hello {{ $name }},</h2>
    <p>{!! nl2br(e($messageText)) !!}</p>
    <p>Thank you for joining the Myzuwa waitlist!</p>
</body>
</html>
