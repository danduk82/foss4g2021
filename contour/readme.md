---
layout: default
title: Contour Lines in Vector Tiles
---

# Contour Lines in Vector Tiles

This example demonstrates how to produce contours from a digital elevation model (DEM) and how to display them with vector tiles.

The approach consists in using the [`gdal_contour`](https://gdal.org/programs/gdal_contour.html) command.

## Install GDAL

Therefore, start by installing `gdal`:

```bash
sudo apt-get install gdal-bin
```

alternatively, you can use the gdal docker image, it is advised to create a shell alias for that:

```bash
alias gdal='docker run --rm -v /home:/home osgeo/gdal:alpine-normal-latest'
```

NB: if you use the docker version, you will need to prepend `gdal` to all the gdal commands that will follow.
For example, instead of `gdalwrap [options]` you will need to execute `gdal gdalwrap [options]`.

## Reproject the DEM file

The geotiff present in this directory comes from the [ASTER](https://asterweb.jpl.nasa.gov/gdem.asp) dataset.
If needed, you can now reproject the geotiff in the desired projection (e.g. WebMercator) before importing it in the database.

NB: for the example, the resulting geotif is already present. Please delete `liecthenstein-aster-dem-v2-3857.tif` if you want
to test this feature.

```
gdalwarp -rc \
  -s_srs epsg:4326 -t_srs epsg:3857 \
  -dstnodata 0 -of GTiff -co tiled=yes \
  -overwrite \
  $PWD/liecthenstein-aster-dem-v2.tif \
  $PWD/liecthenstein-aster-dem-v2-3857.tif
```

## Create contour lines and insert them in postgis

You can now import any GeoTiff DEM as contours in postgis.
Here, the `-nln` argument name the table that contains the data,
the `-a` argument name the column that contains the elevation,
the `-i` argument specifies the interval in meters at which contours are generated.

```
gdal_contour \
  -a elevation -nln aster_dem -i 10 \
  -f PostgreSQL \
  $PWD/liecthenstein-aster-dem-v2-3857.tif "PG:host=localhost user=baremaps password=baremaps dbname=baremaps"
```

The following index can now be created to improve performances.
When available, a smoothing function such as `ST_ChaikinSmoothing` can be used to improve rendering.

```postgresql
DROP INDEX IF EXISTS aster_dem_gix;
CREATE INDEX CONCURRENTLY IF NOT EXISTS aster_dem_gix ON aster_dem USING SPGIST(wkb_geometry);
```

## View the map in the browser

To preview and edit the map in the browser, run the tile server with the following command:

```bash
baremaps edit \
  --database 'jdbc:postgresql://localhost:5432/baremaps?user=baremaps&password=baremaps' \
  --tileset 'tileset.json' \
  --style 'style.json'
```

## Exercise 1:

Add a new layer in style that displays a black line for all the 100m contour layers. Hint: Use a filter on the elevation property.

### Question:

- Do you see another way of achieving the same result?

### Solution:

```json
, {
  "id": "aster_dem_100",
  "type": "line",
  "filter": ["==", 0, ["%", ["get", "elevation"], 100]],
  "source": "baremaps",
  "source-layer": "aster_dem"
}
```

## Exercise 2:

Create a layer in the tileset that select the data every 500m, and create a new layer in the style that uses this datasource to display
a stronger line every 500m.

### Solution:

```json
 , {
      "id": "aster_dem_500",
      "queries": [
        {
          "minzoom": 0,
          "maxzoom": 20,
          "sql": "SELECT ogc_fid, hstore('elevation', elevation::text) as tags, wkb_geometry FROM aster_dem WHERE elevation::int % 500 = 0"
        }
      ]
    }
```
