# Create an empty style and tileset

The following command will create a empty style and an empty tileset.

```bash
baremaps init --style style.json --tileset tileset.json
```

or copy the style and tileset from naturalearth example

```bash
cp ../naturalearth/*.json .
```

## create a new dataset (let's use QGIS)

- create a database connection to baremaps DB
- create a POINT dataset, with one attribute `value` (type: INT) and call the geometry column `geometry`
- insert a few points

## Modify the tileset

Open the tileset and insert the following section in the `vector_layers` list:

```json
{
  "id": "custom",
  "queries": [
    {
      "minzoom": 0,
      "maxzoom": 24,
      "sql": "SELECT ogc_fid, hstore('data', data::text), geometry FROM custom"
    }
  ]
}
```

## adapt style

In maputnik add a layer that uses the `custom` layer from the tileset.

The layer should be of type `circle`.
