<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Vencimientos</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .section {
            margin-bottom: 30px;
        }
        .alert {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .alert-warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            color: #856404;
        }
        .alert-danger {
            background-color: #f8d7da;
            border-left: 4px solid #dc3545;
            color: #721c24;
        }
        .alert-info {
            background-color: #d1ecf1;
            border-left: 4px solid #17a2b8;
            color: #0c5460;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background-color: #ffffff;
        }
        th {
            background-color: #3498db;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            text-align: center;
            color: #7f8c8d;
            font-size: 14px;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
        }
        .badge-warning {
            background-color: #ffc107;
            color: #000;
        }
        .badge-danger {
            background-color: #dc3545;
            color: #fff;
        }
        .no-items {
            padding: 20px;
            text-align: center;
            color: #7f8c8d;
            font-style: italic;
        }
        .btn {
            display: inline-block;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 13px;
            font-weight: bold;
            text-align: center;
        }
        .btn-primary {
            background-color: #3498db;
            color: #ffffff;
        }
        .btn-primary:hover {
            background-color: #2980b9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 Reporte de Vencimientos - Próximos 30 días</h1>
        <p style="color: #7f8c8d; margin-bottom: 20px;">
            <strong>Período:</strong> {{ $currentDate }} - {{ $endDate }}
        </p>
        
        @if(count($expired) === 0 && count($expiringSoon) === 0)
            <div class="alert alert-info">
                <strong>✓ Excelente!</strong> No hay items vencidos ni próximos a vencer en los próximos 30 días.
            </div>
        @else
            <!-- Items Vencidos -->
            @if(count($expired) > 0)
                <div class="section">
                    <div class="alert alert-danger">
                        <strong>⚠️ Atención:</strong> Hay {{ count($expired) }} item(s) vencido(s) que requieren atención inmediata.
                    </div>
                    
                    <h2>Items Vencidos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Tipo de Auditoría</th>
                                <th>Item</th>
                                <th>Fecha de Vencimiento</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($expired as $item)
                                <tr>
                                    <td><strong>{{ $item['client_name'] }}</strong></td>
                                    <td>{{ $item['audit_type_name'] }}</td>
                                    <td>{{ $item['item_name'] }}</td>
                                    <td>{{ \Carbon\Carbon::parse($item['expiry_date'])->format('d/m/Y') }}</td>
                                    <td><span class="badge badge-danger">Vencido</span></td>
                                    <td><a href="{{ url('/audits/' . $item['audit_id']) }}" class="btn btn-primary">Ver Auditoría</a></td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif

            <!-- Items Próximos a Vencer -->
            @if(count($expiringSoon) > 0)
                <div class="section">
                    <div class="alert alert-warning">
                        <strong>📅 Recordatorio:</strong> Hay {{ count($expiringSoon) }} item(s) que vencerán en los próximos 30 días.
                    </div>
                    
                    <h2>Items Próximos a Vencer</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Tipo de Auditoría</th>
                                <th>Item</th>
                                <th>Fecha de Vencimiento</th>
                                <th>Días Restantes</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($expiringSoon as $item)
                                <tr>
                                    <td><strong>{{ $item['client_name'] }}</strong></td>
                                    <td>{{ $item['audit_type_name'] }}</td>
                                    <td>{{ $item['item_name'] }}</td>
                                    <td>{{ \Carbon\Carbon::parse($item['expiry_date'])->format('d/m/Y') }}</td>
                                    <td><span class="badge badge-warning">{{ $item['days_remaining'] }} días</span></td>
                                    <td><a href="{{ url('/audits/' . $item['audit_id']) }}" class="btn btn-primary">Ver</a></td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        @endif

        <div class="footer">
            <p>Este es un correo automático generado por el Sistema de Gestión de Auditorías.</p>
            <p>Por favor, no responder a este correo.</p>
        </div>
    </div>
</body>
</html>

