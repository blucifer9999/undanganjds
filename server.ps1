# Simple HTTP Server for Wedding Invitation
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:5500/')
$listener.Start()
Write-Host "Server running at http://localhost:5500" -ForegroundColor Green

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get the requested path
        $path = $request.Url.LocalPath
        if ($path -eq '/') { $path = '/index.html' }
        
        # Map URL to file system path
        $baseDir = "d:\undangan digital\adit-risa"
        $filePath = Join-Path $baseDir $path.Replace('/', '\')
        
        # Handle query string if present
        if ($filePath -match '\?') {
            $filePath = ($filePath -split '\?')[0]
        }
        
        if (Test-Path $filePath) {
            $content = Get-Content $filePath -Raw -Encoding UTF8
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
            
            # Set content type based on file extension
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                '.html' { $response.ContentType = 'text/html; charset=utf-8' }
                '.css' { $response.ContentType = 'text/css' }
                '.js' { $response.ContentType = 'application/javascript' }
                '.json' { $response.ContentType = 'application/json' }
                '.png' { $response.ContentType = 'image/png' }
                '.jpg' { $response.ContentType = 'image/jpeg' }
                '.jpeg' { $response.ContentType = 'image/jpeg' }
                '.gif' { $response.ContentType = 'image/gif' }
                default { $response.ContentType = 'text/plain' }
            }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 - File not found")
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
        
        $response.Close()
    } catch {
        # Continue on errors
    }
}