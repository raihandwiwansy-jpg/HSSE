<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP Reset Password</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .header {
            background-color: #1A365D;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .content {
            padding: 40px 30px;
            color: #2d3748;
        }
        .content p {
            font-size: 15px;
            line-height: 1.6;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .otp-container {
            background-color: #ebf8ff;
            border: 2px dashed #3182ce;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 6px;
            color: #2b6cb0;
            margin: 0;
        }
        .footer {
            background-color: #f7fafc;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #a0aec0;
        }
        .warning {
            font-size: 12px;
            color: #718096;
            margin-top: 25px;
            border-top: 1px solid #edf2f7;
            padding-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>HSE APPLICATION</h1>
        </div>
        <div class="content">
            <p>Halo,</p>
            <p>Kami menerima permintaan untuk melakukan reset password akun Anda di Portal HSE. Gunakan kode OTP di bawah ini untuk memverifikasi identitas Anda:</p>
            
            <div class="otp-container">
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #4a5568; font-weight: 600; text-transform: uppercase;">Kode OTP Anda</p>
                <div class="otp-code">{{ $otp }}</div>
            </div>

            <p>Kode OTP ini hanya berlaku selama <strong>10 menit</strong>. Jangan bagikan kode verifikasi ini kepada siapapun demi keamanan akun Anda.</p>

            <div class="warning">
                <p style="margin: 0;">Jika Anda tidak merasa mengajukan permintaan reset password ini, abaikan saja email ini dan password Anda akan tetap aman.</p>
            </div>
        </div>
        <div class="footer">
            <p style="margin: 0 0 5px 0;">&copy; {{ date('Y') }} PT. Industri Nabati Lestari. All rights reserved.</p>
            <p style="margin: 0;">Sistem Portal K3 & Lingkungan Kerja (HSE)</p>
        </div>
    </div>
</body>
</html>
