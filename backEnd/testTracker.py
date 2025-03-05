import geopandas as gpd
import time
import threading

geojson_file = r"C:\Users\nogue\Desktop\UPM\Optativas\PGAA\QGIS\ST04_ST47.geojson"

current_lat = None
current_long = None

def count_points_in_multilinestring(filepath):
    gdf = gpd.read_file(filepath)

    gdf = gdf.explode()

    point_counts = gdf.geometry.apply(lambda x: len(x.coords))

    total_points = point_counts.sum()

    return total_points

points_count = count_points_in_multilinestring(geojson_file)

print("Total points:", points_count)

scheduled_time = 1.5
time_interval = scheduled_time / points_count * (3600)

def tracker(interval, filepath):
    global current_lat, current_long

    gdf = gpd.read_file(filepath)
    gdf = gdf.explode()

    for idx, row in gdf.iterrows():
        line = row['geometry']
        for point in line.coords:
            current_lat, current_long = point
            time.sleep(interval)

def print_coordinates():
    global current_lat, current_long
    while True:
        if current_lat is not None and current_long is not None:
            print("Latest Latitude:", current_lat, "Latest Longitude:", current_long)
        time.sleep(1)

tracking_thread = threading.Thread(target=tracker, args=(time_interval, geojson_file))
tracking_thread.start()

print_thread = threading.Thread(target=print_coordinates)
print_thread.start()

tracking_thread.join()

print_thread.join()

print("Final Latitude:", current_lat, "Final Longitude:", current_long)