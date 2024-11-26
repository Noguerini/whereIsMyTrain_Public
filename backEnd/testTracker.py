import geopandas as gpd
import time
import threading

geojson_file = r"C:\Users\nogue\Desktop\UPM\Optativas\PGAA\QGIS\ST04_ST47.geojson"

current_lat = None
current_long = None

def count_points_in_multilinestring(filepath):
    # Read the GeoJSON file
    gdf = gpd.read_file(filepath)

    # Explode the multilinestrings into linestrings
    gdf = gdf.explode()

    # Count the number of points (vertices) in each linestring
    point_counts = gdf.geometry.apply(lambda x: len(x.coords))

    # Sum the point counts across all linestrings
    total_points = point_counts.sum()

    return total_points

points_count = count_points_in_multilinestring(geojson_file)

print("Total points:", points_count)

scheduled_time = 1.5
time_interval = scheduled_time / points_count * (3600)

def tracker(interval, filepath):
    global current_lat, current_long  # Declare these as global

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

# Start the tracking function in a separate thread
tracking_thread = threading.Thread(target=tracker, args=(time_interval, geojson_file))
tracking_thread.start()

# Start a thread to print the coordinates
print_thread = threading.Thread(target=print_coordinates)
print_thread.start()

# Wait for the tracking thread to finish
tracking_thread.join()

# Wait for the print thread to finish
print_thread.join()

# After the tracking thread finishes, print the final coordinates
print("Final Latitude:", current_lat, "Final Longitude:", current_long)