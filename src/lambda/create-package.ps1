Remove-Item gpx-to-geojson.zip -erroraction 'silentlycontinue'
Compress-Archive index.js,node_modules -DestinationPath gpx-to-geojson.zip